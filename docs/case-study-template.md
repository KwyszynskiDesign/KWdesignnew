# MASTER TEMPLATE — Case Study System Portfolio v1.0

**Ostatnia aktualizacja:** 2026-06-19
**Wzorzec bazowy:** #RazDwa
**Projekt kalibracyjny:** #Karoma

---

## 1. STRUKTURA DOKUMENTU

Każde case study składa się z dokładnie tych sekcji, w tej kolejności:

| # | Sekcja | Element HTML | Klasy |
|---|--------|--------------|-------|
| 0 | Breadcrumb | `<nav>` | `kwcs-breadcrumb` |
| 1 | Chapter Rail | `<div>` | `razdwa-chapter-rail` + id |
| 2 | Hero Head | `<section>` | `kwcs-hero-head` |
| 3 | Hero Body | `<section>` | `kwcs-hero-body` |
| 4 | Summary | `<div>` | `razdwa-summary` + id |
| 5–N | Rozdziały | `<h2>` + `<div>` | `section-divider` + `kwcs-sec` |
| N+1 | Rezultat | `<h2>` + `<div>` + `<div>` | `section-divider` + `kwcs-sec` + `kwcs-result` |

**Zasady twarde:**
- chapter-rail musi być przed hero-head (sticky left TOC)
- kwcs-footnote jest obowiązkowy pod razdwa-summary-grid
- kwcs-cta jest obowiązkowy jako ostatni element kwcs-result
- section-divider ma id=`[slug]-[anchor]` — zawsze

---

## 2. KOMPONENTY — ZASADY UŻYCIA

### razdwa-summary
4 komórki: Problem / Moja rola / Rozwiązanie / Efekt. Nie dodawaj piątej. Wartości: max 2 zdania.

### chapter-rail
Ilość linków = ilość section-dividerów. Tekst linku = skrót (max 3 słowa). data-rail-target = id sekcji.

### ux-decision-grid
- 2 boxy → `ux-decision-grid` (domyślny, 2 kolumny)
- 3 boxy → `ux-decision-grid ux-decision-grid--trio`
- Każdy box: `ux-decision-box` + `ux-label` (opcjonalnie) + `h4` + `p`

### contribution-cell--solo
Jedna lista „Za co odpowiadałem". Wrapper: `contribution-grid--razdwa`. Wymagany `<span class="dot">` w h3.

### razdwa-stats
Dokładnie 4 statystyki. Format: liczba w `razdwa-stat-num`, opis w `razdwa-stat-label`.

### kwcs-gallery-grid
Każdy `<img>` musi mieć `class="lightbox-trigger"` + `data-caption`. Bez tego lightbox nie działa.

### kwcs-hero-meta
4 pola w ustalonej kolejności: Rola / Czas / Zakres / Efekt. Struktura: `kwcs-hero-meta-item` → `span.label` + `span.value`.

### kwcs-result
Poprzedza go `section-divider` (h2) + `kwcs-sec` jako wrapper. Obligatoryjna kolejność wewnątrz kwcs-result: `p.result-lead` → `div.result-cards` → `a.kwcs-cta`. Nic poza tym.

---

## 3. TYPY PROJEKTÓW

### A — Brand + Web (wzorzec: Karoma)
Sekcje: kontekst → decyzje projektowe → logo/identyfikacja → strona → nośniki → wnioski → rezultat

### B — Produkt cyfrowy / aplikacja (wzorzec: RazDwa)
Sekcje: kontekst → architektura → kluczowe decyzje → implementacja → wnioski → rezultat

### C — UX Research / strategia
Sekcje: kontekst → metodologia → findings → rekomendacje → wdrożenie → rezultat

---

## 4. KONWENCJE NAZEWNICTWA

```
id na <section>:        case-[slug]
id na chapter-rail:     rail-[slug]
id na section-divider:  [slug]-[anchor]
id na razdwa-summary:   [slug]-summary
```

Przykłady anchors (typ A): kontekst, decyzje, logo, strona, nosniki, wnioski, rezultat
Przykłady anchors (typ B): kontekst, architektura, decyzje, implementacja, wnioski, rezultat

Slug = kebab-case, bez polskich znaków. `karoma`, `razdwa`, `projekt-x`.

---

## 5. ZAKAZY

