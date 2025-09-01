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

 // === KWCS Accordion ===
const items = document.querySelectorAll(".kwcs-item");
console.log("Znaleziono elementów akordeonu:", items.length);

items.forEach(item => {
  const header = item.querySelector(".kwcs-header");
  const content = item.querySelector(".kwcs-content");

  header.addEventListener("click", () => {
    // zamykanie innych, jeśli chcesz tylko jeden otwarty
    items.forEach(i => {
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
});

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
});
