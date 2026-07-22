import { useEffect, useRef } from 'react';
import { useMonitoring } from '../contexts/MonitoringContext';

export function useAntiCheating(enabled: boolean = true) {
  const { reportViolation, isLocked } = useMonitoring();
  const lastBlurTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled || isLocked) return;

    // 1. Context Menu (Right Click) Block
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation('Right Click Attempt', 'Low', -2, 'Attempted to invoke browser context menu on exam workspace.');
    };

    // 2. Clipboard Blocks
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation('Clipboard Copy Attempt', 'Medium', -5, 'Attempted to copy problem text or code buffer.');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation('Clipboard Paste Attempt', 'High', -10, 'Attempted to paste external snippet into Monaco Editor.');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation('Clipboard Cut Attempt', 'Low', -2, 'Attempted cut operation.');
    };

    // 3. Keydown Shortcut Guards (F12, DevTools, Ctrl+U, Tab)
    const handleKeyDown = (e: KeyboardEvent) => {
      // DevTools Shortcuts
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        reportViolation('Developer Tools Shortcut Triggered', 'High', -15, `Attempted key combination: ${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`);
      }
    };

    // 4. Tab Switch & Visibility Change Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('Tab Switch / Viewport Inactive', 'High', -12, 'Candidate left exam tab or minimized browser viewport.');
      }
    };

    const handleWindowBlur = () => {
      const now = Date.now();
      if (now - lastBlurTime.current > 3000) {
        lastBlurTime.current = now;
        reportViolation('Window Focus Lost', 'Medium', -8, 'Browser viewport lost focus (possible secondary window interaction).');
      }
    };

    // 5. Fullscreen Exit Detector
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportViolation('Fullscreen Mode Exited', 'High', -15, 'Candidate exited mandated safe browser full screen viewport.');
      }
    };

    // Attach Listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('cut', handleCut);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, isLocked, reportViolation]);
}
