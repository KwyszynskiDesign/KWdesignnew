/*
 * Google Analytics 4 + baner zgody (Consent Mode v2)
 * ---------------------------------------------------
 * Jeden wspólny plik dla całej strony. Ładowany na każdej podstronie linijką:
 *   <script src="/assets/js/analytics.js"></script>
 *
 * >>> JEDYNE, CO MUSISZ ZROBIĆ: wklej swój Measurement ID poniżej. <<<
 * Znajdziesz go w GA4 → Administracja → Strumienie danych → (Twój strumień web)
 * Wygląda tak: G-XXXXXXXXXX
 *
 * Dopóki ID = "G-XXXXXXXXXX", analityka jest wyłączona i nic się nie ładuje.
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────────────────────
  var MEASUREMENT_ID = "G-XXXXXXXXXX"; // ← WKLEJ TUTAJ SWÓJ ID
  // ─────────────────────────────────────────────────────────────

  var STORAGE_KEY = "kw_consent_analytics"; // "granted" | "denied"

  // Brak prawdziwego ID → nic nie robimy (kod gotowy, czeka na ID).
  if (!MEASUREMENT_ID || MEASUREMENT_ID === "G-XXXXXXXXXX") {
    console.info(
      "[analytics] Wklej swój Measurement ID w assets/js/analytics.js, aby włączyć Google Analytics."
    );
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  var stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* localStorage niedostępny (tryb prywatny) — traktujemy jak brak zgody */
  }

  // Consent Mode v2 — domyślnie wszystko odrzucone (wymóg RODO).
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: stored === "granted" ? "granted" : "denied",
    wait_for_update: 500,
  });

  // Załaduj oficjalny skrypt gtag.js.
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { anonymize_ip: true });

  // Wybór już zapisany — nie pokazuj banera ponownie.
  if (stored === "granted" || stored === "denied") return;

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* ignoruj */
    }
    gtag("consent", "update", { analytics_storage: value });
    var b = document.getElementById("kw-consent");
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function buildBanner() {
    var css =
      "#kw-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;" +
      "max-width:560px;margin:0 auto;background:#0f0f12;color:#f5f5f7;" +
      "border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px 18px;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:inherit;" +
      "display:flex;flex-direction:column;gap:12px}" +
      "#kw-consent .kw-consent__text{margin:0;font-size:.9rem;line-height:1.5}" +
      "#kw-consent a{color:#fff;text-decoration:underline}" +
      "#kw-consent .kw-consent__actions{display:flex;gap:10px;justify-content:flex-end}" +
      "#kw-consent .kw-consent__btn{cursor:pointer;border-radius:9px;padding:9px 16px;" +
      "font-size:.85rem;font-weight:600;border:1px solid transparent;font-family:inherit;line-height:1}" +
      "#kw-consent .kw-consent__btn--ghost{background:transparent;color:#f5f5f7;border-color:rgba(255,255,255,.28)}" +
      "#kw-consent .kw-consent__btn--solid{background:var(--primary,#6c5ce7);color:#fff}" +
      "@media(min-width:560px){#kw-consent{flex-direction:row;align-items:center;justify-content:space-between}" +
      "#kw-consent .kw-consent__actions{flex-shrink:0}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "kw-consent";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", "Zgoda na analityczne pliki cookie");
    wrap.innerHTML =
      '<p class="kw-consent__text">Używam Google Analytics, żeby zobaczyć, które strony są odwiedzane. ' +
      'Zgadzasz się na analityczne pliki cookie? ' +
      '<a href="/polityka-prywatnosci">Polityka prywatności</a>.</p>' +
      '<div class="kw-consent__actions">' +
      '<button type="button" class="kw-consent__btn kw-consent__btn--ghost" id="kw-consent-deny">Odrzuć</button>' +
      '<button type="button" class="kw-consent__btn kw-consent__btn--solid" id="kw-consent-accept">Akceptuję</button>' +
      "</div>";
    document.body.appendChild(wrap);

    document.getElementById("kw-consent-accept").addEventListener("click", function () {
      setConsent("granted");
    });
    document.getElementById("kw-consent-deny").addEventListener("click", function () {
      setConsent("denied");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildBanner);
  } else {
    buildBanner();
  }
})();
