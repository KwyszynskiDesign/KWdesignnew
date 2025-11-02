// ========================================
// PROJECT CASE STUDIES - INTERACTIVE JS
// Premium Edition 2025 | Karol Wyszynski
// ========================================

'use strict';

// ========================================
// ACCORDION FUNCTIONALITY
// ========================================

function initAccordion() {
  const accordionItems = document.querySelectorAll('.kwcs-item');

  if (accordionItems.length === 0) return;

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
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  
  if (!lightbox || !lightboxImg || !closeBtn) return;
  
  // Pobierz wszystkie obrazy w galeriach + hero image + website mockups
  const galleryImages = document.querySelectorAll(
    '.kwcs-gallery-grid img, .hero-image img.cover, .website-mockup img, .website-fullwidth img'
  );
  
  if (galleryImages.length === 0) return;
  
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
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Kliknij, aby powiększyć obraz');
    
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
}

// ========================================
// WEBSITE TABS FUNCTIONALITY - NOWE!
// ========================================

function initWebsiteTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Jeśli nie ma tabów na stronie, wyjdź
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  // Funkcja przełączania tabów
  const switchTab = (targetTabId) => {
    // Usuń klasę active ze wszystkich przycisków
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    // Ukryj wszystkie zawartości
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    });
    
    // Znajdź i aktywuj wybrany przycisk
    const activeButton = document.querySelector(`[data-tab="${targetTabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      activeButton.setAttribute('aria-selected', 'true');
    }
    
    // Znajdź i pokaż wybraną zawartość
    const activeContent = document.getElementById(`tab-${targetTabId}`);
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.setAttribute('aria-hidden', 'false');
      
      // Smooth scroll do tabów (opcjonalne)
      activeContent.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  };
  
  // Dodaj ARIA attributes do przycisków
  tabButtons.forEach((button, index) => {
    const tabId = button.getAttribute('data-tab');
    
    // ARIA setup
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
    button.setAttribute('id', `tab-btn-${tabId}`);
    
    // Click handler
    button.addEventListener('click', () => {
      switchTab(tabId);
    });
    
    // Keyboard navigation (strzałki lewo/prawo)
    button.addEventListener('keydown', (e) => {
      let newIndex = index;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabButtons.length - 1;
      } else {
        return; // Inne klawisze - nie rób nic
      }
      
      // Przełącz na nowy tab i ustaw focus
      const newButton = tabButtons[newIndex];
      const newTabId = newButton.getAttribute('data-tab');
      switchTab(newTabId);
      newButton.focus();
    });
  });
  
  // Setup ARIA dla contentu
  tabContents.forEach(content => {
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-hidden', content.classList.contains('active') ? 'false' : 'true');
    
    const tabId = content.id.replace('tab-', '');
    content.setAttribute('aria-labelledby', `tab-btn-${tabId}`);
  });
  
  console.log('✅ Website tabs initialized:', tabButtons.length, 'tabs found');
}

// ========================================
// INITIALIZATION
// ========================================

function initAllFeatures() {
  console.log('🚀 Initializing KWCS interactive features...');
  
  initAccordion();
  initLightbox();
  initWebsiteTabs(); // NOWA FUNKCJA!
  
  console.log('✅ All features initialized successfully');
}

// Bezpieczne uruchomienie po załadowaniu DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllFeatures);
} else {
  // DOM już załadowany
  initAllFeatures();
}

// ========================================
// UTILITY: Lazy Loading Images (opcjonalne)
// ========================================

// Możesz dodać lazy loading dla obrazów w przyszłości
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// EXPORT (jeśli używasz modułów ES6)
// ========================================

// export { initAccordion, initLightbox, initWebsiteTabs };
