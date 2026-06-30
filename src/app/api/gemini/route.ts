import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(req: Request) {
  try {
    const { action, data } = await req.json();
    const headerKey = req.headers.get('x-gemini-key');
    const apiKey = headerKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return context-aware high-fidelity mock data
      return handleMockFallback(action, data);
    }

    // Call real Gemini API
    const prompt = buildGeminiPrompt(action, data);
    const apiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.warn("Gemini API direct call failed, using mock fallback. Error:", errorText);
      return handleMockFallback(action, data);
    }

    const resJson = await apiResponse.json();
    const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Empty response from Gemini API");
    }

    // Parse output JSON
    const parsedData = JSON.parse(rawText);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

function buildGeminiPrompt(action: string, data: any): string {
  switch (action) {
    case 'generate_milestones':
      return `
You are LifeOS AI, an expert agent that breaks down high-stakes missions into tactical milestones.
Analyze the following mission details:
Mission Title: "${data.title}"
Description: "${data.description}"
Priority: "${data.priority}"
Estimated Effort: "${data.estimatedEffort}"
Success Criteria: "${data.successCriteria}"

Deconstruct this mission into 3 to 5 clear milestones that represent a logical progress path.
Each milestone must have a short, actionable title, a detailed description, estimated effort in hours, and a sequential order starting at 1.

Return JSON in this format:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "Milestone Description detailing tasks and success criteria",
      "estimatedHours": 10,
      "order": 1
    }
  ]
}
      `;

    case 'generate_roadmap':
      return `
You are LifeOS AI, an adaptive educational/career planning agent.
Analyze this long-term mission:
Title: "${data.title}"
Description: "${data.description}"
Days until deadline: ${data.deadlineDays}

Create a week-by-week adaptive roadmap spanning up to 4 weeks.
Each week should contain:
- weekNumber (integer, e.g. 1)
- focus: the main learning/execution goal for the week
- milestones: list of 1-2 major achievements to tick off
- tasks: list of 3-4 concrete daily tasks to complete

Return JSON in this format:
{
  "roadmap": [
    {
      "weekNumber": 1,
      "focus": "Week Focus",
      "milestones": ["Milestone 1", "Milestone 2"],
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ]
}
      `;

    case 'run_rescue_engine':
      return `
You are the LifeOS AI Rescue Engine. A high-stakes crisis situation has occurred.
Analyze the active missions and workload to generate an intervention plan.

Active Missions:
${JSON.stringify(data.missions, null, 2)}

Focus Session Stats:
${JSON.stringify(data.focusStats, null, 2)}

User Self-Reported Workload: ${data.workloadRating}/10
Rescue Mode / Sacrifice Severity: "${data.sacrificeTier}"

Provide a detailed rescue strategy. Your job is to rescue deadlines.
- Estimate success probability (a percentage from 0 to 100) before rescue, and a higher probability after applying the rescue actions.
- Rebuild today's schedule (3-5 recovery blocks with timeslots, task titles, priority, and duration).
- Identify sacrifices: tasks that need to be POSTPONED, DROPPED, or SIMPLIFIED. Give clear reasons for each choice and the positive impact it will have on the success probability.
- Formulate a Next Best Action (the single highest priority task to start IMMEDIATELY).
- Write a short, empathetic, explainable AI summary explaining every decision.
- Outline a fallback plan.

Return JSON in this format:
{
  "strategy": "Overall core strategy for the rescue",
  "nextBestAction": "The exact immediate first action",
  "recoverySchedule": [
    { "timeSlot": "09:00 - 11:00", "taskTitle": "Task Name", "priority": "HIGH", "durationMin": 120 }
  ],
  "sacrifices": [
    { "taskTitle": "Task to Sacrifice", "type": "POSTPONE", "reason": "Explanation of why", "impactOnProbability": 15 }
  ],
  "originalProbability": 45,
  "newProbability": 82,
  "confidence": 90,
  "explanation": "Detailed explanation of why we drop/prioritize these tasks based on workload.",
  "fallbackPlan": "Fallback option if the timeline slips."
}
      `;

    case 'chat':
      const conversationHistory = data.messages
        .map((m: any) => `${m.role === 'user' ? 'User' : 'LifeOS AI'}: ${m.content}`)
        .join('\n');

      return `
You are the LifeOS AI Floating Copilot. You are friendly, premium, and sharp.
You understand the user's high-stakes missions and help them manage their stress, reschedule plans, explain predictions, and optimize schedules.

Active Missions context:
${JSON.stringify(data.currentMissions, null, 2)}

Conversation History:
${conversationHistory}

Generate a concise response to the user's latest query. Make suggestions actionable.
Explain your reasoning clearly so the user understands the "why".

Return JSON in this format:
{
  "reply": "Your response text goes here, formatted in clean markdown."
}
      `;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

function handleMockFallback(action: string, data: any) {
  switch (action) {
    case 'generate_milestones': {
      const title = (data.title || '').toLowerCase();
      let milestones = [];

      if (title.includes('google') || title.includes('internship') || title.includes('placement')) {
        milestones = [
          { title: "Core DSA Patterns", description: "Master Array, String, sliding window, and two-pointer interview problems on LeetCode.", estimatedHours: 15, order: 1 },
          { title: "System Design & Algorithms", description: "Practice Graph, Dynamic Programming, and basic system design fundamentals.", estimatedHours: 20, order: 2 },
          { title: "Resume & Mock Grills", description: "Revamp resume with metrics, and conduct 2 peer mock interviews focusing on communication.", estimatedHours: 10, order: 3 },
          { title: "Behavioral & Company Prep", description: "Prepare answers using the STAR method for leadership principles and review recent patterns.", estimatedHours: 8, order: 4 },
        ];
      } else if (title.includes('react') || title.includes('web') || title.includes('learn')) {
        milestones = [
          { title: "Core React Foundations", description: "Master JSX, Props, State, and Component Lifecycle triggers.", estimatedHours: 10, order: 1 },
          { title: "Hooks & Context API", description: "Deep dive into useEffect, useRef, custom hooks, and global state management.", estimatedHours: 12, order: 2 },
          { title: "Routing & Server Actions", description: "Build multi-page applications using Next.js App Router and fetch data efficiently.", estimatedHours: 15, order: 3 },
          { title: "Full-Stack Project & Deploy", description: "Deploy a production-ready application on Vercel and connect with Firebase/Supabase.", estimatedHours: 18, order: 4 },
        ];
      } else {
        // Generic fallback milestones
        milestones = [
          { title: "Initiation & Scope Setup", description: "Deconstruct the mission, compile essential resources, and outline target requirements.", estimatedHours: 8, order: 1 },
          { title: "Deep-Dive Core Execution", description: "Complete the main modules of work, solving high-priority dependencies.", estimatedHours: 20, order: 2 },
          { title: "Integration & Testing", description: "Verify sub-actions, write automated tests, and run end-to-end user flows.", estimatedHours: 12, order: 3 },
          { title: "Final Review & Deployment", description: "Deliver project artifacts, gather final sign-off, and deploy to production.", estimatedHours: 6, order: 4 },
        ];
      }

      return NextResponse.json({ milestones });
    }

    case 'generate_roadmap': {
      const title = (data.title || '').toLowerCase();
      let roadmap = [];

      if (title.includes('google') || title.includes('internship') || title.includes('placement')) {
        roadmap = [
          {
            weekNumber: 1,
            focus: "DSA & LeetCode Grind",
            milestones: ["Solve 25 Medium LeetCode problems", "Complete Array/String patterns"],
            tasks: ["Solve 3 sliding window questions", "Revise sorting algorithms", "Review time complexity proofs"]
          },
          {
            weekNumber: 2,
            focus: "Advanced Data Structures & Mock Grills",
            milestones: ["Practice Graph/Tree traversals", "Do 1 mock interview"],
            tasks: ["Implement DFS & BFS from scratch", "Solve 5 Tree-based problems", "Watch mock interview videos on YouTube"]
          },
          {
            weekNumber: 3,
            focus: "Resume Review & System Design Basics",
            milestones: ["Draft Google-style resume", "Complete System Design concepts"],
            tasks: ["Rewrite project bullet points with metrics", "Learn load balancer and scaling concepts", "Get resume peer-reviewed"]
          },
          {
            weekNumber: 4,
            focus: "Behavioral & Last Minute Practice",
            milestones: ["Prepare 5 STAR stories", "Review LeetCode top questions"],
            tasks: ["Write down Google-focused STAR stories", "Practice timed coding tests", "Review cheat sheets and algorithms"]
          }
        ];
      } else {
        roadmap = [
          {
            weekNumber: 1,
            focus: "Phase 1: Setup & Groundwork",
            milestones: ["Set up environment", "Complete initial architectural plans"],
            tasks: ["Configure boilerplate code", "Research baseline dependencies", "Create database schema drafts"]
          },
          {
            weekNumber: 2,
            focus: "Phase 2: Core Implementation",
            milestones: ["Implement MVP flow", "Connect backend databases"],
            tasks: ["Create primary components", "Connect mock endpoints to UI", "Write basic test suites"]
          },
          {
            weekNumber: 3,
            focus: "Phase 3: Integration & Polish",
            milestones: ["Polish UX/UI responsive frames", "Optimize latency"],
            tasks: ["Audit accessibility", "Refactor complex functions", "Inject visual feedback states"]
          },
          {
            weekNumber: 4,
            focus: "Phase 4: Release & Reflect",
            milestones: ["Deploy to production", "Conduct post-mortem reflection"],
            tasks: ["Set up CI/CD pipeline", "Monitor deployment logs", "Create user review forms"]
          }
        ];
      }

      return NextResponse.json({ roadmap });
    }

    case 'run_rescue_engine': {
      const tier = data.sacrificeTier || 'CATCH_UP';
      const missions = data.missions || [];
      
      let originalProbability = 52;
      let newProbability = 84;
      let explanation = "";
      let strategy = "";
      let nextBestAction = "Implement the critical DSA algorithms and ignore documentation details.";
      let sacrifices = [];
      let recoverySchedule = [];

      if (tier === 'CATCH_UP') {
        originalProbability = 60;
        newProbability = 88;
        strategy = "Squeeze extra hours and postpone administrative tasks to recover timeline alignment.";
        explanation = "Based on your active missions, you are currently running slightly behind schedule on milestones. By postponing low-priority tasks, we free up 3 hours today to restore safety levels.";
        sacrifices = [
          { taskTitle: "Review notes from week 2", type: "POSTPONE", reason: "Administrative task that doesn't impact immediate milestones.", impactOnProbability: 10 },
          { taskTitle: "Format styling configurations", type: "SIMPLIFY", reason: "We can use standard Tailwind settings for now and refine details later.", impactOnProbability: 5 }
        ];
        recoverySchedule = [
          { timeSlot: "15:00 - 17:00", taskTitle: "Solve Tree/Graph DSA problems", priority: "HIGH", durationMin: 120 },
          { timeSlot: "17:30 - 19:00", taskTitle: "Refactor backend API endpoints", priority: "MEDIUM", durationMin: 90 },
          { timeSlot: "20:00 - 21:00", taskTitle: "Daily milestone checkin & reflection", priority: "LOW", durationMin: 60 }
        ];
      } else if (tier === 'EMERGENCY') {
        originalProbability = 38;
        newProbability = 79;
        strategy = "Immediate lockdown. Postpone 70% of non-essential actions and focus entirely on the core project delivery.";
        explanation = "You have conflicting deadlines tomorrow. The Success Probability is low because you have too many parallel workloads. We are dropping the non-essential deliverables so you can secure a passing MVP.";
        sacrifices = [
          { taskTitle: "Watch general system design videos", type: "DROP", reason: "Irrelevant for tomorrow's coding test. Need to focus strictly on DSA.", impactOnProbability: 25 },
          { taskTitle: "Refining project landing page CSS", type: "SIMPLIFY", reason: "Keep landing page minimal; focus instead on functional backend endpoints.", impactOnProbability: 16 }
        ];
        recoverySchedule = [
          { timeSlot: "14:00 - 17:00", taskTitle: "Core DSA LeetCode Mock Grills", priority: "HIGH", durationMin: 180 },
          { timeSlot: "18:00 - 20:00", taskTitle: "Implement API auth integration", priority: "HIGH", durationMin: 120 },
          { timeSlot: "21:00 - 22:30", taskTitle: "Run deployment build validations", priority: "HIGH", durationMin: 90 }
        ];
      } else {
        originalProbability = 25;
        newProbability = 68;
        strategy = "Salvage operation. The current plan is overloaded. Let's drop secondary missions entirely to salvage your highest priority placement exam.";
        explanation = "You are at high risk of burnout with a critical exam collision. We recommend dropping minor project updates to salvage your Placement Preparation, which carries the highest long-term stakes.";
        sacrifices = [
          { taskTitle: "React web app deployment setup", type: "DROP", reason: "Deployment can wait until after placement tests are over.", impactOnProbability: 30 },
          { taskTitle: "Academic weekly revision reading", type: "POSTPONE", reason: "Can be recovered over the weekend.", impactOnProbability: 13 }
        ];
        recoverySchedule = [
          { timeSlot: "15:00 - 18:00", taskTitle: "Revise OOPs and OS foundations", priority: "HIGH", durationMin: 180 },
          { timeSlot: "19:00 - 21:00", taskTitle: "Solve Top DSA Dynamic Programming questions", priority: "HIGH", durationMin: 120 }
        ];
      }

      // Check if we have dynamic titles in the request to customize sacrifices
      if (missions.length > 0) {
        const criticalMission = missions.find((m: any) => m.health === 'Critical' || m.health === 'At Risk') || missions[0];
        nextBestAction = `Resolve the pending milestones for "${criticalMission.title}" immediately.`;
      }

      return NextResponse.json({
        strategy,
        nextBestAction,
        recoverySchedule,
        sacrifices,
        originalProbability,
        newProbability,
        confidence: 88,
        explanation,
        fallbackPlan: "If today's schedule slips, shift the review block to 07:00 tomorrow and sacrifice tomorrow's personal leisure time."
      });
    }

    case 'chat': {
      const messages = data.messages || [];
      const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      
      let reply = "I understand you are managing high stakes today. Let me help you optimize your schedule. ";

      if (userMessage.includes('rescue') || userMessage.includes('save')) {
        reply = `### LifeOS AI Rescue Analysis
I've reviewed your active missions. You currently have a high concentration of tasks due. 

**Recommended Action**:
1. Click the **🚨 SAVE MY DAY** button on the dashboard.
2. Select **Emergency Mode**.
3. We will drop administrative tasks (saving 2 hours) and shift Focus to your core technical milestones.

*Why this recommendation?* Keeping everything active splits your focus, dragging success down to 40%. Aggressive sacrifice recovers it to 82%.`;
      } else if (userMessage.includes('google') || userMessage.includes('interview') || userMessage.includes('placement')) {
        reply = `### Placement Copilot Active
For **Google / Placement Preparation**, here is your priority plan:
- **DSA Priority**: Focus on *Sliding Window*, *Dynamic Programming (1D)*, and *Graph traversals (BFS/DFS)*.
- **Resource Recommendation**: Watch the [NeetCode 150 playlist](https://youtube.com) and review [Tech Interview Handbook](https://github.com/yangshun/tech-interview-handbook).
- **Today's Action**: Solve 3 Graph problems in Focus Mode.

Let me know if you want me to write a custom study schedule for this!`;
      } else if (userMessage.includes('burnout') || userMessage.includes('stress')) {
        reply = `### Stress Buffer Activated
Your burnout risk index is currently at **78% (At Risk)**.
- **Reason**: You've scheduled 6 consecutive hours of focus with zero buffer blocks.
- **Intervention**: I suggest reducing today's focus block to 4 hours, adding 15-minute walks between Pomodoro rounds.
- **Success Impact**: While this delays one task, it prevents mid-week crash, raising your overall success probability from 65% to 80%.`;
      } else {
        reply = `### LifeOS Assistant online
I'm tracking your active missions. Here's what I can do:
- **Reschedule**: Ask me to "/postpone [task]" or "/buffer [mission]"
- **Explain predictions**: Ask why a mission is "Critical" or why your success probability dropped
- **Roadmap help**: Ask me to break down any new target like "Learn Kubernetes in 2 weeks"

How can I help you save your day?`;
      }

      return NextResponse.json({ reply });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
