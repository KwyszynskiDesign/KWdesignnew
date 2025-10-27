document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfolio.js załadowany');
  
  // === 1. ROK W FOOTERZE ===
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // === 2. HAMBURGER MENU ===
  const burger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // === 3. MAPPING PROJEKTÓW (GRID) ===
  const projectPages = {
    'voucher-magdy': 'projects/voucher-salon-magdy.html',
    'karoma': 'projects/karoma.html',
    'power-of-mind': 'projects/power-of-mind.html',
    'sir-roger': 'projects/realizacja-1.html',
    'marka-e': 'projects/realizacja-2.html',
    'marka-f': 'projects/realizacja-3.html'
  };

  // === 4. FUNKCJA ŁADOWANIA PROJEKTU (GRID) ===
  window.showProjectDetails = async function(projectId) {
    console.log('🔍 Ładowanie projektu:', projectId);
    
    const container = document.getElementById('project-details-container');
    const content = document.getElementById('project-details-content');
    const filename = projectPages[projectId];
    
    if (!filename) {
      console.error('❌ Nie znaleziono pliku dla projektu:', projectId);
      return;
    }
    
    console.log('📂 Próba załadowania:', filename);
    
    try {
      // Pokaż loader
      content.innerHTML = '<div class="loading-spinner">Ładowanie projektu...</div>';
      container.style.display = 'block';
      
      // Fetch pełnej strony HTML
      const response = await fetch(filename, { cache: 'no-store' });
      
      console.log('📡 Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Parsuj HTML i wyciągnij <body>
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bodyContent = doc.body.innerHTML;
      
      // Wstaw zawartość
      content.innerHTML = bodyContent;
      
      console.log('✅ Projekt załadowany pomyślnie');
      
      // Smooth scroll do szczegółów
      setTimeout(() => {
        container.classList.add('active');
        container.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 50);
      
      // Highlight aktywnej karty
      document.querySelectorAll('.portfolio-new-card').forEach(card => {
        card.classList.remove('active');
      });
      document.querySelector(`[data-project="${projectId}"]`)?.classList.add('active');
      
      // Update URL
      history.pushState({ project: projectId }, '', `#${projectId}`);
      
      // Wykonaj skrypty ze załadowanej strony
      executeScriptsInContent(content);
      
    } catch (error) {
      console.error('❌ Błąd ładowania projektu:', error);
      content.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Nie udało się załadować projektu</h3>
          <p>Sprawdź konsolę dla szczegółów błędu.</p>
          <p><strong>Plik:</strong> ${filename}</p>
          <p><a href="${filename}" target="_blank">Otwórz w nowej karcie</a></p>
        </div>
      `;
    }
  };

  // === 5. WYKONAJ SKRYPTY ZE ZAŁADOWANEJ STRONY ===
  function executeScriptsInContent(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  // === 6. FUNKCJA ZAMYKAJĄCA SZCZEGÓŁY ===
  window.closeProjectDetails = function() {
    const container = document.getElementById('project-details-container');
    
    container.classList.remove('active');
    
    setTimeout(() => {
      container.style.display = 'none';
      document.getElementById('project-details-content').innerHTML = '';
      
      document.querySelector('.portfolio-new-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300);
    
    document.querySelectorAll('.portfolio-new-card').forEach(card => {
      card.classList.remove('active');
    });
    
    history.pushState('', document.title, window.location.pathname);
  };

  // === 7. NAPRAWIONE EVENT LISTENERS DLA KART ===
  const cards = document.querySelectorAll('.portfolio-new-card');
  console.log('📦 Znaleziono kart:', cards.length);
  
  cards.forEach(card => {
    // Dodaj accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    const projectId = card.getAttribute('data-project');
    console.log('🏷️ Karta:', projectId);
    
    // Event listener dla kliknięcia
    card.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const id = this.getAttribute('data-project');
      
      if (id) {
        console.log('🎯 Kliknięto:', id);
        showProjectDetails(id);
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

  // === 8. ESC KEY ===
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const container = document.getElementById('project-details-container');
      if (container && container.style.display === 'block') {
        closeProjectDetails();
      }
    }
  });

  // === 9. CAROUSEL (jeśli istnieje) ===
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

    // Event listener dla karuzeli
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item[data-project]');
      if (!item) return;
      const file = item.getAttribute('data-project');
      if (file) {
        showProjectDetails(file.replace('.html', '')); // Usuń .html jeśli jest
      }
    });
  }

  // === 10. WIZUALIZACJE NAV LINK ===
  const vizLink = document.getElementById('nav-wizualizacje');
  if (vizLink) {
    vizLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Tutaj możesz dodać ładowanie wizualizacji
      console.log('🖼️ Kliknięto Wizualizacje');
      window.location.href = 'projects/wizualizacje.html';
    });
  }

  // === 11. DEEP LINKING - załaduj projekt z URL hash ===
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    console.log('🔗 Deep link:', hash);
    
    if (projectPages[hash]) {
      setTimeout(() => {
        showProjectDetails(hash);
      }, 500);
    }
  }

  console.log('✅ Portfolio.js zainicjalizowany');
});
