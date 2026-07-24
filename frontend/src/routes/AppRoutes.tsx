import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingPage } from '../pages/Landing/LandingPage';
import { CandidateLogin } from '../pages/Auth/CandidateLogin';
import { CandidateRegister } from '../pages/Auth/CandidateRegister';
import { AdminLogin } from '../pages/Auth/AdminLogin';
import { CandidateDashboard } from '../pages/Candidate/CandidateDashboard';
import { ExamPage } from '../pages/Compiler/ExamPage';
import { SandboxPage } from '../pages/Compiler/SandboxPage';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { LeaderboardPage } from '../pages/Leaderboard/LeaderboardPage';
import { UserProfilePage } from '../pages/Profile/UserProfilePage';
import { AssessmentsPage } from '../pages/Candidate/AssessmentsPage';
import { ProblemsPage } from '../pages/Candidate/ProblemsPage';
import { ResultsPage } from '../pages/Candidate/ResultsPage';
import { AssessmentReadinessPage } from '../pages/Candidate/AssessmentReadinessPage';
import { AboutPage } from '../pages/About/AboutPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<CandidateLogin />} />
      <Route path="/register" element={<CandidateRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Candidate Pages */}
      <Route path="/dashboard" element={<CandidateDashboard />} />
      <Route path="/assessments" element={<AssessmentsPage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/assessment/:id/readiness" element={<AssessmentReadinessPage />} />
      <Route path="/exam/:id" element={<ExamPage />} />
      <Route path="/sandbox" element={<SandboxPage />} />

      {/* Admin Pages */}
      <Route path="/admin/dashboard" element={<AdminOnly><AdminDashboard /></AdminOnly>} />

      {/* Common Pages */}
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/profile" element={<UserProfilePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  return role === 'admin' ? <>{children}</> : <Navigate to="/admin/login" replace />;
};
