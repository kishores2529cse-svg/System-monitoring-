import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Cpu, LogOut, Award, Terminal, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { GlowingButton } from '../ui/GlowingButton';

export const Navbar: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => {
  const { user, role, logout, loginAdmin, loginCandidate } = useAuth();
  const { confidenceScore, isLocked } = useMonitoring();
  const navigate = useNavigate();
  const location = useLocation();

  const isExamPage = location.pathname.startsWith('/exam');
  const isDark = theme === 'dark';

  const handleRoleToggle = async () => {
    if (role === 'admin') {
      await loginCandidate('vijay@shakthi.edu', 'pass');
      navigate('/dashboard');
    } else {
      await loginAdmin('ADM-CHIEF-01', 'pass');
      navigate('/admin/dashboard');
    }
  };

  return null;
};
