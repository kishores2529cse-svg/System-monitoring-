// Types for Enterprise AI Assessment & Monitoring Platform

export type UserRole = 'candidate' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  adminId?: string;
}

export type CandidateStatus = 'Active' | 'Warning' | 'Locked' | 'Submitted' | 'Terminated';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript' | 'typescript' | 'go' | 'rust' | 'csharp' | 'kotlin' | 'swift';

export interface CandidateCardData {
  id: string;
  name: string;
  email: string;
  college: string;
  department?: string;
  problem: string;
  language: string;
  timeLeft: string;
  confidenceScore: number;
  status: CandidateStatus;
  warnings: number;
  camera: boolean;
  microphone: boolean;
  fullscreen: boolean;
  tabFocused: boolean;
  voiceDetected: boolean;
  avatarUrl?: string;
  startedAt: string;
  codeSnippet?: string;
  unauthorizedObjectDetected?: boolean;
  unauthorizedObjectName?: string;
  focusShiftDetected?: boolean;
  malpracticeAlert?: string;
  recentViolation?: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemData {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  tags?: string[];
  starterCode: Partial<Record<SupportedLanguage, string>>;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    type?: string;
  }>;
}

export interface MonitoringEvent {
  id: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
  event: string;
  severity: SeverityLevel;
  confidenceImpact: number;
  status: 'Flagged' | 'Reviewed' | 'Dismissed';
  evidenceSnapshot?: string;
  details?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  college: string;
  score: number;
  solved: number;
  accuracy: string;
  time: string;
  avatarUrl?: string;
  badge?: 'Gold' | 'Silver' | 'Bronze' | 'Top Performer';
}

export interface CompilerResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Pending';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  passedTests: number;
  totalTests: number;
  testDetails: {
    testId: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    timeMs: number;
  }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: SeverityLevel;
  ipAddress: string;
  details: string;
}

export interface AdminStats {
  totalCandidates: number;
  liveCandidates: number;
  lockedUsers: number;
  suspiciousEvents: number;
  averageConfidenceScore: number;
  completedExams: number;
  runningExams: number;
  aiAccuracy: number;
}

export interface ManagedAssessment {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  totalMarks: number;
  deadline: string;
  cameraRequired: boolean;
  status: 'Draft' | 'Published' | 'Disabled';
}

export interface ManagedMember {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'admin';
  joinedAt: string;
  status: 'Active' | 'Invited' | 'Inactive';
  passwordStatus: 'Set' | 'Invite pending' | 'Reset required';
  progress: number;
  score: number | null;
}
