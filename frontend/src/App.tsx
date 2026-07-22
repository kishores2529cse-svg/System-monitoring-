import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MonitoringProvider } from './contexts/MonitoringContext';
import { ExamProvider } from './contexts/ExamContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
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
