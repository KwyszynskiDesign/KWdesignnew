# Mapa ujednolicenia przycisków — KW Design

> Dokument decyzyjny (nie kod). Bazuje na `docs/spis-przyciskow.md`.
> Cel: zredukować ~20 wariantów do **4 typów × 3 rozmiary** ze spójnymi stanami.
>
> Data: 2026-07-11 · Status: do akceptacji przed wdrożeniem

---

> ✅ **Styl wizualny zatwierdzony jako v1.0 (2026-07-11)** — punkt odniesienia dla etapu 2+.
> Finalne tokeny i komponent: [`assets/css/kw-buttons.css`](../assets/css/kw-buttons.css)
> (paleta teal, radius ~11px, poświata hover 0.70, rozbłysk tekstu). Żywa dokumentacja:
> [`docs/button-system-demo.html`](./button-system-demo.html). Każda zmiana tokenów =
> świadoma decyzja, nie regresja.

---

## 1. Decyzja systemowa

Wprowadzamy **jeden komponent bazowy** `.kw-btn` z modyfikatorami. Wszystkie przyciski i linki-CTA w projekcie sprowadzamy do **4 typów**:

| Typ | Rola | Wygląd bazowy |
|---|---|---|
| **Primary** | główna akcja na ekranie (jedna na sekcję) | wypełniony gradient CTA |
| **Secondary** | akcja drugorzędna / „ghost" | obrys w kolorze primary, tło transparentne |
| **Tertiary** | akcja tekstowa / link-akcja | tekst + strzałka/ikona, bez tła, opcjonalny underline |
| **Utility / Icon** | sterowanie UI, nie-marketingowe | neutralne, kwadratowe/okrągłe, ikona bez marketingowego CTA |

**Ustalenia bazowe (systemowe):**
- **Jedna paleta CTA:** gradient cyan `#06b6d4 → #0284c7` (dominuje w projektach + zgodny z istniejącym `.ui-demo-btn`). Niebieski `#175bf7→#1d4ed8` z `.btn-case` **wycofujemy**.
- **Jeden radius systemowy:** token `--kw-radius-btn: 0.5rem` (8px). Ujednolica dzisiejsze 10px/12px/0.5rem.
- **Stany dla wszystkich typów:** `hover` (translateY(-2px) + cień), `active` (translateY(0)), `focus-visible` (outline 3px + offset), `disabled` (opacity + `cursor:not-allowed`).
- **Rozmiary:** `--sm` (min-h 40px), `--md` (min-h 48px, domyślny), `--lg` (min-h 56px).
- **Nomenklatura (BEM):** `.kw-btn`, `.kw-btn--primary/--secondary/--tertiary/--icon`, `.kw-btn--sm/--md/--lg`.
- **Strategia migracji:** wprowadzamy `.kw-btn` obok istniejących klas; stare klasy zostają **tymczasowo jako aliasy** (te same reguły CSS), potem podmieniamy w HTML etapami, na końcu usuwamy stare definicje. Zero „big-bang".

---

## 2. Tabela mapowania

