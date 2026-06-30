'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth as firebaseAuth, db as firebaseDb, isFirebaseConfigured } from '@/services/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { geminiService, AIRescueResult, AIMilestone, AIRoadmapWeek } from '@/services/gemini';

// --- TypeScript Interfaces ---

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  isMock?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  order: number;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedEffort: string; // e.g. "25 hours"
  successCriteria: string;
  dependencies: string;
  progress: number; // 0 to 100
  health: 'Safe' | 'At Risk' | 'Critical' | 'Recovery Possible' | 'Unlikely Without Sacrifice';
  category: 'academic' | 'hackathon' | 'placement' | 'general';
  milestones: Milestone[];
  roadmap?: AIRoadmapWeek[];
  createdAt: string;
}

export interface FocusSession {
  isActive: boolean;
  taskId: string | null;
  taskTitle: string | null;
  missionId: string | null;
  durationMinutes: number;
  timeRemainingSeconds: number;
  isPaused: boolean;
  type: 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK';
  completedPomodoros: number;
}

export interface PredictiveMetrics {
  successProbability: number;
  burnoutRisk: number; // 0 to 100
  tomorrowRisk: number; // 0 to 100
  requiredEffortRemaining: number; // in hours
  deadlineCollisions: number;
  confidenceLevel: number; // percentage
}

export interface AppSettings {
  geminiKeyConfigured: boolean;
  targetDailyFocusHours: number;
  academicPrepStyle: 'revision' | 'notes' | 'cheat_sheets';
  hackathonScopeStyle: 'mvp_only' | 'standard';
  placementPrepStyle: 'dsa_heavy' | 'mock_interviews';
}

export interface AppContextType {
  user: UserProfile | null;
  loading: boolean;
  missions: Mission[];
  settings: AppSettings;
  focusSession: FocusSession;
  rescueResult: AIRescueResult | null;
  isRescueActive: boolean;
  predictiveMetrics: PredictiveMetrics;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginMock: () => void;
  
  // Mission actions
  createMission: (missionData: Omit<Mission, 'id' | 'progress' | 'health' | 'milestones' | 'createdAt'>) => Promise<void>;
  updateMissionProgress: (id: string, progress: number) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  toggleMilestone: (missionId: string, milestoneId: string) => Promise<void>;
  generateMilestonesForMission: (id: string) => Promise<void>;
  
  // Rescue actions
  triggerSaveMyDay: (sacrificeTier: 'CATCH_UP' | 'EMERGENCY' | 'SALVAGE' | 'PROTECT_TOMORROW') => Promise<void>;
  deactivateRescueMode: () => void;
  
