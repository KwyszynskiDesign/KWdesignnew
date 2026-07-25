# Pozycjonowanie kwyszynski.pl — plan i instrukcje (lipiec 2026)

> Dokument towarzyszący technicznym poprawkom SEO wykonanym w tej samej sesji
> (patrz commit/diff: naprawa starych adresów `/KWdesignnew/...` w `projects/*.html`
> i `404.html`, uzupełnienie `sitemap.xml`, JSON-LD `CreativeWork` w case studies).
> Ten plik pokrywa to, czego nie da się zrobić samym kodem: weryfikację w Google,
> analitykę, kierunek treści i decyzję o local SEO.

---

## 0. Rzeczywisty hosting — ważna korekta założeń

Sprawdzone empirycznie (nagłówki HTTP na żywo + `gh api repos/.../pages` + DNS):

- Strona jest serwowana przez **GitHub Pages** (`build_type: legacy`, branch `main`,
  własna domena `kwyszynski.pl` skonfigurowana w ustawieniach repo GitHub), **nie
  przez Cloudflare Pages**.
- DNS dla `kwyszynski.pl` jest zarządzany u **lh.pl / LightHosting** (nameservery
  `ns.lh.pl`, `ns2.lighthosting.net`), nie w Cloudflare. Rekord `www` to CNAME na
  `kwyszynskidesign.github.io`, rekordy A dla apeksu wskazują wprost na IP GitHub Pages.
  Cloudflare **nigdzie** nie stoi przed ruchem (brak proxy/orange-cloud).
- Wniosek: pliki `_headers` i `_redirects` w repo (format Cloudflare Pages/Netlify)
  **nie są w ogóle odczytywane** przez GitHub Pages. Zdefiniowane tam nagłówki
  bezpieczeństwa (CSP, HSTS, X-Frame-Options, Permissions-Policy) i reguły
  przekierowań **nie działają na produkcji** — potwierdzone brakiem tych nagłówków
  w realnej odpowiedzi serwera. To prawdopodobnie pozostałość po planie migracji
  na Cloudflare Pages, który nigdy nie został dokończony.
- **Naprawione w tej sesji:** `https_enforced` było ustawione na `false` w
  konfiguracji GitHub Pages — `http://kwyszynski.pl/` odpowiadało `200 OK` zamiast
  przekierować na HTTPS. Włączyłem wymuszanie HTTPS przez `gh api` (certyfikat SSL
  jest ważny do 2026-10-23 dla `kwyszynski.pl` i `www.kwyszynski.pl`, więc to
  bezpieczna zmiana). Propagacja na edge'u GitHub bywa nie natychmiastowa — warto
  sprawdzić po jakimś czasie: `curl -I http://kwyszynski.pl/` powinno pokazać `301`
  z `Location: https://...`.
- **Nadal otwarte, do decyzji:** jeśli zależy Ci na realnym CSP/HSTS/ochronie przed
  clickjackingiem na produkcji, `_headers` samo z siebie nic nie da na GitHub Pages.
  Opcje: (a) przenieść DNS apeksu pod proxy Cloudflare (orange cloud) i ustawić
  nagłówki przez Cloudflare Transform Rules/Worker, (b) faktycznie przenieść hosting
  na Cloudflare Pages (wtedy `_headers`/`_redirects` zaczną działać tak, jak są dziś
  napisane), (c) świadomie zostawić bez tych nagłówków, jeśli to nie priorytet.
  Nie podejmuję tej decyzji za Ciebie — wymaga wyboru platformy/przepięcia DNS.

## 1. Google Search Console — weryfikacja domeny

Rekomendacja: weryfikacja przez **rekord DNS TXT** — działa niezależnie od tego,
co jest wdrożone na stronie.

