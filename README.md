# Karol Wyszyński – Digital Product Designer

Strona portfolio i usług: produkty cyfrowe, automatyzacje procesów, usprawnienia.

**Live:** [kwyszynski.pl](https://kwyszynski.pl)  
**Stack:** HTML5, CSS3, vanilla JS • Google Fonts • GitHub Pages / Cloudflare Pages

---

## 📁 Struktura projektu

```
KWdesignnew/
├── index.html              # Strona główna (hero, portfolio, proces, FAQ, kontakt)
├── portfolio.html           # Portfolio z case studies (lazy-loading projektów)
├── uslugi.html              # Strona usługowa (3 obszary, FAQ, proces współpracy)
├── 404.html                 # Niestandardowa strona błędu (Cloudflare Pages)
├── _headers                 # Security headers + cache (Cloudflare Pages)
├── _redirects               # Przekierowania 301 (Cloudflare Pages)
├── robots.txt               # Reguły dla crawlerów
├── sitemap.xml              # Mapa strony (SEO)
│
├── assets/
│   ├── css/
│   │   ├── index-styles.css    # Główny arkusz (shared)
│   │   ├── about-me.css        # Sekcja "O mnie" na portfolio
│   │   ├── portfolio.css       # Siatka portfolio
│   │   ├── projects.css        # Szczegóły projektów (case studies)
│   │   └── services-page.css   # Strona usługowa
│   ├── js/
│   │   ├── index-scripts.js    # Główny JS (nav, FAQ, form, scroll, karuzela)
│   │   ├── portfolio.js        # Lazy-loading projektów + lightbox
│   │   ├── availability.js     # Kalkulator dostępności (święta PL)
│   │   └── projects.js         # Dodatkowe skrypty dla case studies
│   ├── images/                 # Wszystkie assety graficzne (.webp, .png, .svg)
│   └── fonts/                  # Lokalne fonty (Poppins – fallback)
│
├── projects/                   # Podstrony case study (ładowane AJAX)
│   ├── razdwa_aplikacja.html
│   ├── karoma.html
│   ├── power-of-mind.html
│   ├── cyfradruk.html
│   ├── KW-Design.html
│   ├── sir-roger.html
│   ├── savage.html
│   └── voucher-salon-magdy.html
│
└── assets/KARUZELAJ/           # Obrazki do karuzeli (archiwalne)
```

---

## 🚀 Deployment

### GitHub Pages (obecnie)
Push na `main` → automatyczny deploy na `kwyszynskidesign.github.io/KWdesignnew/`.

### Cloudflare Pages (rekomendowany)
1. Podłącz repo w Cloudflare Dashboard → Pages → Create Project
2. **Build settings:** *(wszystko puste – strona statyczna, bez build stepu)*
3. Podepnij własną domenę `kwyszynski.pl`
4. Pliki `_headers` i `_redirects` są już w repo – Cloudflare zastosuje je automatycznie

Szczegółowa instrukcja: [`CLOUDFLARE_DEPLOY.md`](./CLOUDFLARE_DEPLOY.md)

---

## 🔒 Bezpieczeństwo

- **CSP** – tylko `self` + Google Fonts + Apps Script
- **HSTS** – wymuszony HTTPS (preload)
- **X-Frame-Options: DENY**
- **Formularz:** dane wysyłane do Google Apps Script (GET – docelowo POST przez Workera)

---

## 🔧 Znane rzeczy do zrobienia

Zobacz pełny audyt: [`audyt-strony-KW.txt`](./audyt-strony-KW.txt)

| Priorytet | Rzecz |
|-----------|-------|
| 🔴 | Dodać plik `assets/CV_KarolWyszynski.pdf` (obecnie 404) |
| 🔴 | Usunąć placeholder „Tu będzie opinia" w sekcji testimonials |
| 🔴 | Naprawić kropkę statusu dostępności (bug JS/CSS) |
| 🟠 | Formularz – zmienić GET → POST (przez Cloudflare Worker) |
| 🟠 | Zaktualizować święta w `availability.js` (są tylko do 2026-01-06) |
| 🟡 | Dodać `loading="lazy"` na mini-portfolio w index.html |

---

## 👤 Autor

**Karol Wyszyński** – Digital Product Designer  
[wyszynski.k@onet.pl](mailto:wyszynski.k@onet.pl) • [LinkedIn](https://www.linkedin.com/in/karol-wyszynski/)
