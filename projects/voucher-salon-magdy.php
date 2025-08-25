<?php
  // META
  $page_title = "Voucher – Salon fryzjerski u Magdy | Case Study";
  $page_description = "Case study vouchera prezentowego dla salonu fryzjerskiego: założenia, proces, makiety i pliki do druku.";

  // Spróbuj wczytać wspólne partiale; jeśli nie istnieją, wyrenderuj minimalny head/footer
  $has_header = file_exists(__DIR__ . '/../partials/header.php');
  $has_footer = file_exists(__DIR__ . '/../partials/footer.php');

  if ($has_header) {
    include __DIR__ . '/../partials/header.php';
  } else {
    ?><!doctype html>
    <html lang="pl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title><?= htmlspecialchars($page_title) ?></title>
      <meta name="description" content="<?= htmlspecialchars($page_description) ?>" />
      <link rel="stylesheet" href="../assets/css/portfolio.css" />
    </head>
    <body class="portfolio-page page-voucher-magdy"><?php
  }
?>

<!-- BREADCRUMBS -->
<nav class="breadcrumbs">
  <a href="../index.html">Strona główna</a> › <a href="../portfolio.html">Portfolio</a> › Voucher – Salon u Magdy
</nav>

<!-- HERO -->
<section class="hero-section voucher-hero">
  <div class="hero-content">
    <span class="eyebrow">Case study • Voucher prezentowy</span>
    <h1>Voucher dla „Salon fryzjerski u Magdy”</h1>
    <p class="subtitle">
      Elegancki kupon podarunkowy, który wygląda premium, a w salonie działa prosto i szybko.
      Spójny z marką, gotowy do druku i publikacji w social mediach.
    </p>
    <a class="btn-case" href="../portfolio.html#projekty">← Wróć do portfolio</a>
  </div>
</section>

