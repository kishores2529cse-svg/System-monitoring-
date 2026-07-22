import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MonitoringProvider } from './contexts/MonitoringContext';
import { ExamProvider } from './contexts/ExamContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  React.useEffect(() => {
    const blockEscape = (e: KeyboardEvent) => {
      const key = (e.key || '').toLowerCase();
      if (key === 'escape' || key === 'esc' || e.keyCode === 27 || e.which === 27) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    window.addEventListener('keydown', blockEscape, true);
    window.addEventListener('keyup', blockEscape, true);
    window.addEventListener('keypress', blockEscape, true);
    document.addEventListener('keydown', blockEscape, true);
    document.addEventListener('keyup', blockEscape, true);
    document.addEventListener('keypress', blockEscape, true);

    return () => {
      window.removeEventListener('keydown', blockEscape, true);
      window.removeEventListener('keyup', blockEscape, true);
      window.removeEventListener('keypress', blockEscape, true);
      document.removeEventListener('keydown', blockEscape, true);
      document.removeEventListener('keyup', blockEscape, true);
      document.removeEventListener('keypress', blockEscape, true);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <MonitoringProvider>
          <ExamProvider>
            <AppRoutes />
          </ExamProvider>
        </MonitoringProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
