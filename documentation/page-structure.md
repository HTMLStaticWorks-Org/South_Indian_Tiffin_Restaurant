# Page Architecture & Component Guide

Every page in `/pages/` is intentionally art-directed with its own distinct hero architecture, grid rhythm, and non-repeating sections.

---

## 1. Page-by-Page Breakdown

| File | Hero Model | Exclusive Sections |
|---|---|---|
| `pages/index.html` (**Home 1**) | **Model A:** Full-bleed split hero with live serving-time badge, steaming banana-leaf dosa, rotating badge ring & dish marquee | 1. Today's Breakfast Specials (4 tilt cards)<br>2. Why Our Tiffin Is Special (4 icon tilt cards)<br>3. Timings & Serving-Hours Strip + Live Brass Clock<br>4. Chef's Banana-Leaf Thali Parallax Banner<br>5. Mailchimp/ConvertKit Newsletter Signup |
| `pages/home-2.html` (**Home 2**) | **Model B:** Full-screen Ken Burns 3-slide heritage showcase, vertical social rail, scroll cue & floating reserve pill | 1. Horizontal Scroll-Snap Signature Dishes<br>2. Interactive "Build Your Tiffin Plate" Configurator<br>3. Masonry Kitchen & Ambience Mosaic + Lightbox<br>4. Guest Love ARIA Testimonial Carousel (exclusive)<br>5. Animated Heritage Stats Counters<br>6. Instagram-Style Photo Strip |
| `pages/menu.html` (**Menu**) | **Unified Page Hero:** Full-bleed photographic banner (`menu-banner.webp`) with breadcrumb nav, turmeric eyebrow, heading & lead | Sticky Meal-Time Tabs + Skeleton Loaders:<br>• **Breakfast:** 3-col image-led cards<br>• **Lunch (Meals):** Classic temple-bordered dotted-leader price list<br>• **Evening Tiffin:** 4-col compact grid<br>• **Beverages & Sweets:** Two-column medallion heritage list |
| `pages/our-story.html` (**Our Story**) | **Unified Page Hero:** Full-bleed photographic banner (`story-banner.webp`) with breadcrumb nav, turmeric eyebrow, heading & lead | 1. Matriarch Hearth Feature (`story-hero-1.webp`) + Kalam Signature<br>2. Family Origin Zig-Zag Narrative<br>3. Vertical Brass Milestone Timeline (1988–2026)<br>4. 3 Recipes & Traditions Pillars<br>5. Meet the Kitchen Family Grid (4 portraits)<br>6. *Atithi Devo Bhava* Promise Banner |
| `pages/contact.html` (**Contact**) | **Unified Page Hero:** Full-bleed photographic banner (`contact-banner.webp`) with breadcrumb nav, turmeric eyebrow, heading & lead | 1. 4 Contact Details Cards<br>2. Validated Contact/Reservation Form + Exterior Showcase<br>3. Temple-Brass Framed Google Map (with skeleton)<br>4. How to Reach Us Transit Cards + Social Links<br>5. Accessible FAQ Accordion |
| `pages/404.html` (**404 Error**) | Missing-Idli Showcase | Live Dish/Page Search Navigator + 3 Quick-Link Cards |
| `pages/coming-soon.html` (**Coming Soon**) | Pre-Launch Atmospheric Split Stage | Live 4-Unit Countdown Timer + Validated Notify Form + Social Row |

---

## 2. Universal 3D Card Component (`.tiffin-card`)

All cards across all 7 pages follow strict structural rules:
- **3D Tilt & Glare (`assets/js/plugins/tilt.js`):** Tracks pointer coordinates with `perspective(1050px)`, `rotateX/Y`, `.tiffin-card__glare`, and `translateZ(24px)` depth lift on `.tiffin-card__inner`. Automatically switches to tactile press feedback on touch screens and honours `prefers-reduced-motion`.
- **Center Alignment:** Icons, badges, headings, descriptions, and prices inside `.tiffin-card` remain strictly center-aligned on mobile, tablet, and desktop, in both LTR and RTL modes.
- **6 Culinary Theme Animations (`data-card-anim`):** `steam`, `spice`, `kolam`, `leaf`, `coffee`, and `dosa-roll`.

