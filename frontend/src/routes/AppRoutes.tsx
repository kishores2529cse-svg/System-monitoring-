import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/Landing/LandingPage';
import { CandidateLogin } from '../pages/Auth/CandidateLogin';
import { CandidateRegister } from '../pages/Auth/CandidateRegister';
import { AdminLogin } from '../pages/Auth/AdminLogin';
import { CandidateDashboard } from '../pages/Candidate/CandidateDashboard';
import { ExamPage } from '../pages/Compiler/ExamPage';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { LeaderboardPage } from '../pages/Leaderboard/LeaderboardPage';
import { UserProfilePage } from '../pages/Profile/UserProfilePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<CandidateLogin />} />
      <Route path="/register" element={<CandidateRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Candidate Pages */}
      <Route path="/dashboard" element={<CandidateDashboard />} />
      <Route path="/exam/:id" element={<ExamPage />} />

      {/* Admin Pages */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Common Pages */}
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/profile" element={<UserProfilePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
