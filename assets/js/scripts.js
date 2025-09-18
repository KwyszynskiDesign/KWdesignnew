/*
 * JavaScript interactions for the one-page portfolio.
 */
console.log("scripts.js działa ✅");

// ======================================================
// GLOBALNE FUNKCJE POMOCNICZE
// ======================================================

// Funkcja do inicjalizacji akordeonów (może być wywołana wielokrotnie)
function initKWAccordion(container = document) {
  console.log("Inicjalizuję akordeony...");
  
  const accordions = container.querySelectorAll('.kwcs-accordion');
  if (!accordions.length) {
    console.log("Nie znaleziono akordeonów");
    return;
  }

  accordions.forEach(acc => {
    // Sprawdź czy już jest zainicjalizowany
    if (acc.__bound) {
      console.log("Akordeon już zainicjalizowany, pomijam...");
      return;
    }
    
    acc.__bound = true;
    console.log("Inicjalizuję nowy akordeon:", acc);
    
    // Dodaj event listener do całego akordeonu
    acc.addEventListener('click', (e) => {
      const header = e.target.closest('.kwcs-header');
      if (!header || !acc.contains(header)) return;
      
      console.log("Kliknięto header akordeonu");
      
      const item = header.closest('.kwcs-item');
      const content = item.querySelector('.kwcs-content');
      const icon = header.querySelector('.icon');
      
      if (!content) {
        console.error("Nie znaleziono .kwcs-content w elemencie");
        return;
      }
      
      // Zamknij inne otwarte akordeony w tej samej grupie
      acc.querySelectorAll('.kwcs-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const openContent = openItem.querySelector('.kwcs-content');
          const openIcon = openItem.querySelector('.kwcs-header .icon');
          if (openContent) openContent.style.maxHeight = '';
          if (openIcon) openIcon.textContent = '+';
        }
      });
      
      // Toggle aktualnego elementu
      const isOpen = item.classList.contains('open');
      
      if (isOpen) {
        // Zamykanie
        item.classList.remove('open');
        content.style.maxHeight = '';
        if (icon) icon.textContent = '+';
        console.log("Zamykam akordeon");
      } else {
        // Otwieranie
        item.classList.add('open');
        // Ustaw max-height na realną wysokość zawartości
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '–';
        console.log("Otwieram akordeon, wysokość:", content.scrollHeight);
        
        // Dodaj małe opóźnienie dla lepszej animacji
        setTimeout(() => {
          if (item.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }, 10);
      }
    });
    
    // Inicjalny stan: wszystko zamknięte
    acc.querySelectorAll('.kwcs-item').forEach(item => {
      const content = item.querySelector('.kwcs-content');
      const icon = item.querySelector('.kwcs-header .icon');
      
      item.classList.remove('open');
      if (content) content.style.maxHeight = '';
      if (icon) icon.textContent = '+';
    });
    
    console.log("Akordeon zainicjalizowany pomyślnie");
  });
}

// Funkcja do inicjalizacji wszystkich skryptów dla dynamicznej treści
function initDynamicContent(container = document) {
  console.log("Inicjalizuję dynamiczną treść...");
  
  // Reinicjalizuj akordeony dla nowo załadowanej treści
  initKWAccordion(container);
  
  // Reinicjalizuj FAQ akordeony (jeśli są w dynamicznej treści)
  const faqItems = container.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question && !question.__faqBound) {
      question.__faqBound = true;
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });
  
  // Tutaj można dodać inne skrypty dla dynamicznej treści
  // np. lightboxy, galerie, itp.
  
  console.log("Dynamiczna treść zainicjalizowana");
}

