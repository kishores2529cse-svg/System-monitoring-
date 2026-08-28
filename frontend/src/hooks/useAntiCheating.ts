import { useEffect, useRef } from 'react';
import { useMonitoring } from '../contexts/MonitoringContext';
import { useExam } from '../contexts/ExamContext';

export function useAntiCheating(enabled: boolean = true) {
  const { reportViolation, isLocked, setIsFullscreen, unlockExam } = useMonitoring();
  let isSubmittedSuccessfully = false;
  try {
    const exam = useExam();
    isSubmittedSuccessfully = exam.isSubmittedSuccessfully;
  } catch (e) {
    // Fallback if rendered outside ExamProvider
  }

  const lastBlurTime = useRef<number>(0);
  const lastEscTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled || isLocked) return;

    // 1. Context Menu (Right Click) Block
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation('Right Click Attempt', 'Low', -2, 'Attempted to invoke browser context menu on exam workspace.', false);
    };

    // 2. Clipboard Blocks
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      reportViolation('Clipboard Copy Attempt', 'Medium', -5, 'Attempted to copy problem text or code buffer.', false);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      reportViolation('Clipboard Paste Attempt', 'High', -10, 'Attempted to paste external snippet into Monaco Editor.', false);
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      reportViolation('Clipboard Cut Attempt', 'Low', -2, 'Attempted cut operation.', false);
    };

    // 3. Keydown Shortcut Guards
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Escape is handled in handleKeyDownCapture

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      const combination = `${isCtrl ? 'Ctrl+' : ''}${isShift ? 'Shift+' : ''}${isAlt ? 'Alt+' : ''}${key}`;

      const isModifierShortcut = isCtrl || isAlt || isShift;
      const forbiddenShortcut = isModifierShortcut && key !== 'shift' && key !== 'control' && key !== 'alt' && key !== 'meta';

      if (isAlt && key === 'tab') {
        e.preventDefault();
        if (!e.repeat) {
          reportViolation('Window Switch Attempt (Alt+Tab)', 'High', -15, 'Attempted to use Alt+Tab to switch windows.', true);
        }
        return;
      }

      if (key === 'meta' || key === 'os') {
        e.preventDefault();
        if (!e.repeat) {
          reportViolation('OS Menu Key Pressed', 'High', -10, 'Attempted to open the operating system menu.', true);
        }
        return;
      }

      if (forbiddenShortcut || key === 'f12' || key === 'contextmenu') {
        e.preventDefault();
        reportViolation('Browser Shortcut Attempt', 'High', -12, `Attempted key combination: ${combination}`, false);
      }
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && !target.closest('.monaco-editor') && !target.closest('textarea') && !target.closest('input')) {
        e.preventDefault();
        reportViolation('Text Selection Attempt', 'Medium', -6, 'Attempted to select text outside the secure exam editor.', false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      reportViolation('Drag & Drop Attempt', 'Medium', -6, 'Attempted to drop content into the secure exam viewport.', false);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);

      if (!isFS) {
        if (!isSubmittedSuccessfully && !isLocked) {
          reportViolation(
            'Fullscreen Mode Exited',
            'High',
            -15,
            'Candidate exited constant fullscreen mode.',
            true
          );
        }
      }
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && !target.closest('.monaco-editor')) {
        reportViolation('Scroll Attempt Outside Editor', 'Low', -4, 'Attempted to scroll outside the secure exam viewport.');
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) {
        e.preventDefault();
        reportViolation('Non-primary Click Attempt', 'Low', -3, 'Attempted right-click or alternate mouse button interaction.', false);
      }
    };

    const handleDevToolsHeuristic = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();

      if (e.key === 'F12' || (isCtrl && isShift && ['i', 'j', 'c'].includes(key)) || (isCtrl && key === 'u') || (isCtrl && key === 's') || (isCtrl && key === 'p')) {
        reportViolation('Developer Tools / Forbidden Shortcut Attempt', 'High', -15, `Attempted forbidden key combination: ${e.key}`);
      }
    };

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

    const handleWindowFocus = () => {
      reportViolation('Window Refocus Detected', 'Low', -4, 'Candidate returned to the exam after losing application focus.');
    };

    const handleFocusAttempt = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && !target.closest('.monaco-editor') && !target.closest('textarea') && !target.closest('input')) {
        reportViolation('Unauthorized Focus Shift', 'Low', -3, 'Attempted to move focus outside the secure exam editor.');
      }
    };

    const handleKeyDownCapture = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'esc') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Anti-cheat hack: Reset the browser's internal 2-second "Hold to Exit" timer
        if ('keyboard' in navigator && (navigator as any).keyboard) {
          try {
            (navigator as any).keyboard.unlock();
            (navigator as any).keyboard.lock().catch(() => {});
          } catch (err) {
            // Ignore
          }
        }

        if (!e.repeat) {
          lastEscTime.current = Date.now();
          reportViolation('Escape Key Pressed', 'Medium', -5, 'Attempted to press Escape to exit fullscreen.', true);
        } else {
          // If held for more than 1 second, trigger the 2-minute lockout penalty
          const timeHeld = Date.now() - lastEscTime.current;
          if (timeHeld > 1000) {
            // Update lastEscTime so we don't spam this block
            lastEscTime.current = Date.now() + 9999999;
            reportViolation(
              'Escape Key Long-Press',
              'Critical',
              -20,
              'Candidate held Escape key. 2-minute penalty lock applied.',
              true
            );
            
            // Auto-unlock after 2 minutes (120,000 ms)
            setTimeout(() => {
              unlockExam();
            }, 120000);
          }
        }
      }
    };

    // Attach Listeners
    window.addEventListener('keydown', handleKeyDownCapture, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('cut', handleCut);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleDevToolsHeuristic);
    document.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('focusin', handleFocusAttempt);

    return () => {
      window.removeEventListener('keydown', handleKeyDownCapture, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleDevToolsHeuristic);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('focusin', handleFocusAttempt);
    };
  }, [enabled, isLocked, reportViolation]);
}
