# Changelog

Every meaningful version of this site is tagged in git. To get back to any
version exactly as it was:

```bash
git checkout v7          # look around, read-only
git checkout main        # come back to the latest version
```

To permanently roll the live site back to an older version:

```bash
git checkout main
git reset --hard v7      # ⚠️ discards anything after v7 from main
git push origin main --force-with-lease
```

(Nothing is ever actually deleted by this — even old commits stay in git's
history and are still reachable by their tag, this just moves what `main`
points to.)

---

## v10 — current
**Hero reverted to plain single-column layout.** Dropped the proof-card
grid from v9, removed the world-map/cloud-glow background layers. Hero is
now a plain two-stop gradient with no illustrated centerpiece, per direct
feedback that the design direction wasn't working.

## v9
**Hero simplified: dropped the 3D board for a flat proof-card layout.**
Replaced the tilted departures board + drifting planes with a flat,
trust-first layout — real Bali departure facts (fixed pricing, no sales
calls, trip captain, capped group size) in a card instead of decoration.
Removed all now-dead board/flap/plane CSS and JS.

## v8
**Fixed nav contrast bug.** Nav text/icons were hardcoded dark, invisible
on the 5 of 6 pages with a dark hero/header under the fixed nav. Added
theme-aware nav CSS (light by default, dark once scrolled or on
`destinations.html` which starts light) and fixed active-link highlighting.

## v7
**Hero rebuilt as an on-brand 3D departures board.** Dropped Three.js
entirely — replaced the globe with a CSS/SVG split-flap departures board
(6 rows cycling real destinations), drifting paper planes, and a
depth-parallax scroll effect.

## v6
**Hero background: dot-matrix world map + cloud-glow layers.** Added a
procedurally generated dot-matrix world map texture behind the globe, plus
soft cloud-like glow gradients, for a clearer "travel" feel.

## v5
**Hero animation: paper-airplane markers replace glow dots.** The Three.js
globe's abstract glowing dots became small oriented paper airplanes with
fading contrails, flying along the same flight-path arcs.

## v4
**Restructured into a multi-page site.** Split the single-page homepage
into six real pages (home, how-it-works, bali, destinations, dubai,
singapore — only the three *live* destinations got dedicated pages). Added
`build.js` + `partials/layout.html` so nav/footer live in one place instead
of being duplicated six times.

## v3
**Hero background refined.** Replaced the flat fill with a layered
gradient + subtle violet glow positioned behind the globe.

## v2
**Live WhatsApp number set** in `js/config.js`.

## v1 — initial build
3D globe hero (Three.js), full Bali departure showcase (itinerary +
inclusions/exclusions from the vendor quote), 10-destination grid with
status badges, WhatsApp CTAs site-wide, SEO meta/JSON-LD, Netlify/Vercel/
GitHub Pages configs.
