# Spis przycisków w projekcie KW Design

> Inwentaryzacja wszystkich przycisków i elementów działających jak przyciski (buttons, linki-CTA, elementy z `role="button"`).
> Cel: najpierw wyciągnąć **wszystkie** istniejące warianty, żeby w kolejnym kroku ujednolicić je do kilku spójnych komponentów.
>
> Data: 2026-07-11

---

## 1. Główne przyciski akcji / CTA

| Klasa | Element | Gdzie występuje | Tekst / funkcja | Wygląd |
|---|---|---|---|---|
| `.btn` + `.btn-primary` | `<a>` | index.html (hero, proces), portfolio.html | „Umów konsultację", „Zobacz wybrane projekty" | Wypełniony, `--color-primary`, radius `--radius-lg`, min-height 48px |
| `.btn` + `.btn-secondary` | `<a>` | index-styles.css (zdefiniowany, warianty) | — | Obrys `--color-primary`, tło transparentne |
| `.btn-sm` / `.btn-lg` | modyfikatory | index-styles.css | rozmiary | padding + min-height 40/56px |
| `.btn.btn-hero-cta` | `<a>` | index.html:141 | „Umów konsultację" (hero) | Osobne nadpisanie w index-styles.css:4437 |
| `.hero-cta` | `<a>` | uslugi.html:122 | „Zapytaj o wycenę →" | Gradient `135deg primary→primary-dark`, radius 10px |
| `.hero-image-cta` | `<a>` | wszystkie projects/*.html (hero) | „Zobacz stronę na żywo" itd. | Gradient cyan `#06b6d4→#0284c7`, radius 0.5rem |
| `.kwcs-cta` | `<a>` | projects/*.html (sekcja wyników) | „Napisz do mnie", „Otwórz stronę" | Gradient cyan, padding 1rem 2rem, font 1.125rem |
| `.kwcs-cta--ghost` | modyfikator | projects/karoma, power-of-mind, razdwa | wariant „ghost" | Obrysowy wariant `.kwcs-cta` |
| `.kwcs-cta-link` | `<a>` | projects/wizualizacje.html:88 | „Skontaktuj się" | Osobny lżejszy wariant link-CTA |
| `.btn-cta` | `<a>` | portfolio.html:278 | „Napisz wiadomość" | Zdefiniowany w portfolio.css:1257 |
| `.btn-case` | `<a>` | portfolio.css:739 | link do case study | Gradient niebieski `#175bf7→#1d4ed8` |
| `.btn-large` | `<a>` | services-page.css:754 | duży CTA | Białe tło, tekst primary |
| `.card-btn` (+`.btn-primary`/`.btn-secondary`) | `<span>` | uslugi.html:143,155,166 | „Zobacz szczegóły →" | Przycisk w karcie cennika (full-width) |
| `.service-btn` | `<a>` | index.html:291,313,332 | „Więcej informacji →" | Link-przycisk w kartach usług |
| `.service-cta` | `<div>` wrapper | uslugi.html:245,325,404 | kontener CTA | — |
| `.card-cta` | `<span>`/`<div>` | index.html, portfolio.html | „Zobacz projekt" (+ ikona SVG) | Element CTA w kartach portfolio |
| `.lm-teaser-cta` | `<a>` | index.html:655 | „Pobierz za darmo →" | CTA lead-magnet |

## 2. Przyciski formularzy (submit)

| Klasa | Gdzie | Tekst / stany |
|---|---|---|
| `.submit-btn` (+ `.btn-text`, `.btn-loader`) | index.html:705, uslugi.html:558, kontakt.html:122 | „Wyślij wiadomość" / „Umów pierwszy krok" + stan „Wysyłam..." |
| `.lm-btn` (+ `.lm-btn-text`, `.lm-btn-loader`) | narzedzie.html:134 | „Wyślij mi PDF" + „Wysyłam…" |

## 3. Przyciski nawigacyjne / UI

| Klasa | Element | Gdzie | Funkcja |
|---|---|---|---|
| `.hamburger` | `<button>` | uslugi.html:84 + hamburgery w innych plikach | Otwieranie menu mobilnego |
| `.scroll-to-top` (`#scrollToTop`) | `<button>` | index.html:95, portfolio.html:88, uslugi.html:598 | „Wróć na górę" |
| `.kwcs-back-btn` | `<a>` | wszystkie projects/*.html | Powrót do portfolio (breadcrumb) |
| `.testimonials-nav` (`.testimonials-prev`/`.next`) | `<button>` | index.html:535,540 | Nawigacja karuzeli opinii |
| `#carousel-prev` / `#carousel-next` | `<button>` | projects/wizualizacje.html:77,78 | Strzałki karuzeli ← → |
| `.faq-question` (+ `.faq-icon`) | `<button>` | index.html:602–633 | Rozwijanie FAQ (akordeon) |
| `.kwcs-header` | `<button>` | projects/*.html (akordeony case study) | Rozwijane sekcje `aria-expanded` |

## 4. Elementy z `role="button"` (klikalne, nie-`<button>`)

| Element | Gdzie | Funkcja |
|---|---|---|
| `.portfolio-new-card[role="button"]` | portfolio.html:122–225 (7 kart) | Wejście w projekt (klik/Enter) |
| `.lightbox-close[role="button"]` | wszystkie strony z lightboxem | Zamknięcie lightboxa (`&times;`) |

## 5. Sekcja demonstracyjna „design system" (już istniejący wzorzec!)

W `projects/voucher-salon-magdy.html:565–623` jest **gotowa tabela stanów przycisków** — to najbliższe temu, co chcemy ujednolicić:

| Klasa | Warianty (kind) | Stany |
|---|---|---|
| `.ui-demo-btn` | `.is-primary`, `.is-secondary`, `.is-tertiary` | `.is-hover`, `.is-active`, `.is-disabled` |

Teksty demo: „Kup voucher" (primary), „Zarezerwuj wizytę" (secondary), „Cennik usług" (tertiary).
Definicje: `assets/css/projects.css:2147`.

---

## 6. Kluczowe niespójności do ujednolicenia

1. **`.btn-primary` / `.btn-secondary` są zdefiniowane w 3 różnych plikach z różnym wyglądem:**
   - `index-styles.css:314` — pełny kolor `--color-primary`, radius `--radius-lg`
   - `style.css:130` — inne wartości
   - `services-page.css:581` — **gradient** `135deg primary→primary-dark`
   → ta sama nazwa klasy = różny wygląd na różnych stronach.

2. **Wiele nazw dla tej samej roli „główne CTA":** `.btn-primary`, `.hero-cta`, `.hero-image-cta`, `.kwcs-cta`, `.btn-cta`, `.btn-case`, `.btn-large`, `.card-btn` — wszystkie to warianty wypełnionego przycisku akcji, ale z osobnymi definicjami, kolorami i radiusami (0.5rem / 10px / 12px).

3. **Dwie palety gradientów:**
   - cyan `#06b6d4 → #0284c7` (projects, services)
   - niebieski `#175bf7 → #1d4ed8` (portfolio `.btn-case`)

4. **Różne wartości radius:** `--radius-lg`, `10px`, `12px`, `0.5rem` — brak jednego tokena.

5. **Rozbieżne focus/hover:** część ma `:focus-visible` z outline, część nie; `translateY(-1px)` vs `(-2px)`.

---

## 7. Propozycja docelowego zestawu (do decyzji)

Sugerowana redukcja do **4 komponentów** + rozmiary i stany:

- **Primary** — główna akcja (dziś: `btn-primary`, `hero-cta`, `hero-image-cta`, `kwcs-cta`, `btn-cta`, `btn-case`)
- **Secondary** — akcja drugorzędna / ghost (dziś: `btn-secondary`, `kwcs-cta--ghost`, `btn-large`)
- **Tertiary / link** — akcja tekstowa (dziś: `service-btn`, `kwcs-cta-link`, `card-cta`, `lm-teaser-cta`)
- **Icon / utility** — `scroll-to-top`, `hamburger`, `testimonials-nav`, `carousel-prev/next`, `lightbox-close`, `kwcs-back-btn`

Każdy z rozmiarami (`sm`/`md`/`lg`) i stanami (`hover`/`active`/`disabled`/`focus-visible`) — wzorzec już istnieje jako `.ui-demo-btn` w voucher-salon-magdy.html.