// ======================================================
// GŁÓWNY KOD INICJALIZACYJNY
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM załadowany, inicjalizuję skrypty...");

  // Mobile navigation toggling
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
      });
    });
    console.log("Nawigacja mobilna zainicjalizowana");
  }

  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        portfolioItems.forEach((item) => {
          item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
        });
      });
    });
    console.log("Filtrowanie portfolio zainicjalizowane");
  }

  // Testimonials slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  }
  
  if (prevBtn && nextBtn && slides.length) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
    console.log("Slider testimoniali zainicjalizowany");
  }

  // FAQ accordions (dla statycznej treści)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.__faqBound = true;
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });
  if (faqItems.length) {
    console.log("FAQ akordeony zainicjalizowane");
  }

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      fetch(scriptURL, {
        method: 'POST',
        body: new FormData(contactForm),
      })
        .then(() => {
          alert('Dziękuję za wiadomość! Skontaktuję się wkrótce.');
          contactForm.reset();
        })
        .catch((error) => {
          console.error('Error!', error.message);
          alert('Wystąpił błąd podczas wysyłki. Spróbuj ponownie później.');
        });
    });
    console.log("Formularz kontaktowy zainicjalizowany");
  }

  // ======================================================
  // KARUZELA I ŁADOWANIE PROJEKTÓW
  // ======================================================
  const carouselItems = document.querySelectorAll('.carousel-item');
  const projectViewer = document.querySelector('.project-viewer');
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselNavBtns = document.querySelectorAll('.carousel-nav');
  const closeBtn = document.querySelector('.close-button');

  // Funkcja do ładowania zawartości projektu
  const loadProject = (projectFile) => {
    if (!projectFile) {
      console.error('Brak pliku projektu w atrybucie data-project.');
      return;
    }
    
    console.log("Ładuję projekt:", projectFile);
    const filePath = `projects/${projectFile}`;
    
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Błąd ładowania pliku: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        console.log("HTML projektu załadowany, długość:", html.length);
        projectViewer.innerHTML = html;
        projectViewer.classList.remove('hidden');
        
        // WAŻNE: Inicjalizuj wszystkie skrypty dla nowo załadowanej treści
        setTimeout(() => {
          initDynamicContent(projectViewer);
        }, 100); // Małe opóźnienie dla renderowania DOM
      })
      .catch(error => {
        console.error('Błąd ładowania projektu:', error);
        projectViewer.innerHTML = `<p class="error-msg">${error.message}. Nie można załadować projektu.</p>`;
        projectViewer.classList.remove('hidden');
      });
  };

  // Nasłuchiwanie na kliknięcia w karuzeli
  if (carouselItems.length) {
    carouselItems.forEach(item => {
      item.addEventListener('click', (event) => {
        console.log("Kliknięto element karuzeli");
        // Usuń klasę 'active' ze wszystkich elementów i dodaj do klikniętego
        carouselItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        // Załaduj projekt z atrybutu data-project
        const projectFile = item.dataset.project;
        loadProject(projectFile);
      });
    });
    console.log("Karuzela zainicjalizowana");
  }

  // Zamknięcie widoku projektu
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log("Zamykam widok projektu");
      projectViewer.classList.add('hidden');
      projectViewer.innerHTML = '';
      carouselItems.forEach(el => el.classList.remove('active'));
    });
  }

  // Obsługa przycisków nawigacyjnych karuzeli
  if (carouselNavBtns.length > 0) {
    carouselNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        const scrollAmount = direction === 'next' ? carouselTrack.offsetWidth : -carouselTrack.offsetWidth;
        carouselTrack.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      });
    });
    console.log("Nawigacja karuzeli zainicjalizowana");
  }

  // ======================================================
  // INICJALIZACJA AKORDEONÓW NA STARCIE
  // ======================================================
  initKWAccordion();
  
  console.log("Wszystkie skrypty zainicjalizowane ✅");
});

// ======================================================
// GLOBALNE FUNKCJE (dostępne z innych skryptów)
// ======================================================

// Eksportuj funkcje do globalnego obiektu window dla kompatybilności
if (typeof window !== 'undefined') {
  window.KW = window.KW || {};
  window.KW.initDynamicContent = initDynamicContent;
  window.KW.initKWAccordion = initKWAccordion;
}
