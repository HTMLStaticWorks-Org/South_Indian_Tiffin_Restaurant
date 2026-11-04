# Customisation Guide — Brand, Colours, Typography, Content & Integrations

Every customisable touchpoint across all 7 HTML pages, CSS files, and JS modules is annotated with `TODO:` comments so you can search globally for `TODO:` in your code editor and complete rebranding in minutes.

---

## 1. Replacing Brand Identity ("Amma's Tiffin House")

Search across `/pages/*.html` for `TODO:` to update:
- **Restaurant Name:** Replace `Amma's Tiffin House` in `<title>`, header `.brand-logo__name`, footer, Open Graph meta tags, and JSON-LD `Restaurant` schema.
- **Phone & WhatsApp:** Replace `+44 20 7946 0198` / `tel:+442079460198` in header "Reserve / Call Now" CTAs, `pages/contact.html`, and footer.
- **Address & Hours:** Update the Covent Garden address and serving hours in `pages/index.html`, `pages/contact.html`, JSON-LD structured data, and `assets/js/plugins/counter.js` (`getServingStatus()`).

---

## 2. Customising the South Indian Colour Palette

Open `assets/css/style.css` (Light Mode `:root`) and `assets/css/dark-mode.css` (`:root[data-theme="dark"]`):

```css
:root {
  --leaf: #1B4D2E;          /* Banana-leaf deep green (Primary) */
  --turmeric: #E5A11C;      /* Turmeric golden yellow (Accent) */
  --kumkum: #9E2A2B;        /* Kumkum maroon / chilli red (Secondary / CTA) */
  --coconut: #FBF7EF;       /* Coconut cream surface (Light Mode background) */
  --filter-coffee: #241610; /* Filter-coffee brown (Body text / Dark surfaces) */
  --brass: #B6862C;         /* Temple-brass gold (Borders & highlights) */
}
```

> **Accessibility Tip:** Whenever adjusting `--leaf`, `--kumkum`, or `--filter-coffee`, verify text contrast remains at least **4.5:1** for body copy and **3:1** for large display headings (WCAG 2.1 AA).

---

## 3. Customising Locally Hosted Fonts

Three Google Font families are self-hosted in `assets/fonts/` for zero external font requests and GDPR privacy compliance:
- `--font-display`: `'Cormorant Garamond', Georgia, serif`
- `--font-body`: `'DM Sans', sans-serif`
- `--font-accent`: `'Kalam', cursive`

To swap a font:
1. Place new `.woff2` files in `assets/fonts/`.
2. Update `@font-face` declarations in Section 1 of `assets/css/style.css`.
3. Update `--font-display`, `--font-body`, or `--font-accent` in Section 2 of `assets/css/style.css`.

---

## 4. Updating Photography (`/assets/images/`)

- Keep all photography inside `assets/images/` in optimised `.webp` format (with `.jpg` fallbacks for Open Graph previews).
- Recommended dimensions:
  - Full-screen / Banner Heroes: `1600×1066` or `1600×900` (WebP quality `80–84`)
  - Dish & Story Cards: `900×675` (`4:3`) or `800×800` (`1:1`)
- Always preserve explicit `width`, `height`, and descriptive `alt` attributes on every `<img>` to maintain `CLS < 0.1` and screen-reader clarity.

---

## 5. Connecting Forms, Map & Booking Integrations

1. **Contact & Table Reservation Form (`pages/contact.html`):**
   - **Formspree:** Replace `action="https://formspree.io/f/YOUR_FORMSPREE_ID"` with your live Formspree endpoint.
   - **Netlify Forms:** Leave `data-netlify="true"` on `<form>` and remove placeholder `YOUR_FORMSPREE_ID` from `action`.
2. **Newsletter (`pages/index.html`) & Launch Notify (`pages/coming-soon.html`):**
   - Replace `action="https://app.convertkit.com/forms/YOUR_LIST_ID/subscriptions"` with your Mailchimp or ConvertKit form action URL.
3. **Google Maps (`pages/contact.html`):**
   - Replace the `<iframe>` `src` coordinates/place query with your restaurant's Google Maps Embed URL or Maps JavaScript API embed.
4. **Pre-Order / Table Deposit (`pages/index.html` & `pages/home-2.html`):**
   - Connect `[data-plate-order]` in `assets/js/plugins/plate-builder.js` or the combo CTA button to your Stripe Payment Link, Razorpay Checkout button, or OpenTable/Zomato Reserve URL.

