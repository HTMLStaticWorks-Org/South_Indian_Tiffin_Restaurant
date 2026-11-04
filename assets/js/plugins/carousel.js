/**
 * Amma's Tiffin House - Ken Burns Slider, Scroll-Snap Rail & Testimonial Carousel
 * Powers Home 2's full-screen heritage slider, horizontal signature dish showcase,
 * and WCAG-accessible guest love carousel.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  /**
   * Initialize the full-screen Ken Burns hero slider on Home 2.
   */
  function initKenBurnsHero() {
    const hero = document.querySelector('[data-kenburns-slider]');
    if (!hero) {
      return;
    }

    const slides = Array.from(hero.querySelectorAll('[data-kenburns-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-kenburns-dot]'));
    const subtitles = Array.from(hero.querySelectorAll('[data-kenburns-caption]'));
    const pauseBtn = hero.querySelector('[data-kenburns-toggle]');

    if (slides.length < 2) {
      return;
    }

    let activeIndex = 0;
    let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timerId = null;

    /**
     * Activate a specific Ken Burns slide and sync controls.
     * @param {number} nextIndex Target slide index.
     */
    const goToSlide = (nextIndex) => {
      activeIndex = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        const isActive = idx === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      subtitles.forEach((cap, idx) => {
        cap.classList.toggle('is-active', idx === activeIndex);
      });
    };

    const SLIDE_INTERVAL_MS = 3800;

    /**
     * Start automatic slide rotation if not paused.
     */
    const startAuto = () => {
      stopAuto();
      if (isPaused) {
        return;
      }
      timerId = window.setInterval(() => {
        goToSlide(activeIndex + 1);
      }, SLIDE_INTERVAL_MS);
    };

    /**
     * Stop automatic slide rotation.
     */
    const stopAuto = () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAuto();
      });
    });

    if (pauseBtn) {
      const syncPauseButton = () => {
        pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
        pauseBtn.setAttribute(
          'aria-label',
          isPaused ? 'Resume background slideshow' : 'Pause background slideshow'
        );
        const labelSpan = pauseBtn.querySelector('span');
        if (labelSpan) {
          labelSpan.textContent = isPaused ? 'Play' : 'Pause';
        }
      };

      syncPauseButton();
      pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        syncPauseButton();
        if (isPaused) {
          stopAuto();
        } else {
          goToSlide(activeIndex + 1);
          startAuto();
        }
      });
    }

    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  /**
   * Initialize horizontal scroll-snap showcase navigation controls.
   */
  function initSignatureScrollTrack() {
    const wrapper = document.querySelector('[data-snap-showcase]');
    if (!wrapper) {
      return;
    }

    const track = wrapper.querySelector('[data-snap-track]');
    const prevBtn = wrapper.querySelector('[data-snap-prev]');
    const nextBtn = wrapper.querySelector('[data-snap-next]');
    const progressFill = wrapper.querySelector('[data-snap-progress]');

    if (!track) {
      return;
    }

    /**
     * Update progress indicator bar based on horizontal scroll ratio.
     */
    const updateProgress = () => {
      if (!progressFill) {
        return;
      }
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 1);
      const ratio = Math.min(Math.max(Math.abs(track.scrollLeft) / maxScroll, 0), 1);
      progressFill.style.transform = `scaleX(${Math.max(ratio, 0.18)})`;
    };

    /**
     * Scroll the horizontal track by one card width in LTR or RTL mode.
     * @param {number} direction -1 for previous, +1 for next.
     */
    const scrollByCard = (direction) => {
      const card = track.querySelector('.signature-snap-card');
      const distance = card ? card.getBoundingClientRect().width + 24 : 360;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const signed = isRtl ? -direction * distance : direction * distance;
      track.scrollBy({ left: signed, behavior: 'smooth' });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollByCard(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollByCard(1));
    }

    track.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /**
   * Initialize the ARIA-compliant testimonial carousel on Home 2.
   */
  function initTestimonialCarousel() {
    const root = document.querySelector('[data-testimonial-carousel]');
    if (!root) {
      return;
    }

    const slides = Array.from(root.querySelectorAll('[data-testimonial-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-testimonial-dot]'));
    const prevBtn = root.querySelector('[data-testimonial-prev]');
    const nextBtn = root.querySelector('[data-testimonial-next]');
    const liveStatus = root.querySelector('[data-testimonial-status]');

    if (!slides.length) {
      return;
    }

    let current = 0;

    /**
     * Display the selected testimonial slide and update ARIA attributes.
     * @param {number} index Target testimonial index.
     */
    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        const active = idx === current;
        slide.classList.toggle('is-active', active);
        slide.hidden = !active;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach((dot, idx) => {
        const active = idx === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (liveStatus) {
        liveStatus.textContent = `Showing guest story ${current + 1} of ${slides.length}`;
      }

      if (window.AmmasTiffin.tiltController) {
        window.AmmasTiffin.tiltController.init(slides[current]);
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(current - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(current + 1));
    }
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => showSlide(idx));
    });

    root.addEventListener('keydown', (event) => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(current + (isRtl ? 1 : -1));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(current + (isRtl ? -1 : 1));
      }
    });

    showSlide(0);
  }

  window.AmmasTiffin.initKenBurnsHero = initKenBurnsHero;
  window.AmmasTiffin.initSignatureScrollTrack = initSignatureScrollTrack;
  window.AmmasTiffin.initTestimonialCarousel = initTestimonialCarousel;
})();

