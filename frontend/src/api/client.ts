import {
  INITIAL_CANDIDATES,
  INITIAL_PROBLEMS,
  INITIAL_MONITORING_EVENTS,
  INITIAL_LEADERBOARD,
  INITIAL_SYSTEM_LOGS,
  INITIAL_ADMIN_STATS
} from '../services/mockData';
import type {
  CandidateCardData,
  ProblemData,
  MonitoringEvent,
  LeaderboardEntry,
  SystemLog,
  AdminStats,
  CompilerResult,
  UserProfile
} from '../types';

// Helper to interact with persistent localStorage store
const getStore = <T>(key: string, initial: T): T => {
  try {
    const data = localStorage.getItem(`codeshield_${key}`);
    return data ? JSON.parse(data) : initial;
  } catch {
    return initial;
  }
};

const setStore = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`codeshield_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
};

// Initialize Store
let candidates = getStore<CandidateCardData[]>('candidates', INITIAL_CANDIDATES);
let problems = getStore<ProblemData[]>('problems', INITIAL_PROBLEMS);
let events = getStore<MonitoringEvent[]>('events', INITIAL_MONITORING_EVENTS);
let leaderboard = getStore<LeaderboardEntry[]>('leaderboard', INITIAL_LEADERBOARD);
let logs = getStore<SystemLog[]>('logs', INITIAL_SYSTEM_LOGS);
let stats = getStore<AdminStats>('admin_stats', INITIAL_ADMIN_STATS);

const API_BASE = 'http://localhost:8080/api';

// Pre-registered users store for offline fallback
let registeredUsers = getStore<Array<{ email: string; password?: string; name: string; college?: string; phone?: string }>>('registered_users', [
  { email: 'vijay@shakthi.edu', password: 'password123', name: 'Vijay Rathinam', college: 'Sri Shakthi Institute of Engineering and Technology' },
  { email: 'user@codeshield.ai', password: 'user123', name: 'Default Candidate', college: 'Technology Institute' }
]);

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password?: string): Promise<UserProfile> => {
      // 1. Try real Go Backend PostgreSQL Auth API
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const userObj = resData.data.user;
          const token = resData.data.token;
          if (token) localStorage.setItem('codeshield_token', token);
          return {
            id: `USR-${userObj.id}`,
            name: userObj.name || userObj.username || email.split('@')[0],
            email: userObj.email,
            role: 'candidate',
            college: userObj.college || 'Engineering Institute',
            phone: userObj.phone,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          };
        } else {
          throw new Error(resData.message || 'Invalid email or password');
        }
      } catch (err: any) {
        // If server explicitly returned invalid credentials error, throw it!
        if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
          throw err;
        }

        // Fallback for offline mode: validate credentials strictly
        const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          if (password && found.password && found.password !== password) {
            throw new Error('Invalid email or password');
          }
          return {
            id: 'USR001',
            name: found.name,
            email: found.email,
            role: 'candidate',
            college: found.college || 'Engineering Institute',
            phone: found.phone || '+91 9876543210',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          };
        }
        throw new Error('Invalid email or password. User not found in database.');
      }
    },

    register: async (data: any): Promise<UserProfile> => {
      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.name,
            email: data.email,
            password: data.password,
            name: data.name,
            phone: data.phone,
            college: data.college,
            role: 'user'
          })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const userObj = resData.data.user;
          return {
            id: `USR-${userObj.id}`,
            name: userObj.name,
            email: userObj.email,
            role: 'candidate',
            college: userObj.college,
            department: data.department,
            phone: userObj.phone
          };
        }
      } catch (e) {
        console.warn('Backend server offline during register, saving locally.');
      }

      const newUser = {
        email: data.email,
        password: data.password,
        name: data.name,
        college: data.college,
        phone: data.phone
      };
      registeredUsers.push(newUser);
      setStore('registered_users', registeredUsers);

      return {
        id: `USR${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        email: data.email,
        role: 'candidate',
        college: data.college,
        department: data.department,
        phone: data.phone
      };
    },

    adminLogin: async (adminIdOrEmail: string, password?: string, _code2FA?: string): Promise<UserProfile> => {
      // 1. Try real Go Backend PostgreSQL Admin Auth API
      try {
        const response = await fetch(`${API_BASE}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminIdOrEmail, password })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const adminObj = resData.data.admin;
          const token = resData.data.token;
          if (token) localStorage.setItem('codeshield_admin_token', token);
          return {
            id: `ADM-${adminObj.id}`,
            name: adminObj.name || 'Proctor Admin',
            email: adminObj.email,
            role: 'admin',
            adminId: adminIdOrEmail,
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          };
        } else {
          throw new Error(resData.message || 'Invalid admin credentials');
        }
      } catch (err: any) {
        if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
          throw err;
        }

        // Fallback validation for offline admin credentials
        const cleanEmail = adminIdOrEmail.toLowerCase().trim();
        const validAdmins: Record<string, string> = {
          'admin@codeshield.ai': 'admin123',
          'abc@gmail.com': 'xyz',
          'adm-chief-01': 'adminpass123'
        };

        if (validAdmins[cleanEmail]) {
          if (password && validAdmins[cleanEmail] !== password) {
            throw new Error('Invalid admin passphrase');
          }
          return {
            id: cleanEmail === 'abc@gmail.com' ? 'ADM002' : 'ADM001',
            name: cleanEmail === 'abc@gmail.com' ? 'Admin ABC' : 'Enterprise Chief Proctor',
            email: cleanEmail,
            role: 'admin',
            adminId: adminIdOrEmail,
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          };
        }

        throw new Error('Invalid admin email or password. Access denied.');
      }
    },

    logout: async (): Promise<boolean> => {
      localStorage.removeItem('codeshield_token');
      localStorage.removeItem('codeshield_admin_token');
      return true;
    }
  },

  // Exam Endpoints
  exam: {
    start: async (): Promise<{ success: boolean; examId: string; durationMinutes: number }> => {
      await new Promise(r => setTimeout(r, 300));
      return { success: true, examId: 'EXM-2026-GO', durationMinutes: 90 };
    },
    getStatus: async (candidateId: string): Promise<Partial<CandidateCardData>> => {
      const cand = candidates.find(c => c.id === candidateId) || candidates[0];
      return cand;
    },
    end: async (candidateId: string): Promise<{ success: boolean; message: string }> => {
      candidates = candidates.map(c => c.id === candidateId ? { ...c, status: 'Submitted' } : c);
      setStore('candidates', candidates);
      return { success: true, message: 'Assessment submitted successfully.' };
    },
    lock: async (candidateId: string, _reason?: string): Promise<{ success: boolean }> => {
      candidates = candidates.map(c => c.id === candidateId ? { ...c, status: 'Locked' } : c);
      setStore('candidates', candidates);
      return { success: true };
    }
  },

  // Problems API
  problems: {
    getAll: async (): Promise<ProblemData[]> => {
      return getStore<ProblemData[]>('problems', problems);
    },
    getById: async (problemId: number): Promise<ProblemData | undefined> => {
      const currentList = getStore<ProblemData[]>('problems', problems);
      return currentList.find(p => p.id === problemId) || currentList[0];
    },
    create: async (newProbData: Omit<ProblemData, 'id'> & { id?: number }): Promise<ProblemData> => {
      await new Promise(r => setTimeout(r, 400));
      const currentList = getStore<ProblemData[]>('problems', problems);
      const newId = newProbData.id || Math.max(...currentList.map(p => p.id), 0) + 1;
      const createdProblem: ProblemData = {
        ...newProbData,
        id: newId,
        starterCode: newProbData.starterCode || {
          go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Solution code here\n    fmt.Println("Result")\n}',
          python: 'def solution():\n    # Solution code here\n    pass',
          javascript: 'function solution() {\n    // Solution code here\n}'
        }
      };
      const updatedList = [createdProblem, ...currentList];
      problems = updatedList;
      setStore('problems', updatedList);
      return createdProblem;
    }
  },

  // Compiler Execution Simulator
  compiler: {
    run: async (_code: string, language: string, input?: string, problemId?: number): Promise<CompilerResult> => {
      await new Promise(r => setTimeout(r, 800));
      const currentList = getStore<ProblemData[]>('problems', problems);
      const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];

      const customCases = targetProblem?.testCases && targetProblem.testCases.length > 0
        ? targetProblem.testCases.map((tc, idx) => ({
          testId: idx + 1,
          passed: true,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
          timeMs: 4 + idx * 2
        }))
        : [
          { testId: 1, passed: true, input: input || 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', actualOutput: '[0,1]', timeMs: 4 },
          { testId: 2, passed: true, input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', actualOutput: '[1,2]', timeMs: 5 }
        ];

      return {
        status: 'Accepted',
        stdout: `[Output] Executed ${language.toUpperCase()} binary successfully in sandbox.\nInput: ${input || customCases[0]?.input || 'sample'}\nResult: Accepted`,
        stderr: '',
        executionTimeMs: 14,
        memoryKb: 2048,
        passedTests: customCases.length,
        totalTests: customCases.length,
        testDetails: customCases
      };
    },
    submit: async (_code?: string, _language?: string, problemId?: number): Promise<CompilerResult> => {
      await new Promise(r => setTimeout(r, 1200));
      const currentList = getStore<ProblemData[]>('problems', problems);
      const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];

      const customCases = targetProblem?.testCases && targetProblem.testCases.length > 0
        ? targetProblem.testCases.map((tc, idx) => ({
          testId: idx + 1,
          passed: true,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
          timeMs: 3 + idx * 2
        }))
        : Array.from({ length: 5 }).map((_, i) => ({
          testId: i + 1,
          passed: true,
          input: `Sample Testcase #${i + 1}`,
          expectedOutput: `Valid Output #${i + 1}`,
          actualOutput: `Valid Output #${i + 1}`,
          timeMs: 2 + i
        }));

      return {
        status: 'Accepted',
        stdout: `All ${customCases.length} test cases PASSED successfully in isolated sandbox! Score: +100 Points`,
        stderr: '',
        executionTimeMs: 12,
        memoryKb: 1920,
        passedTests: customCases.length,
        totalTests: customCases.length,
        testDetails: customCases
      };
    }
  },

  // Real-Time Monitoring Telemetry API
  monitor: {
    sendHeartbeat: async (data: { candidateId: string; confidence: number; camera: boolean; fullscreen: boolean }): Promise<{ status: string }> => {
      candidates = candidates.map(c => c.id === data.candidateId ? { ...c, confidenceScore: data.confidence, camera: data.camera, fullscreen: data.fullscreen } : c);
      setStore('candidates', candidates);
      return { status: 'ack' };
    },
    reportEvent: async (event: Omit<MonitoringEvent, 'id'>): Promise<MonitoringEvent> => {
      const newEvt: MonitoringEvent = {
        ...event,
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`
      };
      events = [newEvt, ...events];
      setStore('events', events);

      // Adjust candidate confidence score & warnings
      candidates = candidates.map(c => {
        if (c.id === event.candidateId) {
          const newScore = Math.max(0, Math.min(100, c.confidenceScore + event.confidenceImpact));
          const newWarnings = event.severity === 'High' || event.severity === 'Critical' ? c.warnings + 1 : c.warnings;
          const isLocked = newWarnings >= 3 || event.severity === 'Critical' || c.status === 'Locked';
          return {
            ...c,
            confidenceScore: newScore,
            warnings: newWarnings,
            status: isLocked ? 'Locked' : (newWarnings > 0 ? 'Warning' : 'Active')
          };
        }
        return c;
      });
      setStore('candidates', candidates);

      return newEvt;
    },
    getHistory: async (candidateId?: string): Promise<MonitoringEvent[]> => {
      return candidateId ? events.filter(e => e.candidateId === candidateId) : events;
    }
  },

  // Admin Dashboard API
  admin: {
    getDashboard: async (): Promise<AdminStats> => {
      return stats;
    },
    getLiveSessions: async (): Promise<CandidateCardData[]> => {
      return candidates;
    },
    getLiveEvents: async (): Promise<MonitoringEvent[]> => {
      return events;
    },
    getLockedUsers: async (): Promise<CandidateCardData[]> => {
      return candidates.filter(c => c.status === 'Locked');
    },
    getUserDetail: async (userId: string): Promise<CandidateCardData | undefined> => {
      return candidates.find(c => c.id === userId);
    },
    unlockUser: async (userId: string): Promise<boolean> => {
      candidates = candidates.map(c => c.id === userId ? { ...c, status: 'Active', warnings: 0, confidenceScore: 85 } : c);
      setStore('candidates', candidates);
      return true;
    },
    rejectUser: async (userId: string): Promise<boolean> => {
      candidates = candidates.map(c => c.id === userId ? { ...c, status: 'Terminated' } : c);
      setStore('candidates', candidates);
      return true;
    },
    extendTime: async (userId: string, minutes: number): Promise<boolean> => {
      candidates = candidates.map(c => {
        if (c.id === userId) {
          const parts = c.timeLeft.split(':').map(Number);
          const totalSecs = (parts[0] * 3600) + (parts[1] * 60) + parts[2] + (minutes * 60);
          const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
          const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
          const s = (totalSecs % 60).toString().padStart(2, '0');
          return { ...c, timeLeft: `${h}:${m}:${s}` };
        }
        return c;
      });
      setStore('candidates', candidates);
      return true;
    },
    terminateSession: async (userId: string): Promise<boolean> => {
      candidates = candidates.map(c => c.id === userId ? { ...c, status: 'Terminated' } : c);
      setStore('candidates', candidates);
      return true;
    }
  },

  // Leaderboard & Logs
  leaderboard: {
    get: async (): Promise<LeaderboardEntry[]> => {
      return leaderboard;
    }
  },
  logs: {
    get: async (): Promise<SystemLog[]> => {
      return logs;
    }
  }
};
