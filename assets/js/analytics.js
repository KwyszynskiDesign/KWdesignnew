/**
 * Google Analytics 4 – centralna konfiguracja
 * ---------------------------------------------------------------------------
 * Aby URUCHOMIĆ pomiar ruchu:
 *   1. Załóż usługę GA4 w https://analytics.google.com (Admin → Utwórz usługę).
 *   2. Skopiuj identyfikator pomiaru (Measurement ID) w formacie G-XXXXXXXXXX.
 *   3. Wklej go poniżej w zmiennej MEASUREMENT_ID.
 *   4. Commit + push → GitHub Pages / Cloudflare Pages zdeployuje automatycznie.
 *
 * Ten plik jest dołączany na każdej podstronie przez:
 *   <script defer src="/assets/js/analytics.js"></script>
 * dzięki czemu ID zmieniasz TYLKO w jednym miejscu.
 *
 * Dopóki MEASUREMENT_ID pozostaje wartością-zaślepką ("G-XXXXXXXXXX"),
 * skrypt nic nie robi (żadne żądania nie są wysyłane).
 */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-TG0HE09DE7'; // ← wklej tutaj swój identyfikator GA4

  // Nie uruchamiaj, dopóki nie wpisano prawdziwego ID.
  if (!MEASUREMENT_ID || MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }

  // Wczytaj bibliotekę gtag.js.
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);

  // Inicjalizacja gtag.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true // maskowanie adresu IP (dobra praktyka RODO)
  });
})();