- Żadnych `<style>` w pliku HTML. CSS → projects.css (scoped `#case-[slug]`)
- Żadnych `style=""` inline na elementach
- Żadnych emoji w result-lead, result-cards, razdwa-summary
- Zakazana jest ogólna sekcja „Proces projektowy" jako zbiorczy kontener bez dedykowanego tematu — zastąp dedykowanymi sekcjami z ux-decision-grid. Accordion dozwolony wyłącznie jako element pomocniczy wewnątrz dedykowanej sekcji procesowej.
- Żadnych chips w hero-body — zakres idzie do contribution-cell--solo
- Żadnych zduplikowanych informacji o zakresie (max 1 sekcja = contribution-cell--solo)
- Żaden img w gallery/mockups bez `class="lightbox-trigger"` i `data-caption`
- Nie modyfikuj razdwa_aplikacja.html — to wzorzec, read-only

---

## 6. CHECKLISTA PRE-PUBLIKACJA

```
[ ] chapter-rail ma tyle linków ile section-dividerów
[ ] razdwa-summary ma dokładnie 4 komórki
[ ] kwcs-footnote obecny pod razdwa-summary-grid
[ ] każdy section-divider ma poprawne id=[slug]-[anchor]
[ ] każdy img w gallery/mockups ma class="lightbox-trigger" + data-caption
[ ] kwcs-cta jest ostatnim elementem kwcs-result
[ ] brak <style> w <head>
[ ] brak style="" na elementach
[ ] scoped CSS dodany do projects.css jako #case-[slug]
[ ] breadcrumb href prowadzi do portfolio.html z poprawnym #anchor
[ ] wszystkie obrazy istnieją na dysku (ścieżka relatywna)
```

---

## SKELETON HTML

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TYTUŁ PROJEKTU] — Karol Wyszyński</title>
  <link rel="stylesheet" href="../assets/css/main.css">
  <link rel="stylesheet" href="../assets/css/projects.css">
</head>
<body>

<nav class="kwcs-breadcrumb">
  <div class="wrap">
    <a href="../portfolio.html#[SLUG]" class="kwcs-back-btn">← Portfolio</a>
    <span class="kwcs-breadcrumb-sep">/</span>
    <span class="kwcs-breadcrumb-current">[TYTUŁ PROJEKTU]</span>
  </div>
</nav>

<div class="razdwa-chapter-rail" id="rail-[SLUG]">
  <nav>
    <a href="#[SLUG]-kontekst" data-rail-target="[SLUG]-kontekst">[Skrót 1]</a>
    <a href="#[SLUG]-decyzje" data-rail-target="[SLUG]-decyzje">[Skrót 2]</a>
    <a href="#[SLUG]-rezultat" data-rail-target="[SLUG]-rezultat">Rezultat</a>
  </nav>
</div>

<section class="kwcs-hero-head" id="case-[SLUG]">
  <div class="wrap hero-content-grid">
    <div class="hero-text">
      <div class="hero-tags">
        <span class="hero-tag">[Tag kategorii]</span>
      </div>
      <h1>[Tytuł projektu]</h1>
      <p class="hero-desc">[Jedno zdanie — o co chodzi w projekcie]</p>
    </div>
    <div class="hero-image">
      <img src="../assets/img/[SLUG]/hero.webp" alt="[SLUG] — widok główny">
    </div>
  </div>
</section>

<section class="kwcs-hero-body">
  <div class="wrap kwcs-hero-meta">
    <div class="kwcs-hero-meta-item"><span class="label">Rola</span><span class="value">[Moja rola w projekcie]</span></div>
    <div class="kwcs-hero-meta-item"><span class="label">Czas</span><span class="value">[Czas trwania]</span></div>
    <div class="kwcs-hero-meta-item"><span class="label">Zakres</span><span class="value">[Krótki opis zakresu]</span></div>
    <div class="kwcs-hero-meta-item"><span class="label">Efekt</span><span class="value">[Główny mierzalny efekt]</span></div>
  </div>
</section>

