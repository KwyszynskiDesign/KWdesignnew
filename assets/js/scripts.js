/*
 * JavaScript interactions for the one-page portfolio.
 *
 * Features implemented:
 *   - Mobile navigation toggle via hamburger icon
 *   - Closing mobile menu when a navigation link is clicked
 *   - Filtering portfolio items by category
 *   - Simple testimonials slider with previous/next buttons
 *   - FAQ accordions toggling open/closed
 *   - Contact form submission using Fetch to Google Apps Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggling
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
    // Close menu on navigation link click
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
      // Update active state
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      // Show/hide items
      portfolioItems.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Testimonials slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentSlide = 0;
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
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
      // Replace with your Google Apps Script deployment URL
      const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      fetch(scriptURL, {
        method: 'POST',
        body: new FormData(contactForm),
      })
        .then((response) => {
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