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

    const isCtrl = e.ctrlKey || e.metaKey;
    const isCtrlA = isCtrl && e.key.toLowerCase() === 'a';
    const isCtrlC = isCtrl && e.key.toLowerCase() === 'c';
    const isCtrlV = isCtrl && e.key.toLowerCase() === 'v';
    const isCtrlX = isCtrl && e.key.toLowerCase() === 'x';
    const isCtrlS = isCtrl && e.key.toLowerCase() === 's';
    const isCtrlP = isCtrl && e.key.toLowerCase() === 'p';
    const isCtrlU = isCtrl && e.key.toLowerCase() === 'u';
    const isF12 = e.key === 'F12';
    const isCtrlShiftI = isCtrl && e.shiftKey && e.key.toLowerCase() === 'i';
    const isCtrlShiftJ = isCtrl && e.shiftKey && e.key.toLowerCase() === 'j';
    const isCtrlShiftC = isCtrl && e.shiftKey && e.key.toLowerCase() === 'c';

    const isEsc = e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;

    if (isEsc || isCtrlA || isCtrlC || isCtrlV || isCtrlX || isCtrlS || isCtrlP || isCtrlU || isF12 || isCtrlShiftI || isCtrlShiftJ || isCtrlShiftC) {
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