<div class="razdwa-summary" id="[SLUG]-summary">
  <div class="wrap">
    <h2>W skrócie</h2>
    <div class="razdwa-summary-grid">
      <div class="razdwa-summary-cell">
        <div class="label">Problem</div>
        <div class="value">[Max 2 zdania]</div>
      </div>
      <div class="razdwa-summary-cell">
        <div class="label">Moja rola</div>
        <div class="value">[Max 2 zdania]</div>
      </div>
      <div class="razdwa-summary-cell">
        <div class="label">Rozwiązanie</div>
        <div class="value">[Max 2 zdania]</div>
      </div>
      <div class="razdwa-summary-cell">
        <div class="label">Efekt</div>
        <div class="value">[Max 2 zdania]</div>
      </div>
    </div>
    <p class="kwcs-footnote">[Źródło danych lub zastrzeżenie]</p>
  </div>
</div>

<h2 class="section-divider" id="[SLUG]-kontekst">[Tytuł rozdziału 1]</h2>
<div class="kwcs-sec">
  <div class="wrap">
    <p class="kwcs-section-lead">[Intro rozdziału — max 2 zdania]</p>

    <div class="ux-decision-grid">
      <div class="ux-decision-box">
        <h4>[Nagłówek decyzji]</h4>
        <p>[Opis]</p>
      </div>
      <div class="ux-decision-box">
        <h4>[Nagłówek decyzji]</h4>
        <p>[Opis]</p>
      </div>
    </div>

    <div class="contribution-grid--razdwa">
      <div class="contribution-cell contribution-cell--solo">
        <h3><span class="dot"></span>Za co odpowiadałem</h3>
        <ul>
          <li>[Zakres 1]</li>
          <li>[Zakres 2]</li>
        </ul>
      </div>
    </div>

    <div class="razdwa-stats">
      <div class="razdwa-stat"><div class="razdwa-stat-num">[N]</div><div class="razdwa-stat-label">[Opis]</div></div>
      <div class="razdwa-stat"><div class="razdwa-stat-num">[N]</div><div class="razdwa-stat-label">[Opis]</div></div>
      <div class="razdwa-stat"><div class="razdwa-stat-num">[N]</div><div class="razdwa-stat-label">[Opis]</div></div>
      <div class="razdwa-stat"><div class="razdwa-stat-num">[N]</div><div class="razdwa-stat-label">[Opis]</div></div>
    </div>
  </div>
</div>

<!-- POWTÓRZ section-divider + kwcs-sec dla kolejnych rozdziałów -->

<h2 class="section-divider" id="[SLUG]-rezultat">Rezultat</h2>
<div class="kwcs-sec">
  <div class="wrap">
    <div class="kwcs-result">
      <p class="result-lead">[Jedno zdanie podsumowujące efekt projektu]</p>
      <div class="result-cards">
        <div class="result-card"><h4>[Wynik 1]</h4><p>[Opis]</p></div>
        <div class="result-card"><h4>[Wynik 2]</h4><p>[Opis]</p></div>
        <div class="result-card"><h4>[Wynik 3]</h4><p>[Opis]</p></div>
      </div>
      <a href="[URL]" class="kwcs-cta" target="_blank" rel="noopener">Zobacz projekt</a>
    </div>
  </div>
</div>

<script src="../assets/js/projects.js"></script>
</body>
</html>
```

---

## CHECKLISTA STARTOWA — NOWE CASE STUDY

```
KROK 1 — SETUP
[ ] Skopiuj skeleton HTML → projects/[slug].html
[ ] Zamień wszystkie [SLUG] i [placeholdery]
[ ] Dodaj images do assets/img/[slug]/
[ ] Dodaj scoped block do projects.css → #case-[slug] { }

KROK 2 — TREŚĆ
[ ] Ustal typ projektu (A/B/C) → dobierz kolejność rozdziałów
[ ] Wypełnij razdwa-summary (4 komórki, max 2 zdania każda)
[ ] Napisz kwcs-footnote (źródło danych)
[ ] Wypełnij contribution-cell--solo (lista zakresów, max 8 punktów)
[ ] Wypełnij razdwa-stats (4 liczby)

KROK 3 — WERYFIKACJA
[ ] Uruchom checklistę pre-publikacja (sekcja 6)
[ ] Otwórz w przeglądarce → sprawdź chapter-rail (aktywny stan przy scrollu)
[ ] Sprawdź lightbox na 2–3 obrazach
[ ] Sprawdź responsywność na 375px
[ ] Dodaj wpis do portfolio.html (kafelka projektu)
```