  // Focus actions
  startFocusSession: (missionId: string, taskId: string, taskTitle: string, duration?: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  stopFocusSession: () => void;
  completeFocusSession: () => void;
  tickTimer: () => void;
  
  // Settings actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  refreshMetrics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- AppProvider Component ---

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isRescueActive, setIsRescueActive] = useState(false);
  const [rescueResult, setRescueResult] = useState<AIRescueResult | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    geminiKeyConfigured: false,
    targetDailyFocusHours: 4,
    academicPrepStyle: 'revision',
    hackathonScopeStyle: 'mvp_only',
    placementPrepStyle: 'dsa_heavy',
  });

  const [focusSession, setFocusSession] = useState<FocusSession>({
    isActive: false,
    taskId: null,
    taskTitle: null,
    missionId: null,
    durationMinutes: 25,
    timeRemainingSeconds: 25 * 60,
    isPaused: true,
    type: 'POMODORO',
    completedPomodoros: 0,
  });

  const [predictiveMetrics, setPredictiveMetrics] = useState<PredictiveMetrics>({
    successProbability: 75,
    burnoutRisk: 30,
    tomorrowRisk: 25,
    requiredEffortRemaining: 0,
    deadlineCollisions: 0,
    confidenceLevel: 85,
  });

  // --- Auth state observer ---
  useEffect(() => {
    if (isFirebaseConfigured && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Hero User',
            isMock: false,
          };
          setUser(profile);
          await loadMissions(fbUser.uid);
        } else {
          // Check if mock user was saved
          const storedMock = localStorage.getItem('lifeos_mock_user');
          if (storedMock) {
            setUser(JSON.parse(storedMock));
            loadMissions('mock');
          } else {
            setUser(null);
            setMissions([]);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local mock auth detection
      const storedMock = localStorage.getItem('lifeos_mock_user');
      if (storedMock) {
        setUser(JSON.parse(storedMock));
        loadMissions('mock');
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  // --- Focus Timer Tick effect ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusSession.isActive && !focusSession.isPaused) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusSession]);

  // --- Calculate analytics when missions or sessions change ---
  useEffect(() => {
    refreshMetrics();
  }, [missions, isRescueActive]);

  // --- Database operations helpers ---

  const getMissionsCollection = (uid: string) => {
    if (isFirebaseConfigured && firebaseDb && uid !== 'mock') {
      return collection(firebaseDb, 'users', uid, 'missions');
    }
    return null;
  };

  const loadMissions = async (uid: string) => {
    try {
      const col = getMissionsCollection(uid);
      if (col) {
        const snapshot = await getDocs(col);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
        setMissions(list);
      } else {
        const local = localStorage.getItem('lifeos_missions');
        if (local) {
          setMissions(JSON.parse(local));
        } else {
          // Set default mock missions for demonstration
          const demoMissions: Mission[] = [
            {
              id: 'm1',
              title: 'Crack Google Internship',
              description: 'Crack Google Software Engineer Internship. Requires DSA preparation, interview grids, and mock feedback.',
              deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days out
              priority: 'CRITICAL',
              estimatedEffort: '35 hours',
              successCriteria: 'Secure interview invitation and solve double medium LeetCode questions.',
              dependencies: 'Resume update, Graph traversals, DP patterns',
              progress: 40,
              health: 'At Risk',
              category: 'placement',
              createdAt: new Date().toISOString(),
              milestones: [
                { id: 'ms1_1', title: 'Complete Array & Sliding Window LeetCode list', description: 'Solve 15 problems', estimatedHours: 8, order: 1, completed: true },
                { id: 'ms1_2', title: 'Revise Graph Traversals (DFS/BFS)', description: 'Understand recursive stack and queue configurations', estimatedHours: 10, order: 2, completed: false },
                { id: 'ms1_3', title: 'System Design Fundamentals & OOPs revision', description: 'Read scaling and API structures', estimatedHours: 9, order: 3, completed: false },
                { id: 'ms1_4', title: 'Google Resume Revamp & 2 Mock Grills', description: 'Metric focus and interview speech check', estimatedHours: 8, order: 4, completed: false }
              ]
            },
            {
              id: 'm2',
              title: 'Semester Finals Preparation',
              description: 'Prep for Operating Systems, DBMS, and Compiler Design examinations.',
              deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days out
              priority: 'HIGH',
              estimatedEffort: '24 hours',
              successCriteria: 'Prepare summary sheets and complete last 5 years past papers.',
              dependencies: 'Lecture slide folders',
              progress: 20,
              health: 'Critical',
              category: 'academic',
              createdAt: new Date().toISOString(),
              milestones: [
                { id: 'ms2_1', title: 'OS Process management & Thread cycles', description: 'Revise Scheduling and Deadlocks', estimatedHours: 6, order: 1, completed: true },
                { id: 'ms2_2', title: 'DBMS Normalization & SQL query mocks', description: '1NF to BCNF details and indexing', estimatedHours: 6, order: 2, completed: false },
                { id: 'ms2_3', title: 'Compiler lexical analysis & parsers', description: 'LR and LL parser exercises', estimatedHours: 8, order: 3, completed: false },
                { id: 'ms2_4', title: 'Solve last 3 semesters past papers', description: 'Under timed exam environment', estimatedHours: 4, order: 4, completed: false }
              ]
            }
          ];
          setMissions(demoMissions);
          localStorage.setItem('lifeos_missions', JSON.stringify(demoMissions));
        }
      }
    } catch (error) {
      console.error("Error loading missions:", error);
    }
  };

  const saveMissionsState = async (newMissions: Mission[]) => {
    setMissions(newMissions);
    const uid = user?.uid || 'mock';
    try {
      const col = getMissionsCollection(uid);
      if (col) {
        // Write each mission to firestore
        for (const mission of newMissions) {
          const mRef = doc(col, mission.id);
          await setDoc(mRef, mission);
        }
      } else {
        localStorage.setItem('lifeos_missions', JSON.stringify(newMissions));
      }
    } catch (error) {
      console.error("Error saving missions:", error);
    }
  };

  // --- Auth Operations ---

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } else {
      // Mock login
      loginMock();
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (isFirebaseConfigured && firebaseAuth) {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Wait a moment for firestore sync if needed, or save profile info
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: name,
        isMock: false,
      };
      setUser(profile);
    } else {
      // Mock register
      const mockUser: UserProfile = {
        uid: 'mock_user_123',
        email,
        displayName: name,
        isMock: true,
      };
      localStorage.setItem('lifeos_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      loadMissions('mock');
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
    }
    localStorage.removeItem('lifeos_mock_user');
    setUser(null);
    setMissions([]);
    setIsRescueActive(false);
    setRescueResult(null);
  };

  const loginMock = () => {
    const mockUser: UserProfile = {
      uid: 'mock_user_123',
      email: 'pilot@lifeos.ai',
      displayName: 'Commander Pilot',
      isMock: true,
    };
    localStorage.setItem('lifeos_mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
    loadMissions('mock');
  };

  // --- Mission Operations ---

  const createMission = async (missionData: Omit<Mission, 'id' | 'progress' | 'health' | 'milestones' | 'createdAt'>) => {
    const id = 'mission_' + Math.random().toString(36).substring(2, 9);
    
    // Determine initial health
    const deadlineDate = new Date(missionData.deadline);
    const daysRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    
    let health: Mission['health'] = 'Safe';
    if (daysRemaining <= 3) health = 'Critical';
    else if (daysRemaining <= 7) health = 'At Risk';

    // Call Gemini API to pre-generate milestones
    let milestones: Milestone[] = [];
    let roadmap: AIRoadmapWeek[] = [];

    try {
      const generatedMilestones = await geminiService.generateMilestones(
        missionData.title,
        missionData.description,
        missionData.priority,
        missionData.estimatedEffort,
        missionData.successCriteria
      );
      
      milestones = generatedMilestones.map((m, idx) => ({
        id: `ms_${id}_${idx}`,
        title: m.title,
        description: m.description,
        estimatedHours: m.estimatedHours,
        order: m.order,
        completed: false
      }));

      // Generate roadmap as well
      const generatedRoadmap = await geminiService.generateRoadmap(
        missionData.title,
        missionData.description,
        daysRemaining
      );
      roadmap = generatedRoadmap;
    } catch (e) {
      console.warn("Milestone generation failed, using standard template milestones:", e);
      milestones = [
        { id: `ms_${id}_1`, title: 'Define Scope & Compile Notes', description: 'Analyze success criteria and baseline resources', estimatedHours: 4, order: 1, completed: false },
        { id: `ms_${id}_2`, title: 'Core Implementation Block', description: 'Complete the main technical build files', estimatedHours: 12, order: 2, completed: false },
        { id: `ms_${id}_3`, title: 'Final Testing & Refactor', description: 'Fix edge cases and verify responsiveness', estimatedHours: 6, order: 3, completed: false }
      ];
    }

    const newMission: Mission = {
      ...missionData,
      id,
      progress: 0,
      health,
      milestones,
      roadmap,
      createdAt: new Date().toISOString()
    };

    const updated = [newMission, ...missions];
    await saveMissionsState(updated);
  };

  const updateMissionProgress = async (id: string, progress: number) => {
    const updated = missions.map(m => {
      if (m.id === id) {
        // Adjust health based on progress and deadlines
        const deadlineDate = new Date(m.deadline);
        const daysRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        let health = m.health;

        if (progress >= 100) {
          health = 'Safe';
        } else if (daysRemaining <= 2) {
          health = progress < 70 ? 'Critical' : 'Recovery Possible';
        } else if (daysRemaining <= 5) {
          health = progress < 40 ? 'At Risk' : 'Safe';
        } else {
          health = 'Safe';
        }

        return { ...m, progress, health };
      }
      return m;
    });
    await saveMissionsState(updated);
  };

  const deleteMission = async (id: string) => {
    const uid = user?.uid || 'mock';
    const updated = missions.filter(m => m.id !== id);
    setMissions(updated);

    try {
      const col = getMissionsCollection(uid);
      if (col) {
        await deleteDoc(doc(col, id));
      } else {
        localStorage.setItem('lifeos_missions', JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Error deleting mission:", error);
    }
  };

  const toggleMilestone = async (missionId: string, milestoneId: string) => {
    const updated = missions.map(m => {
      if (m.id === missionId) {
        const updatedMilestones = m.milestones.map(ms => {
          if (ms.id === milestoneId) return { ...ms, completed: !ms.completed };
          return ms;
        });

        // Recompute progress based on completed milestones
        const completedCount = updatedMilestones.filter(ms => ms.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

        // Compute new health
        const deadlineDate = new Date(m.deadline);
        const daysRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        let health = m.health;

        if (newProgress >= 100) {
          health = 'Safe';
        } else if (daysRemaining <= 2) {
          health = newProgress < 75 ? 'Critical' : 'Recovery Possible';
        } else if (daysRemaining <= 5) {
          health = newProgress < 40 ? 'At Risk' : 'Safe';
        } else {
          health = 'Safe';
        }

        return { ...m, milestones: updatedMilestones, progress: newProgress, health };
      }
      return m;
    });
    await saveMissionsState(updated);
  };

  const generateMilestonesForMission = async (id: string) => {
    const target = missions.find(m => m.id === id);
    if (!target) return;

    try {
      const list = await geminiService.generateMilestones(
        target.title,
        target.description,
        target.priority,
        target.estimatedEffort,
        target.successCriteria
      );
      
      const newMilestones = list.map((m, idx) => ({
        id: `ms_${id}_new_${idx}`,
        title: m.title,
        description: m.description,
        estimatedHours: m.estimatedHours,
        order: m.order,
        completed: false
      }));

      const updated = missions.map(m => {
        if (m.id === id) {
          return { ...m, milestones: newMilestones, progress: 0 };
        }
        return m;
      });
      await saveMissionsState(updated);
    } catch (e) {
      console.error("Failed to regenerate milestones:", e);
    }
  };

  // --- Rescue Actions ---

  const triggerSaveMyDay = async (sacrificeTier: 'CATCH_UP' | 'EMERGENCY' | 'SALVAGE' | 'PROTECT_TOMORROW') => {
    try {
      const activeMissionsSummary = missions.map(m => ({
        title: m.title,
        priority: m.priority,
        progress: m.progress,
        health: m.health,
        deadline: m.deadline,
        remainingTasks: m.milestones.filter(ms => !ms.completed).map(ms => ms.title)
      }));

      const focusStats = {
        completedPomodoros: focusSession.completedPomodoros,
        totalFocusTimeMinutes: focusSession.completedPomodoros * 25,
      };

      const result = await geminiService.runRescueEngine(
        activeMissionsSummary,
        focusStats,
        predictiveMetrics.burnoutRisk > 60 ? 9 : 6,
        sacrificeTier
      );

      setRescueResult(result);
      setIsRescueActive(true);
    } catch (e) {
      console.error("Error triggering Save My Day:", e);
    }
  };

  const deactivateRescueMode = () => {
    setIsRescueActive(false);
    setRescueResult(null);
  };

  // --- Focus Timer Operations ---

  const startFocusSession = (missionId: string, taskId: string, taskTitle: string, duration = 25) => {
    setFocusSession({
      isActive: true,
      taskId,
      taskTitle,
      missionId,
      durationMinutes: duration,
      timeRemainingSeconds: duration * 60,
      isPaused: false,
      type: 'POMODORO',
      completedPomodoros: focusSession.completedPomodoros,
    });
  };

  const pauseFocusSession = () => {
    setFocusSession(prev => ({ ...prev, isPaused: true }));
  };

  const resumeFocusSession = () => {
    setFocusSession(prev => ({ ...prev, isPaused: false }));
  };

  const stopFocusSession = () => {
    setFocusSession({
      isActive: false,
      taskId: null,
      taskTitle: null,
      missionId: null,
      durationMinutes: 25,
      timeRemainingSeconds: 25 * 60,
      isPaused: true,
      type: 'POMODORO',
      completedPomodoros: focusSession.completedPomodoros,
    });
  };

  const completeFocusSession = () => {
    // If the active focus was linked to a task, we toggle it upon completion
    if (focusSession.missionId && focusSession.taskId) {
      toggleMilestone(focusSession.missionId, focusSession.taskId);
    }

    setFocusSession(prev => {
      const nextType = prev.type === 'POMODORO' ? 'SHORT_BREAK' : 'POMODORO';
      const duration = nextType === 'POMODORO' ? 25 : 5;
      return {
        ...prev,
        isActive: true,
        isPaused: true,
        type: nextType,
        durationMinutes: duration,
        timeRemainingSeconds: duration * 60,
        completedPomodoros: prev.type === 'POMODORO' ? prev.completedPomodoros + 1 : prev.completedPomodoros,
      };
    });
  };

  const tickTimer = () => {
    setFocusSession(prev => {
      if (prev.timeRemainingSeconds <= 1) {
        // Play notification sound if browser environment allows
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        } catch(e) {}
        
        // Return complete state
        setTimeout(() => completeFocusSession(), 50);
        return { ...prev, timeRemainingSeconds: 0 };
      }
      return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
    });
  };

  // --- App settings operations ---

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('lifeos_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // --- Dynamic Predictive Engine calculations ---

  const refreshMetrics = () => {
    if (missions.length === 0) {
      setPredictiveMetrics({
        successProbability: 100,
        burnoutRisk: 10,
        tomorrowRisk: 5,
        requiredEffortRemaining: 0,
        deadlineCollisions: 0,
        confidenceLevel: 95,
      });
      return;
    }

    // Determine deadline collisions (deadlines on the same day)
    const deadlineCounts: { [key: string]: number } = {};
    let totalRemainingEffort = 0;
    let criticalMissionsCount = 0;
    let atRiskMissionsCount = 0;

    missions.forEach(m => {
      // Collision counts
      deadlineCounts[m.deadline] = (deadlineCounts[m.deadline] || 0) + 1;
      
      // Calculate remaining effort hours
      const uncompletedMilestones = m.milestones.filter(ms => !ms.completed);
      const hours = uncompletedMilestones.reduce((acc, curr) => acc + curr.estimatedHours, 0);
      totalRemainingEffort += hours;

      if (m.health === 'Critical') criticalMissionsCount++;
      if (m.health === 'At Risk') atRiskMissionsCount++;
    });

    const collisions = Object.values(deadlineCounts).filter(c => c > 1).reduce((acc, val) => acc + (val - 1), 0);

    // Calculate baseline success probability
    // Start with 90, subtract points for critical missions, remaining efforts, and short deadlines
    let baseSuccess = 90;
    
    // Penalize critical missions heavily
    baseSuccess -= criticalMissionsCount * 25;
    baseSuccess -= atRiskMissionsCount * 12;
    baseSuccess -= collisions * 8;

    // Estimate based on time buffer
    const nextDeadlines = missions.map(m => new Date(m.deadline).getTime());
    const minDeadline = Math.min(...nextDeadlines);
    const daysUntilNext = Math.max(1, Math.ceil((minDeadline - Date.now()) / (1000 * 60 * 60 * 24)));

    if (totalRemainingEffort > daysUntilNext * settings.targetDailyFocusHours) {
      // We don't have enough focus hours to finish the tasks on time
      const deficit = totalRemainingEffort - (daysUntilNext * settings.targetDailyFocusHours);
      baseSuccess -= Math.min(40, deficit * 4);
    }

    const calculatedSuccess = Math.max(15, Math.min(98, baseSuccess));
    
    // Burnout risk is high if daily effort required exceeds 6 hours
    const dailyRequiredHours = totalRemainingEffort / Math.max(1, daysUntilNext);
    const calculatedBurnout = Math.max(10, Math.min(99, Math.round(dailyRequiredHours * 10 + (criticalMissionsCount * 15))));
    
    // Tomorrow risk is high if a deadline is tomorrow and progress is low
    const hasDeadlineTomorrow = missions.some(m => {
      const days = Math.ceil((new Date(m.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 1 && m.progress < 85;
    });
    const calculatedTomorrowRisk = hasDeadlineTomorrow ? 85 : Math.max(10, Math.min(90, calculatedBurnout - 10));

    // If Rescue Mode is active, boost success probability by 30-40% to show before vs after
    const finalSuccess = isRescueActive && rescueResult
      ? rescueResult.newProbability
      : calculatedSuccess;

    setPredictiveMetrics({
      successProbability: finalSuccess,
      burnoutRisk: isRescueActive ? Math.round(calculatedBurnout * 0.6) : calculatedBurnout, // Rescue planning reduces burnout risk
      tomorrowRisk: isRescueActive ? Math.round(calculatedTomorrowRisk * 0.5) : calculatedTomorrowRisk,
      requiredEffortRemaining: totalRemainingEffort,
      deadlineCollisions: collisions,
      confidenceLevel: 80 + Math.min(18, missions.length * 3), // Higher confidence with more data points
    });
  };

  // Load settings on mount
  useEffect(() => {
    const localSettings = localStorage.getItem('lifeos_settings');
    if (localSettings) {
      setSettings(JSON.parse(localSettings));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      loading,
      missions,
      settings,
      focusSession,
      rescueResult,
      isRescueActive,
      predictiveMetrics,
      login,
      register,
      logout,
      loginMock,
      createMission,
      updateMissionProgress,
      deleteMission,
      toggleMilestone,
      generateMilestonesForMission,
      triggerSaveMyDay,
      deactivateRescueMode,
      startFocusSession,
      pauseFocusSession,
      resumeFocusSession,
      stopFocusSession,
      completeFocusSession,
      tickTimer,
      updateSettings,
      refreshMetrics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
