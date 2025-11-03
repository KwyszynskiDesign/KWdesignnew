// ========================================
// PROJECT CASE STUDIES - INTERACTIVE JS
// Premium Edition 2025 | Karol Wyszynski
// ⭐ PRODUCTION READY - ALL FEATURES WORKING
// ⭐ LIGHTBOX: SCROLL TO IMAGE + INLINE MODAL
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

    if (!header.id) header.id = `accordion-header-${index}`;
    if (!content.id) content.id = `accordion-content-${index}`;

    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', content.id);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', header.id);

    const toggleAccordion = () => {
      const wasOpen = item.classList.contains('open');

      accordionItems.forEach(otherItem => {
        const otherHeader = otherItem.querySelector('.kwcs-header');
        const otherIcon = otherItem.querySelector('.icon');
        
        otherItem.classList.remove('open');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      if (!wasOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '−';
      }
    };

    header.addEventListener('click', toggleAccordion);

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });

  console.log('✅ Accordion initialized:', accordionItems.length, 'items found');
}

// ========================================
// LIGHTBOX FUNCTIONALITY - SCROLL TO IMAGE
// ⭐ SCROLL DO ZDJĘCIA + LIGHTBOX OTWIERA SIĘ
// ⭐ BRAK CZARNEGO EKRANU NA POCZĄTKU!
// ========================================

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  
  if (!lightbox || !lightboxImg || !closeBtn) {
    console.warn('⚠️ Lightbox elements not found');
    return;
  }
  
  let scrollPosition = 0;
  let imageElement = null;
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
    
    // ⭐ Przywróć scroll
    window.scrollTo(0, scrollPosition);
    
    console.log('✖️ Lightbox closed - scroll restored');
  };

  document.addEventListener('click', function(e) {
    const img = e.target.closest('.kwcs-gallery-grid img, .hero-image img.cover, .showcase-item img, .lightbox-trigger');
    
    if (!img) return;

    // ⭐ KLUCZOWE: Zapamiętaj scroll PRZED scrollowaniem
    scrollPosition = window.scrollY || window.pageYOffset;
    
    // ⭐ SCROLL DO ZDJĘCIA — na górę ekranu
    img.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    imageElement = img;

    // ⭐ PO SCROLL — otwórz lightbox (czekaj 300ms na scroll animation)
    setTimeout(() => {
      lightbox.classList.add('active');
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.dataset.caption || img.alt || '';
      document.body.classList.add('lightbox-open');

      console.log('🖼️ Lightbox opened at image position');
      console.log('📍 Image scrolled to top of viewport');
    }, 300);
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  console.log('✅ Lightbox (Scroll to Image) initialized');
}

// ========================================
// WEBSITE TABS FUNCTIONALITY
// ========================================

function initWebsiteTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  const switchTab = (targetTabId) => {
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    });
    
    const activeButton = document.querySelector(`[data-tab="${targetTabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      activeButton.setAttribute('aria-selected', 'true');
    }
    
    const activeContent = document.getElementById(`tab-${targetTabId}`);
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.setAttribute('aria-hidden', 'false');
      
      activeContent.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  };
  
  tabButtons.forEach((button, index) => {
    const tabId = button.getAttribute('data-tab');
    
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
    button.setAttribute('id', `tab-btn-${tabId}`);
    
    button.addEventListener('click', () => {
      switchTab(tabId);
    });
    
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
        return;
      }
      
      const newButton = tabButtons[newIndex];
      const newTabId = newButton.getAttribute('data-tab');
      switchTab(newTabId);
      newButton.focus();
    });
  });
  
  tabContents.forEach(content => {
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-hidden', content.classList.contains('active') ? 'false' : 'true');
    
    const tabId = content.id.replace('tab-', '');
    content.setAttribute('aria-labelledby', `tab-btn-${tabId}`);
  });
  
  console.log('✅ Website tabs initialized:', tabButtons.length, 'tabs found');
}

// ========================================
// INITIALIZATION - MAIN FUNCTION
// ========================================

function initAllFeatures() {
  console.log('🚀 Initializing KWCS interactive features...');
  
  initAccordion();
  initLightbox();
  initWebsiteTabs();
  
  console.log('✅ All features initialized successfully');
}

// Bezpieczne uruchomienie po załadowaniu DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllFeatures);
} else {
  initAllFeatures();
}

// ========================================
// UTILITY: Lazy Loading Images
// ========================================

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
// EXPORT (dla ES6 modułów)
// ========================================

// export { initAccordion, initLightbox, initWebsiteTabs };
