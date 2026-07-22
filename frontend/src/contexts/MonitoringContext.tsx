import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MonitoringEvent, SeverityLevel } from '../types';
import { api } from '../api/client';
import { INITIAL_MONITORING_EVENTS } from '../services/mockData';
import { useCopyPasteProtection } from '../hooks/useCopyPasteProtection';

interface MonitoringContextType {
  confidenceScore: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  warningsCount: number;
  isLocked: boolean;
  lockReason: string;
  cameraActive: boolean;
  micActive: boolean;
  isFullscreen: boolean;
  tabFocused: boolean;
  voiceDetected: boolean;
  events: MonitoringEvent[];
  evidenceCount: number;
  activeWarningModal: { open: boolean; title: string; message: string; severity: SeverityLevel } | null;
  dismissWarningModal: () => void;
  reportViolation: (eventTitle: string, severity: SeverityLevel, impact: number, details?: string, showAlert?: boolean) => Promise<void>;
  toggleCamera: () => void;
  toggleMic: () => void;
  requestFullscreen: () => Promise<void>;
  unlockExam: () => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setTabFocused: (focused: boolean) => void;
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
  const [riskScore, setRiskScore] = useState<number>(12);
  const [tabFocused, setTabFocused] = useState<boolean>(true);
  const [voiceDetected] = useState<boolean>(false);
  const [events, setEvents] = useState<MonitoringEvent[]>(INITIAL_MONITORING_EVENTS);
  const [activeWarningModal, setActiveWarningModal] = useState<{ open: boolean; title: string; message: string; severity: SeverityLevel } | null>(null);

  // Copy/Paste Protection - enabled when exam is locked or in fullscreen proctoring mode
  const isProctoringActive = isLocked || isFullscreen;
  useCopyPasteProtection({
    enabled: isProctoringActive,
    allowedSelectors: ['input', 'textarea', '[contenteditable]', '[contenteditable="true"]'],
    onViolation: (action: string) => {
      const eventMap: Record<string, { event: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; impact: number }> = {
        'c': { event: 'Copy Attempt (Ctrl+C)', severity: 'Medium', impact: -8 },
        'v': { event: 'Paste Attempt (Ctrl+V)', severity: 'Medium', impact: -10 },
        'x': { event: 'Cut Attempt (Ctrl+X)', severity: 'Medium', impact: -8 },
        'a': { event: 'Select All Attempt (Ctrl+A)', severity: 'Low', impact: -3 },
        's': { event: 'Save Attempt (Ctrl+S)', severity: 'Low', impact: -3 },
        'p': { event: 'Print Attempt (Ctrl+P)', severity: 'Medium', impact: -8 },
        'u': { event: 'View Source Attempt (Ctrl+U)', severity: 'Medium', impact: -10 },
        'f12': { event: 'DevTools Attempt (F12)', severity: 'High', impact: -15 },
        'i': { event: 'DevTools Attempt (Ctrl+Shift+I)', severity: 'High', impact: -15 },
        'j': { event: 'DevTools Attempt (Ctrl+Shift+J)', severity: 'High', impact: -15 },
        'contextmenu': { event: 'Right-click Context Menu', severity: 'Low', impact: -3 },
        'copy': { event: 'Copy Menu/Shortcut', severity: 'Medium', impact: -8 },
        'paste': { event: 'Paste Menu/Shortcut', severity: 'Medium', impact: -10 },
        'cut': { event: 'Cut Menu/Shortcut', severity: 'Medium', impact: -8 },
        'dragstart': { event: 'Drag Start Attempt', severity: 'Low', impact: -5 },
        'drop': { event: 'Drop Attempt', severity: 'Low', impact: -5 },
        'selectstart': { event: 'Text Selection Attempt', severity: 'Low', impact: -3 },
        'printscreen': { event: 'Print Screen Attempt', severity: 'High', impact: -20 },
      };

      const violation = eventMap[action.toLowerCase()] || { 
        event: `Copy/Paste Protection: ${action}`, 
        severity: 'Low' as const, 
        impact: -5 
      };
      
      reportViolation(violation.event, violation.severity, violation.impact, 
        `Copy/Paste protection triggered: ${action}`, true);
    },
  });

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

  const riskLevel = riskScore <= 30 ? 'Low' : riskScore <= 60 ? 'Medium' : 'High';

  const reportViolation = useCallback(async (eventTitle: string, severity: SeverityLevel, impact: number, details?: string, showAlert: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const eventDetails = details || `Security monitor flagged: ${eventTitle}`;

    const newEvt = await api.monitor.reportEvent({
      candidateId: 'USR001',
      candidateName: 'Vijay Rathinam',
      timestamp,
      event: eventTitle,
      severity,
      confidenceImpact: impact,
      status: 'Flagged',
      details: eventDetails,
      evidenceSnapshot: 'webcam-placeholder'
    });

    setEvents(prev => [newEvt, ...prev]);
    setConfidenceScore(prev => Math.max(0, Math.min(100, prev + impact)));
    setRiskScore(prev => Math.min(100, prev + Math.min(18, Math.abs(impact))));

    if (severity === 'High' || severity === 'Critical') {
      const nextWarnings = warningsCount + 1;
      setWarningsCount(nextWarnings);

      if (nextWarnings >= 3 || severity === 'Critical') {
        setIsLocked(true);
        setLockReason(`Multiple security violations detected (${eventTitle}). Your exam session has been locked.`);
      } else if (showAlert) {
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
      riskScore,
      riskLevel,
      warningsCount,
      isLocked,
      lockReason,
      cameraActive,
      micActive,
      isFullscreen,
      tabFocused,
      voiceDetected,
      events,
      evidenceCount: events.length,
      activeWarningModal,
      dismissWarningModal,
      reportViolation,
      toggleCamera,
      toggleMic,
      requestFullscreen,
      unlockExam,
      setIsFullscreen,
      setTabFocused
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