<main>
  <article class="case-study">
    <!-- Intro -->
    <div class="case-grid">
      <div class="case-text">
        <h2>O projekcie</h2>
        <p class="subtitle">
          Lokalny salon potrzebował vouchera, który będzie przyjemnie wręczać i z dumą pokazywać online.
          Minimalistyczna elegancja, czytelność pól do uzupełnienia i szybkie przygotowanie do druku.
        </p>
        <ul class="meta-list">
          <li><span class="badge">Format</span> DL (ok. 99×210&nbsp;mm), druk cyfrowy</li>
          <li><span class="badge">Zastosowanie</span> prezent, akcje promocyjne, social media</li>
          <li><span class="badge">Personalizacja</span> imię, wartość, termin ważności, podpis/pieczątka</li>
          <li><span class="badge">Dostarczone</span> PDF do druku + grafiki IG/FB</li>
        </ul>
      </div>
      <div class="case-image">
        <img src="../assets/images/Salon%20u%20Magdy%20mockup.png"
             alt="Makieta vouchera – Salon u Magdy" loading="lazy" />
      </div>
    </div>

    <!-- Wyzwanie -->
    <section class="case-section">
      <h3>Wyzwanie</h3>
      <p>
        Połączyć <strong>wrażenie premium</strong> z praktyczną codziennością salonu: jasna hierarchia informacji,
        pola do ręcznego uzupełnienia, wariant do krótkich serii druku i publikacji w socialach.
      </p>
    </section>

    <!-- Cele -->
    <section class="case-section">
      <h3>Kluczowe cele</h3>
      <ul>
        <li>Spójność z wizerunkiem salonu i nowoczesny, „instagramowalny” look.</li>
        <li>Wyeksponowana wartość prezentu + czytelne zasady realizacji.</li>
        <li>Plik gotowy do druku (spady, marginesy, CMYK, osadzone fonty).</li>
        <li>Łatwa personalizacja w salonie: imię, wartość, data, podpis/pieczątka.</li>
      </ul>
    </section>

    <!-- Rozwiązanie -->
    <section class="case-section two-col">
      <div>
        <h3>Rozwiązanie projektowe</h3>
        <p>
          Czysta typografia <em>Poppins</em> i mocne zdjęcie wprowadzające klimat.
          Przód buduje efekt „wow”, tył zawiera <strong>pola do uzupełnienia</strong> oraz krótkie zasady wykorzystania –
          wszystko bez przeładowania detalami. Efekt: <strong>elegancko</strong> i <strong>praktycznie</strong>.
        </p>
        <ul>
          <li>Wyraźna hierarchia: nagłówek → benefity → pola do wypełnienia.</li>
          <li>Bezpieczne marginesy, spady 3&nbsp;mm, siatka – bez „ucięć” w druku.</li>
          <li>Warianty eksportu do CMYK/PDF i wersje do social mediów.</li>
        </ul>
      </div>
      <div class="case-image">
        <img src="../assets/images/salon%20Magdy%20mockup%20copy.png"
             alt="Wizualizacja – przód vouchera Salon u Magdy" loading="lazy" />
      </div>
    </section>

    <!-- Proces -->
    <section class="case-section">
      <h3>Proces w pigułce</h3>
      <ul>
        <li>Brief i moodboard (kierunek: nowoczesna elegancja, lekki glam).</li>
        <li>Szkice układu, decyzja o formacie DL i polach edycyjnych.</li>
        <li>Projekt przodu/tyłu + test czytelności i mikro-iteracje.</li>
        <li>Przygotowanie do druku: spady 3&nbsp;mm, marginesy, PDF (X-ready).</li>
        <li>Dodatki: grafiki na IG/FB (post, story) z mockupem vouchera.</li>
      </ul>
    </section>

    <!-- Galeria -->
    <section class="case-section">
      <h3>Makiety / podglądy</h3>
      <div class="gallery">
        <img src="../assets/images/Salon%20u%20Magdy%20mockup.png" alt="Makieta vouchera – ujęcie 1" class="js-zoom" />
        <img src="../assets/images/salon%20Magdy%20mockup%20copy.png" alt="Makieta vouchera – ujęcie 2" class="js-zoom" />
      </div>
    </section>

    <!-- Specyfikacja -->
    <section class="case-section">
      <h3>Specyfikacja &amp; dostarczone materiały</h3>
      <ul>
        <li>PDF do druku (spady 3&nbsp;mm, marginesy bezpieczeństwa, CMYK, fonty osadzone).</li>
        <li>Wersje do social: IG/FB (kwadrat + story), 2 rozdzielczości.</li>
        <li>Instrukcja krótkiej personalizacji dla zespołu w salonie.</li>
      </ul>
    </section>

    <!-- Rezultat + CTA -->
    <section class="case-section">
      <h3>Efekt</h3>
      <p>
        Voucher, który wygląda „premium” i realnie ułatwia pracę przy wręczaniu prezentów —
        prosta personalizacja i spójność z komunikacją marki.
      </p>
    </section>

    <div class="case-section cta-center">
      <a class="btn-case" href="../kontakt.html">Chcę podobny voucher / materiał premium</a>
    </div>
  </article>
</main>

<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox" aria-hidden="true">
  <button class="lightbox__close" aria-label="Zamknij podgląd">Zamknij ✕</button>
  <img alt="" />
</div>

<script>
  // Prosty lightbox bez bibliotek
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.js-zoom').forEach(img=>{
    img.addEventListener('click', ()=>{
      lbImg.src = img.src;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');
    });
  });
  lb.addEventListener('click', e=>{
    if(e.target===lb || e.target.classList.contains('lightbox__close')){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      lbImg.removeAttribute('src');
    }
  });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && lb.classList.contains('open')){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      lbImg.removeAttribute('src');
    }
  });
</script>

<?php
  if ($has_footer) {
    include __DIR__ . '/../partials/footer.php';
  } else {
    echo "</body></html>";
  }
?>
