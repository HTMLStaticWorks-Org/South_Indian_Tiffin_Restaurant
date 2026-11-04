/**
 * Amma's Tiffin House - Interactive Plate Builder, Menu Tabs, 404 Finder & Countdown
 * Modular interactive controllers for Home 2's custom tiffin plate builder,
 * Menu meal-time tabs with skeleton loaders, 404 quick search, and Coming Soon timer.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  /**
   * Initialize Home 2's interactive "Build Your Tiffin Plate" combo configurator.
   */
  function initPlateBuilder() {
    const builder = document.querySelector('[data-plate-builder]');
    if (!builder) {
      return;
    }

    const optionInputs = Array.from(builder.querySelectorAll('[data-plate-item]'));
    const listEl = builder.querySelector('[data-plate-summary-list]');
    const subtotalEl = builder.querySelector('[data-plate-subtotal]');
    const discountRow = builder.querySelector('[data-plate-discount-row]');
    const discountEl = builder.querySelector('[data-plate-discount]');
    const totalEl = builder.querySelector('[data-plate-total]');
    const countBadge = builder.querySelector('[data-plate-count]');
    const resetBtn = builder.querySelector('[data-plate-reset]');
    const orderBtn = builder.querySelector('[data-plate-order]');
    const feedbackEl = builder.querySelector('[data-plate-feedback]');

    /**
     * Recalculate selected items, combo savings, and banana-leaf summary chips.
     */
    const renderSummary = () => {
      const selected = optionInputs.filter((input) => input.checked);
      let subtotal = 0;

      if (listEl) {
        listEl.innerHTML = '';
        if (!selected.length) {
          const emptyLi = document.createElement('li');
          emptyLi.className = 'plate-summary__empty';
          emptyLi.textContent = 'Select at least one tiffin item to lay out your banana leaf.';
          listEl.appendChild(emptyLi);
        } else {
          selected.forEach((input) => {
            const name = input.getAttribute('data-item-name') || '';
            const price = parseInt(input.getAttribute('data-item-price') || '0', 10);
            const note = input.getAttribute('data-item-note') || '';
            subtotal += price;

            const li = document.createElement('li');
            li.className = 'plate-summary__item';
            li.innerHTML = `
              <span class="plate-summary__item-info">
                <strong>${name}</strong>
                ${note ? `<small>${note}</small>` : ''}
              </span>
              <span class="plate-summary__item-price">£${price}</span>
            `;
            listEl.appendChild(li);
          });
        }
      }

      const qualifiesCombo = selected.length >= 3;
      const discount = qualifiesCombo ? Math.round(subtotal * 0.1) : 0;
      const finalTotal = Math.max(subtotal - discount, 0);

      if (countBadge) {
        countBadge.textContent = `${selected.length} ${selected.length === 1 ? 'Item' : 'Items'} on Leaf`;
      }
      if (subtotalEl) {
        subtotalEl.textContent = `£${subtotal}`;
      }
      if (discountRow && discountEl) {
        discountRow.hidden = !qualifiesCombo;
        discountEl.textContent = `-£${discount}`;
      }
      if (totalEl) {
        totalEl.textContent = `£${finalTotal}`;
      }

      optionInputs.forEach((input) => {
        const labelCard = input.closest('.plate-choice');
        if (labelCard) {
          labelCard.classList.toggle('is-selected', input.checked);
        }
      });

      if (orderBtn) {
        orderBtn.disabled = selected.length === 0;
      }
    };

    optionInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (feedbackEl) {
          feedbackEl.hidden = true;
        }
        renderSummary();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        optionInputs.forEach((input, idx) => {
          input.checked = idx === 0 || idx === 6;
        });
        if (feedbackEl) {
          feedbackEl.hidden = true;
        }
        renderSummary();
      });
    }

    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        const selectedNames = optionInputs
          .filter((i) => i.checked)
          .map((i) => i.getAttribute('data-item-name'));
        if (!selectedNames.length || !feedbackEl) {
          return;
        }
        const totalText = totalEl ? totalEl.textContent : '';
        feedbackEl.textContent = `Custom plate saved (${selectedNames.join(' + ')} — ${totalText}). Ready for dine-in table reservation or Stripe/Razorpay checkout integration.`;
        feedbackEl.hidden = false;
      });
    }

    renderSummary();
  }

  /**
   * Initialize Menu page sticky ARIA tabs with skeleton loading transitions.
   */
  function initMenuTabs() {
    const tablist = document.querySelector('[data-menu-tabs]');
    if (!tablist) {
      return;
    }

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[data-menu-panel]'));
    const skeletonBox = document.querySelector('[data-menu-skeleton]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let swapTimer = null;

    /**
     * Activate a meal-time tab with an accessible skeleton loading shimmer.
     * @param {HTMLElement} targetTab Selected tab button element.
     * @param {boolean} focusTab Whether keyboard focus should move to the tab.
     * @param {boolean} instant Skip skeleton transition on initial boot.
     */
    const activateTab = (targetTab, focusTab = false, instant = false) => {
      const targetId = targetTab.getAttribute('aria-controls');
      if (!targetId) {
        return;
      }

      if (swapTimer) {
        window.clearTimeout(swapTimer);
        swapTimer = null;
      }

      tabs.forEach((tab) => {
        const isSelected = tab === targetTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        tab.classList.toggle('is-active', isSelected);
      });

      if (focusTab) {
        targetTab.focus();
      }

      const revealTargetPanel = () => {
        if (skeletonBox) {
          skeletonBox.hidden = true;
        }
        panels.forEach((panel) => {
          const match = panel.id === targetId;
          panel.hidden = !match;
          panel.classList.toggle('is-active', match);
          if (match && window.AmmasTiffin.tiltController) {
            window.AmmasTiffin.tiltController.init(panel);
          }
        });
      };

      if (instant || reducedMotion || !skeletonBox) {
        revealTargetPanel();
        return;
      }

      panels.forEach((panel) => {
        panel.hidden = true;
        panel.classList.remove('is-active');
      });
      skeletonBox.hidden = false;

      swapTimer = window.setTimeout(revealTargetPanel, 310);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab, false, false));

      tab.addEventListener('keydown', (event) => {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        let nextIdx = null;

        if (event.key === 'ArrowRight') {
          nextIdx = (index + (isRtl ? -1 : 1) + tabs.length) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIdx = (index + (isRtl ? 1 : -1) + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIdx = 0;
        } else if (event.key === 'End') {
          nextIdx = tabs.length - 1;
        }

        if (nextIdx !== null) {
          event.preventDefault();
          activateTab(tabs[nextIdx], true, false);
        }
      });
    });

    const hash = window.location.hash.replace('#', '');
    const hashedTab = tabs.find(
      (t) => t.getAttribute('aria-controls') === hash || t.getAttribute('data-tab-key') === hash
    );
    activateTab(hashedTab || tabs[0], false, true);
  }

  /**
   * Initialize 404 page live dish & page search navigator.
   */
  function initQuickFinder() {
    const finderForm = document.querySelector('[data-404-finder]');
    if (!finderForm) {
      return;
    }

    const input = finderForm.querySelector('input[type="search"]');
    const resultsList = finderForm.querySelector('[data-404-results]');
    if (!input || !resultsList) {
      return;
    }

    const directory = [
      { title: 'Morning Breakfast Specials (Home 1)', tag: 'Idli, Ghee Podi Dosa, Pongal', url: './index.html' },
      { title: 'Heritage Experience & Plate Builder (Home 2)', tag: 'Ken Burns, Mosaic, Testimonials', url: './home-2.html' },
      { title: 'Breakfast Tiffin Menu', tag: '6:30 AM – 11:30 AM • Dosa, Idli, Poori', url: './menu.html#panel-breakfast' },
      { title: 'Unlimited Banana-Leaf Lunch Meals', tag: '12:00 PM – 3:30 PM • Sadhya & Variety Rice', url: './menu.html#panel-lunch' },
      { title: 'Evening Tiffin & Crispy Bajji', tag: '4:30 PM – 10:00 PM • Bonda, Paniyaram, Rava Dosa', url: './menu.html#panel-evening' },
      { title: 'Kumbakonam Filter Coffee & Sweets', tag: 'Degree Kaapi, Payasam, Rava Kesari, Mysore Pak', url: './menu.html#panel-beverages' },
      { title: 'Amma’s 1988 Covent Garden Origin Story', tag: 'Wet-stone heritage, timeline & kitchen family', url: './our-story.html' },
      { title: 'Table Reservations, Map & Hours', tag: 'London Covent Garden address, directions & FAQ', url: './contact.html' }
    ];

    /**
     * Render filtered navigation matches inside the 404 search dropdown.
     * @param {string} query Search text entered by visitor.
     */
    const renderMatches = (query) => {
      const clean = query.trim().toLowerCase();
      resultsList.innerHTML = '';

      const matches = !clean
        ? directory.slice(0, 4)
        : directory.filter(
            (item) =>
              item.title.toLowerCase().includes(clean) ||
              item.tag.toLowerCase().includes(clean)
          );

      if (!matches.length) {
        const empty = document.createElement('li');
        empty.className = 'finder-results__empty';
        empty.textContent = 'No exact match found — try "dosa", "coffee", "meals", or "map".';
        resultsList.appendChild(empty);
        return;
      }

      matches.slice(0, 5).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="${item.url}" class="finder-results__link">
            <span class="finder-results__title">${item.title}</span>
            <span class="finder-results__tag">${item.tag}</span>
          </a>
        `;
        resultsList.appendChild(li);
      });
    };

    input.addEventListener('input', () => renderMatches(input.value));
    finderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const firstLink = resultsList.querySelector('a.finder-results__link');
      if (firstLink) {
        window.location.href = firstLink.getAttribute('href');
      }
    });

    renderMatches('');
  }

  /**
   * Initialize Coming Soon countdown timer with automatic rolling target fallback.
   */
  function initComingSoonCountdown() {
    const root = document.querySelector('[data-countdown]');
    if (!root) {
      return;
    }

    const daysEl = root.querySelector('[data-cd-days]');
    const hoursEl = root.querySelector('[data-cd-hours]');
    const minsEl = root.querySelector('[data-cd-mins]');
    const secsEl = root.querySelector('[data-cd-secs]');

    const rawDate = root.getAttribute('data-launch-date');
    let targetTime = rawDate ? Date.parse(rawDate) : NaN;

    if (Number.isNaN(targetTime) || targetTime <= Date.now() + 86400000) {
      targetTime = Date.now() + 24 * 24 * 60 * 60 * 1000 + 6 * 3600 * 1000;
    }

    /**
     * Pad single-digit countdown numbers with a leading zero.
     * @param {number} num Value to pad.
     * @returns {string} Zero-padded two-digit string.
     */
    const pad = (num) => String(Math.max(0, num)).padStart(2, '0');

    const tick = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    };

    tick();
    window.setInterval(tick, 1000);
  }

  window.AmmasTiffin.initPlateBuilder = initPlateBuilder;
  window.AmmasTiffin.initMenuTabs = initMenuTabs;
  window.AmmasTiffin.initQuickFinder = initQuickFinder;
  window.AmmasTiffin.initComingSoonCountdown = initComingSoonCountdown;
})();

