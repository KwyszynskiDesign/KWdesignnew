# Audyt strony kwyszynski.pl — perspektywa nowego klienta

**Data:** lipiec 2026
**Perspektywa:** właściciel małej/średniej firmy, który trafia na stronę pierwszy raz, nie zna Karola i w ciągu kilkudziesięciu sekund decyduje, czy napisać, czy zamknąć kartę.
**Zakres:** język (messaging), warstwa wizualna, elementy zaufania, spójność serwisu. Audyt oparty na przeglądzie kodu wszystkich podstron i zrzutach ekranu (desktop 1440px + mobile 390px).

---

## TL;DR — 5 rzeczy, które dziś najmocniej psują sprzedaż

| # | Problem | Dlaczego to boli | Wysiłek naprawy |
|---|---------|------------------|-----------------|
| 1 | **Zepsuty hero na stronie głównej** — placeholder „tu można coś napisać" i przyciski CTA renderują się NAD nagłówkiem, cały akapit autobiograficzny siedzi wewnątrz `<h1>`, literówki („nasilniejszą", „stategiczne", „PROJEKTUJE" bez ogonka) | To pierwsze 3 sekundy wizyty. Strona osoby, która sprzedaje „porządkowanie i dopracowanie", wygląda na niedokończoną — to zaprzeczenie oferty | Mały (1–2 h) |
| 2 | **Placeholderowe opinie z fikcyjnymi nazwiskami** („Tu będzie opinia", „Anna Kowalska, CEO Beauty Studio", „Marcin Dąbrowski, właściciel agencji") | Jeśli odwiedzający to zauważy, przestaje wierzyć we wszystko inne na stronie. Fałszywie wyglądający social proof jest gorszy niż żaden | Mały (usunąć lub zdobyć 2 prawdziwe) |
| 3 | **`omnie.html` i `kontakt.html` to stary, niestylowany szablon** — inne fonty, tekstowe logo „KW", CSS (`style.css`) nie pasuje do markupu, a tłem hero „O mnie" jest… baner klienta „Power of Mind / Ewa Bugaj" | Strona „O mnie" to miejsce, gdzie klient sprawdza „kim jesteś" — a wita go surowy HTML i cudze logo | Średni |
| 4 | **Komunikat mówi o Tobie, nie o kliencie** — hero zaczyna się od „W trakcie poznawania siebie dowiedziałem się…" | Nowy odwiedzający nie szuka Twojej historii samopoznania — szuka odpowiedzi „co z tego będę miał i czy mogę Ci zaufać". Historia ma swoje miejsce, ale w sekcji O mnie, nie w H1 | Mały (nowy copy niżej) |
| 5 | **Niespójne liczby i ceny między podstronami** — „~8 lat" vs „~10 lat" vs „kilkanaście lat"; automatyzacje „od 8 tys. PLN" (index) vs „wycena po analizie" (usługi); „10+ wdrożonych narzędzi" vs „5 stron · 1 aplikacja · 10+ automatyzacji" | Klient, który porównuje podstrony przed napisaniem, widzi rozjazd — a spójność to u Ciebie produkt | Mały |

---

## 1. Test 5 sekund — co naprawdę widzi nowy odwiedzający

### Strona główna (desktop i mobile)
Kolejność elementów po wejściu (przez błąd w strukturze HTML):

1. szary tekst „tu można coś napisać"
2. dwa przyciski CTA („Porozmawiajmy o Twoim problemie", „Zobacz, jak pracuję")
3. eyebrow „PROJEKTUJE I UPRASZCZAM PROCESY" (brak „Ę")
4. `<h1>` zawierający jednocześnie: imię i nazwisko, tytuł „Digital Product Designer" **i cały akapit** „W trakcie poznawania siebie dowiedziałem się, że moją nasilniejszą cechą jest myślenie stategiczne…"
5. dwukrotnie powtórzona linia „Jeden specjalista — projekt, technologia i wdrożenie"
6. małe zdjęcie grupy osób przy laptopach

**Wniosek:** odwiedzający nie dostaje odpowiedzi na żadne z trzech pytań, które zadaje sobie w pierwszych sekundach: *co ten człowiek robi? dla kogo? dlaczego mam mu zaufać?* Zamiast tego dostaje sygnał „strona w budowie".

**Przyczyny techniczne (index.html):**
- linie 118–130: zduplikowany blok `hero-info-icons` z niezamkniętym `<div>` — to rozjeżdża cały układ hero,
- linia 111–117: akapit narracyjny wewnątrz `<h1>`,
- linia 144: placeholder „tu można coś napisać" w `hero-subtitle`.

