# Kontekst / handoff — stan prac i następne kroki

> Dokument pomostowy dla kolejnych sesji. Zbiera to, co **ustalone i wdrożone**,
> oraz to, co **świadomie odłożone**, żeby następna sesja nie zaczynała od zera.
>
> Data: 2026-07-11 · Branch roboczy: `claude/button-inventory-50jc2s` (restartowany od main po każdym merge)

---

## CZĘŚĆ A — System przycisków `.kw-btn` (ZAMKNIĘTY)

### Status: v1.1, zmergowany do `main` (PR #76, squash `dc4af40`)

**Źródło prawdy:** [`assets/css/kw-buttons.css`](../assets/css/kw-buttons.css)
**Żywa dokumentacja:** [`docs/button-system-demo.html`](./button-system-demo.html)
**Dokumenty decyzyjne:** [`spis-przyciskow.md`](./spis-przyciskow.md) · [`mapa-ujednolicenia-przyciskow.md`](./mapa-ujednolicenia-przyciskow.md)

### Finalne ustalenia wizualne (v1.0 + rozszerzenie v1.1)
- **Paleta:** głęboki teal — primary `#10809d → #0c6076` (gradient pionowy, near-flat), akcent `#0e7490`. Świadomie **nie** jasny „SaaS cyan", **nie** kolorowy glossy gradient.
- **Radius:** `--kw-btn-radius: 0.7rem` (~11px), miękkie krawędzie.
- **Głębia:** subtelny highlight górnej krawędzi (`inset` biały 16%).
- **Cień:** neutralny (slate), miękki; hover = głębszy, większy blur.
- **Hover:** lift `-2px` + pogłębienie cienia + **poświata**: jasny cyjan (`0.70`) „zapalający się" ze środka (radial `::before`, z-index -1) + **rozbłysk tekstu** (`text-shadow`) na typach wypełnionych.
- **Typy (4):** `--primary` / `--secondary` / `--tertiary` / `--icon`.
- **Rozmiary (3):** `--sm` / `--md` / `--lg`. Modyfikatory: `--block` (full-width), `--ghost` (icon bez tła).
- **Stany:** `hover` / `active` / `focus-visible` / `disabled`.
- **v1.1 — wariant kontekstowy `--inverse`:** biały fill + głęboki teal tekst, pod sekcje **ciemne/teal** (tokeny v1.0 są strojone pod jasne tło). Wygrywa specyficznością z aliasami (`.kw-btn.kw-btn--inverse`).

### Mechanika migracji (ważne dla kolejnych stron)
- **Aliasy OPT-IN:** stara klasa mapuje typ **tylko** gdy element ma jednocześnie `.kw-btn`
  (np. `class="hero-cta kw-btn kw-btn--lg"`). Same stare klasy pozostają nietknięte →
  zero „big-bang", zmiana per-element, odwracalna.
- **Kolejność ładowania:** `kw-buttons.css` MUSI być linkowany **po** głównym CSS strony,
  żeby aliasy wygrywały w kaskadzie.
- **PUŁAPKA specyficzności:** reguły kontekstowe typu `.karta:not(.x) .btn` (0,2,1) **biją**
  aliasy `.kw-btn.btn` (0,2,0). Gdy alias „nie łapie" — szukać reguły kontekstowej i albo
  ją neutralizować w produkcyjnym CSS, albo użyć jawnego modyfikatora `--primary/--secondary`.
- **PUŁAPKA tła:** v1.0 zakłada jasne tło. CTA na sekcjach ciemnych/teal → `--inverse`.
  Zawsze sprawdzać tło sekcji przed konwersją (kontrast).

### Co zrobione (homepage, `index.html`)
| Element | Typ | Uwaga |
|---|---|---|
| Hero CTA | primary lg | jasne tło, czysta konwersja |
| process-cta | primary lg | jasne tło |
| lm-teaser-cta | **inverse** md | ciemna sekcja — biały fill |
| submit-btn | **inverse** lg | teal sekcja — biały fill, full-width, loader nietknięty |

### Backlog przycisków (ŚWIADOMIE ODŁOŻONE — do wznowienia w razie potrzeby)
1. **service-btn** (karty usług, `index.html`) — decyzja: **Secondary + neutralizacja**
   reguły `.service-card:not(.featured) .service-btn` (0,2,1) w `index-styles.css`.
   Otwarte pytanie do właściciela: featured card ma dziś **wypełniony** przycisk —
   Opcja A (Secondary dla wszystkich, featured traci wypełnienie) vs Opcja B (featured→Primary,
   non-featured→Secondary, zachowana hierarchia; rekomendacja B). Diagnoza gotowa, kod nietknięty.
2. **scroll-to-top** — zostaje jako **custom FAB** (ciemny okrągły 64px, `position:fixed`);
   poza wzorcem inline icon-button. Ewentualnie tylko ujednolicić `focus-visible` w etapie utility.
