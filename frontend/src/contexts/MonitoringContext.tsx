import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MonitoringEvent, SeverityLevel } from '../types';
import { api } from '../api/client';
import { INITIAL_MONITORING_EVENTS } from '../services/mockData';

interface MonitoringContextType {
  confidenceScore: number;
  warningsCount: number;
  isLocked: boolean;
  lockReason: string;
  cameraActive: boolean;
  micActive: boolean;
  isFullscreen: boolean;
  tabFocused: boolean;
  voiceDetected: boolean;
  events: MonitoringEvent[];
  activeWarningModal: { open: boolean; title: string; message: string; severity: SeverityLevel } | null;
  dismissWarningModal: () => void;
  reportViolation: (eventTitle: string, severity: SeverityLevel, impact: number, details?: string) => Promise<void>;
  toggleCamera: () => void;
  toggleMic: () => void;
  requestFullscreen: () => Promise<void>;
  unlockExam: () => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [warningsCount, setWarningsCount] = useState<number>(1);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockReason, setLockReason] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [micActive, setMicActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [tabFocused] = useState<boolean>(true);
  const [voiceDetected] = useState<boolean>(false);
  const [events, setEvents] = useState<MonitoringEvent[]>(INITIAL_MONITORING_EVENTS);
  const [activeWarningModal, setActiveWarningModal] = useState<{ open: boolean; title: string; message: string; severity: SeverityLevel } | null>(null);

  // Sync heartbeat telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      api.monitor.sendHeartbeat({
        candidateId: 'USR001',
        confidence: confidenceScore,
        camera: cameraActive,
        fullscreen: isFullscreen
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [confidenceScore, cameraActive, isFullscreen]);

  const dismissWarningModal = () => {
    setActiveWarningModal(null);
  };

  const reportViolation = useCallback(async (eventTitle: string, severity: SeverityLevel, impact: number, details?: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Call Mock API
    const newEvt = await api.monitor.reportEvent({
      candidateId: 'USR001',
      candidateName: 'Vijay Rathinam',
      timestamp,
      event: eventTitle,
      severity,
      confidenceImpact: impact,
      status: 'Flagged',
      details: details || `Security monitor flagged: ${eventTitle}`
    });

    setEvents(prev => [newEvt, ...prev]);

    // Update local state
    setConfidenceScore(prev => Math.max(0, Math.min(100, prev + impact)));
    
    if (severity === 'High' || severity === 'Critical') {
      const nextWarnings = warningsCount + 1;
      setWarningsCount(nextWarnings);

      if (nextWarnings >= 3 || severity === 'Critical') {
        setIsLocked(true);
        setLockReason(`Multiple security violations detected (${eventTitle}). Your exam session has been locked.`);
      } else {
        setActiveWarningModal({
          open: true,
          title: `Security Warning (${nextWarnings}/3)`,
          message: `Caution: ${eventTitle} is forbidden during the security proctored assessment. Continued violations will result in automatic exam lock.`,
          severity
        });
      }
    }
  }, [warningsCount]);

  const toggleCamera = () => setCameraActive(prev => !prev);
  const toggleMic = () => setMicActive(prev => !prev);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.warn('Fullscreen request rejected by user browser permissions');
    }
  };

  const unlockExam = () => {
    setIsLocked(false);
    setWarningsCount(0);
    setConfidenceScore(88);
    setLockReason('');
  };

  return (
    <MonitoringContext.Provider value={{
      confidenceScore,
      warningsCount,
      isLocked,
      lockReason,
      cameraActive,
      micActive,
      isFullscreen,
      tabFocused,
      voiceDetected,
      events,
      activeWarningModal,
      dismissWarningModal,
      reportViolation,
      toggleCamera,
      toggleMic,
      requestFullscreen,
      unlockExam
    }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context) throw new Error('useMonitoring must be used within a MonitoringProvider');
  return context;
};
