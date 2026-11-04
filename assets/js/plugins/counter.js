/**
 * Amma's Tiffin House - Counters, Live Serving Status & Brass Clock Plugin
 * Handles scroll-activated numeric counters, real-time restaurant serving status,
 * and the live analog brass tiffin clock on Home 1.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  /**
   * Determine current serving session based on local time of day.
   * Schedule:
   * - Morning Tiffin: 06:30 to 11:30
   * - Banana-Leaf Lunch: 12:00 to 15:30
   * - Evening Tiffin & Kaapi: 16:30 to 22:00
   * @param {Date} now Date object to evaluate.
   * @returns {Object} Status metadata { isOpen, label, shortLabel, sessionKey }.
   */
  function getServingStatus(now = new Date()) {
    const minutes = now.getHours() * 60 + now.getMinutes();

    if (minutes >= 390 && minutes <= 690) {
      return {
        isOpen: true,
        sessionKey: 'breakfast',
        shortLabel: 'Open Now • Morning Tiffin',
        label: 'Serving Now: Steaming Morning Breakfast (until 11:30 AM)'
      };
    }
    if (minutes >= 720 && minutes <= 930) {
      return {
        isOpen: true,
        sessionKey: 'lunch',
        shortLabel: 'Open Now • Banana-Leaf Meals',
        label: 'Serving Now: Traditional Lunch Meals (until 3:30 PM)'
      };
    }
    if (minutes >= 990 && minutes <= 1320) {
      return {
        isOpen: true,
        sessionKey: 'evening',
        shortLabel: 'Open Now • Evening Tiffin',
        label: 'Serving Now: Hot Evening Tiffin & Degree Kaapi (until 10:00 PM)'
      };
    }
    if (minutes > 690 && minutes < 720) {
      return {
        isOpen: false,
        sessionKey: 'prep-lunch',
        shortLabel: 'Prep Break • Lunch at 12:00 PM',
        label: 'Kitchen Resetting: Banana-Leaf Lunch Opens at 12:00 PM'
      };
    }
    if (minutes > 930 && minutes < 990) {
      return {
        isOpen: false,
        sessionKey: 'prep-evening',
        shortLabel: 'Prep Break • Tiffin at 4:30 PM',
        label: 'Roasting Fresh Podi: Evening Tiffin Opens at 4:30 PM'
      };
    }
    return {
      isOpen: false,
      sessionKey: 'closed',
      shortLabel: 'Closed • Opens 6:30 AM',
      label: 'Batter Fermenting Overnight • Fresh Idlis Ready at 6:30 AM'
    };
  }

  /**
   * Update all live status badges and active timing slots on the page.
   */
  function initLiveStatusAndClock() {
    const headerBadges = document.querySelectorAll('[data-live-status]');
    const heroBadges = document.querySelectorAll('[data-serving-hero]');
    const clockHour = document.querySelector('[data-clock-hour]');
    const clockMinute = document.querySelector('[data-clock-minute]');
    const clockSecond = document.querySelector('[data-clock-second]');
    const clockDigital = document.querySelector('[data-clock-digital]');
    const sessionSlots = document.querySelectorAll('[data-session-slot]');

    const updateAll = () => {
      const now = new Date();
      const status = getServingStatus(now);

      headerBadges.forEach((badge) => {
        badge.classList.toggle('is-open', status.isOpen);
        badge.classList.toggle('is-closed', !status.isOpen);
        const textEl = badge.querySelector('.status-badge__text') || badge;
        textEl.textContent = status.shortLabel;
      });

      heroBadges.forEach((badge) => {
        badge.classList.toggle('is-open', status.isOpen);
        badge.classList.toggle('is-closed', !status.isOpen);
        const textEl = badge.querySelector('.hero-live-badge__text');
        if (textEl) {
          textEl.textContent = status.label;
        }
      });

      sessionSlots.forEach((slot) => {
        const key = slot.getAttribute('data-session-slot');
        const active = key === status.sessionKey;
        slot.classList.toggle('is-active-session', active);
      });

      if (clockHour && clockMinute) {
        const hrs = now.getHours() % 12;
        const mins = now.getMinutes();
        const secs = now.getSeconds();
        const hrDeg = hrs * 30 + mins * 0.5;
        const minDeg = mins * 6 + secs * 0.1;
        const secDeg = secs * 6;

        clockHour.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
        clockMinute.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        if (clockSecond) {
          clockSecond.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        }
      }

      if (clockDigital) {
        clockDigital.textContent = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    };

    updateAll();
    window.setInterval(updateAll, 1000);
  }

  /**
   * Animate numeric counters once they enter the viewport.
   */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Format an interpolated value according to element attributes.
     * @param {number} val Numeric value.
     * @param {number} decimals Decimal precision.
     * @param {string} prefix Optional prefix string.
     * @param {string} suffix Optional suffix string.
     * @returns {string} Formatted counter text.
     */
    const formatValue = (val, decimals, prefix, suffix) => {
      const fixed = decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString('en-IN');
      return `${prefix}${fixed}${suffix}`;
    };

    /**
     * Run smooth ease-out cubic animation for a single counter element.
     * @param {HTMLElement} el Counter element.
     */
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-counter-target') || '0');
      const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = parseInt(el.getAttribute('data-counter-duration') || '1800', 10);

      if (reducedMotion) {
        el.textContent = formatValue(target, decimals, prefix, suffix);
        return;
      }

      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = formatValue(current, decimals, prefix, suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(target, decimals, prefix, suffix);
        }
      };

      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  window.AmmasTiffin.initLiveStatusAndClock = initLiveStatusAndClock;
  window.AmmasTiffin.initCounters = initCounters;
})();