3. **Etap 3+ — pozostałe strony** wg `mapa-ujednolicenia-przyciskow.md`:
   `uslugi.html` (hero-cta, card-btn, service-cta), `portfolio.html` (btn-cta, btn-case→zmiana koloru,
   card-cta), case studies `projects/*.html` (hero-image-cta, kwcs-cta, kwcs-cta--ghost, kwcs-back-btn),
   formularze `kontakt.html`/`narzedzie.html`, na końcu sprzątanie duplikatów `.btn-primary` w
   `style.css` / `services-page.css`.

### Proces pracy (sprawdzony, trzymać się go)
- Małe kroki, diff po diffie; render **1440px + 390px**, **overflow=0** po każdej zmianie;
  before/after dla elementów ryzyka; potwierdzenie, że inne strony nietknięte.
- **Zatrzymać się i zapytać** przy kolizji stylów lub gdy wygląd różni się od zamierzonego —
  nie „poprawiać na wyczucie".
- Render: Chromium `/opt/pw-browsers/chromium` + Playwright (instalowany tymczasowo, `--headless=new`,
  `--no-sandbox`; `node_modules`/lockfile usuwane przed commitem).
- Po merge: restart brancha od `origin/main` (nie stackować na zmergowanej historii).

---

## CZĘŚĆ B — Case studies (NASTĘPNE PROJEKTY)

### System (z repo — zweryfikowane)
**Master template:** [`docs/case-study-template.md`](./case-study-template.md) — v1.0, wzorzec bazowy
**#RazDwa** (read-only), projekt kalibracyjny **#Karoma**.

Kluczowe zasady stąd:
- **Struktura stała:** Breadcrumb → **Chapter Rail** (sticky TOC) → Hero Head → Hero Body →
  Summary (4 komórki) → Rozdziały (`section-divider` + `kwcs-sec`) → Rezultat (`kwcs-result`
  zakończony `kwcs-cta`).
- **Typy projektów:** A — Brand+Web (wzorzec Karoma), B — Produkt/aplikacja (RazDwa), C — UX/strategia.
- **Twarde zakazy:** brak `<style>`/`style=""` w HTML (CSS scoped `#case-[slug]` w `projects.css`),
  brak emoji w treści wynikowej, każdy `<img>` w galerii = `class="lightbox-trigger"` + `data-caption`,
  `razdwa_aplikacja.html` = read-only.
- Checklisty pre-publikacja i startowa — w template.

**Kontekst sprzedażowy/messaging:** [`docs/audyt-sprzedazowy-2026-07.md`](./audyt-sprzedazowy-2026-07.md)
— audyt całego serwisu (hero, proof, spójność). Przydatny przy pisaniu treści case studies
(kolejność: efekt dla klienta → jak → dowód).

### Decyzje i statusy PRZENIESIONE Z WCZEŚNIEJSZEJ SESJI (do potwierdzenia)
> ⚠️ Poniższe pochodzą z ustaleń właściciela w innej sesji — **ta sesja ich nie wygenerowała**.
> Zapisane, by nie zginęły; przed wdrożeniem potwierdzić szczegóły/„format CyfraDruk".

- **Kolejność:** **voucher-magdy** teraz (komplet assetów **9/9**) → potem **power-of-mind**
  (dziś **6/10**, brak 4 plików brandingu — odłożone do dogrania) → potem **CyfraDruk**
  (odłożone w całości; **nie** tworzyć makiety hero bez realnego zdjęcia panelu/hero mockup).
- **voucher-magdy:** typ jak Karoma (Brand+Web / grafika użytkowa), **rail = decyzja #2**,
  **pełne SB7 = decyzja #3** — „zastosuj jak w Karomie". Diagnoza ma format:
  **techniczna + treściowa + SB7 gap analysis** (StoryBrand 7: Bohater/Problem/Przewodnik/
  Plan/Wezwanie/Sukces/Porażka). Właściciel czeka na diagnozę przed planem sekcja-po-sekcji.
- **Do odtworzenia w następnej sesji:** dokładny „format CyfraDruk" (jeśli różni się od
  powyższego) — najlepiej wkleić tamtą diagnozę jako wzorzec, albo potwierdzić rekonstrukcję
  z `case-study-template.md` + SB7.

### Materiał voucher-magdy (zweryfikowane w repo — punkt startowy diagnozy)
- Plik: `projects/voucher-salon-magdy.html` (672 linie). Zawiera m.in. gotową sekcję
  demonstracyjną `.ui-demo-btn` (primary/secondary/tertiary + stany) — historyczny wzorzec UI.
- Obrazy referowane w pliku (ścieżki `/KWdesignnew/assets/images/...`): `salon Magdy mockup copy.webp`,
  `Wizu_Magda_salon{,2,3,4}.jpg`, `Mockup_Magda_salon{,1,2,3}.jpg`.
  Uwaga: na dysku są też `VoucherLogoSalon kopia.webp`, `Voucher Fryzjer_druk_KW-1 kopia.webp`
  — do weryfikacji spójności ścieżek vs pliki (spacje/„ kopia" w nazwach).
