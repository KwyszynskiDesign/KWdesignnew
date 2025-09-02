/*
 * JavaScript interactions for the one-page portfolio.
 */
console.log("scripts.js działa ✅");

document.addEventListener('DOMContentLoaded', () => {
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
  }

  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
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
  }

  // FAQ accordions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

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
  }

  // ======================================================
  // NOWA LOGIKA DLA KARUZELI I ŁADOWANIA PROJEKTÓW
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
    const filePath = `projects/${projectFile}`;
    
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Błąd ładowania pliku: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        projectViewer.innerHTML = html;
        projectViewer.classList.remove('hidden');
        // TUTAJ INICJALIZUJEMY WSZYSTKIE SKRYPTY DLA NOWO ZAŁADOWANEJ TREŚCI
        initDynamicContent();
      })
      .catch(error => {
        projectViewer.innerHTML = `<p class="error-msg">${error.message}. Nie można załadować projektu.</p>`;
        projectViewer.classList.remove('hidden');
        console.error('Błąd ładowania projektu:', error);
      });
  };

  // Nasłuchiwanie na kliknięcia w karuzeli
  carouselItems.forEach(item => {
    item.addEventListener('click', (event) => {
      // Usuń klasę 'active' ze wszystkich elementów i dodaj do klikniętego
      carouselItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      // Załaduj projekt z atrybutu data-project
      const projectFile = item.dataset.project;
      loadProject(projectFile);
    });
  });

  // Zamknięcie widoku projektu
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
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
  }
});

// ======================================================
// WAŻNE: TA FUNKCJA MUSI BYĆ WYWOŁANA PO KAŻDYM ZAŁADOWANIU DYNAMICZNEJ TREŚCI
// ======================================================
function initDynamicContent() {
  // === Akordeon dla Case Study (kwcs-accordion) ===
  const kwcsItems = document.querySelectorAll(".kwcs-item");
  console.log("Inicjalizuję akordeony. Znaleziono elementów:", kwcsItems.length);

  kwcsItems.forEach(item => {
    const header = item.querySelector(".kwcs-header");
    const content = item.querySelector(".kwcs-content");

    if (header && content) {
      header.addEventListener("click", () => {
        kwcsItems.forEach(i => {
          if (i !== item) {
            i.classList.remove("active");
            i.querySelector(".kwcs-content").style.maxHeight = null;
          }
        });

        item.classList.toggle("active");
        if (item.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = null;
        }
      });
    }
  });
 
  // Tutaj można dodać inne skrypty, które są potrzebne dla dynamicznie ładowanych projektów
  // np. Lightbox, galerii, itp.
}

/* Akordeon dla .kwcs-accordion  -----------------------------------------
   Działa dla markup:
   .kwcs-accordion
     .kwcs-item
       button.kwcs-header > .icon (+/-)
       .kwcs-content (ukryta na start)
------------------------------------------------------------------------- */

(function initKWAccordion(){
  // Szukamy wszystkich akordeonów na stronie
  const accordions = document.querySelectorAll('.kwcs-accordion');
  if (!accordions.length) return;

  accordions.forEach(acc => {
    // unikamy podwójnego bindowania
    if (acc.__bound) return;
    acc.__bound = true;

    acc.addEventListener('click', (e) => {
      const header = e.target.closest('.kwcs-header');
      if (!header || !acc.contains(header)) return;

      const item = header.closest('.kwcs-item');
      const content = item.querySelector('.kwcs-content');
      const icon = header.querySelector('.icon');

      const isOpen = item.classList.toggle('open');
      if (isOpen) {
        // płynne rozwinięcie – ustawiamy max-height na realną wysokość
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '–';
      } else {
        // zwijanie
        content.style.maxHeight = '';
        if (icon) icon.textContent = '+';
      }
    });

    // (opcjonalnie) zamknij inne po otwarciu jednego
    // acc.addEventListener('click', (e) => { ... })

    // Inicjalny stan: wszystko zamknięte (upewniamy się)
    acc.querySelectorAll('.kwcs-item').forEach(item => {
      const content = item.querySelector('.kwcs-content');
      const icon = item.querySelector('.kwcs-header .icon');
      item.classList.remove('open');
      if (content) content.style.maxHeight = '';
      if (icon) icon.textContent = '+';
    });
  });
})();

