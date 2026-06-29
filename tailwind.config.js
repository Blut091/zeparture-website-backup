/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./pages/**/*.html", "./partials/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7000E0",
          50: "#F5EFFD",
          100: "#EDE0FF",
          200: "#D8B8FF",
          300: "#BE85FF",
          400: "#9A4AF2",
          500: "#7000E0",
          600: "#5E00BC",
          700: "#4B0096",
          800: "#38006F",
          900: "#26004A",
        },
        surface: "#F0EEF8",
        accent: "#EDE0FF",
        ink: "#1A1523",
        live: "#059669",
        footer: "#110E1A",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(26, 21, 35, 0.12)",
        "glow-primary": "0 0 40px rgba(112, 0, 224, 0.35)",
        card: "0 1px 2px rgba(26,21,35,0.04), 0 12px 24px -8px rgba(26,21,35,0.10)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(26,21,35,0.04) 1px, transparent 0)",
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-live": "pulseLive 2.2s ease-in-out infinite",
        "marquee": "marquee 38s linear infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseLive: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.55, transform: "scale(1.25)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
