/**
 * ZEPARTURE — GLOBAL CONFIG
 * ---------------------------------------------------------
 * Change ONE value here and every "Enquire / Book Now / More
 * Information" button across the site updates automatically.
 *
 * WHATSAPP_NUMBER must be in international format, digits only,
 * no "+", no spaces, no leading zero.
 * Example: India number +91 98765 43210  ->  "919876543210"
 * ---------------------------------------------------------
 */
window.ZEPARTURE_CONFIG = {
  WHATSAPP_NUMBER: "919193971645",

  BRAND_NAME: "Zeparture",
  SITE_URL: "https://zeparture.com",

  // Default message used when a button doesn't specify data-whatsapp-msg
  DEFAULT_MESSAGE:
    "Hi Zeparture! I'd like to know more about your group departures.",

  // Pre-built message templates, referenced from index.html via
  // data-whatsapp-template="bali" / "destination" / "general"
  MESSAGE_TEMPLATES: {
    bali:
      "Hi Zeparture! I'm interested in the Bali Group Departure (8 Days / 7 Nights, Seminyak + Gili T + Ubud). Please share the next available batch dates and pricing.",
    general:
      "Hi Zeparture! I'd like to know more about your upcoming group departures.",
    destination: (name) =>
      `Hi Zeparture! I'm interested in a group departure to ${name}. Could you share more information?`,
    waitlist: (name) =>
      `Hi Zeparture! Please add me to the waitlist for ${name} — I'd like to be notified when it goes live.`,
  },
};
