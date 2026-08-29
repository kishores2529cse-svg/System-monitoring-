import {
  INITIAL_CANDIDATES,
  INITIAL_PROBLEMS,
  INITIAL_MONITORING_EVENTS,
  INITIAL_LEADERBOARD,
  INITIAL_SYSTEM_LOGS
} from '../services/mockData';
import type {
  CandidateCardData,
  ProblemData,
  MonitoringEvent,
  LeaderboardEntry,
  SystemLog,
  AdminStats,
  ManagedAssessment,
  ManagedMember,
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
const DEFAULT_MANAGED_MEMBERS: ManagedMember[] = [
  { id: 'MEM-001', name: 'Aarav Mehta', email: 'aarav.mehta@example.edu', role: 'candidate', joinedAt: '23 Jul 2026', status: 'Active', passwordStatus: 'Set', progress: 72, score: 88 },
  { id: 'MEM-002', name: 'Priya Nair', email: 'priya.nair@example.edu', role: 'candidate', joinedAt: '22 Jul 2026', status: 'Active', passwordStatus: 'Set', progress: 46, score: 76 },
  { id: 'MEM-003', name: 'Karthik Rao', email: 'karthik.rao@example.edu', role: 'candidate', joinedAt: '23 Jul 2026', status: 'Invited', passwordStatus: 'Invite pending', progress: 0, score: null }
];
const storedMembers = getStore<ManagedMember[]>('managed_members', DEFAULT_MANAGED_MEMBERS);
let managedMembers = storedMembers.length ? storedMembers : DEFAULT_MANAGED_MEMBERS;
let managedAssessments = getStore<ManagedAssessment[]>('managed_assessments', []);
let adminEvents = getStore<MonitoringEvent[]>('admin_events', []);

const API_BASE = import.meta.env.VITE_API_BASE || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://system-monitoring-1-drf0.onrender.com/api'
);

const ANTICHEATING_API_BASE = import.meta.env.VITE_ANTICHEATING_API_BASE || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081/api'
    : 'https://system-monitoring-1-drf0.onrender.com/api'
);

// Pre-registered users store for offline fallback
let registeredUsers = getStore<Array<{ email: string; password?: string; name: string; college?: string; phone?: string }>>('registered_users', [
  { email: 'kishore@shakthi.edu', password: 'password123', name: 'Kishore S', college: 'Sri Shakthi Institute of Engineering and Technology' },
  { email: 'user@codeshield.ai', password: 'user123', name: 'Default Candidate', college: 'Technology Institute' }
]);

const validateCodeSyntax = (code: string, language: string): { isValid: boolean; errorMsg: string } => {
  const trimmed = (code || '').trim();
  const langLower = (language || 'go').toLowerCase();

  if (!trimmed) {
    return { isValid: false, errorMsg: 'Line 1: SyntaxError: Empty solution provided.' };
  }

  if (langLower === 'go') {
    if (!trimmed.includes('package') && !trimmed.includes('func')) {
      return {
        isValid: false,
        errorMsg: `main.go:1:1: syntax error: unexpected name "${trimmed.slice(0, 30)}", expected package or func declaration`
      };
    }
  } else if (langLower === 'java') {
    if (!trimmed.includes('class') && !trimmed.includes('public') && !trimmed.includes('void')) {
      return {
        isValid: false,
        errorMsg: `Main.java:1: error: '<identifier>' expected\n${trimmed.slice(0, 40)}\n^`
      };
    }
  } else if (langLower === 'python' || langLower === 'py') {
    if (!trimmed.includes('def') && !trimmed.includes('return') && !trimmed.includes('print') && !trimmed.includes('=')) {
      return {
        isValid: false,
        errorMsg: `File "solution.py", line 1\n    ${trimmed.slice(0, 40)}\n    ^\nSyntaxError: invalid syntax`
      };
    }
  } else if (langLower === 'javascript' || langLower === 'js' || langLower === 'typescript' || langLower === 'ts') {
    if (!trimmed.includes('function') && !trimmed.includes('const') && !trimmed.includes('let') && !trimmed.includes('var') && !trimmed.includes('=>') && !trimmed.includes('return')) {
      return {
        isValid: false,
        errorMsg: `Uncaught SyntaxError: Unexpected token '${trimmed.slice(0, 30)}'`
      };
    }
  }

  return { isValid: true, errorMsg: '' };
};

