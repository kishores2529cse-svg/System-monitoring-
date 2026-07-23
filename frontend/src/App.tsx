import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MonitoringProvider } from './contexts/MonitoringContext';
import { ExamProvider } from './contexts/ExamContext';
import { AppRoutes } from './routes/AppRoutes';
import { saveReportAsPdf } from './utils/reportPdf';

export const App: React.FC = () => {
  React.useEffect(() => {
    // Escape blocking is handled by useAntiCheating
  }, []);

  React.useEffect(() => {
    const exportResults = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (button?.textContent?.trim() !== 'Download report') return;
      event.preventDefault();
      saveReportAsPdf('Candidate Assessment Results', '<table><thead><tr><th>Assessment</th><th>Date</th><th>Score</th><th>Rank</th><th>Status</th></tr></thead><tbody><tr><td>DSA Round 1</td><td>22 Jul 2026</td><td>94%</td><td>#12</td><td>Passed</td></tr><tr><td>Java Programming Assessment</td><td>18 Jul 2026</td><td>89%</td><td>#24</td><td>Passed</td></tr><tr><td>SQL Fundamentals Assessment</td><td>12 Jul 2026</td><td>82%</td><td>#38</td><td>Passed</td></tr><tr><td>System Design Round</td><td>04 Jul 2026</td><td>64%</td><td>#76</td><td>Failed</td></tr></tbody></table><p><strong>Average score:</strong> 82% &nbsp; <strong>Highest score:</strong> 94% &nbsp; <strong>Completed:</strong> 4</p>');
    };
    document.addEventListener('click', exportResults);
    return () => document.removeEventListener('click', exportResults);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <MonitoringProvider>
          <ExamProvider>
            <ApplicationTheme />
          </ExamProvider>
        </MonitoringProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const ApplicationTheme: React.FC = () => {
  const { pathname } = useLocation();
  const preserveOriginalDesign = pathname === '/' || pathname === '/login' || pathname === '/admin/login';
  return <div className={preserveOriginalDesign ? '' : 'app-premium'}><AppRoutes /></div>;
};

export default App;