Kroki:
1. Wejdź na [search.google.com/search-console](https://search.google.com/search-console) → **Dodaj usługę** → **Domena** (nie "Prefiks adresu URL") → wpisz `kwyszynski.pl`.
2. Google poda rekord TXT w formacie `google-site-verification=...`.
3. Dodaj go w panelu **lh.pl / LightHosting** (tam faktycznie jest zarządzany DNS tej domeny, nie w Cloudflare) jako rekord **TXT**, host `@`, wartość dokładnie taka jak podał Google.
4. Poczekaj na propagację DNS (zwykle kilka minut–godzin) i kliknij **Weryfikuj** w GSC.
5. Po weryfikacji: **Sitemapy** → wklej `sitemap.xml` → Wyślij. GSC zacznie zgłaszać, ile z 14 URL-i zostało zaindeksowanych.
6. Warto też odpytać ręcznie **Kontrolę adresu URL** dla `https://kwyszynski.pl/` i kluczowych podstron (`portfolio.html`, `uslugi.html`) i kliknąć "Poproś o zindeksowanie" — przyspiesza pierwsze wejście do indeksu na nowej domenie.

## 2. Analityka — Cloudflare Web Analytics czy GA4 (decyzja neutralna)

W repo jest już częściowo wpięty tag **Cloudflare Web Analytics**
(`static.cloudflareinsights.com/beacon.min.js`), ale:
- token jest placeholderem `"TWOJ_TOKEN"` w 3 plikach (`uslugi.html`, `narzedzie.html`, `polityka-prywatnosci.html`),
- brakuje go na pozostałych stronach — czyli tam, gdzie akurat jest, i tak nic nie mierzy,
- **uwaga:** to narzędzie działa niezależnie od hostingu/DNS (to tylko skrypt JS wysyłający dane do Cloudflare) — nie wymaga, żeby domena była w Cloudflare. Wcześniej rekomendowałem je m.in. argumentem "nie trzeba ruszać CSP" — ten argument już nie obowiązuje, bo (patrz punkt 0) na produkcji **nie ma żadnego CSP**, więc GA4 też nic by nie blokowało.

Realny wybór sprowadza się teraz do:
- **Cloudflare Web Analytics** — prywatność (bez cookies), lżejsze, już częściowo wdrożone — ale wymaga założenia/posiadania konta Cloudflare tylko po to narzędzie, skoro domena i tak tam nie jest.
- **Google Analytics 4** — więcej możliwości raportowania, naturalnie łączy się z Search Console w jednym ekosystemie Google, branżowy standard.

Do potwierdzenia, co wolisz — obie opcje są dziś technicznie równie łatwe do wdrożenia.

Kroki do dokończenia Cloudflare Analytics (jeśli to wybierzesz):
1. Zaloguj się do Cloudflare dashboard (samo konto Cloudflare, nie musi zarządzać DNS domeny) → **Analytics & Logs → Web Analytics** → dodaj `kwyszynski.pl` jako monitorowaną stronę.
2. Skopiuj wygenerowany realny `token`.
3. Podmień `"TWOJ_TOKEN"` na realną wartość we wszystkich plikach, które już mają tag beacon, i dodaj identyczny tag na pozostałych stronach (w tym `projects/*.html`), jeśli chcesz mierzyć cały ruch.

## 3. Słowa kluczowe i mapowanie treści

Frazy dobrane pod realną ofertę z `uslugi.html` (3 obszary: produkty cyfrowe,
automatyzacje procesów, analiza procesów) i istniejące case studies. Do potwierdzenia
z właścicielem — to punkt wyjścia, nie ostateczna lista.

| Klaster fraz | Docelowa strona | Uwagi |
|---|---|---|
| „projektowanie aplikacji webowych", „aplikacja na zamówienie dla firmy" | `uslugi.html`, `projects/razdwa_aplikacja.html` | Raz Dwa Druk to najmocniejszy dowód (godzina → 5 minut) |
| „automatyzacja procesów firma", „automatyzacja Google Apps Script" | `uslugi.html`, `projects/power-of-mind.html` | Power of Mind ma konkretny automat (zapisy/płatności/przypomnienia) |
| „digital product designer", „projektant UX/UI produktów cyfrowych" | `index.html`, `omnie.html` | już w tytule/JSON-LD, wzmocnić w treści `omnie.html` |
| „identyfikacja wizualna dla firmy", „branding + sklep WooCommerce" | `projects/karoma.html`, `projects/KW-Design.html` | dwa case studies brandingowe, można je linkować krzyżowo |
| „analiza procesów biznesowych", „diagnoza procesu przed automatyzacją" | `uslugi.html` (sekcja "Analiza procesów") | to najsłabiej reprezentowany case-studiami obszar — warto pomyśleć o krótkim wpisie/case study dot. samej analizy |
| „projekt opakowań", „rebranding marki premium" | `projects/sir-roger.html` | nisza, ale konkretna — mało konkurencji w polskim SEO na tę frazę |

**Zasada:** każda strona ma jeden główny temat/frazę w `<h1>` i tytule — nie
dublować tej samej frazy głównej na dwóch stronach (kanibalizacja). Rozbudowa
treści (dłuższe opisy procesu, FAQ, liczby) pomaga bardziej niż dodawanie nowych,
cienkich podstron.

**Pomysł na rozwój (opcjonalny, nie w zakresie tej sesji):** krótkie wpisy blogowe
odpowiadające na pytania z „Analizy procesów" (np. „Jak rozpoznać proces, który
opłaca się zautomatyzować") — dziś to jedyny z trzech obszarów oferty bez żadnego
dowodu w postaci case study ani treści rozwijającej temat.

## 4. Local SEO — decyzja otwarta

Audyt całego repo (grep pod kątem telefonu/adresu/NIP) **nie znalazł żadnych
danych NAP** (Nazwa/Adres/Telefon) na stronie — jedyne trafienia to przykładowy
tekst w mockupie ("ul. Przykładowa 1 · tel. 000 000 000") i wewnętrzna notatka
o adresie e-mail na domenie onet.pl.

To wygląda na świadomy model (freelance/zdalna współpraca), nie przeoczenie —
ale zanim zainwestujesz czas w local SEO, warto to jawnie rozstrzygnąć:

- **Jeśli biznes jest w pełni zdalny** (praca z klientami w całej Polsce, bez
  lokalnego biura) → **pomiń Google Business Profile / local SEO**. Miejsce na
  ten czas: SEO ogólnokrajowe/eksperckie z sekcji 3 (treść, case studies, frazy
  "dla firm" bez przywiązania do miasta).
- **Jeśli jednak chcesz też ruchu lokalnego** (np. spotkania stacjonarne w
  konkretnym mieście) → Google Business Profile wymaga *co najmniej* obszaru
  działania (service area) lub adresu/telefonu kontaktowego — wtedy potrzebne
  będą realne dane do publikacji, których dziś na stronie nie ma.

Nie zakładam żadnej z tych opcji za Ciebie — to do potwierdzenia, zanim ruszymy
z tym tematem dalej.
