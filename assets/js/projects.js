// ========================================
// ACCORDION FUNCTIONALITY
// ========================================

function initAccordion() {
  const accordionItems = document.querySelectorAll('.kwcs-item');

  if (accordionItems.length === 0) {
    console.warn('⚠️ Nie znaleziono elementów .kwcs-item');
    return;
  }

  accordionItems.forEach((item, index) => {
    const header = item.querySelector('.kwcs-header');
    const content = item.querySelector('.kwcs-content');
    const icon = item.querySelector('.icon');

    if (!header || !content) return;

    // Dodaj ID jeśli nie ma (dla ARIA)
    if (!header.id) header.id = `accordion-header-${index}`;
    if (!content.id) content.id = `accordion-content-${index}`;

    // Ustaw ARIA attributes
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', content.id);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', header.id);

    // Click handler
    const toggleAccordion = () => {
      const wasOpen = item.classList.contains('open');

      // Zamknij wszystkie inne
      accordionItems.forEach(otherItem => {
        const otherHeader = otherItem.querySelector('.kwcs-header');
        const otherIcon = otherItem.querySelector('.icon');
        
        otherItem.classList.remove('open');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // Otwórz kliknięty, jeśli był zamknięty
      if (!wasOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '−';
      }
    };

    // Event listeners
    header.addEventListener('click', toggleAccordion);

    // Keyboard support (Enter i Space)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });

  console.log('✅ Akordeon zainicjalizowany:', accordionItems.length, 'elementów (z ARIA)');
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  
  if (!lightbox || !lightboxImg || !closeBtn) {
    console.warn('⚠️ Nie znaleziono elementów lightboxa');
    return;
  }
  
  // Pobierz wszystkie obrazy w galeriach + hero image
  const galleryImages = document.querySelectorAll('.kwcs-gallery-grid img, .hero-image img.cover');
  
  if (galleryImages.length === 0) {
    console.warn('⚠️ Nie znaleziono obrazów do lightboxa');
    return;
  }
  
  // Funkcja otwierania lightboxa
  const openLightbox = (imgElement) => {
    lightbox.classList.add('active');
    lightboxImg.src = imgElement.src;
    lightboxCaption.textContent = imgElement.alt || '';
    document.body.classList.add('lightbox-open');
    
    // Focus na przycisk zamknięcia (accessibility)
    setTimeout(() => closeBtn.focus(), 100);
  };
  
  // Funkcja zamykania lightboxa
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    lightboxImg.src = '';
  };
  
  // Dodaj event listener do każdego obrazu
  galleryImages.forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
    
    // Keyboard support dla obrazów (Enter/Space)
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });
  
  // Zamknij lightbox po kliknięciu X
  closeBtn.addEventListener('click', closeLightbox);
  
  // Keyboard support dla przycisku zamknięcia
  closeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeLightbox();
    }
  });
  
  // Zamknij lightbox po kliknięciu poza obrazem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Zamknij lightbox klawiszem ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  console.log('✅ Lightbox zainicjalizowany:', galleryImages.length, 'obrazów');
}

// ========================================
// INITIALIZATION
// ========================================

// Bezpieczne uruchomienie po załadowaniu DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initLightbox();
  });
} else {
  initAccordion();
  initLightbox();
}
