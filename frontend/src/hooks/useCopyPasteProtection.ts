import { useEffect, useRef } from 'react';

interface UseCopyPasteProtectionOptions {
  enabled?: boolean;
  allowedSelectors?: string[];
  onViolation?: (action: string) => void;
}

export const useCopyPasteProtection = ({
  enabled = true,
  allowedSelectors = [],
  onViolation,
}: UseCopyPasteProtectionOptions = {}) => {
  const allowedSelectorsRef = useRef(allowedSelectors);
  const onViolationRef = useRef(onViolation);

  useEffect(() => {
    allowedSelectorsRef.current = allowedSelectors;
    onViolationRef.current = onViolation;
  }, [allowedSelectors, onViolation]);

  const isAllowedTarget = (target: EventTarget | null): boolean => {
    if (!target) return false;
    const element = target as HTMLElement;
    if (typeof element.matches !== 'function') return false;
    return allowedSelectorsRef.current.some(selector =>
      element.matches(selector) || (typeof element.closest === 'function' && element.closest(selector))
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!enabled) return;

    const key = e.key.toLowerCase();
    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;

    // Existing restricted keys
    const isCtrlA = isCtrl && key === 'a';
    const isCtrlC = isCtrl && key === 'c';
    const isCtrlV = isCtrl && key === 'v';
    const isCtrlX = isCtrl && key === 'x';
    const isCtrlS = isCtrl && key === 's';
    const isCtrlP = isCtrl && key === 'p';
    const isCtrlU = isCtrl && key === 'u';
    const isF12 = key === 'f12';
    const isCtrlShiftI = isCtrl && isShift && key === 'i';
    const isCtrlShiftJ = isCtrl && isShift && key === 'j';
    const isCtrlShiftC = isCtrl && isShift && key === 'c';

    // System-Level Shortcuts Requested
    const isWinD = e.metaKey && key === 'd';
    const isWinE = e.metaKey && key === 'e';
    const isWinL = e.metaKey && key === 'l';
    const isAltTab = isAlt && key === 'tab';
    const isAltF4 = isAlt && key === 'f4';
    const isCtrlShiftEsc = isCtrl && isShift && (key === 'escape' || key === 'esc');
    const isCtrlAltDel = isCtrl && isAlt && key === 'delete';
    const isPrtScn = key === 'printscreen';

    // Browser-Level Shortcuts Requested
    const isCtrlT = isCtrl && key === 't';
    const isCtrlW = isCtrl && key === 'w';
    const isCtrlShiftT = isCtrl && isShift && key === 't';
    const isCtrlN = isCtrl && key === 'n';
    const isCtrlShiftN = isCtrl && isShift && key === 'n';
    const isCtrlH = isCtrl && key === 'h';
    const isCtrlJ = isCtrl && key === 'j';
    const isCtrlL = isCtrl && key === 'l';
    const isF6 = key === 'f6';
    const isCtrlR = isCtrl && key === 'r';
    const isF5 = key === 'f5';
    const isAltLeft = isAlt && key === 'arrowleft';

    // Cross-Over Shortcuts Requested
    const isCtrlF = isCtrl && key === 'f';
    const isF11 = key === 'f11';

    const isEsc = key === 'escape' || key === 'esc' || e.keyCode === 27;

    const isBlocked = 
      isCtrlA || isCtrlC || isCtrlV || isCtrlX || isCtrlS || isCtrlP || isCtrlU || 
      isF12 || isCtrlShiftI || isCtrlShiftJ || isCtrlShiftC ||
      isWinD || isWinE || isWinL || isAltTab || isAltF4 || isCtrlShiftEsc || isCtrlAltDel || isPrtScn ||
      isCtrlT || isCtrlW || isCtrlShiftT || isCtrlN || isCtrlShiftN || isCtrlH || isCtrlJ || 
      isCtrlL || isF6 || isCtrlR || isF5 || isAltLeft || isCtrlF || isF11;

    if (isEsc || isBlocked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (!isEsc) {
        onViolationRef.current?.(e.key.toLowerCase());
      }
      return false;
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('contextmenu');
    return false;
  };

  const handleCopy = (e: ClipboardEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('copy');
    return false;
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('paste');
    return false;
  };

  const handleCut = (e: ClipboardEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('cut');
    return false;
  };

  const handleDragStart = (e: DragEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('dragstart');
    return false;
  };

  const handleDrop = (e: DragEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('drop');
    return false;
  };

  const handleSelectStart = (e: Event) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    onViolationRef.current?.('selectstart');
    return false;
  };

  const handleBeforeCopy = (e: Event) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleBeforePaste = (e: Event) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleBeforeCut = (e: Event) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!enabled) return;
    if (isAllowedTarget(e.target)) return;
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard?.writeText('').catch(() => {});
      onViolationRef.current?.('printscreen');
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const handlers: Array<{ event: string; handler: EventListener; capture: boolean }> = [
      { event: 'keydown', handler: handleKeyDown as unknown as EventListener, capture: true },
      { event: 'keyup', handler: handleKeyUp as unknown as EventListener, capture: true },
      { event: 'contextmenu', handler: handleContextMenu as unknown as EventListener, capture: true },
      { event: 'copy', handler: handleCopy as unknown as EventListener, capture: true },
      { event: 'paste', handler: handlePaste as unknown as EventListener, capture: true },
      { event: 'cut', handler: handleCut as unknown as EventListener, capture: true },
      { event: 'dragstart', handler: handleDragStart as unknown as EventListener, capture: true },
      { event: 'drop', handler: handleDrop as unknown as EventListener, capture: true },
      { event: 'selectstart', handler: handleSelectStart as unknown as EventListener, capture: true },
      { event: 'beforecopy', handler: handleBeforeCopy as unknown as EventListener, capture: true },
      { event: 'beforepaste', handler: handleBeforePaste as unknown as EventListener, capture: true },
      { event: 'beforecut', handler: handleBeforeCut as unknown as EventListener, capture: true },
    ];

    handlers.forEach(({ event, handler, capture }) => {
      document.addEventListener(event, handler, capture);
    });

    const bodyStyle = document.body.style;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    (bodyStyle as any).msUserSelect = 'none';
    (bodyStyle as any).mozUserSelect = 'none';
    (bodyStyle as any).webkitTouchCallout = 'none';
    (bodyStyle as any).webkitTapHighlightColor = 'transparent';

    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      ${allowedSelectorsRef.current.map(s => `${s}, ${s} *`).join(', ')} {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      handlers.forEach(({ event, handler, capture }) => {
        document.removeEventListener(event, handler, capture);
      });
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      (bodyStyle as any).msUserSelect = '';
      (bodyStyle as any).mozUserSelect = '';
      (bodyStyle as any).webkitTouchCallout = '';
      (bodyStyle as any).webkitTapHighlightColor = '';
      document.head.removeChild(style);
    };
  }, [enabled]);

  return {
    enable: () => {},
    disable: () => {},
  };
};

export default useCopyPasteProtection;