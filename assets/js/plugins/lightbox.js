/**
 * Amma's Tiffin House - Accessible Lightbox & Gallery Skeleton Plugin
 * Provides WCAG 2.1 AA compliant modal image preview with focus trapping,
 * RTL-aware keyboard navigation, and skeleton shimmer removal upon image load.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  class MosaicLightbox {
    /**
     * Construct a MosaicLightbox controller.
     */
    constructor() {
      this.items = [];
      this.currentIndex = 0;
      this.lastFocused = null;
      this.overlay = null;
    }

    /**
     * Initialize gallery skeleton states and lightbox triggers.
     */
    init() {
      this.initImageSkeletons();
      const triggers = Array.from(document.querySelectorAll('[data-lightbox-item]'));
      if (!triggers.length) {
        return;
      }

      this.items = triggers.map((trigger) => {
        const img = trigger.querySelector('img');
        return {
          trigger,
          src: trigger.getAttribute('data-lightbox-src') || (img ? img.currentSrc || img.src : ''),
          alt: img ? img.alt : '',
          caption: trigger.getAttribute('data-lightbox-caption') || (img ? img.alt : '')
        };
      });

      this.buildModal();

      triggers.forEach((trigger, idx) => {
        trigger.addEventListener('click', (event) => {
          event.preventDefault();
          this.open(idx);
        });
      });
    }

    /**
     * Clear skeleton shimmer classes once gallery or map frames finish loading.
     */
    initImageSkeletons() {
      const skeletonWrappers = document.querySelectorAll('.has-skeleton');
      skeletonWrappers.forEach((wrapper) => {
        const media = wrapper.querySelector('img, iframe');
        if (!media) {
          return;
        }
        const markLoaded = () => wrapper.classList.add('is-loaded');

        if (media.tagName === 'IMG' && media.complete && media.naturalWidth > 0) {
          markLoaded();
        } else {
          media.addEventListener('load', markLoaded, { once: true });
          media.addEventListener('error', markLoaded, { once: true });
          window.setTimeout(markLoaded, 3500);
        }
      });
    }

    /**
     * Create accessible lightbox DOM structure and attach keyboard listeners.
     */
    buildModal() {
      const overlay = document.createElement('div');
      overlay.className = 'tiffin-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Kitchen and Ambience Photo Viewer');
      overlay.setAttribute('hidden', '');

      overlay.innerHTML = `
        <div class="tiffin-lightbox__backdrop" data-lightbox-close></div>
        <div class="tiffin-lightbox__dialog" role="document">
          <div class="tiffin-lightbox__topbar">
            <span class="tiffin-lightbox__counter" aria-live="polite">1 / 1</span>
            <button type="button" class="tiffin-lightbox__close" data-lightbox-close aria-label="Close photo viewer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="tiffin-lightbox__stage">
            <button type="button" class="tiffin-lightbox__nav tiffin-lightbox__nav--prev" data-lightbox-prev aria-label="Previous photo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <figure class="tiffin-lightbox__figure">
              <div class="tiffin-lightbox__img-wrap">
                <img class="tiffin-lightbox__img" src="" alt="" />
              </div>
              <figcaption class="tiffin-lightbox__caption"></figcaption>
            </figure>
            <button type="button" class="tiffin-lightbox__nav tiffin-lightbox__nav--next" data-lightbox-next aria-label="Next photo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.overlay = overlay;
      this.imgEl = overlay.querySelector('.tiffin-lightbox__img');
      this.captionEl = overlay.querySelector('.tiffin-lightbox__caption');
      this.counterEl = overlay.querySelector('.tiffin-lightbox__counter');
      this.closeBtn = overlay.querySelector('.tiffin-lightbox__close');

      overlay.querySelectorAll('[data-lightbox-close]').forEach((el) => {
        el.addEventListener('click', () => this.close());
      });
      overlay.querySelector('[data-lightbox-prev]').addEventListener('click', () => this.step(-1));
      overlay.querySelector('[data-lightbox-next]').addEventListener('click', () => this.step(1));

      document.addEventListener('keydown', (event) => {
        if (this.overlay.hasAttribute('hidden')) {
          return;
        }
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

        if (event.key === 'Escape') {
          event.preventDefault();
          this.close();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.step(isRtl ? 1 : -1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.step(isRtl ? -1 : 1);
        } else if (event.key === 'Tab') {
          this.trapFocus(event);
        }
      });
    }

    /**
     * Keep keyboard Tab focus confined within the open modal dialog.
     * @param {KeyboardEvent} event Tab keydown event.
     */
    trapFocus(event) {
      const focusable = Array.from(
        this.overlay.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (!focusable.length) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    /**
     * Open the lightbox at the specified item index.
     * @param {number} index Zero-based gallery item index.
     */
    open(index) {
      this.lastFocused = document.activeElement;
      this.currentIndex = index;
      this.renderSlide();
      this.overlay.removeAttribute('hidden');
      document.body.classList.add('has-modal-open');
      this.closeBtn.focus();
    }

    /**
     * Close the lightbox and return focus to the originating gallery trigger.
     */
    close() {
      this.overlay.setAttribute('hidden', '');
      document.body.classList.remove('has-modal-open');
      if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
        this.lastFocused.focus();
      }
    }

    /**
     * Advance or rewind the active lightbox image with wraparound.
     * @param {number} delta Step offset (+1 or -1).
     */
    step(delta) {
      const len = this.items.length;
      this.currentIndex = (this.currentIndex + delta + len) % len;
      this.renderSlide();
    }

    /**
     * Update modal image source, alt text, caption, and counter indicator.
     */
    renderSlide() {
      const item = this.items[this.currentIndex];
      if (!item) {
        return;
      }
      this.imgEl.classList.add('is-switching');
      this.imgEl.src = item.src;
      this.imgEl.alt = item.alt;
      this.captionEl.textContent = item.caption;
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      requestAnimationFrame(() => {
        this.imgEl.classList.remove('is-switching');
      });
    }
  }

  window.AmmasTiffin.MosaicLightbox = MosaicLightbox;
})();

