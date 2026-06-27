/**
 * ZEPARTURE — STATIC PAGE BUILDER
 * ---------------------------------------------------------
 * Assembles every top-level *.html file from partials/layout.html
 * + the matching fragment in pages/. Run after editing anything
 * in partials/ or pages/, then commit the regenerated root files.
 *
 *   npm run build:html
 * ---------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const layout = fs.readFileSync(path.join(ROOT, "partials/layout.html"), "utf-8");

const JSONLD_HOME = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Zeparture",
  "url": "https://zeparture.com",
  "description": "Self-serve group departures platform for solo travelers. Fixed-date group trips with a dedicated trip captain.",
  "areaServed": ["Bali", "Dubai", "Singapore", "Thailand", "Malaysia", "Sri Lanka", "Vietnam", "Maldives"],
  "makesOffer": {
    "@type": "Offer",
    "name": "Bali Group Departure — 8 Days / 7 Nights",
    "itemOffered": {
      "@type": "TouristTrip",
      "name": "Bali Group Departure",
      "touristType": "Solo travelers / small groups"
    }
  }
}
</script>`;

const pages = [
  {
    out: "index.html",
    file: "home.html",
    pageId: "home",
    title: "Zeparture — Group Departures for Solo Travelers | Bali, Dubai, Singapore & More",
    description: "Zeparture is a self-serve group departures platform for solo Indian travelers. No salesperson calls — pick a fixed departure, reserve your seat online, and travel with a curated group.",
    canonical: "https://zeparture.com/",
    ogTitle: "Zeparture — Group Departures for Solo Travelers",
    jsonld: JSONLD_HOME,
  },
  {
    out: "how-it-works.html",
    file: "how-it-works.html",
    pageId: "how-it-works",
    title: "How It Works — Zeparture",
    description: "No salesperson, fixed dates, fixed prices. Here's exactly how Zeparture's self-serve group departures work, step by step.",
    canonical: "https://zeparture.com/how-it-works.html",
    ogTitle: "How Zeparture Works",
    jsonld: "",
  },
  {
    out: "bali.html",
    file: "bali.html",
    pageId: "bali",
    title: "Bali Group Departure — 8D/7N | Zeparture",
    description: "8 Days / 7 Nights across Seminyak, Gili Trawangan & Ubud. Full itinerary, inclusions and exclusions. Capped at 12–16 travelers. Reserve your seat now.",
    canonical: "https://zeparture.com/bali.html",
    ogTitle: "Bali Group Departure — Zeparture",
    jsonld: "",
  },
  {
    out: "destinations.html",
    file: "destinations.html",
    pageId: "destinations",
    title: "Destinations — Zeparture",
    description: "Browse every Zeparture destination: live departures, fixed batches, on-request trips and what's coming soon.",
    canonical: "https://zeparture.com/destinations.html",
    ogTitle: "Zeparture Destinations",
    jsonld: "",
  },
  {
    out: "dubai.html",
    file: "dubai.html",
    pageId: "dubai",
    title: "Dubai Group Departure — Zeparture",
    description: "A Zeparture group departure to Dubai — desert, skyline and souk. Get early access to dates and pricing.",
    canonical: "https://zeparture.com/dubai.html",
    ogTitle: "Dubai Group Departure — Zeparture",
    jsonld: "",
  },
  {
    out: "singapore.html",
    file: "singapore.html",
    pageId: "singapore",
    title: "Singapore Group Departure — Zeparture",
    description: "A Zeparture group departure to Singapore — city, Sentosa and the food trail. Get early access to dates and pricing.",
    canonical: "https://zeparture.com/singapore.html",
    ogTitle: "Singapore Group Departure — Zeparture",
    jsonld: "",
  },
];

let built = 0;
for (const page of pages) {
  const contentPath = path.join(ROOT, "pages", page.file);
  const content = fs.readFileSync(contentPath, "utf-8");

  let html = layout
    .replaceAll("{{TITLE}}", page.title)
    .replaceAll("{{DESCRIPTION}}", page.description)
    .replaceAll("{{CANONICAL}}", page.canonical)
    .replaceAll("{{OG_TITLE}}", page.ogTitle)
    .replaceAll("{{PAGE_ID}}", page.pageId)
    .replace("{{JSONLD}}", page.jsonld)
    .replace("{{CONTENT}}", content);

  fs.writeFileSync(path.join(ROOT, page.out), html);
  built++;
  console.log("built", page.out);
}

console.log(`\nDone — ${built} pages built.`);