### Portfolio
Najlepsza podstrona serwisu — spójna wizualnie, profesjonalne zdjęcie portretowe, sensowna siatka projektów. Uwagi niżej (sekcja 4).

### Usługi
Dobra struktura („Dla kogo / Co robię / Co dostajesz / Czego NIE robię" — blok „czego nie robię" to mocny, wiarygodny element). Problem: długość (ponad 10 000 px wysokości) i powtarzalność — trzy niemal identyczne szablony sekcji czyta się jak jeden.

### O mnie i Kontakt
Wyglądają jak inna, zepsuta strona: systemowe fonty, niebieski link „KW" zamiast logo, menu jako pionowa lista, formularz bez stylów. `style.css` styluje klasy `.header`, `.hero-section`, których te strony nie używają (mają `<header>`, `.hero`, `.hero-overlay` — markup ze starej wersji). Do tego `OMNIE_M.png` i `KONTAKT_M.png` to grafiki z banerem „Power of Mind Ewa Bugaj" — na stronie „O mnie" Karola wisi logo klientki.

---

## 2. Audyt języka (messaging)

### 2.1 Zasada, której dziś brakuje
Skuteczna strona wykonawcy mówi w tej kolejności:

1. **Efekt dla klienta** (nagłówek) — co się zmieni w jego firmie,
2. **Jak to robisz** (podtytuł) — czym i w jakim modelu,
3. **Dowód** (liczby, realizacje, opinie) — dlaczego można w to uwierzyć.

Obecny hero odwraca tę kolejność: zaczyna od Twojej autorefleksji, tytułu po angielsku i dopiero gdzieś w tle jest efekt.

### 2.2 Hero — propozycja przepisania

**Obecnie:**
> PROJEKTUJE I UPRASZCZAM PROCESY
> Karol Wyszyński / Digital Product Designer / W trakcie poznawania siebie dowiedziałem się, że moją nasilniejszą cechą jest myślenie stategiczne…

**Propozycja A (efekt + dowód):**
> *eyebrow:* Aplikacje · Automatyzacje · Strony internetowe
> *H1:* **Zamieniam chaos w firmowych procesach na narzędzia, które oszczędzają godziny pracy.**
> *podtytuł:* Jestem Karol Wyszyński. Projektuję i wdrażam rozwiązania od analizy procesu po działający produkt — jako jeden wykonawca, bez przekazywania projektu między rękami. Przykład? Wycena zleceń w drukarni: z godziny do 5 minut.
> *CTA główne:* Opisz mi swój proces → *CTA drugie:* Zobacz realizacje

**Propozycja B (bardziej bezpośrednia):**
> *H1:* **Twoja firma robi coś ręcznie, co powinno robić się samo.**
> *podtytuł:* Buduję aplikacje, automatyzacje i strony dopasowane do procesu — od analizy po wdrożenie. Jeden specjalista, pełna odpowiedzialność za efekt.

W obu wariantach imię i nazwisko schodzi z H1 do podtytułu — nagłówek pracuje na klienta, nazwisko buduje osobisty charakter zdanie niżej.

### 2.3 „Digital Product Designer"
Dla polskiego właściciela MŚP (drukarnia, sklep, usługi) to określenie jest puste albo myląco „graficzne". Wszędzie tam, gdzie tytuł pełni rolę wyjaśnienia (hero, footer, meta description), lepiej działa opis po polsku: **„Projektuję i wdrażam aplikacje, automatyzacje i strony dla firm"**. Angielski tytuł można zostawić na LinkedIn i w sekcji O mnie jako uzupełnienie.

### 2.4 Konkretne poprawki językowe

| Miejsce | Jest | Powinno być |
|---|---|---|
| index hero eyebrow | „PROJEKTUJE I UPRASZCZAM PROCESY" | „PROJEKTUJĘ…" (literówka) — albo całkiem nowy eyebrow (2.2) |
| index hero H1 | „nasilniejszą", „stategiczne", „strony internetowych" | usunąć cały akapit z H1; jeśli zostaje gdzieś indziej: „najsilniejszą", „strategiczne", „stron internetowych" |
| index, opinie | „Właściciel filmy Karoma" | „firmy" — ale cała sekcja do wymiany (sekcja 3.1) |
| index FAQ „Jak sprawdzić, co warto usprawnić najpierw?" | odpowiedź wymijająca („warto zadać sobie pytanie…") | odpowiedź z konkretem, np. „Zacznij od zadania, które ktoś w firmie powtarza co tydzień w ten sam sposób. Jeśli da się je opisać krok po kroku — prawie na pewno da się je zautomatyzować. Pomaga w tym moja checklista (link)." |
| index FAQ „Czy mogę zacząć od jednego procesu…" | odpowiedź nie odpowiada na pytanie | zacząć od „Tak — większość współprac tak się zaczyna." i dopiero potem opis |
| uslugi.html | „Czas większych projektów: 4–5 miesięcy" powtórzone w wielu miejscach | podawać też dolną granicę: „mniejsze wdrożenia: 2–4 tygodnie" — samo „4–5 miesięcy" odstrasza klientów z małym zakresem |
| kontakt.html „Pierwsza rozmowa nic nie kosztuje — sprawdzimy, czy w ogóle warto się brać" | „czy warto się brać" brzmi niedbale | „sprawdzimy, czy jest sens i co da największy efekt" |

