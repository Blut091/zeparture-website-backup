# Zeparture — Marketing Website

Premium, fully static marketing site for **Zeparture** — a self-serve group
departures platform for solo travelers. Built with Tailwind CSS, vanilla JS,
GSAP (scroll animation) and Three.js (3D hero scene). No backend, no
database — every "Enquire / Book Now / More Information" action opens
WhatsApp with a prefilled message.

---

## 1. Folder structure

This is a **multi-page static site assembled by a tiny build script** —
nav and footer live in one place (`partials/layout.html`) so they never
drift out of sync across pages.

```
zeparture/
├── partials/
│   └── layout.html          ← shared nav + footer + scripts (edit ONCE here)
├── pages/                    ← page-specific content only (no nav/footer)
│   ├── home.html             → builds to index.html
│   ├── how-it-works.html
│   ├── bali.html
│   ├── destinations.html
│   ├── dubai.html
│   └── singapore.html
├── build.js                  ← assembles partials/layout.html + pages/*.html → root *.html
├── index.html, bali.html, … ← GENERATED — don't hand-edit, edit pages/ instead
├── css/
│   └── style.css             ← compiled, minified Tailwind output (commit this)
├── js/
│   ├── config.js             ← ⚠️ WhatsApp number + message templates live here
│   ├── whatsapp.js
│   ├── three-scene.js
│   └── main.js
├── src/
│   └── input.css             ← Tailwind source (edit this, NOT css/style.css)
├── tailwind.config.js
├── robots.txt
├── sitemap.xml
├── netlify.toml / vercel.json
├── package.json
└── README.md
```

**Only Bali, Dubai and Singapore get dedicated pages** — they're the only
destinations marked "Live." Thailand, Malaysia, Sri Lanka, Vietnam, Maldives,
Philippines and Japan live only as cards on `destinations.html` until their
status changes; add a new page under `pages/` and register it in `build.js`
when one of them goes live.

> **Dubai and Singapore are template pages, not real itineraries.** There's
> no source data for them yet (the Bali itinerary came from your DMC vendor
> quote — these didn't). They're built to the same standard so the structure
> is ready, but the highlight cards are generic placeholders. Replace them
> with real day-by-day content before treating these as bookable in the
> same way Bali is.



---

## 2. ⚠️ Required before going live: set the WhatsApp number

Open **`js/config.js`** and replace the placeholder:

```js
WHATSAPP_NUMBER: "910000000000",   // <-- put the real number here
```

Format: country code + number, digits only, no `+`, no spaces, no leading 0.
Example: `+91 98765 43210` → `"919876543210"`.

You can also edit the prefilled message text per button type
(`bali`, `destination`, `waitlist`, `general`) in the same file —
every button on the site reads from this one config object.

---

## 3. Local development

```bash
npm install
npm run build        # builds HTML pages (build.js) + CSS (Tailwind) once
npm run watch:css     # then keep this running while you edit src/input.css
```

**To change something on every page** (nav, footer, WhatsApp button):
edit `partials/layout.html`, then run `npm run build:html`.

**To change one page's content**: edit the matching file in `pages/`,
then run `npm run build:html`. Never hand-edit the root `index.html`,
`bali.html`, etc. — they're overwritten on every build.

Then just open `index.html` in a browser (or serve the folder with any
static server, e.g. `npx serve .`).

To produce a fresh production build of everything at any time:

```bash
npm run build
```

---

## 4. Deploying

This is a 100% static site — any of the following work with zero config
beyond what's already in this repo:

### Netlify
1. Push this repo to GitHub (see §5 below).
2. [New site from Git] → pick the repo → Netlify auto-detects `netlify.toml`.
3. Build command and output are already set — just click **Deploy**.

### Vercel
1. Push this repo to GitHub.
2. **Import Project** → pick the repo → Vercel auto-detects `vercel.json`.
3. Click **Deploy**.

### GitHub Pages
Both `css/style.css` and every root `*.html` page are committed,
pre-built files, so Pages can serve the repo with **no build step**:
1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main`, folder: `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

> If you deploy to a subpath (typical for GitHub Pages on a project repo,
> not a custom domain), update `<link rel="canonical">` and the Open Graph
> `og:url` / `og:image` values in `index.html` to match.

---

## 5. Pushing this code to your GitHub repository

This project was generated in an environment that has **no stored GitHub
credentials**, so the push itself has to happen from your machine (or by
giving a scoped token — see the note at the end). From inside this folder:

```bash
git init
git add .
git commit -m "Zeparture marketing site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If the repo already exists and has commits, use instead:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 6. Before launch — checklist

- [ ] Set the real `WHATSAPP_NUMBER` in `js/config.js`
- [ ] Replace `https://zeparture.com` in `index.html`, `sitemap.xml`,
      `robots.txt` with your real production domain
- [ ] Add a real `assets/og-image.jpg` (1200×630px) for social share previews
- [ ] Build out `Terms & Conditions` and `Privacy Policy` pages (footer links
      currently point to `#`)
- [ ] Swap placeholder destination descriptions/pricing once finalized
- [ ] Run a Lighthouse pass (target: 90+ on Performance/SEO/Accessibility)
