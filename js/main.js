/**
 * ZEPARTURE — MAIN INTERACTIONS
 * GSAP ScrollTrigger reveals + nav behaviour + hero departures board.
 */
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------------------------------------------------------
   1. Sticky nav background on scroll
--------------------------------------------------------- */
const nav = document.getElementById("site-nav");
ScrollTrigger.create({
  start: "top -60",
  onUpdate: (self) => {
    nav.classList.toggle("nav-glass", self.scroll() > 60);
    nav.classList.toggle("shadow-card", self.scroll() > 60);
  },
});

/* ---------------------------------------------------------
   2. Mobile menu
--------------------------------------------------------- */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("flex");
    mobileMenu.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------------------------------------------------------
   3. Hero entrance: headline, text, planes fade in, board powers on
--------------------------------------------------------- */
if (!prefersReducedMotion) {
  gsap.from("[data-hero-word]", {
    yPercent: 110,
    opacity: 0,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.07,
    delay: 0.2,
  });
  gsap.from("[data-hero-fade]", {
    y: 20,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.7,
    stagger: 0.12,
  });
  gsap.to(".hero-plane", { opacity: 1, duration: 0.6, delay: 0.4 });
  gsap.to("#hero-board", { opacity: 1, duration: 0.4, delay: 0.3 });
  gsap.to("[data-board-row]", {
    opacity: 1,
    duration: 0.45,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.4,
  });
} else {
  gsap.set("[data-hero-word], [data-hero-fade]", { opacity: 1, y: 0, yPercent: 0 });
  gsap.set("#hero-board, [data-board-row]", { opacity: 1 });
}

/* ---------------------------------------------------------
   4. Hero depth-parallax on scroll — three layers move at
      different rates, text fades out first (no pin, no jack)
--------------------------------------------------------- */
if (!prefersReducedMotion) {
  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set("#hero-map-layer", { yPercent: p * 8 });
      gsap.set("#hero-board-stage", {
        yPercent: p * 22,
        scale: 1 - p * 0.08,
        rotateY: -16 - p * 8,
      });
      gsap.set("#hero-plane-layer", { yPercent: p * 35 });
      gsap.set("#hero-text", { opacity: 1 - Math.min(p / 0.6, 1) });
    },
  });
}

/* ---------------------------------------------------------
   5. Generic scroll-reveal for any [data-reveal] element
--------------------------------------------------------- */
document.querySelectorAll("[data-reveal]").forEach((el) => {
  if (prefersReducedMotion) return;
  gsap.from(el, {
    y: 36,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 86%",
      toggleActions: "play none none none",
    },
  });
});

/* ---------------------------------------------------------
   6. Staggered reveal for [data-reveal-group] children
--------------------------------------------------------- */
document.querySelectorAll("[data-reveal-group]").forEach((group) => {
  if (prefersReducedMotion) return;
  const items = group.children;
  gsap.from(items, {
    y: 28,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.09,
    scrollTrigger: {
      trigger: group,
      start: "top 88%",
      toggleActions: "play none none none",
    },
  });
});

/* ---------------------------------------------------------
   7. Itinerary timeline line draw
--------------------------------------------------------- */
const timelineLine = document.getElementById("timeline-line");
if (timelineLine && !prefersReducedMotion) {
  gsap.fromTo(
    timelineLine,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#itinerary-timeline",
        start: "top 70%",
        end: "bottom 80%",
        scrub: true,
      },
    }
  );
}

/* ---------------------------------------------------------
   8. Hero departures board — each row cycles independently
      through real destinations, desynced via stagger + offset
--------------------------------------------------------- */
const BOARD_DESTINATIONS = [
  { code: "BAL", status: "LIVE" },
  { code: "DXB", status: "LIVE" },
  { code: "SIN", status: "LIVE" },
  { code: "BKK", status: "FIXED" },
  { code: "KUL", status: "REQ" },
  { code: "CMB", status: "REQ" },
  { code: "HAN", status: "REQ" },
  { code: "MLE", status: "REQ" },
  { code: "MNL", status: "SOON" },
  { code: "NRT", status: "SOON" },
];

function initBoardRow(rowEl, startIndex) {
  const cells = rowEl.querySelectorAll("[data-flap-cell]");
  const statusEl = rowEl.querySelector("[data-row-status]");
  let idx = startIndex;

  function setEntry(entry) {
    cells.forEach((cell, i) => {
      const char = entry.code[i] || "·";
      if (prefersReducedMotion) {
        cell.textContent = char;
        return;
      }
      cell.classList.remove("animate-flap");
      void cell.offsetWidth;
      cell.classList.add("animate-flap");
      setTimeout(() => {
        cell.textContent = char;
      }, 260);
    });
    if (statusEl) {
      statusEl.textContent = entry.status;
      statusEl.className = `board-status status-${entry.status.toLowerCase()}`;
    }
  }

  setEntry(BOARD_DESTINATIONS[idx % BOARD_DESTINATIONS.length]);
  if (!prefersReducedMotion) {
    // stagger each row's interval slightly so they never sync up
    setInterval(() => {
      idx++;
      setEntry(BOARD_DESTINATIONS[idx % BOARD_DESTINATIONS.length]);
    }, 3000 + startIndex * 220);
  }
}
document.querySelectorAll("[data-board-row]").forEach((row, i) => initBoardRow(row, i));

/* ---------------------------------------------------------
   9. Destination card status badges flip-in on scroll
--------------------------------------------------------- */
document.querySelectorAll("[data-badge-flip]").forEach((badge) => {
  if (prefersReducedMotion) return;
  gsap.from(badge, {
    rotateX: -90,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: badge,
      start: "top 92%",
      toggleActions: "play none none none",
    },
  });
});

/* ---------------------------------------------------------
   10. Counting stat numbers
--------------------------------------------------------- */
document.querySelectorAll("[data-count-to]").forEach((el) => {
  const target = parseFloat(el.dataset.countTo);
  const suffix = el.dataset.countSuffix || "";
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: () => {
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { innerText: target % 1 === 0 ? 1 : 0.1 },
          onUpdate() {
            el.textContent =
              (target % 1 === 0
                ? Math.round(this.targets()[0].innerText)
                : this.targets()[0].innerText.toFixed(1)) + suffix;
          },
        }
      );
    },
  });
});

/* ---------------------------------------------------------
   11. Footer year
--------------------------------------------------------- */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   13. Nav theming per page: light-top pages need dark nav text
       even before scrolling (destinations.html starts light,
       everything else starts with a dark hero/header)
--------------------------------------------------------- */
const currentPage = document.body.dataset.page;
if (currentPage === "destinations") {
  nav.classList.add("nav-on-light");
}

/* ---------------------------------------------------------
   14. Highlight the active nav link
--------------------------------------------------------- */
if (currentPage) {
  document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach((link) => {
    link.classList.add("active");
  });
}

/* ---------------------------------------------------------
   12. Inclusions / Exclusions tab toggle (mobile)
--------------------------------------------------------- */
const packageTabs = document.querySelectorAll("[data-package-tab]");
const packagePanels = document.querySelectorAll("[data-package-panel]");
packageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.packageTab;
    packageTabs.forEach((t) =>
      t.classList.toggle("bg-primary", t === tab)
    );
    packageTabs.forEach((t) =>
      t.classList.toggle("text-white", t === tab)
    );
    packageTabs.forEach((t) => {
      if (t !== tab) {
        t.classList.remove("text-white");
        t.classList.add("text-ink/60");
      } else {
        t.classList.remove("text-ink/60");
      }
    });
    packagePanels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.packagePanel !== target);
    });
  });
});
