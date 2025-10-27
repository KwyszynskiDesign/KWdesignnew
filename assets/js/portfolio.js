/* ========================================
   PORTFOLIO.JS - PREMIUM EDITION 2025
   Dynamic project loading with full functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfolio.js załadowany');
  
  // ========================================
  // 1. YEAR IN FOOTER
  // ========================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========================================
  // 2. HAMBURGER MENU
  // ========================================
  const burger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  
  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // ========================================
  // 3. PROJECT MAPPING
  // ========================================
  const projectPages = {
    'voucher-magdy': 'projects/voucher-salon-magdy.html',
    'karoma': 'projects/karoma.html',
    'power-of-mind': 'projects/power-of-mind.html',
    'sir-roger': 'projects/realizacja-1.html',
    'marka-e': 'projects/realizacja-2.html',
    'marka-f': 'projects/realizacja-3.html'
  };

  // ========================================
  // 4. LOAD PROJECT FUNCTION - NAPRAWIONA
  // ========================================
  window.showProjectDetails = async function(projectId) {
    console.log('🎯 Ładowanie projektu:', projectId);
    
    const container = document.getElementById('project-details-container');
    const content = document.getElementById('project-details-content');
    const filename = projectPages[projectId];
    
    if (!container || !content) {
      console.error('❌ Brak kontenera projektu w DOM');
      return;
    }
    
    if (!filename) {
      console.error('❌ Nie znaleziono pliku dla projektu:', projectId);
      content.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Projekt nie został znaleziony</h3>
          <p>ID projektu: <code>${projectId}</code></p>
        </div>`;
      return;
    }
    
    console.log('📂 Ładowanie pliku:', filename);
    
    try {
      // Loading state
      content.innerHTML = '<div class="loading-spinner">Ładowanie projektu...</div>';
      container.style.display = 'block';
      container.classList.add('active');
      
      // Fetch project HTML
      const response = await fetch(filename, { 
        cache: 'no-store',
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('📡 HTTP Status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Parse HTML and extract body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bodyContent = doc.body.innerHTML;
      
      // Insert content
      content.innerHTML = bodyContent;
      
      console.log('✅ Projekt załadowany pomyślnie');
      
      // ✅ KLUCZOWA ZMIANA: Inicjalizuj skrypty projektu
      initializeProjectScripts();
      
      // Smooth scroll to project
      setTimeout(() => {
        container.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
      
      // Highlight active card
      document.querySelectorAll('.portfolio-new-card').forEach(card => {
        card.classList.remove('active');
      });
      const activeCard = document.querySelector(`[data-project="${projectId}"]`);
      if (activeCard) {
        activeCard.classList.add('active');
      }
      
      // Update URL
      history.pushState({ project: projectId }, '', `#${projectId}`);
      
    } catch (error) {
      console.error('❌ Błąd ładowania projektu:', error);
      content.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Nie udało się załadować projektu</h3>
          <p><strong>Plik:</strong> <code>${filename}</code></p>
          <p><strong>Błąd:</strong> ${error.message}</p>
          <p><a href="${filename}" target="_blank" rel="noopener">Otwórz projekt w nowej karcie →</a></p>
        </div>
      `;
      container.classList.add('active');
    }
  };

  // ========================================
  // 5. INICJALIZACJA SKRYPTÓW PROJEKTU - NOWA FUNKCJA
  // ========================================
  function initializeProjectScripts() {
    console.log('🔧 Inicjalizacja skryptów projektu...');
    
    // === LIGHTBOX ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (lightbox && lightboxImg) {
      console.log('✅ Lightbox znaleziony, inicjalizacja...');
      
      // Remove old event listeners (if any)
      const newLightbox = lightbox.cloneNode(true);
      lightbox.parentNode.replaceChild(newLightbox, lightbox);
      
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      const lbCaption = document.getElementById('lightbox-caption');
      const lbClose = document.querySelector('.lightbox-close');
      
      // Open lightbox on image click
      document.querySelectorAll('.kwcs-gallery-grid img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
          lb.classList.add('active');
          lbImg.src = this.src;
          lbCaption.textContent = this.alt || '';
          document.body.classList.add('lightbox-open');
          console.log('🖼️ Lightbox otwarty:', this.alt);
        });
      });
      
      // Close lightbox
      const closeLightbox = () => {
        lb.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        console.log('❌ Lightbox zamknięty');
      };
      
      if (lbClose) {
        lbClose.addEventListener('click', closeLightbox);
      }
      
      lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('active')) {
          closeLightbox();
        }
      });
      
      console.log('✅ Lightbox zainicjalizowany');
    }
    
    // === ACCORDION ===
    const accordionHeaders = document.querySelectorAll('.kwcs-header');
    
    if (accordionHeaders.length > 0) {
      console.log('✅ Accordion znaleziony, inicjalizacja...');
      
      accordionHeaders.forEach(header => {
        // Remove old listeners
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
      });
      
      // Re-attach listeners
      document.querySelectorAll('.kwcs-header').forEach(header => {
        header.addEventListener('click', function() {
          const item = this.parentElement;
          const content = item.querySelector('.kwcs-content');
          const isOpen = item.classList.contains('open');
          
          // Close all items
          document.querySelectorAll('.kwcs-item').forEach(i => {
            i.classList.remove('open');
            const c = i.querySelector('.kwcs-content');
            if (c) c.style.maxHeight = '0';
          });
          
          // Open clicked item if it was closed
          if (!isOpen && content) {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
            console.log('📂 Accordion otwarty:', this.textContent.trim());
          }
        });
      });
      
      console.log('✅ Accordion zainicjalizowany');
    }
    
    console.log('✅ Wszystkie skrypty projektu zainicjalizowane');
  }

  // ========================================
  // 6. CLOSE PROJECT DETAILS
  // ========================================
  window.closeProjectDetails = function() {
    console.log('❌ Zamykanie projektu...');
    
    const container = document.getElementById('project-details-container');
    
    if (!container) return;
    
    container.classList.remove('active');
    
    setTimeout(() => {
      container.style.display = 'none';
      document.getElementById('project-details-content').innerHTML = '';
      
      // Scroll back to grid
      const grid = document.querySelector('.portfolio-new-grid');
      if (grid) {
        grid.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
    
    // Remove active class from cards
    document.querySelectorAll('.portfolio-new-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Update URL
    history.pushState('', document.title, window.location.pathname);
    
    console.log('✅ Projekt zamknięty');
  };

  // ========================================
  // 7. PROJECT CARDS EVENT LISTENERS
  // ========================================
  const cards = document.querySelectorAll('.portfolio-new-card');
  console.log('📦 Znaleziono kart:', cards.length);
  
  cards.forEach(card => {
    // Accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    const projectId = card.getAttribute('data-project');
    console.log('🏷️ Karta zarejestrowana:', projectId);
    
    // Click event
    card.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const id = this.getAttribute('data-project');
      
      if (id) {
        console.log('🎯 Kliknięto kartę:', id);
        showProjectDetails(id);
      } else {
        console.error('❌ Brak data-project na karcie');
      }
    });
    
    // Keyboard accessibility
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ========================================
  // 8. ESCAPE KEY HANDLER
  // ========================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const container = document.getElementById('project-details-container');
      if (container && container.classList.contains('active')) {
        closeProjectDetails();
      }
    }
  });

  // ========================================
  // 9. CAROUSEL (optional)
  // ========================================
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');

  if (track && prevBtn && nextBtn) {
    console.log('🎠 Karuzela znaleziona');
    
    const VISIBLE_COUNT = 3;

    function getItemWidth() {
      const firstItem = track.querySelector('.carousel-item');
      if (!firstItem) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return firstItem.offsetWidth + gap;
    }

    function updateArrows() {
      const buffer = 2;
      const maxScroll = track.scrollWidth - track.clientWidth - buffer;
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    function scrollByItems(count) {
      track.scrollBy({ left: getItemWidth() * count, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => scrollByItems(-VISIBLE_COUNT));
    nextBtn.addEventListener('click', () => scrollByItems(VISIBLE_COUNT));

    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    updateArrows();

    // Carousel item click
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item[data-project]');
      if (!item) return;
      
      const projectId = item.getAttribute('data-project');
      if (projectId) {
        showProjectDetails(projectId.replace('.html', ''));
      }
    });
  }

  // ========================================
  // 10. WIZUALIZACJE NAV LINK
  // ========================================
  const vizLink = document.getElementById('nav-wizualizacje');
  if (vizLink) {
    vizLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🖼️ Kliknięto Wizualizacje');
      window.location.href = 'projects/wizualizacje.html';
    });
  }

  // ========================================
  // 11. DEEP LINKING - Load project from URL hash
  // ========================================
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    console.log('🔗 Deep link wykryty:', hash);
    
    if (projectPages[hash]) {
      setTimeout(() => {
        showProjectDetails(hash);
      }, 500);
    }
  }

  // ========================================
  // 12. BROWSER BACK/FORWARD NAVIGATION
  // ========================================
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.project) {
      showProjectDetails(event.state.project);
    } else {
      closeProjectDetails();
    }
  });

  console.log('✅ Portfolio.js w pełni zainicjalizowany');
});
