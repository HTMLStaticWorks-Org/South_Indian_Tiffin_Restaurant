# Installation & Deployment Guide — Amma's Tiffin House

Welcome to the **Amma's Tiffin House** multi-page HTML5, CSS3, and ES6+ JavaScript website template, purpose-built for authentic South Indian tiffin houses, heritage vegetarian restaurants, and filter-coffee cafés.

---

## 1. Quick Local Preview

No build bundler or database is required. Every font, stylesheet, JavaScript plugin, and WebP/JPG photograph is self-hosted locally inside `/assets/`.

### Option A: VS Code Live Server (Recommended)
1. Open the `South_Indian_Tiffin_Restaurant` folder in **VS Code**.
2. Install the **Live Server** extension (`ritwickdey.LiveServer`).
3. Right-click `pages/index.html` and choose **Open with Live Server**.
4. Navigate to `http://127.0.0.1:5500/pages/index.html`.

### Option B: Python Local HTTP Server
```bash
python -m http.server 8080
```
Open `http://localhost:8080/pages/index.html` in any modern browser.

### Option C: Node `npx serve`
```bash
npx serve .
```
Open the printed local URL and append `/pages/index.html`.

---

## 2. Production Deployment

### Netlify / Vercel / Cloudflare Pages
1. Push the repository to GitHub, GitLab, or Bitbucket (or drag-and-drop the project folder into Netlify Drop).
2. Set **Build Command** to empty (`None`) and **Publish Directory** to `.` (root).
3. Add a clean root redirect rule (for example in `_redirects` on Netlify: `/ /pages/index.html 200` and `/* /pages/404.html 404`) so visitors arriving at `/` see Home 1 (`pages/index.html`) or Home 2 (`pages/home-2.html`), and missing routes render your custom `pages/404.html`.

### Apache / cPanel / Traditional Shared Hosting
1. Upload `assets/`, `pages/`, `robots.txt`, and `sitemap.xml` to `public_html/`.
2. In `.htaccess`, set:
   ```apache
   DirectoryIndex pages/index.html
   ErrorDocument 404 /pages/404.html
   ```
3. Verify HTTPS is active and update `https://ammastiffinhouse.com` inside `robots.txt`, `sitemap.xml`, Open Graph tags, and JSON-LD blocks.

---

## 3. Pre-Launch Maintenance Mode
While preparing your restaurant launch or new outlet opening, point your root route temporarily to `pages/coming-soon.html` and set `data-launch-date="2026-12-15T06:30:00+05:30"` on the `[data-countdown]` container.