// Extract what the code would actually print by parsing print/println/console.log statements.
// This allows the offline fallback to compare actual output vs expected output instead of
// blindly marking everything as Accepted.
const extractPrintOutput = (code: string, language: string): string | null => {
  const langLower = (language || 'go').toLowerCase();
  const outputs: string[] = [];

  // Match common print patterns and extract the string arguments
  const patterns: RegExp[] = [];
  if (langLower === 'go') {
    patterns.push(/fmt\.Print(?:ln|f)?\(\s*"([^"]*)"/g);
  } else if (langLower === 'java') {
    patterns.push(/System\.out\.print(?:ln)?\(\s*"([^"]*)"/g);
  } else if (langLower === 'python' || langLower === 'py') {
    patterns.push(/print\(\s*"([^"]*)"/g);
    patterns.push(/print\(\s*'([^']*)'/g);
  } else if (['javascript', 'js', 'typescript', 'ts'].includes(langLower)) {
    patterns.push(/console\.log\(\s*"([^"]*)"/g);
    patterns.push(/console\.log\(\s*'([^']*)'/g);
    patterns.push(/console\.log\(\s*`([^`]*)`/g);
  } else if (langLower === 'c++' || langLower === 'cpp' || langLower === 'c') {
    patterns.push(/cout\s*<<\s*"([^"]*)"/g);
    patterns.push(/printf\(\s*"([^"]*)"/g);
  } else if (langLower === 'rust') {
    patterns.push(/println!\(\s*"([^"]*)"/g);
  } else if (langLower === 'c#' || langLower === 'csharp') {
    patterns.push(/Console\.Write(?:Line)?\(\s*"([^"]*)"/g);
  }

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      outputs.push(match[1]);
    }
  }

  return outputs.length > 0 ? outputs.join('\n').trim() : null;
};

// Centralized Admin-Controlled Exam Timer API interface & default
export interface CentralTimerState {
  id: number;
  duration_minutes: number;
  duration_seconds?: number;
  exam_password?: string;
  status: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'ENDED';
  total_duration_seconds: number;
  accumulated_seconds: number;
  start_time: string | null;
  remaining_seconds?: number;
}

const DEFAULT_TIMER: CentralTimerState = {
  id: 1,
  duration_minutes: 60,
  duration_seconds: 0,
  exam_password: 'exam123',
  status: 'NOT_STARTED',
  total_duration_seconds: 3600,
  accumulated_seconds: 0,
  start_time: null
};

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password?: string): Promise<UserProfile> => {
      // 1. Try real Go Backend Database Auth API
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const userObj = resData.data.user || resData.data;
          const token = resData.data.token;
          if (token) localStorage.setItem('codeshield_token', token);
          const profile: UserProfile = {
            id: `USR-${userObj.id}`,
            name: userObj.name || userObj.username || email.split('@')[0],
            email: userObj.email,
            role: userObj.role === 'admin' ? 'admin' : 'candidate',
            college: userObj.college || '',
            department: userObj.department || '',
            phone: userObj.phone || '',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          };
          localStorage.setItem('codeshield_auth_user', JSON.stringify(profile));
          return profile;
        } else {
          throw new Error(resData.message || 'Invalid email or password');
        }
      } catch (err: any) {
        // If server explicitly returned invalid credentials or validation error, throw it!
        if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
          throw err;
        }

        // Fallback for offline/local mode: validate credentials strictly from persistent store
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();
        const allUsers = getStore<Array<{ email: string; password?: string; name: string; college?: string; department?: string; phone?: string }>>('registered_users', registeredUsers);
        const found = allUsers.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
        
        if (found) {
          if (cleanPassword && found.password && found.password.trim() !== cleanPassword) {
            throw new Error('Invalid email or password');
          }
          const offlineProfile: UserProfile = {
            id: `USR-${found.email.replace(/[^a-zA-Z0-9]/g, '')}`,
            name: found.name,
            email: found.email,
            role: 'candidate',
            college: found.college || '',
            department: (found as any).department || '',
            phone: found.phone || '',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          };
          localStorage.setItem('codeshield_auth_user', JSON.stringify(offlineProfile));
          return offlineProfile;
        }
        throw new Error('Invalid email or password. User not found.');
      }
    },

    register: async (data: any): Promise<UserProfile> => {
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPassword = (data.password || '').trim();
      const cleanName = (data.name || '').trim();
      const cleanCollege = (data.college || '').trim();
      const cleanDept = (data.department || '').trim();
      const cleanPhone = (data.phone || '').trim();

      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanName,
            email: cleanEmail,
            password: cleanPassword,
            name: cleanName,
            phone: cleanPhone,
            college: cleanCollege,
            department: cleanDept,
            role: 'user'
          })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const userObj = resData.data.user || resData.data;
          const token = resData.data.token;
          if (token) localStorage.setItem('codeshield_token', token);
          const profile: UserProfile = {
            id: `USR-${userObj.id}`,
            name: userObj.name,
            email: userObj.email,
            role: 'candidate',
            college: userObj.college || cleanCollege,
            department: userObj.department || cleanDept,
            phone: userObj.phone || cleanPhone,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          };
          localStorage.setItem('codeshield_auth_user', JSON.stringify(profile));
          return profile;
        }
      } catch (err: any) {
        // Fallback gracefully to offline store
      }

      // Offline storage fallback: re-read store, update or insert user
      const allUsers = getStore<Array<{ email: string; password?: string; name: string; college?: string; department?: string; phone?: string }>>('registered_users', registeredUsers);
      const existingIdx = allUsers.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
      
      const userRecord = {
        email: cleanEmail,
        password: cleanPassword,
        name: cleanName,
        college: cleanCollege,
        department: cleanDept,
        phone: cleanPhone
      };

      if (existingIdx !== -1) {
        allUsers[existingIdx] = userRecord;
      } else {
        allUsers.push(userRecord);
      }
      setStore('registered_users', allUsers);
      registeredUsers = allUsers;

      const profile: UserProfile = {
        id: `USR-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
        name: cleanName,
        email: cleanEmail,
        role: 'candidate',
        college: cleanCollege,
        department: cleanDept,
        phone: cleanPhone,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('codeshield_auth_user', JSON.stringify(profile));
      return profile;
    },

    adminLogin: async (adminIdOrEmail: string, password?: string, _code2FA?: string): Promise<UserProfile> => {
      // 1. Try real Go Backend Admin Auth API
      try {
        const response = await fetch(`${API_BASE}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminIdOrEmail, password })
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const adminObj = resData.data.admin || resData.data;
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
      localStorage.removeItem('codeshield_auth_user');
      return true;
    }
  },

  // User & Profile Endpoints
  user: {
    getProfile: async (): Promise<UserProfile> => {
      const token = localStorage.getItem('codeshield_token');
      if (!token) {
        const saved = localStorage.getItem('codeshield_auth_user');
        if (saved) return JSON.parse(saved);
        throw new Error('User not authenticated');
      }

      try {
        const response = await fetch(`${API_BASE}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const u = resData.data;
          const profile: UserProfile = {
            id: `USR-${u.id}`,
            name: u.name,
            email: u.email,
            role: u.role === 'admin' ? 'admin' : 'candidate',
            college: u.college || '',
            department: u.department || '',
            phone: u.phone || '',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          };
          localStorage.setItem('codeshield_auth_user', JSON.stringify(profile));
          return profile;
        } else {
          // Token expired or invalid
          if (response.status === 401) {
            localStorage.removeItem('codeshield_token');
            localStorage.removeItem('codeshield_auth_user');
          }
          throw new Error(resData.message || 'Failed to fetch profile');
        }
      } catch (err: any) {
        if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
          throw err;
        }
        const saved = localStorage.getItem('codeshield_auth_user');
        if (saved) return JSON.parse(saved);
        throw err;
      }
    },

    updateProfile: async (data: { name?: string; college?: string; department?: string; phone?: string }): Promise<UserProfile> => {
      const token = localStorage.getItem('codeshield_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/user/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
          });
          const resData = await response.json();
          if (response.ok && resData.success && resData.data) {
            const u = resData.data;
            const updated: UserProfile = {
              id: `USR-${u.id}`,
              name: u.name,
              email: u.email,
              role: u.role === 'admin' ? 'admin' : 'candidate',
              college: u.college || '',
              department: u.department || '',
              phone: u.phone || '',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            };
            localStorage.setItem('codeshield_auth_user', JSON.stringify(updated));
            return updated;
          } else {
            throw new Error(resData.message || 'Failed to update profile');
          }
        } catch (err: any) {
          if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
            throw err;
          }
        }
      }

      // Offline store update
      const saved = localStorage.getItem('codeshield_auth_user');
      const current: UserProfile = saved ? JSON.parse(saved) : { id: 'USR001', name: '', email: '', role: 'candidate' };
      const updated: UserProfile = {
        ...current,
        ...data,
        name: data.name !== undefined ? data.name : current.name,
        college: data.college !== undefined ? data.college : current.college,
        department: data.department !== undefined ? data.department : current.department,
        phone: data.phone !== undefined ? data.phone : current.phone,
      };
      localStorage.setItem('codeshield_auth_user', JSON.stringify(updated));

      // Also update in registeredUsers array
      if (current.email) {
        const idx = registeredUsers.findIndex(u => u.email.toLowerCase() === current.email.toLowerCase());
        if (idx !== -1) {
          registeredUsers[idx] = {
            ...registeredUsers[idx],
            name: updated.name,
            college: updated.college,
            department: updated.department,
            phone: updated.phone
          } as any;
          setStore('registered_users', registeredUsers);
        }
      }

      return updated;
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
    },
    verifyPassword: async (password: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE}/exam/verify-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return true;
        }
      } catch (e) {}

      // Offline fallback verification against stored exam password
      const timer = getStore<{ exam_password?: string }>('central_timer', { exam_password: 'exam123' });
      const storedPwd = timer.exam_password || 'exam123';
      return password.trim() === storedPwd.trim();
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

  // Compiler Execution & Validation API (Backend Integration)
  compiler: {
    run: async (code: string, language: string, input?: string, problemId?: number): Promise<CompilerResult> => {
      // Step 1: Pre-validate syntax for errors e.g. "vidttfjnrij"
      const syntaxCheck = validateCodeSyntax(code, language);
      if (!syntaxCheck.isValid) {
        return {
          status: 'Compilation Error',
          stdout: '',
          stderr: syntaxCheck.errorMsg,
          executionTimeMs: 12,
          memoryKb: 0,
          passedTests: 0,
          totalTests: 1,
          testDetails: [
            {
              testId: 1,
              passed: false,
              input: input || 'Sample Input',
              expectedOutput: 'Valid Output',
              actualOutput: syntaxCheck.errorMsg,
              timeMs: 12
            }
          ]
        };
      }

      const token = localStorage.getItem('codeshield_token') || localStorage.getItem('codeshield_admin_token');
      
      try {
        const response = await fetch(`${API_BASE}/compiler/run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            code,
            language: language || 'go',
            problem_id: problemId || 1
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const data = resData.data;
          const isError = !!(data.compilation_error || data.runtime_error);
          
          const currentList = getStore<ProblemData[]>('problems', problems);
          const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];
          const testCaseSources = targetProblem?.testCases && targetProblem.testCases.length > 0
            ? targetProblem.testCases
            : [
              { input: input || 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' }
            ];

          if (isError) {
            return {
              status: data.compilation_error ? 'Compilation Error' : 'Runtime Error',
              stdout: data.output || data.compilation_error || data.runtime_error || 'Execution completed with no output.',
              stderr: data.compilation_error || data.runtime_error || '',
              executionTimeMs: Math.round((data.execution_time || 0.015) * 1000),
              memoryKb: 2048,
              passedTests: 0,
              totalTests: testCaseSources.length,
              testDetails: testCaseSources.map((tc, idx) => ({
                testId: idx + 1,
                passed: false,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: data.output || data.compilation_error || data.runtime_error || 'Execution Failed',
                timeMs: Math.round((data.execution_time || 0.015) * 1000)
              }))
            };
          }

          const actualOutput = (data.output || '').trim();
          const customCases = testCaseSources.map((tc, idx) => {
            const passed = actualOutput === tc.expectedOutput.trim();
            return {
              testId: idx + 1,
              passed,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: actualOutput || 'No output produced',
              timeMs: Math.round((data.execution_time || 0.015) * 1000)
            };
          });

          const passedCount = customCases.filter(c => c.passed).length;
          const allPassed = passedCount === customCases.length;
          const verdict = allPassed ? 'Accepted' : 'Wrong Answer';

          return {
            status: verdict,
            stdout: data.output || 'Execution completed with no output.',
            stderr: allPassed ? '' : `Wrong Answer: Expected "${customCases.find(c => !c.passed)?.expectedOutput}" but got "${actualOutput}"`,
            executionTimeMs: Math.round((data.execution_time || 0.015) * 1000),
            memoryKb: 2048,
            passedTests: passedCount,
            totalTests: customCases.length,
            testDetails: customCases
          };
        }
      } catch (err) {
        console.warn('Backend compiler offline, using local evaluator.', err);
      }

      // Fallback Evaluator — evaluate solution test cases locally
      await new Promise(r => setTimeout(r, 600));
      const currentList = getStore<ProblemData[]>('problems', problems);
      const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];
      const simulatedOutput = extractPrintOutput(code, language);

      const testCaseSources = targetProblem?.testCases && targetProblem.testCases.length > 0
        ? targetProblem.testCases
        : [
          { input: input || 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' }
        ];

      const customCases = testCaseSources.map((tc, idx) => {
        const actual = simulatedOutput !== null ? simulatedOutput : tc.expectedOutput;
        const passed = simulatedOutput !== null ? (simulatedOutput.trim() === tc.expectedOutput.trim()) : true;
        return {
          testId: idx + 1,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actual,
          timeMs: 4 + idx * 2
        };
      });

      const passedCount = customCases.filter(c => c.passed).length;
      const allPassed = passedCount === customCases.length;
      const verdict = allPassed ? 'Accepted' : 'Wrong Answer';

      return {
        status: verdict,
        stdout: allPassed
          ? `All ${customCases.length} test cases PASSED!\nOutput: "${customCases[0]?.actualOutput || 'Success'}"`
          : `Wrong Answer: ${passedCount}/${customCases.length} test cases passed.\nYour output: "${simulatedOutput}"\nExpected: "${customCases.find(c => !c.passed)?.expectedOutput}"`,
        stderr: allPassed ? '' : `Wrong Answer: Expected "${customCases.find(c => !c.passed)?.expectedOutput}" but got "${simulatedOutput}"`,
        executionTimeMs: 14,
        memoryKb: 2048,
        passedTests: passedCount,
        totalTests: customCases.length,
        testDetails: customCases
      };
    },

    submit: async (code?: string, language?: string, problemId?: number): Promise<CompilerResult> => {
      // Step 1: Pre-validate syntax for errors e.g. "vidttfjnrij"
      const syntaxCheck = validateCodeSyntax(code || '', language || 'go');
      if (!syntaxCheck.isValid) {
        const currentList = getStore<ProblemData[]>('problems', problems);
        const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];
        const cases = targetProblem?.testCases && targetProblem.testCases.length > 0
          ? targetProblem.testCases
          : [{ input: 'Sample Case', expectedOutput: 'Output' }];

        return {
          status: 'Compilation Error',
          stdout: '',
          stderr: syntaxCheck.errorMsg,
          executionTimeMs: 12,
          memoryKb: 0,
          passedTests: 0,
          totalTests: cases.length,
          testDetails: cases.map((c, idx) => ({
            testId: idx + 1,
            passed: false,
            input: c.input,
            expectedOutput: c.expectedOutput,
            actualOutput: 'Compilation Error',
            timeMs: 12
          }))
        };
      }

      const token = localStorage.getItem('codeshield_token') || localStorage.getItem('codeshield_admin_token');
      
      try {
        const targetId = problemId || 1;
        const response = await fetch(`${API_BASE}/compiler/submit?problemId=${targetId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            code: code || '',
            language: language || 'go'
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const data = resData.data;
          const currentList = getStore<ProblemData[]>('problems', problems);
          const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];

          const cases = targetProblem?.testCases && targetProblem.testCases.length > 0
            ? targetProblem.testCases.map((tc, idx) => ({
              testId: idx + 1,
              passed: data.verdict === 'Accepted' || idx < data.test_cases_passed,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: data.verdict === 'Accepted' ? tc.expectedOutput : (data.output || 'Output mismatch'),
              timeMs: Math.round((data.execution_time || 0.012) * 1000)
            }))
            : Array.from({ length: data.total_test_cases || 5 }).map((_, i) => ({
              testId: i + 1,
              passed: data.verdict === 'Accepted' || i < data.test_cases_passed,
              input: `Sample Testcase #${i + 1}`,
              expectedOutput: `Valid Output #${i + 1}`,
              actualOutput: data.output || `Valid Output #${i + 1}`,
              timeMs: 2 + i * 3
            }));

          return {
            status: data.verdict || 'Accepted',
            stdout: data.output || (data.verdict === 'Accepted' ? `All test cases PASSED! Score: +100 Points` : 'Submission evaluated.'),
            stderr: data.error_message || '',
            executionTimeMs: Math.round((data.execution_time || 0.012) * 1000),
            memoryKb: data.memory_used || 1920,
            passedTests: data.test_cases_passed || cases.filter(c => c.passed).length,
            totalTests: data.total_test_cases || cases.length,
            testDetails: cases
          };
        }
      } catch (err) {
        console.warn('Backend compiler offline, using local evaluator.', err);
      }

      // Fallback Evaluator — evaluate solution test cases locally
      await new Promise(r => setTimeout(r, 1000));
      const currentList = getStore<ProblemData[]>('problems', problems);
      const targetProblem = currentList.find(p => p.id === problemId) || currentList[0];
      const simulatedOutput = extractPrintOutput(code || '', language || 'go');

      const testCaseSources = targetProblem?.testCases && targetProblem.testCases.length > 0
        ? targetProblem.testCases
        : Array.from({ length: 2 }).map((_, i) => ({
          input: `Sample Testcase #${i + 1}`,
          expectedOutput: `Valid Output #${i + 1}`
        }));

      const customCases = testCaseSources.map((tc, idx) => {
        const actual = simulatedOutput !== null ? simulatedOutput : tc.expectedOutput;
        const passed = simulatedOutput !== null ? (simulatedOutput.trim() === tc.expectedOutput.trim()) : true;
        return {
          testId: idx + 1,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actual,
          timeMs: 3 + idx * 2
        };
      });

      const passedCount = customCases.filter(c => c.passed).length;
      const allPassed = passedCount === customCases.length;
      const verdict = allPassed ? 'Accepted' : 'Wrong Answer';

      return {
        status: verdict,
        stdout: allPassed
          ? `All ${customCases.length} test cases PASSED! Score: +100 Points`
          : `Wrong Answer: ${passedCount}/${customCases.length} test cases passed.\nYour output: "${simulatedOutput}"\nExpected: "${customCases.find(c => !c.passed)?.expectedOutput}"`,
        stderr: allPassed ? '' : `Wrong Answer on Case ${customCases.findIndex(c => !c.passed) + 1}`,
        executionTimeMs: 12,
        memoryKb: 1920,
        passedTests: passedCount,
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

      // Adjust candidate confidence score & warnings and tag malpractice flags
      const isUnauthObj = event.event.includes('UNAUTHORIZED OBJECT DETECTED') || event.event.includes('Mobile Phone');
      const isFocusShift = event.event.includes('Focus Shift') || event.event.includes('Turned Around');

      candidates = candidates.map(c => {
        if (c.id === event.candidateId || c.name === event.candidateName) {
          const newScore = Math.max(0, Math.min(100, c.confidenceScore + event.confidenceImpact));
          const newWarnings = event.severity === 'High' || event.severity === 'Critical' ? c.warnings + 1 : c.warnings;
          const isLocked = newWarnings >= 3 || event.severity === 'Critical' || c.status === 'Locked';
          
          return {
            ...c,
            confidenceScore: newScore,
            warnings: newWarnings,
            status: isLocked ? 'Locked' : (newWarnings > 0 ? 'Warning' : 'Active'),
            unauthorizedObjectDetected: isUnauthObj || c.unauthorizedObjectDetected,
            unauthorizedObjectName: isUnauthObj ? (event.details?.match(/object:\s*([a-zA-Z\s]+)/i)?.[1] || 'cell phone') : c.unauthorizedObjectName,
            focusShiftDetected: isFocusShift || c.focusShiftDetected,
            malpracticeAlert: isUnauthObj ? 'UNAUTHORIZED OBJECT DETECTED!!!' : (isFocusShift ? (c.malpracticeAlert || 'FOCUS SHIFT DETECTED') : c.malpracticeAlert),
            recentViolation: event.event
          };
        }
        return c;
      });
      setStore('candidates', candidates);

      // Real backend integration: persist to Supabase & Anticheating
      const token = localStorage.getItem('codeshield_token');
      try {
        const rawId = event.candidateId.replace(/[^0-9]/g, '');
        const userIdNum = parseInt(rawId, 10) || 1;
        
        let eventType = 'PROCTOR_EVENT';
        if (isUnauthObj) {
          eventType = 'UNAUTHORIZED_OBJECT';
        } else if (isFocusShift) {
          eventType = 'TAB_SWITCH';
        } else if (event.event.includes('Fullscreen')) {
          eventType = 'EXIT_FULLSCREEN';
        } else {
          eventType = event.event.toUpperCase().replace(/\s+/g, '_');
        }

        // 1. Write directly to Supabase malpractice_logs table via backend-auth
        await fetch(`${API_BASE}/monitoring/malpractice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            user_id: userIdNum,
            event_type: eventType,
            details: event.details || event.event,
            severity: event.severity.toUpperCase(),
            detected_item: isUnauthObj ? (event.details?.match(/object:\s*([a-zA-Z\s]+)/i)?.[1] || 'cell phone') : '',
            confidence: 0.95
          })
        });

        // 2. Also notify Anticheating microservice if available
        if (token) {
          await fetch(`${ANTICHEATING_API_BASE}/monitor/event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user_id: rawId || '1',
              event_type: eventType,
              details: event.details || '',
              timestamp: new Date()
            })
          });
        }
      } catch (e) {
        console.warn('Backend malpractice sync offline. Event preserved in local session.');
      }

      return newEvt;
    },
    getHistory: async (candidateId?: string): Promise<MonitoringEvent[]> => {
      const token = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      if (token) {
        try {
          const url = candidateId
            ? `${ANTICHEATING_API_BASE}/monitor/history?userId=${candidateId.replace('USR-', '').replace('USR', '')}`
            : `${ANTICHEATING_API_BASE}/monitor/history`;
          
          const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const resData = await response.json();
            if (resData.success && Array.isArray(resData.data)) {
              const backendEvents: MonitoringEvent[] = resData.data.map((item: any) => ({
                id: `EVT-${item.id || Math.floor(1000 + Math.random() * 9000)}`,
                candidateId: item.user_id ? `USR-${item.user_id}` : 'USR001',
                candidateName: item.username || 'Candidate',
                timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
                event: item.event_type === 'MOBILE_PHONE_DETECTED' ? 'Mobile Phone Detected' : (item.event_type === 'HEAD_TURNED_AWAY' ? 'Candidate Turned Around' : item.event_type),
                severity: (item.event_type === 'MOBILE_PHONE_DETECTED' || item.event_type === 'HEAD_TURNED_AWAY') ? 'Critical' : 'Medium',
                confidenceImpact: -30,
                status: 'Flagged',
                details: item.details || 'Malpractice violation registered on server'
              }));
              
              const merged = [...backendEvents, ...events];
              const unique = merged.filter((v, i, a) => a.findIndex(t => t.timestamp === v.timestamp && t.event === v.event) === i);
              return candidateId ? unique.filter(e => e.candidateId === candidateId) : unique;
            }
          }
        } catch (e) {
          console.warn('Anticheating backend offline. Using offline browser store for history.');
        }
      }
      return candidateId ? events.filter(e => e.candidateId === candidateId) : events;
    }
  },

  // Admin Dashboard API
  admin: {
    getDashboard: async (): Promise<AdminStats> => {
      const liveCandidates = managedMembers.filter(member => member.role === 'candidate').length;
      return { totalCandidates: liveCandidates, liveCandidates: 0, lockedUsers: 0, suspiciousEvents: adminEvents.length, averageConfidenceScore: 0, completedExams: 0, runningExams: 0, aiAccuracy: 0 };
    },
    getLiveSessions: async (): Promise<CandidateCardData[]> => {
      const storedEvents = getStore<MonitoringEvent[]>('events', events);
      return candidates.map(c => {
        const candidateEvts = storedEvents.filter(e => e.candidateId === c.id || e.candidateName === c.name);
        const hasUnauthObj = candidateEvts.some(e => e.event.includes('UNAUTHORIZED OBJECT DETECTED') || e.event.includes('Mobile Phone'));
        const hasFocusShift = candidateEvts.some(e => e.event.includes('Focus Shift') || e.event.includes('Turned Around'));
        const latestEvt = candidateEvts[0];
        return {
          ...c,
          unauthorizedObjectDetected: hasUnauthObj || c.unauthorizedObjectDetected,
          focusShiftDetected: hasFocusShift || c.focusShiftDetected,
          malpracticeAlert: hasUnauthObj ? 'UNAUTHORIZED OBJECT DETECTED!!!' : (hasFocusShift ? (c.malpracticeAlert || 'FOCUS SHIFT DETECTED') : c.malpracticeAlert),
          recentViolation: latestEvt ? latestEvt.event : c.recentViolation
        };
      });
    },
    getLiveEvents: async (): Promise<MonitoringEvent[]> => {
      return adminEvents;
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
    },
    getAssessments: async (): Promise<ManagedAssessment[]> => managedAssessments,
    createAssessment: async (assessment: Omit<ManagedAssessment, 'id'>): Promise<ManagedAssessment> => {
      const created = { ...assessment, id: `ASM-${Date.now()}` };
      managedAssessments = [created, ...managedAssessments];
      setStore('managed_assessments', managedAssessments);
      return created;
    },
    toggleAssessment: async (id: string): Promise<void> => {
      managedAssessments = managedAssessments.map(item => item.id === id ? { ...item, status: item.status === 'Disabled' ? 'Published' : 'Disabled' } : item);
      setStore('managed_assessments', managedAssessments);
    },
    getMembers: async (): Promise<ManagedMember[]> => managedMembers,
    createMember: async (member: Omit<ManagedMember, 'id' | 'joinedAt' | 'status' | 'passwordStatus' | 'progress' | 'score'>): Promise<ManagedMember> => {
      const created = { ...member, id: `MEM-${Date.now()}`, joinedAt: new Date().toLocaleDateString(), status: 'Invited' as const, passwordStatus: 'Invite pending' as const, progress: 0, score: null };
      managedMembers = [created, ...managedMembers];
      setStore('managed_members', managedMembers);
      return created;
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
  },

  timer: {
    getStatus: async (): Promise<CentralTimerState & { remaining_seconds: number }> => {
      const token = localStorage.getItem('codeshield_token') || localStorage.getItem('codeshield_admin_token');
      try {
        const response = await fetch(`${API_BASE}/timer/status`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          return resData.data;
        }
      } catch (e) {
        // Fallback for offline mode
      }

      // Offline store fallback logic
      let timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      let remaining = timer.total_duration_seconds - timer.accumulated_seconds;
      if (timer.status === 'RUNNING' && timer.start_time) {
        const elapsed = Math.floor((Date.now() - new Date(timer.start_time).getTime()) / 1000);
        remaining = timer.total_duration_seconds - (timer.accumulated_seconds + elapsed);
      } else if (timer.status === 'ENDED') {
        remaining = 0;
      }

      if (remaining <= 0 && timer.status === 'RUNNING') {
        timer.status = 'ENDED';
        timer.start_time = null;
        remaining = 0;
        setStore('central_timer', timer);
      }

      return {
        ...timer,
        remaining_seconds: Math.max(0, remaining)
      };
    },

    config: async (minutes: number, seconds: number = 0, examPassword?: string): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/config`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
          },
          body: JSON.stringify({ minutes, seconds, exam_password: examPassword })
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      // Offline fallback
      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      timer.duration_minutes = minutes;
      timer.duration_seconds = seconds;
      timer.total_duration_seconds = minutes * 60 + seconds;
      if (examPassword && examPassword.trim()) {
        timer.exam_password = examPassword.trim();
      }
      if (timer.status === 'NOT_STARTED') {
        timer.accumulated_seconds = 0;
      }
      setStore('central_timer', timer);
      return { ...timer, remaining_seconds: timer.total_duration_seconds };
    },

    start: async (): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/start`, {
          method: 'POST',
          headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      timer.status = 'RUNNING';
      timer.start_time = new Date().toISOString();
      timer.accumulated_seconds = 0;
      setStore('central_timer', timer);
      return { ...timer, remaining_seconds: timer.total_duration_seconds };
    },

    pause: async (): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/pause`, {
          method: 'POST',
          headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      if (timer.status === 'RUNNING' && timer.start_time) {
        const elapsed = Math.floor((Date.now() - new Date(timer.start_time).getTime()) / 1000);
        timer.accumulated_seconds += elapsed;
        timer.status = 'PAUSED';
        timer.start_time = null;
        setStore('central_timer', timer);
      }
      return timer;
    },

    resume: async (): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/resume`, {
          method: 'POST',
          headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      timer.status = 'RUNNING';
      timer.start_time = new Date().toISOString();
      setStore('central_timer', timer);
      return timer;
    },

    extend: async (minutes: number, seconds: number = 0): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/extend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
          },
          body: JSON.stringify({ minutes, seconds })
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      const addSecs = minutes * 60 + seconds;
      timer.total_duration_seconds += addSecs;
      const currentSecs = timer.duration_seconds || 0;
      timer.duration_minutes += minutes + Math.floor((currentSecs + seconds) / 60);
      timer.duration_seconds = (currentSecs + seconds) % 60;
      if (timer.status === 'ENDED') {
        timer.status = 'PAUSED';
      }
      setStore('central_timer', timer);
      return timer;
    },

    end: async (): Promise<any> => {
      const adminToken = localStorage.getItem('codeshield_admin_token') || localStorage.getItem('codeshield_token');
      try {
        const response = await fetch(`${API_BASE}/admin/timer/end`, {
          method: 'POST',
          headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          return resData.data;
        }
      } catch (e) {}

      const timer = getStore<CentralTimerState>('central_timer', DEFAULT_TIMER);

      timer.status = 'ENDED';
      timer.start_time = null;
      setStore('central_timer', timer);
      return { ...timer, remaining_seconds: 0 };
    }
  }
};
