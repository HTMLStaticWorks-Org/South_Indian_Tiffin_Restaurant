/**
 * Amma's Tiffin House - 3D Card Tilt & Glare Plugin
 * Applies hardware-accelerated 3D perspective rotation, dynamic glare highlight,
 * and translateZ inner-content depth lift on desktop pointer devices.
 * Gracefully degrades to a tactile press state on touch screens and respects
 * prefers-reduced-motion accessibility preferences.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  class CardTiltController {
    /**
     * Create a new CardTiltController instance.
     * @param {Object} options Configuration overrides for tilt physics.
     */
    constructor(options = {}) {
      this.maxTilt = options.maxTilt || 9;
      this.perspective = options.perspective || 1050;
      this.scale = options.scale || 1.018;
      this.speed = options.speed || 420;
      this.boundCards = new WeakSet();

      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    }

    /**
     * Determine whether 3D pointer tilt should be suppressed.
     * @returns {boolean} True when reduced motion or touch pointer is active.
     */
    shouldDisableTilt() {
      return this.reducedMotionQuery.matches || this.touchQuery.matches;
    }

    /**
     * Initialize tilt interactions on all matching cards within a root container.
     * @param {ParentNode} root DOM container to scan for [data-tilt] cards.
     */
    init(root = document) {
      const cards = root.querySelectorAll('.tiffin-card, [data-tilt]');
      const isTouchOrReduced = this.shouldDisableTilt();

      cards.forEach((card) => {
        if (isTouchOrReduced) {
          card.classList.add('tiffin-card--touch');
        } else {
          card.classList.remove('tiffin-card--touch');
        }

        if (this.boundCards.has(card)) {
          return;
        }
        this.ensureGlareLayer(card);
        this.bindCardEvents(card);
        this.boundCards.add(card);
      });
    }

    /**
     * Ensure every tilt card contains a glare highlight layer for pointer sheen.
     * @param {HTMLElement} card Target card element.
     */
    ensureGlareLayer(card) {
      if (!card.querySelector(':scope > .tiffin-card__glare')) {
        const glare = document.createElement('span');
        glare.className = 'tiffin-card__glare';
        glare.setAttribute('aria-hidden', 'true');
        card.appendChild(glare);
      }
    }

    /**
     * Bind pointer enter, move, and leave handlers with requestAnimationFrame throttling.
     * @param {HTMLElement} card Target card element.
     */
    bindCardEvents(card) {
      let rafId = null;
      let rect = null;

      const onPointerEnter = (event) => {
        if (this.shouldDisableTilt() || event.pointerType === 'touch') {
          card.classList.add('tiffin-card--touch');
          return;
        }
        card.classList.remove('tiffin-card--touch');
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease';
        card.classList.add('is-tilting');
      };

      const onPointerMove = (event) => {
        if (this.shouldDisableTilt() || event.pointerType === 'touch') {
          return;
        }
        if (!rect) {
          rect = card.getBoundingClientRect();
        }
        const clientX = event.clientX;
        const clientY = event.clientY;

        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          const relX = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
          const relY = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);

          const rotateY = (relX - 0.5) * (this.maxTilt * 2);
          const rotateX = (0.5 - relY) * (this.maxTilt * 2);

          card.style.transform = `perspective(${this.perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;
          card.style.setProperty('--glare-x', `${(relX * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${(relY * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-opacity', '1');
        });
      };

      const onPointerLeave = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        rect = null;
        card.classList.remove('is-tilting');
        card.style.transition = `transform ${this.speed}ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${this.speed}ms ease`;
        card.style.transform = '';
        card.style.setProperty('--glare-opacity', '0');
      };

      card.addEventListener('pointerenter', onPointerEnter, { passive: true });
      card.addEventListener('pointermove', onPointerMove, { passive: true });
      card.addEventListener('pointerleave', onPointerLeave, { passive: true });
      card.addEventListener('pointercancel', onPointerLeave, { passive: true });
    }
  }

  window.AmmasTiffin.CardTiltController = CardTiltController;
})();

