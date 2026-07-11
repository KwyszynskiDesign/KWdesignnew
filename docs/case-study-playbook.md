# Playbook przebudowy case studies — portfolio Karola Wyszyńskiego

Kontekst zebrany po przebudowie **Raz Dwa Druk** (PR #71) i **Karoma**
(PR #73 treść + #74 fixy tła/podtytułów). Służy jako seed do kolejnych
case studies. Repo: `KwyszynskiDesign/KWdesignnew` (GitHub Pages / kwyszynski.pl).

---

## 1. Cel i framework

**Cel:** przekonać właściciela firmy, że współpraca daje mierzalny efekt
(czas / pieniądze / mniej błędów). Opisujemy KORZYŚCI, nie funkcje.

**Framework:** StoryBrand SB7 (Hero=klient, Problem, Guide=Karol, Plan,
Rozwiązanie, Sukces, CTA) + Before/After/Bridge.

**Kolejność sekcji (wzór):**
Hero → W skrócie → **Problem** → **Moja rola** (staty jako authority) →
Kluczowe decyzje (plan) → Rozwiązanie (kilka sekcji) → Wnioski →
Rezultat → niewidoczny slot na cytat → mocne CTA końcowe.

## 2. Zasady redakcyjne

- **H2 = 3–6 słów, hook z korzyścią.** Test: „czy właściciel bez wiedzy UX
  zrozumie tu korzyść?". Detal → podtytuł `.razdwa-h2-sub` nad muted leadem.
- Każda sekcja techniczna: 1–2 zdania „dzięki temu klient/firma…".
- **Liczby z podpisem kontekstu** (było→jest gdzie uczciwe), różnicuj
  podobne liczby. Przykład Karoma: `0 → 7` nośników (jedyne uczciwe
  było→jest), reszta = kontekst korzyści bo brak danych.
- **Cytat klienta: NIGDY nie zmyślaj.** Brak realnego = niewidoczny slot
  (HTML comment z gotowym `figure.razdwa-quote`, do odkomentowania).
- **CTA końcowe** = blok `result-invite`: hook h3 + zaproszenie + 2 CTA:
  primary „Napisz do mnie" (mailto z `?subject=`) + ghost „Zobacz na żywo".
- Unikaj powtórzeń frazowych między „W skrócie/Efekt" a „Rezultat" —
  Rezultat to puenta, nie kopia skrótu.

## 3. Architektura (NIE zgaduj — to jest ustalone)

- Case study = `projects/<slug>.html` z `<section class="kwcs"
  id="case-<slug>-pelne">`. **Konwencja ID: `case-<slug>-pelne`** (ważne!).
- Działa samodzielnie ORAZ jest doładowywany do `portfolio.html`
  (`#case-viewer`) przez `assets/js/portfolio.js`:
  - mapa `projectPages` (slug → ścieżka) — nowy slug MUSI tu być.
  - selektor `doc.querySelector('section.kwcs')` (po klasie, nie ID) —
    wstrzykuje sekcję do `#case-viewer`, przepisuje `img[src^="../"]`.
  - karta w portfolio.html = `<article class="portfolio-new-card"
    data-project="<slug>" role="button" ...>` (bez wewnętrznego `<a href>`!).
- **CSS: `assets/css/projects.css` (współdzielony).** Style scope'uj przez
  `#case-<slug>-pelne`, NIE ruszaj innych case studies. Zero nowych bibliotek.
- Fonty: Inter + Playfair (H2 = serif Playfair). JS: `assets/js/projects.js`
  (akordeon, lightbox, chapter rail scroll-spy).

## 4. Mechanika layoutu (klasy i pułapki — z Karomy)

Klasy współdzielone (`razdwa-*` mimo nazwy używamy wszędzie):
`razdwa-chapter-rail`, `razdwa-summary`, `razdwa-summary-grid/-cell`,
`razdwa-stats`/`razdwa-stat`/`-num`/`-label`, `razdwa-h2-sub`,
`ux-decision-grid`/`-box` (+ `--trio`), `contribution-grid--razdwa` /
`contribution-cell--solo`, `kwcs-sec` (+ `--alt`), `section-divider` (H2,
`text-align:center` + `::after` podkreślenie), `kwcs-result`,
`result-cards`, `result-invite` (+ `kwcs-cta--ghost`), `razdwa-quote`,
`result-next`, `kwcs-project-nav`.

**Chapter rail** (`.razdwa-chapter-rail`): `position: fixed`, lewa
kolumna. Wpisy TOC = `<li><a class="razdwa-chapter-link"
data-rail-target="<id>" href="#<id>">`. Musi mieć wpis na każdą sekcję.

**Pułapki, które MUSISZ obsłużyć per case study (scope `#case-<slug>-pelne`):**

1. **Padding pod fixed rail** — kontener potrzebuje `padding-left`, inaczej
   rail nachodzi na treść. Breakpointy:
   ```css
   @media (min-width:1280px){ #case-<slug>-pelne{ padding-left:216px; --wrap-max:1240px; } }
   @media (min-width:1101px) and (max-width:1279px){ #case-<slug>-pelne{ padding-left:184px; --wrap-max:1120px; } }
   @media (max-width:1100px){ #case-<slug>-pelne{ padding-left:0; } }  /* rail = górny pasek */
   ```
2. **Full-bleed tła kolorowych sekcji** — bez tego tło (`razdwa-summary`,
   `kwcs-sec--alt`) urywa się przy railu (biały pas z lewej). Cofnij padding
   kontenera marginesem, skompensuj paddingiem (treść zostaje w miejscu):
   ```css
   @media (min-width:1280px){
     #case-<slug>-pelne > .razdwa-summary,
     #case-<slug>-pelne > .kwcs-sec--alt { margin-left:-216px; padding-left:calc(216px + 1rem); } }
   @media (min-width:1101px) and (max-width:1279px){
     #case-<slug>-pelne > .razdwa-summary,
     #case-<slug>-pelne > .kwcs-sec--alt { margin-left:-184px; padding-left:calc(184px + 1rem); } }
   ```
   (body ma `margin:8px` → full-bleed sięga [8, vw-8], spójnie z footer/breadcrumb.)
3. **Podtytuły `.razdwa-h2-sub`** — reguła istnieje TYLKO pod
   `#case-razdwa-pelne`. Nowy case MUSI dodać własną, inaczej podtytuły lecą
   do lewej (H2 jest center):
   ```css
   #case-<slug>-pelne .razdwa-h2-sub { max-width:760px; margin:-0.25rem auto 1.25rem;
     text-align:center; color:#0f172a; font-weight:600; font-size:1.15rem; line-height:1.5; }
   ```
4. **Hero image** — sprawdź REALNE wymiary pliku (webp: parsuj VP8X) i wpisz
   je w atrybuty `width/height` (złe proporcje = spłaszczenie). Dodaj:
   ```css
   #case-<slug>-pelne .kwcs-hero-body .hero-image .cover { object-fit:contain;
     max-width:~860px; height:auto; border-radius:14px; box-shadow:...; }
   ```
   Pusty dół zrzutu → `object-fit:cover; object-position:top`.
5. **Hero CTA overflow na mobile** — `.hero-image-cta` ma `width:100%` +
   padding; bez `box-sizing:border-box` wystaje ~16px na 390px:
   ```css
   #case-<slug>-pelne .hero-image-cta { box-sizing:border-box; max-width:100%; }
   ```
6. **Blok CTA końcowy + quote** — skopiuj scoped odpowiedniki `result-invite`,
   `result-invite-actions .kwcs-cta` (neutralizacja margin:auto),
   `kwcs-cta--ghost`, `razdwa-quote` (patrz `#case-razdwa-pelne` w CSS).

## 5. Tryb pracy (obowiązkowy)

1. Przeczytaj cały plik + strukturę + wzorzec (`razdwa_aplikacja.html`).
2. **Diagnoza PRZED edycją** — pokaż co jest inaczej / do naprawy, czekaj na OK.
3. **Plan sekcja-po-sekcji** — czekaj na „OK".
4. Edytuj **małymi krokami**, po każdym: **diff** + (przy wizualnych)
   **zrzut przed/po**. Commit po commicie.
5. Listy do oceny (H2, liczby) pokazuj **na raz** (całą tabelę PAR), nie
   sekcja-po-sekcji.
6. **Weryfikuj render** w Playwright (390px + 1440px, `docOverflow=0`) +
   w kontekście `portfolio.html#<slug>`. Po polsku.

## 6. Render / środowisko

- localhost **nieosiągalny dla klienta** → pokazuj screeny (`SendUserFile`),
  nie URL. Do lokalnego podglądu klient serwuje z katalogu NADRZĘDNEGO nad
  repo (`cd ..; python3 -m http.server 8199`), bo ścieżki są `/KWdesignnew/...`.
- Serwuj z `/home/user` (`python3 -m http.server 8199`), URL
  `http://localhost:8199/KWdesignnew/...`.
- Chromium: `/opt/pw-browsers/chromium`, playwright w
  `/opt/node22/lib/node_modules/playwright/index.mjs`.
- Wysokie zrzuty tnij na segmenty (scroll + screenshot pętla).
- Google Fonts blokowane przez proxy → w renderach fallback serif
  (na produkcji Playfair OK).
- webp wymiary: parsuj chunk VP8X ręcznie w node (brak PIL/imagemagick).

## 7. Git / proces

- Osobny feature branch od `main` na każde zadanie. Autor commitów:
  `user.email noreply@anthropic.com`, `user.name Claude`.
- Po zmergowaniu PR → restartuj branch z `main` (nowy PR draft→ready).
  NIE stackuj na zmergowanej historii.
- NIE `rebase --exec origin/main` (przepisze cudze commity). Na branchu bywa
  równoległa sesja → fetch + rebase swoich na wierzch cudzych, nie force-overwrite.
- Push: `git push -u origin <branch>`, retry z backoff przy błędach sieci.
- Po push: draft PR (mirror szablonu jeśli jest; tu brak). Subskrypcja PR
  aktywna — review comments przychodzą jako eventy. CI: brak (statyczna strona).
- **NIE wstawiaj ID modelu** do commitów/PR/kodu.

## 8. Stan wykonanych case studies

- **Raz Dwa Druk** (`projects/razdwa_aplikacja.html`, `#case-razdwa-pelne`) —
  WZORZEC. PR #71 zmergowany.
- **Karoma** (`projects/karoma.html`, `#case-karoma-pelne`) — zrobione.
  PR #73 (treść SB7) zmergowany; PR #74 (full-bleed tła + wyśrodkowanie
  podtytułów) — otwarty draft.
- **Uwaga:** full-bleed tła (§4.2) NIE jest jeszcze zastosowany w Raz Dwa
  (ten sam biały pas). Do rozważenia dla spójności.

## 9. Kandydaci do przebudowy (z mapy portfolio.js)

`cyfradruk`, `power-of-mind`, `KW-Design`, `sir-roger`, `voucher-magdy`.
(`savage` wyłączony z publicznego flow.)

## 10. Checklist nowego case study

- [ ] `id="case-<slug>-pelne"` na `section.kwcs`
- [ ] slug w `projectPages` (portfolio.js) + karta `portfolio-new-card` w portfolio.html
- [ ] chapter rail: wpis na każdą sekcję
- [ ] CSS scoped `#case-<slug>-pelne`: padding-left (§4.1), full-bleed tła
      (§4.2), h2-sub (§4.3), hero image (§4.4), hero CTA (§4.5), CTA/quote (§4.6)
- [ ] hero: realne wymiary w atrybutach width/height
- [ ] H2 3–6 słów z korzyścią + h2-sub; liczby z kontekstem; slot cytatu; CTA końcowe
- [ ] render 390 + 1440, docOverflow=0, standalone + portfolio context
