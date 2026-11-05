/**
 * Amma's Tiffin House - Main Application Entry (ES6+)
 * Coordinates theme & RTL persistence, navigation accessibility, preloader,
 * custom desktop cursor, magnetic buttons, scroll reveals, FAQ accordions,
 * client-side form validation with tooltips, and modular UI plugins.
 */
(() => {
  'use strict';

  window.AmmasTiffin = window.AmmasTiffin || {};

  const STORAGE_THEME_KEY = 'ammas_tiffin_theme';
  const STORAGE_DIR_KEY = 'ammas_tiffin_dir';

  /**
   * Initialize dark/light color theme with OS preference fallback and toggle sync.
   */
  function initThemeController() {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * Apply theme attribute and synchronize all toggle button ARIA states.
     * @param {'light'|'dark'} theme Active theme name.
     */
    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);
      toggles.forEach((btn) => {
        const isDark = theme === 'dark';
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute(
          'aria-label',
          isDark ? 'Switch to Coconut Cream light mode' : 'Switch to Filter Coffee dark mode'
        );
      });
    };

    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    } catch (_) {
      savedTheme = null;
    }

    const initialTheme = savedTheme || (systemDark.matches ? 'dark' : 'light');
    applyTheme(initialTheme);

    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
        } catch (_) {
          /* Storage unavailable in private mode */
        }
        applyTheme(nextTheme);
      });
    });

    systemDark.addEventListener('change', (event) => {
      let hasExplicitChoice = false;
      try {
        hasExplicitChoice = Boolean(localStorage.getItem(STORAGE_THEME_KEY));
      } catch (_) {
        hasExplicitChoice = false;
      }
      if (!hasExplicitChoice) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Initialize LTR / RTL reading direction toggle and persistence.
   */
  function initRtlController() {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('[data-rtl-toggle]');

    /**
     * Apply text direction attribute and update toggle button labels.
     * @param {'ltr'|'rtl'} dir Document direction.
     */
    const applyDirection = (dir) => {
      root.setAttribute('dir', dir);
      toggles.forEach((btn) => {
        const isRtl = dir === 'rtl';
        btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
        btn.setAttribute(
          'aria-label',
          isRtl ? 'Switch layout direction to Left-to-Right' : 'Switch layout direction to Right-to-Left'
        );
        const label = btn.querySelector('[data-rtl-label]');
        if (label) {
          label.textContent = isRtl ? 'LTR' : 'RTL';
        }
      });
    };

    let savedDir = 'ltr';
    try {
      savedDir = localStorage.getItem(STORAGE_DIR_KEY) || root.getAttribute('dir') || 'ltr';
    } catch (_) {
      savedDir = root.getAttribute('dir') || 'ltr';
    }

    applyDirection(savedDir === 'rtl' ? 'rtl' : 'ltr');

    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextDir = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        try {
          localStorage.setItem(STORAGE_DIR_KEY, nextDir);
        } catch (_) {
          /* Storage unavailable */
        }
        applyDirection(nextDir);
      });
    });
  }

  /**
   * Dismiss the brief kolam/steaming-idli preloader cleanly without delaying LCP.
   */
  function initPreloader() {
    const preloader = document.querySelector('[data-preloader]');
    if (!preloader) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hidePreloader = () => {
      if (preloader.classList.contains('is-hidden')) {
        return;
      }
      preloader.classList.add('is-hidden');
      window.setTimeout(() => {
        preloader.setAttribute('hidden', '');
      }, reducedMotion ? 0 : 380);
    };

    if (reducedMotion) {
      hidePreloader();
      return;
    }

    if (document.readyState === 'complete') {
      window.setTimeout(hidePreloader, 260);
    } else {
      window.addEventListener('load', () => window.setTimeout(hidePreloader, 260), { once: true });
      window.setTimeout(hidePreloader, 900);
    }
  }

  /**
   * Initialize sticky shrinking glass header, Home dropdown, and mobile drawer.
   */
  function initNavigation() {
    const header = document.querySelector('[data-site-header]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navDrawer = document.querySelector('[data-nav-drawer]');
    const navBackdrop = document.querySelector('[data-nav-backdrop]');
    const dropdownWrappers = document.querySelectorAll('[data-dropdown]');

    const onScroll = () => {
      if (!header) {
        return;
      }
      header.classList.toggle('is-scrolled', window.scrollY > 36);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /**
     * Open or close the mobile hamburger drawer with ARIA synchronization.
     * @param {boolean} open Whether drawer should be open.
     */
    const setDrawerState = (open) => {
      if (!navToggle || !navDrawer) {
        return;
      }
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navDrawer.classList.toggle('is-open', open);
      if (navBackdrop) {
        navBackdrop.classList.toggle('is-visible', open);
      }
      document.body.classList.toggle('has-drawer-open', open);
    };

    if (navToggle && navDrawer) {
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        setDrawerState(!isOpen);
      });
    }

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => setDrawerState(false));
    }

    const navCloseButtons = document.querySelectorAll('[data-nav-close]');
    navCloseButtons.forEach((btn) => {
      btn.addEventListener('click', () => setDrawerState(false));
    });

    const drawerNavLinks = navDrawer?.querySelectorAll('a.nav-drawer__link');
    drawerNavLinks?.forEach((link) => {
      link.addEventListener('click', () => setDrawerState(false));
    });

    const drawerDropdownTriggers = navDrawer?.querySelectorAll('[data-drawer-dropdown-trigger]');
    drawerDropdownTriggers?.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = btn.closest('[data-drawer-dropdown]');
        if (parent) {
          const isOpen = parent.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });

    dropdownWrappers.forEach((wrapper) => {
      const trigger = wrapper.querySelector('[data-dropdown-trigger]');
      const menu = wrapper.querySelector('[data-dropdown-menu]');
      if (!trigger || !menu) {
        return;
      }

      const setOpen = (open) => {
        wrapper.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const currentlyOpen = wrapper.classList.contains('is-open');
        dropdownWrappers.forEach((other) => {
          if (other !== wrapper) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('[data-dropdown-trigger]');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        setOpen(!currentlyOpen);
      });

      wrapper.addEventListener('focusout', (event) => {
        if (!wrapper.contains(event.relatedTarget)) {
          setOpen(false);
        }
      });
    });

    document.addEventListener('click', (event) => {
      dropdownWrappers.forEach((wrapper) => {
        if (!wrapper.contains(event.target)) {
          wrapper.classList.remove('is-open');
          const btn = wrapper.querySelector('[data-dropdown-trigger]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setDrawerState(false);
        dropdownWrappers.forEach((wrapper) => {
          wrapper.classList.remove('is-open');
          const btn = wrapper.querySelector('[data-dropdown-trigger]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /**
   * Initialize custom turmeric dot + brass ring cursor and magnetic buttons on desktop.
   */
  function initCursorAndMagneticButtons() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reducedMotion) {
      return;
    }

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener(
      'pointermove',
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      },
      { passive: true }
    );

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      requestAnimationFrame(renderRing);
    };
    requestAnimationFrame(renderRing);

    const interactiveSelector = 'a, button, input, select, textarea, summary, [role="tab"], .plate-choice';
    document.addEventListener('mouseover', (event) => {
      if (event.target.closest(interactiveSelector)) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (event) => {
      if (event.target.closest(interactiveSelector)) {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    });

    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('pointermove', (event) => {
        const rect = btn.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.22;
        btn.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /**
   * Initialize scroll-reveal animations using IntersectionObserver.
   */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /**
   * Initialize accessible FAQ accordion controls on the Contact page.
   */
  function initAccordions() {
    const accordions = document.querySelectorAll('[data-accordion]');
    accordions.forEach((acc) => {
      const triggers = Array.from(acc.querySelectorAll('[data-accordion-trigger]'));
      triggers.forEach((btn) => {
        btn.addEventListener('click', () => {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          const panelId = btn.getAttribute('aria-controls');
          const panel = panelId ? document.getElementById(panelId) : null;

          triggers.forEach((otherBtn) => {
            if (otherBtn !== btn) {
              otherBtn.setAttribute('aria-expanded', 'false');
              const otherId = otherBtn.getAttribute('aria-controls');
              const otherPanel = otherId ? document.getElementById(otherId) : null;
              if (otherPanel) {
                otherPanel.hidden = true;
              }
            }
          });

          btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          if (panel) {
            panel.hidden = expanded;
          }
        });
      });
    });
  }

  /**
   * Validate a single form field and display inline error + tooltip state.
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field Form control.
   * @returns {boolean} True when valid.
   */
  function validateField(field) {
    const wrapper = field.closest('.form-field') || field.parentElement;
    const errorEl = wrapper ? wrapper.querySelector('.form-error-tooltip') : null;
    const value = field.value.trim();
    let message = '';

    if (field.hasAttribute('required') && !value) {
      message = field.getAttribute('data-error-required') || 'Please fill out this field.';
    } else if (value && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(value)) {
        message = 'Please enter a valid email address (e.g., name@domain.com).';
      }
    } else if (value && field.type === 'tel') {
      const phoneRegex = /^[+\d][\d\s\-()]{7,18}$/;
      if (!phoneRegex.test(value)) {
        message = 'Please enter a valid 10-digit mobile or landline number.';
      }
    } else if (value && field.hasAttribute('minlength')) {
      const minLen = parseInt(field.getAttribute('minlength') || '0', 10);
      if (value.length < minLen) {
        message = `Please enter at least ${minLen} characters.`;
      }
    }

    const isValid = message === '';
    field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
    if (wrapper) {
      wrapper.classList.toggle('has-error', !isValid);
      wrapper.classList.toggle('is-valid', isValid && Boolean(value));
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = isValid;
    }

    return isValid;
  }

  /**
   * Initialize client-side validation for Contact, Newsletter, and Coming Soon forms.
   */
  function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate-form]');
    forms.forEach((form) => {
      const fields = Array.from(form.querySelectorAll('input, textarea, select')).filter(
        (el) => el.type !== 'hidden' && el.type !== 'submit'
      );
      const statusBanner = form.querySelector('[data-form-status]');

      fields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.getAttribute('aria-invalid') === 'true') {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', (event) => {
        let allValid = true;
        let firstInvalid = null;

        fields.forEach((field) => {
          const valid = validateField(field);
          if (!valid && !firstInvalid) {
            firstInvalid = field;
          }
          allValid = allValid && valid;
        });

        if (!allValid) {
          event.preventDefault();
          if (firstInvalid) {
            firstInvalid.focus();
          }
          return;
        }

        const action = (form.getAttribute('action') || '').trim();
        const isPlaceholderEndpoint =
          !action || action === '#' || action.includes('YOUR_FORMSPREE_ID') || action.includes('YOUR_LIST_ID');

        if (isPlaceholderEndpoint) {
          event.preventDefault();
          const successText =
            form.getAttribute('data-success-message') ||
            'Nandri! We have received your request and our Covent Garden reservations desk will confirm shortly.';

          if (statusBanner) {
            statusBanner.textContent = successText;
            statusBanner.hidden = false;
          }
          form.reset();
          fields.forEach((f) => {
            const wrap = f.closest('.form-field');
            if (wrap) wrap.classList.remove('is-valid', 'has-error');
          });
        }
      });
    });
  }

  /**
   * Initialize parallax combo banner subtle scroll translation on Home 1.
   */
  function initParallaxBanner() {
    const parallaxImg = document.querySelector('[data-parallax-media]');
    if (!parallaxImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const updateParallax = () => {
      const container = parallaxImg.closest('.combo-parallax-banner');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const shift = (ratio - 0.5) * 38;
      parallaxImg.style.transform = `scale(1.09) translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /**
   * Accessible Menu Category Tabs & Smooth Section Navigator (ScrollSpy).
   * Supports clicking any meal-time pill to smoothly scroll to that section,
   * keeping all sections accessible and updating active pill as the page scrolls.
   */
  function initMenuTabs() {
    const tabsBar = document.querySelector('[data-menu-tabs]');
    if (!tabsBar) return;

    const tabs = Array.from(tabsBar.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[data-menu-panel]'));
    let isUserScrollingProgrammatically = false;
    let scrollTimeout = null;

    function getStickyOffset() {
      const header = document.querySelector('.site-header');
      const tabsBarElem = document.querySelector('.menu-tabs-bar');
      const headerH = header ? header.offsetHeight : 64;
      const tabsH = tabsBarElem ? tabsBarElem.offsetHeight : 56;
      return headerH + tabsH + 16;
    }

    function scrollToSection(targetElement) {
      if (!targetElement) return;
      const offset = getStickyOffset();
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, Math.round(offsetPosition)),
        behavior: 'smooth'
      });
    }

    function selectTab(targetTab, shouldScroll = true) {
      const tabKey = targetTab.getAttribute('data-tab-key');

      tabs.forEach((tab) => {
        const isTarget = tab === targetTab;
        tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        tab.setAttribute('tabindex', isTarget ? '0' : '-1');
        if (isTarget) {
          tab.classList.add('is-active');
        } else {
          tab.classList.remove('is-active');
        }
      });

      if (typeof targetTab.scrollIntoView === 'function') {
        targetTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }

      // Ensure all panels are open and visible for continuous menu browsing
      panels.forEach((panel) => {
        panel.removeAttribute('hidden');
        panel.style.display = '';
      });

      if (shouldScroll) {
        if (tabKey === 'all') {
          const firstPanel = panels[0] || document.querySelector('.menu-tabs-bar');
          scrollToSection(firstPanel);
        } else {
          const targetPanel = document.getElementById('panel-' + tabKey);
          if (targetPanel) {
            scrollToSection(targetPanel);
          }
        }
      }

      if (window.AmmasTiffin.CardTiltController && window.AmmasTiffin.tiltController) {
        window.AmmasTiffin.tiltController.init(document);
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        isUserScrollingProgrammatically = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isUserScrollingProgrammatically = false;
        }, 900);
        selectTab(tab, true);
      });

      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = tabs.length - 1;
        } else {
          return;
        }
        e.preventDefault();
        tabs[newIndex].focus();
        isUserScrollingProgrammatically = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isUserScrollingProgrammatically = false;
        }, 900);
        selectTab(tabs[newIndex], true);
      });
    });

    // ScrollSpy: Automatically highlight matching category pill as user scrolls
    if ('IntersectionObserver' in window && panels.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        if (isUserScrollingProgrammatically) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) => {
            return prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr;
          });

          const panelId = topEntry.target.id;
          const matchKey = panelId.replace('panel-', '');
          const matchingTab = tabs.find((t) => t.getAttribute('data-tab-key') === matchKey);
          if (matchingTab && !matchingTab.classList.contains('is-active')) {
            selectTab(matchingTab, false);
          }
        } else {
          const firstTop = panels[0].getBoundingClientRect().top;
          if (firstTop > 200) {
            const allTab = tabs.find((t) => t.getAttribute('data-tab-key') === 'all');
            if (allTab && !allTab.classList.contains('is-active')) {
              selectTab(allTab, false);
            }
          }
        }
      }, {
        rootMargin: '-140px 0px -50% 0px',
        threshold: [0, 0.1, 0.2]
      });

      panels.forEach((panel) => observer.observe(panel));
    }

    // Support direct anchor hash navigation on page load (e.g. menu.html#panel-dosas)
    if (window.location.hash) {
      const hashKey = window.location.hash.replace('#panel-', '').replace('#', '');
      const matchingTab = tabs.find((t) => t.getAttribute('data-tab-key') === hashKey);
      if (matchingTab) {
        setTimeout(() => {
          selectTab(matchingTab, true);
        }, 200);
      }
    }
  }

  window.AmmasTiffin.initMenuTabs = initMenuTabs;

  /**
   * Floating Scroll-to-Top button controller with scroll threshold detection,
   * smooth window scrolling, and auto-fallback creation if not present in markup.
   */
  function initScrollUpButton() {
    let btn = document.querySelector('[data-scroll-top]');

    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scroll-up-btn';
      btn.setAttribute('data-scroll-top', '');
      btn.setAttribute('aria-label', 'Scroll to top of page');
      btn.setAttribute('title', 'Scroll to top');
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    let ticking = false;
    const updateVisibility = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrolled > 300) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateVisibility);
          ticking = true;
        }
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    updateVisibility();
  }

  window.AmmasTiffin.initScrollUpButton = initScrollUpButton;

  /**
   * Initialize continuous running dish marquee ticker on Home 1.
   * Ensures uninterrupted infinite scroll, duplicate track mirroring, and touch pause support.
   */
  function initMarqueeTicker() {
    const marquees = document.querySelectorAll('.dish-marquee');
    if (!marquees.length) {
      return;
    }

    marquees.forEach((marquee) => {
      const inner = marquee.querySelector('.dish-marquee__inner');
      const tracks = marquee.querySelectorAll('.dish-marquee__track');

      // If inner container exists but only 1 track was provided, duplicate it for seamless infinite loop
      if (inner && tracks.length === 1) {
        const clone = tracks[0].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        inner.appendChild(clone);
      }

      // Touch tap toggle for mobile devices
      let isPaused = false;
      marquee.addEventListener('click', () => {
        isPaused = !isPaused;
        const allTracks = marquee.querySelectorAll('.dish-marquee__track');
        allTracks.forEach((track) => {
          track.style.animationPlayState = isPaused ? 'paused' : 'running';
        });
      });
    });
  }

  window.AmmasTiffin.initMarqueeTicker = initMarqueeTicker;

  /**
   * Boot all core modules and optional page plugins once DOM is parsed.
   */
  function boot() {
    initThemeController();
    initRtlController();
    initPreloader();
    initNavigation();
    initCursorAndMagneticButtons();
    initScrollReveal();
    initAccordions();
    initFormValidation();
    initParallaxBanner();
    initScrollUpButton();
    initMarqueeTicker();

    if (window.AmmasTiffin.CardTiltController) {
      const tiltController = new window.AmmasTiffin.CardTiltController();
      tiltController.init(document);
      window.AmmasTiffin.tiltController = tiltController;
    }
    if (window.AmmasTiffin.initLiveStatusAndClock) {
      window.AmmasTiffin.initLiveStatusAndClock();
    }
    if (window.AmmasTiffin.initCounters) {
      window.AmmasTiffin.initCounters();
    }
    if (window.AmmasTiffin.MosaicLightbox) {
      const lightbox = new window.AmmasTiffin.MosaicLightbox();
      lightbox.init();
    }
    if (window.AmmasTiffin.initKenBurnsHero) {
      window.AmmasTiffin.initKenBurnsHero();
    }
    if (window.AmmasTiffin.initSignatureScrollTrack) {
      window.AmmasTiffin.initSignatureScrollTrack();
    }
    if (window.AmmasTiffin.initTestimonialCarousel) {
      window.AmmasTiffin.initTestimonialCarousel();
    }
    if (window.AmmasTiffin.initPlateBuilder) {
      window.AmmasTiffin.initPlateBuilder();
    }
    if (window.AmmasTiffin.initMenuTabs) {
      window.AmmasTiffin.initMenuTabs();
    }
    if (window.AmmasTiffin.initQuickFinder) {
      window.AmmasTiffin.initQuickFinder();
    }
    if (window.AmmasTiffin.initComingSoonCountdown) {
      window.AmmasTiffin.initComingSoonCountdown();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

