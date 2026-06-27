/**
 * ZEPARTURE — WHATSAPP CTA WIRING
 * ---------------------------------------------------------
 * Any element with [data-whatsapp] becomes a WhatsApp CTA.
 *
 *   data-whatsapp                 -> marks the element as a WA button
 *   data-whatsapp-template="bali" -> use a named template from config.js
 *   data-whatsapp-msg="..."       -> use this exact custom message
 *   data-whatsapp-name="Dubai"    -> fills {name} into "destination" /
 *                                     "waitlist" template functions
 * ---------------------------------------------------------
 */
(function () {
  function buildMessage(el) {
    const cfg = window.ZEPARTURE_CONFIG || {};
    const templates = cfg.MESSAGE_TEMPLATES || {};

    if (el.dataset.whatsappMsg) return el.dataset.whatsappMsg;

    const templateKey = el.dataset.whatsappTemplate;
    if (templateKey && templates[templateKey]) {
      const tpl = templates[templateKey];
      if (typeof tpl === "function") {
        return tpl(el.dataset.whatsappName || "");
      }
      return tpl;
    }

    return cfg.DEFAULT_MESSAGE || "Hi Zeparture!";
  }

  function buildUrl(message) {
    const number = (window.ZEPARTURE_CONFIG || {}).WHATSAPP_NUMBER || "";
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encoded}`;
  }

  function wireButton(el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const message = buildMessage(el);
      const url = buildUrl(message);
      window.open(url, "_blank", "noopener,noreferrer");
    });

    // Make sure anchors are also keyboard/SEO friendly with a real href
    if (el.tagName === "A") {
      el.href = buildUrl(buildMessage(el));
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  }

  function init() {
    document.querySelectorAll("[data-whatsapp]").forEach(wireButton);
  }

  document.addEventListener("DOMContentLoaded", init);
  window.ZeparturewireWhatsApp = init; // exposed in case of dynamic content
})();