### 2.5 Ton
Dobre, już działające elementy języka (zostawić i eksponować): „Nie pakiety z półki", „Czego NIE robię", „zrobić coś dobrze raz, a nie tanio trzy razy", opcja w formularzu „Nie wiem — pomóż mi to nazwać". To jest autentyczny, konkretny ton — hero powinien brzmieć tak samo.

---

## 3. Audyt zaufania (proof)

### 3.1 Opinie
W kodzie strony głównej jest 6 kart opinii z tekstem „Tu będzie opinia", w tym 3 z wymyślonymi osobami („Anna Kowalska, CEO Beauty Studio"). Sekcja ma `aria-hidden="true"`, ale jest w HTML i może być widoczna.

**Rekomendacja:** usunąć sekcję całkowicie do czasu zdobycia 2–3 prawdziwych opinii. Masz realnych klientów (Raz Dwa Druk, Karoma, Power of Mind) — jedna szczera, konkretna opinia z nazwiskiem i firmą („skrócił nam wycenę z godziny do 5 minut") jest warta więcej niż karuzela sześciu ogólników.

### 3.2 Liczby — ujednolicić w całym serwisie
Obecnie krążą: „~8 lat w designie", „~10 lat pracy zawodowej", „kilkanaście lat pracy" (portfolio), „10+ wdrożonych narzędzi i automatyzacji", „5 stron · 1 aplikacja biznesowa · 10+ automatyzacji". Wybrać jeden zestaw (np. **10 lat doświadczenia · 5 stron i sklepów · 10+ automatyzacji · 1 aplikacja B2B**) i używać go wszędzie identycznie.

### 3.3 Ceny — ta sama usługa, dwie wersje
- index: automatyzacje „od 8 tys. PLN"; uslugi.html: „wycena po krótkiej analizie potrzeb".
- „od 8 tys. PLN" przy automatyzacjach jest też ryzykowne sprzedażowo: to usługa-wejście („najczęściej wybierane", „najszybszy efekt"), a wysoki próg cenowy na dzień dobry ucina małe pierwsze zlecenia, którymi klient chce Cię przetestować.

**Rekomendacja:** na index przy automatyzacjach dać to samo co na usługach („wycena po krótkiej analizie") albo realny niższy próg wejścia, jeśli istnieje.

### 3.4 Brakujące dowody (do dodania z czasem)
- **Linki do żywych realizacji** — jeśli strony Karomy, Power of Mind, Savage są online, karty portfolio powinny linkować „Zobacz na żywo →". Działająca strona klienta to najtańszy dowód kompetencji.
- **Wynik w każdej karcie portfolio** — dziś tylko Raz Dwa Druk ma liczbę (−90% czasu wyceny). Każdy case powinien mieć jedną linijkę efektu, nawet miękkiego („klientka samodzielnie zarządza sklepem od 1. dnia").
- **E-mail w domenie** — `wyszynski.k@onet.pl` przy własnej domenie kwyszynski.pl osłabia wiarygodność; adres typu `kontakt@kwyszynski.pl` to drobiazg, który robi różnicę przy pierwszym kontakcie.

---

## 4. Audyt wizualny

### 4.1 Strona główna
- **Hero do przebudowy** (błędy struktury opisane w sekcji 1). Po naprawie: jeden H1, jeden podtytuł, dwa CTA, jedna linia dowodu (liczby), zdjęcie.
- **Zdjęcie hero:** `ja-skupiony2.webp` pokazuje kilka osób przy laptopach — nie wiadomo, który to Ty; kadr jest mały i przypadkowy. Na portfolio jest znacznie lepsze zdjęcie portretowe (`presentation HERO.webp`) — to ono powinno być na stronie głównej. Strona sprzedaje osobę, więc twarz musi być jednoznaczna.
- **Typografia H1:** przez wciśnięty akapit H1 renderuje się jako ściana pogrubionego serifa (szczególnie na mobile). Po wydzieleniu akapitu problem zniknie.

### 4.2 Spójność serwisu
- **Dwa systemy wizualne:** nowy (index, portfolio, usługi — Inter/Playfair, logo graficzne, spójne kolory) i stary (omnie, kontakt, polityka — Montserrat/systemowe, tekstowe „KW"). Docelowo: przenieść O mnie i Kontakt na szablon nowego systemu (header/footer z index.html, `index-styles.css`).
- **Nawigacja bez „O mnie":** menu na index/portfolio/usługi nie linkuje do omnie.html — a to kluczowa strona dla pytania „kim jest ten człowiek". Treść omnie.html jest zresztą najlepszym tekstem sprzedażowym w serwisie (historia poligrafia → web → automatyzacje, „nie jestem agencją od wszystkiego"). Dziś ta treść jest osierocona i nieostylowana. Dodać „O mnie" do nawigacji wszystkich stron.
- **Dwa formularze kontaktowe** (index `#contact` i kontakt.html) o różnych polach (kontakt.html ma dodatkowo firmę i budżet). Zostawić jeden wzór — wersja z budżetem jest lepsza dla kwalifikacji leadów — i użyć go w obu miejscach albo zlikwidować kontakt.html na rzecz sekcji na index.
- **Tła hero na starych stronach:** `OMNIE_M.png`/`KONTAKT_M.png` zawierają baner klientki (Power of Mind) — wymienić na neutralne tło lub własne zdjęcie.

### 4.3 Portfolio
- Miniatury projektów mają bardzo różną „gęstość": część kart wygląda na puste (jasne obrazy `object-fit: contain` na białym tle z dużym paddingiem — CyfraDruk, Raz Dwa Druk), część wypełnia kadr. Ujednolicić: każda miniatura jako pełnokadrowy zrzut/mockup na spójnym tle.
- Kolejność kart nie odzwierciedla strategii: najmocniejszy, najbardziej „biznesowy" case (Raz Dwa Druk, z liczbą −90%) jest piąty. Sortować od najmocniejszego dowodu: Raz Dwa Druk → Karoma → Power of Mind → reszta.
- Voucher dla salonu fryzjerskiego jako osobny case osłabia pozycjonowanie „aplikacje/automatyzacje/procesy" — rozważyć przeniesienie do zbiorczej karty „grafika użytkowa" albo usunięcie.

### 4.4 Drobiazgi techniczne (wpływają na odbiór)
- `uslugi.html:66` — beacon Cloudflare z placeholderem `"token": "TWOJ_TOKEN"`.
- `og:image` wszędzie to ikona 512×512 — przy udostępnianiu linku (np. na LinkedIn) podgląd wygląda słabo; przygotować grafikę OG 1200×630 z twarzą + jednym zdaniem oferty.
- Menu index: „Start" linkuje do `#hero`, na podstronach do `index.html` — ok, ale brak „O mnie" (jak wyżej).
- W `index.html` sekcja opinii: literówka „filmy Karoma", niedomknięty `</p>` w czwartej karcie.

---

## 5. Plan naprawczy w kolejności

**Krok 1 — gaszenie pożarów (1 dzień):**
1. Naprawić strukturę hero (usunąć zduplikowany blok, domknąć divy, wynieść akapit z H1, usunąć „tu można coś napisać").
2. Usunąć sekcję opinii (do czasu zdobycia prawdziwych).
3. Poprawić literówki (PROJEKTUJĘ, najsilniejszą, strategiczne, firmy Karoma).
4. Ujednolicić liczby i ceny między index a usługami.

**Krok 2 — komunikat (1–2 dni):**
5. Nowy copy hero (propozycja A/B z sekcji 2.2) + zdjęcie portretowe z portfolio na stronie głównej.
6. Spolszczyć opis roli w hero/footer/meta; poprawić słabe odpowiedzi FAQ.
7. Dodać „O mnie" do nawigacji.

**Krok 3 — spójność (2–3 dni):**
8. Przenieść omnie.html i kontakt.html na nowy szablon (header/footer/style z index); wymienić tła hero z banerem klientki.
9. Jeden wspólny wzór formularza (z polem budżetu).
10. Uporządkować miniatury i kolejność portfolio; dodać linijkę efektu do każdego case'a.

**Krok 4 — dowody (proces ciągły):**
11. Zebrać 2–3 prawdziwe opinie od Raz Dwa Druk / Karoma / Power of Mind.
12. Linki „zobacz na żywo" przy realizacjach online.
13. Grafika OG 1200×630; e-mail w domenie kwyszynski.pl.

---

*Dokument przygotowany jako wynik audytu — nie zawiera zmian w kodzie strony. Propozycje copy w sekcji 2.2 są gotowe do wdrożenia po akceptacji.*
