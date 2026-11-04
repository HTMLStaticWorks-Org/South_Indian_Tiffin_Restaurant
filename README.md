# Amma's Tiffin House — South Indian Tiffin Restaurant HTML Template

A production-ready, multi-page **HTML5 / CSS3 / ES6+ JavaScript** website template crafted for authentic **South Indian Tiffin Houses**, heritage vegetarian dining rooms, and Kumbakonam filter-coffee cafés.

> **Brand Placeholder:** `Amma's Tiffin House` — every customisation point (brand name, Covent Garden London address, phone, map coordinates, Formspree/Netlify endpoints, Mailchimp/ConvertKit action URLs, and booking links) is clearly annotated with `TODO:` comments.

---

## Project Structure

```text
South_Indian_Tiffin_Restaurant/
├── assets/
│   ├── css/
│   │   ├── style.css            # Master stylesheet (tokens, layouts, 3D cards, animations)
│   │   ├── dark-mode.css        # Filter-coffee & temple-brass dark theme (WCAG 2.1 AA)
│   │   └── rtl.css              # Right-to-Left (RTL) layout & directional mirroring
│   ├── js/
│   │   ├── main.js              # Core ES6+ app (theme, RTL, nav, cursor, validation, reveal)
│   │   └── plugins/
│   │       ├── tilt.js          # 3D perspective card tilt, glare & translateZ depth lift
│   │       ├── counter.js       # Live serving status, analog brass clock & stats counters
│   │       ├── lightbox.js      # Accessible keyboard-trapped masonry photo lightbox
│   │       ├── carousel.js      # Ken Burns hero slider, snap showcase & ARIA testimonials
│   │       └── plate-builder.js # Interactive Tiffin Plate Builder, Menu tabs, 404 search & countdown
│   ├── images/                  # 100% local, unique real photography in optimised WebP (+ JPG)
│   └── fonts/                   # Locally hosted Google Fonts (Cormorant Garamond, DM Sans, Kalam)
├── pages/
│   ├── index.html               # Home 1 — Morning Breakfast Specials focus (Split Hero)
│   ├── home-2.html              # Home 2 — Heritage Experience focus (Ken Burns Slider)
│   ├── menu.html                # Meal-Time Menu (4 distinct tab layouts + skeleton loaders)
│   ├── our-story.html           # Editorial Origin Story, Vertical Timeline & Kitchen Team
│   ├── contact.html             # Contact Cards, Validated Form, Styled Map & FAQ Accordion
│   ├── 404.html                 # Missing-Idli Error Page with Live Dish/Page Quick-Finder
│   └── coming-soon.html         # Pre-Launch Page with Countdown Timer & Notify Form
├── documentation/
│   ├── installation.md          # Local preview & Netlify/Vercel/Apache deployment guide
│   ├── customisation-guide.md   # Palette, fonts, content, forms & map setup
│   ├── page-structure.md        # Architecture of all 7 non-repeating pages & 3D card specs
│   ├── credits.md               # Photographer, license & font attributions
│   └── changelog-and-support.md # Release notes, browser support & QA notes
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Highlights & Standards

1. **Zero Repeated Sections & Distinct Page Rhythms:** Home 1 and Home 2 have completely different hero architectures, grid compositions, and section lists; every section across all 7 pages is unique to its page.
2. **Authentic South Indian Culinary Palette:** Built around Banana-Leaf Green (`--leaf`), Turmeric Gold (`--turmeric`), Kumkum Maroon (`--kumkum`), Coconut Cream (`--coconut`), Filter-Coffee Brown (`--filter-coffee`), and Temple-Brass Gold (`--brass`).
3. **Universal 3D Tilt Cards:** Every card features pointer-tracking 3D perspective, glare sheen, `translateZ` inner lift, strict center alignment across mobile/tablet/desktop, touch-device press fallback, and culinary theme animations (`steam`, `spice`, `kolam`, `leaf`, `coffee`, `dosa-roll`).
4. **100% Local Self-Hosted Assets:** Zero external image links or CDN font dependencies. Every photograph in `assets/images/` is a real licensed photograph used once across the entire site.
5. **Accessibility & Internationalisation:** WCAG 2.1 AA contrast, semantic landmarks, skip-to-content link, full ARIA keyboard support, `prefers-reduced-motion` support, Dark/Light persistence, and working RTL toggle.

---

## Quick Start

1. Serve the project folder with VS Code **Live Server** or run:
   ```bash
   python -m http.server 8080
   ```
2. Open `http://localhost:8080/pages/index.html`.
3. See [`documentation/installation.md`](./documentation/installation.md) and [`documentation/customisation-guide.md`](./documentation/customisation-guide.md) for full setup and branding instructions.

