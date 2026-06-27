/**
 * ZEPARTURE — MAIN INTERACTIONS
 * GSAP ScrollTrigger reveals + nav behaviour + departure-board ticker.
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
   3. Hero headline entrance
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
  gsap.from("#hero-canvas", {
    opacity: 0,
    scale: 0.92,
    duration: 1.4,
    ease: "power2.out",
  });
} else {
  gsap.set("[data-hero-word], [data-hero-fade]", { opacity: 1, y: 0, yPercent: 0 });
}

/* ---------------------------------------------------------
   4. Hero scene fade/parallax on scroll out
--------------------------------------------------------- */
ScrollTrigger.create({
  trigger: "#hero",
  start: "top top",
  end: "bottom top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set("#hero-canvas-wrap", {
      opacity: 1 - self.progress * 0.9,
      y: self.progress * 80,
    });
  },
});

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
   8. Departure-board ticker (hero mini flap board)
--------------------------------------------------------- */
const FLAP_CODES = ["BAL", "DXB", "SIN", "BKK", "MLE", "HAN"];
function initFlapBoard(boardEl) {
  if (!boardEl) return;
  const cells = boardEl.querySelectorAll("[data-flap-cell]");
  let codeIndex = 0;

  function setCode(code) {
    cells.forEach((cell, i) => {
      const char = code[i] || "·";
      if (prefersReducedMotion) {
        cell.textContent = char;
        return;
      }
      cell.classList.remove("animate-flap");
      // restart animation
      void cell.offsetWidth;
      cell.classList.add("animate-flap");
      setTimeout(() => {
        cell.textContent = char;
      }, 260);
    });
  }

  setCode(FLAP_CODES[0]);
  if (!prefersReducedMotion) {
    setInterval(() => {
      codeIndex = (codeIndex + 1) % FLAP_CODES.length;
      setCode(FLAP_CODES[codeIndex]);
    }, 2600);
  }
}
initFlapBoard(document.getElementById("hero-flap-board"));

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
   13. Highlight the active nav link based on body[data-page]
--------------------------------------------------------- */
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach((link) => {
    link.classList.remove("text-ink/70");
    link.classList.add("text-primary");
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
