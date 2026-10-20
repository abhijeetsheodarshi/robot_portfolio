import { useEffect } from 'react';
import { ShelfGlow, CONFIG } from './shelfGlow.js';
import { ASTRIBOT_FIGURE } from './astribotFigure.js';

export function useShelfGlow({ followPage = false, robot = true, ripple = '#FA6147' } = {}) {
  useEffect(() => {
    let cleanupGlow;
    const shelfGlowEl = document.querySelector('[data-shelf-glow]');
    const shelfPageEl = document.querySelector('.shelf-page');

    // Dynamic cursor shadow tracking on elements marked with [data-cursor-shadow]
    const cleanupCursorShadow = ((container) => {
      if (!container) return () => {};
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let rafId = 0;
      let activeEl = null;
      let clientX = 0;
      let clientY = 0;

      const clearShadow = () => {
        cancelAnimationFrame(rafId);
        rafId = 0;
        if (activeEl) {
          activeEl.style.removeProperty('--cursor-shadow-x');
          activeEl.style.removeProperty('--cursor-shadow-y');
          activeEl = null;
        }
      };

      const updateShadow = () => {
        rafId = 0;
        if (!activeEl?.isConnected) return;
        const rect = activeEl.getBoundingClientRect();
        const xOffset = 7 * Math.max(-1, Math.min(1, (rect.left + rect.width / 2 - clientX) / (rect.width / 2 || 1)));
        const yOffset = 7 * Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - clientY) / (rect.height / 2 || 1)));
        activeEl.style.setProperty('--cursor-shadow-x', `${xOffset.toFixed(2)}px`);
        activeEl.style.setProperty('--cursor-shadow-y', `${yOffset.toFixed(2)}px`);
      };

      const onPointerMove = (e) => {
        if (!canHover.matches || prefersReducedMotion.matches || e.pointerType === 'touch') {
          return clearShadow();
        }
        const target = e.target instanceof Element ? e.target.closest('[data-cursor-shadow]') : null;
        if (target !== activeEl) {
          clearShadow();
          activeEl = target;
        }
        if (activeEl) {
          clientX = e.clientX;
          clientY = e.clientY;
          if (!rafId) {
            rafId = requestAnimationFrame(updateShadow);
          }
        }
      };

      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerleave', clearShadow, { passive: true });
      canHover.addEventListener('change', clearShadow);
      prefersReducedMotion.addEventListener('change', clearShadow);

      return () => {
        clearShadow();
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', clearShadow);
        canHover.removeEventListener('change', clearShadow);
        prefersReducedMotion.removeEventListener('change', clearShadow);
      };
    })(shelfPageEl);

    if (shelfGlowEl) {
      if (!shelfGlowEl.__shelfGlow) {
        shelfGlowEl.__shelfGlow = new ShelfGlow(shelfGlowEl, {
          ...CONFIG,
          glow: '#FA6147',
          ripple: typeof ripple === 'string' ? ripple : '#FA6147',
          ...(robot ? {
            figure: ASTRIBOT_FIGURE,
            copy: '.shelf-home__heading'
          } : {}),
          ...(followPage && shelfPageEl ? { pointerSource: shelfPageEl } : { pointerSource: window })
        });
      }
      cleanupGlow = () => {
        if (shelfGlowEl.__shelfGlow) {
          shelfGlowEl.__shelfGlow.destroy();
          delete shelfGlowEl.__shelfGlow;
        }
      };
    }

    return () => {
      try {
        cleanupGlow?.();
      } finally {
        cleanupCursorShadow();
      }
    };
  }, [followPage, robot, ripple]);
}