| Stara klasa / element | Gdzie | Docelowy typ | Rozmiar | Alias tymczasowy czy podmiana | Uwagi |
|---|---|---|---|---|---|
| `.btn` (bazowa) | index-styles.css, style.css | baza → `.kw-btn` | — | **scal** w bazę | Trzy różne definicje bazy → jedna |
| `.btn-primary` | index-styles.css:314 | Primary | md | podmiana → `--primary` | Kanoniczna definicja Primary |
| `.btn-primary` | style.css:130 | Primary | md | **usuń** (duplikat) | Inny wygląd tej samej klasy — źródło niespójności |
| `.btn-primary` | services-page.css:581 | Primary | md | **usuń** (duplikat, gradient) | Gradient przenosimy do bazy Primary |
| `.btn-secondary` | index-styles.css:333 | Secondary | md | podmiana → `--secondary` | Kanoniczna definicja Secondary |
| `.btn-secondary` | style.css:132, services-page.css:592 | Secondary | md | **usuń** (duplikaty) | — |
| `.btn-sm` | index-styles.css:347 | modyfikator | sm | podmiana → `--sm` | — |
| `.btn-lg` | index-styles.css:353 | modyfikator | lg | podmiana → `--lg` | — |
| `.btn.btn-hero-cta` | index.html:141 | Primary | lg | podmiana → `--primary --lg` | Nadpisanie znika, staje się rozmiarem |
| `.hero-cta` | uslugi.html:122 | Primary | md/lg | alias → podmiana | Gradient już zgodny |
| `.hero-image-cta` | projects/*.html (hero) | Primary | md | alias → podmiana | Gradient cyan = baza Primary |
| `.kwcs-cta` | projects/*.html (wyniki) | Primary | lg | alias → podmiana | Font 1.125rem = rozmiar lg |
| `.kwcs-cta--ghost` | karoma/power-of-mind/razdwa | Secondary | lg | alias → podmiana | Ghost = Secondary |
| `.kwcs-cta-link` | projects/wizualizacje.html:88 | Tertiary | md | alias → podmiana | Lżejszy link-CTA |
| `.btn-cta` | portfolio.html:278 | Primary | md | alias → podmiana | — |
| `.btn-case` | portfolio.css:739 | Primary | md | podmiana + zmiana koloru | **Zmiana palety** na cyan |
| `.btn-large` | services-page.css:754 | Secondary | lg | alias → podmiana | Białe tło/tekst primary → wariant Secondary lg |
| `.card-btn` + `.btn-primary` | uslugi.html:155 | Primary | md (full-width) | podmiana → `--primary --block` | Dodać modyfikator `--block` (width:100%) |
| `.card-btn` + `.btn-secondary` | uslugi.html:143,166 | Secondary | md (full-width) | podmiana → `--secondary --block` | jw. |
| `.service-btn` | index.html:291,313,332 | Tertiary | md | alias → podmiana | „Więcej informacji →" |
| `.card-cta` | index.html, portfolio.html | Tertiary | sm/md | alias → podmiana | „Zobacz projekt" + ikona; wewnątrz klikalnej karty |
| `.lm-teaser-cta` | index.html:655 | Tertiary | md | alias → podmiana | „Pobierz za darmo →" |
| `.submit-btn` (+`.btn-text`/`.btn-loader`) | index/uslugi/kontakt (formularze) | Primary | lg | podmiana → `--primary --lg` | Zachować mechanikę loadera (spany) |
| `.lm-btn` (+`.lm-btn-text`/`.lm-btn-loader`) | narzedzie.html:134 | Primary | lg | podmiana → `--primary --lg` | jw. |
| `.ui-demo-btn` (`.is-primary/-secondary/-tertiary`) | voucher-salon-magdy.html | **wzorzec** | — | zostawić jako demo | To referencja design-systemu; docelowo re-mapować na `.kw-btn` w prezentacji |
| `.hamburger` | wszystkie strony | **Utility/Icon** | — | **wyjątek** | NIE styl CTA (patrz §3) |
| `.scroll-to-top` (`#scrollToTop`) | index/portfolio/uslugi | **Utility/Icon** | — | **wyjątek** | jw. |
| `.testimonials-nav` (`--prev/--next`) | index.html:535,540 | **Utility/Icon** | — | **wyjątek** | Strzałki karuzeli |
| `#carousel-prev/-next` | projects/wizualizacje.html | **Utility/Icon** | — | **wyjątek** | Strzałki karuzeli |
| `.lightbox-close` (`role=button`) | wszystkie lightboxy | **Utility/Icon** | — | **wyjątek** | Zamknięcie `&times;` |
| `.kwcs-back-btn` | wszystkie projects/*.html | **Utility/Icon** (link-back) | sm | **wyjątek** | Breadcrumb-back, nie CTA |
| `.faq-question` (+`.faq-icon`) | index.html:602–633 | **Utility** (akordeon) | — | **wyjątek** | Kontrolka akordeonu, nie przycisk akcji |
| `.kwcs-header` | projects/*.html (akordeony) | **Utility** (akordeon) | — | **wyjątek** | jw. |
| `.portfolio-new-card` (`role=button`) | portfolio.html:122–225 | **nie-przycisk** | — | bez zmian | Klikalna karta — zostaje kartą, nie stylujemy jak `.kw-btn` |
| `.service-cta` / `.card-cta` (wrappery `div`) | index/uslugi | **nie-przycisk** | — | bez zmian | Kontenery layoutu, nie same przyciski |

---

## 3. Lista wyjątków (NIE używają stylu marketingowego CTA)

Te elementy dostają typ **Utility/Icon** (neutralny, funkcjonalny) — nigdy gradientu CTA:

1. `.hamburger` — otwieranie menu mobilnego
2. `.scroll-to-top` — powrót na górę
3. `.testimonials-nav` (`--prev` / `--next`) — nawigacja karuzeli opinii
4. `#carousel-prev` / `#carousel-next` — strzałki karuzeli wizualizacji
5. `.lightbox-close` — zamknięcie lightboxa
6. `.kwcs-back-btn` — powrót breadcrumb
7. `.faq-question` — kontrolka akordeonu FAQ (zachowuje własny layout pytania)
8. `.kwcs-header` — kontrolka akordeonu case study

Dodatkowo **nie są przyciskami** i zostają bez zmian: `.portfolio-new-card` (klikalna karta), wrappery `.service-cta` / `div.card-cta`.

---

## 4. Kolejność wdrożenia

**Etap 1 — Tokeny + klasy bazowe** (fundament, bez zmian w HTML)
- Nowy plik `assets/css/kw-buttons.css`: tokeny (`--kw-radius-btn`, gradient CTA, kolory stanów) + `.kw-btn` i modyfikatory typów/rozmiarów/stanów.
- Stare klasy → aliasy wskazujące na nowe reguły (żeby nic się nie zepsuło).

**Etap 2 — Homepage** (`index.html`)
- Podmiana: hero CTA, `.service-btn`, `.card-cta`, `.lm-teaser-cta`, `.submit-btn`, `.faq-question` (jako utility).

**Etap 3 — Portfolio** (`portfolio.html`, `uslugi.html`)
- `.btn-cta`, `.btn-case` (zmiana koloru!), `.card-cta`, `.card-btn`, `.hero-cta`, `.service-cta`.

**Etap 4 — Case studies** (`projects/*.html`)
- `.hero-image-cta`, `.kwcs-cta`, `.kwcs-cta--ghost`, `.kwcs-cta-link`, `.kwcs-back-btn` (utility), `.kwcs-header` (utility). Aktualizacja demo `.ui-demo-btn`.

**Etap 5 — Formularze + utility** (`kontakt.html`, `narzedzie.html` + globalnie)
- `.submit-btn`, `.lm-btn` (z loaderem), `.hamburger`, `.scroll-to-top`, `.testimonials-nav`, `#carousel-*`, `.lightbox-close`.
- Na końcu: usunięcie martwych, zduplikowanych definicji `.btn-primary`/`.btn-secondary` z `style.css` i `services-page.css`.

---

## 5. Definition of Done

- [ ] **Max 4 typy** przycisków: Primary / Secondary / Tertiary / Utility-Icon
- [ ] **Max 3 rozmiary**: `--sm` / `--md` / `--lg`
- [ ] **Jedna paleta CTA**: gradient cyan `#06b6d4 → #0284c7` (niebieski `.btn-case` wycofany)
- [ ] **Jeden radius systemowy**: `--kw-radius-btn` (0.5rem) na wszystkich przyciskach CTA
- [ ] **Spójne stany**: `hover` / `active` / `focus-visible` / `disabled` identyczne dla wszystkich typów
- [ ] Zero zduplikowanych, rozjeżdżających się definicji `.btn-primary` / `.btn-secondary`
- [ ] Wyjątki (utility/icon, akordeony) nie używają stylu marketingowego CTA
- [ ] Wszystkie strony wizualnie spójne (homepage, portfolio, uslugi, case studies, formularze)
