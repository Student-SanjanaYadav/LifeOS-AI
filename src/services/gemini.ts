export interface AIChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface AIRecoverySchedule {
  timeSlot: string;
  taskTitle: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  durationMin: number;
}

export interface AISacrificeRecommendation {
  taskTitle: string;
  type: 'POSTPONE' | 'DROP' | 'SIMPLIFY';
  reason: string;
  impactOnProbability: number;
}

export interface AIRescueResult {
  success: boolean;
  strategy: string;
  nextBestAction: string;
  recoverySchedule: AIRecoverySchedule[];
  sacrifices: AISacrificeRecommendation[];
  originalProbability: number;
  newProbability: number;
  confidence: number;
  explanation: string;
  fallbackPlan: string;
}

export interface AIMilestone {
  title: string;
  description: string;
  estimatedHours: number;
  order: number;
}

export interface AIRoadmapWeek {
  weekNumber: number;
  focus: string;
  milestones: string[];
  tasks: string[];
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('lifeos_local_gemini_key');
    if (localKey) {
      headers['x-gemini-key'] = localKey;
    }
  }
  return headers;
}

export const geminiService = {
  /**
   * Generates milestones and subtasks for a new mission using Gemini.
   */
  async generateMilestones(
    title: string,
    description: string,
    priority: string,
    estimatedEffort: string,
    successCriteria: string
  ): Promise<AIMilestone[]> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'generate_milestones',
          data: { title, description, priority, estimatedEffort, successCriteria },
        }),
      });
      if (!response.ok) throw new Error('Failed to generate milestones');
      const result = await response.json();
      return result.milestones;
    } catch (error) {
      console.error('Error generating milestones:', error);
      throw error;
    }
  },

  /**
   * Generates a long-term adaptive roadmap for a mission.
   */
  async generateRoadmap(
    title: string,
    description: string,
    deadlineDays: number
  ): Promise<AIRoadmapWeek[]> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'generate_roadmap',
          data: { title, description, deadlineDays },
        }),
      });
      if (!response.ok) throw new Error('Failed to generate roadmap');
      const result = await response.json();
      return result.roadmap;
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  },

  /**
   * Runs the Save My Day Rescue Engine analysis.
   */
  async runRescueEngine(
    missions: any[],
    focusStats: any,
    workloadRating: number,
    sacrificeTier: 'CATCH_UP' | 'EMERGENCY' | 'SALVAGE' | 'PROTECT_TOMORROW'
  ): Promise<AIRescueResult> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'run_rescue_engine',
          data: { missions, focusStats, workloadRating, sacrificeTier },
        }),
      });
      if (!response.ok) throw new Error('Failed to execute rescue analysis');
      return await response.json();
    } catch (error) {
      console.error('Error executing rescue engine:', error);
      throw error;
    }
  },

  /**
   * Chat assistant endpoint.
   */
  async chat(messages: AIChatMessage[], currentMissions: any[]): Promise<string> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'chat',
          data: { messages, currentMissions },
        }),
      });
      if (!response.ok) throw new Error('Failed chat query');
      const result = await response.json();
      return result.reply;
    } catch (error) {
      console.error('Error in AI Chat:', error);
      throw error;
    }
  }
};
