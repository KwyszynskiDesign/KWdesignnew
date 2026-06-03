document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const burger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  const projectPages = {
    'voucher-magdy': 'projects/voucher-salon-magdy.html',
    'karoma': 'projects/karoma.html',
    'power-of-mind': 'projects/power-of-mind.html',
    'KW-Design': 'projects/KW-Design.html',
    'sir-roger': 'projects/sir-roger.html',
    'savage': 'projects/savage.html',
    'RazDwa': 'projects/razdwa_aplikacja.html',
     'cyfradruk' : 'projects/cyfradruk.html',
  };

  window.showProjectDetails = async function(projectId) {
    const container = document.getElementById('project-details-container');
    const content = document.getElementById('project-details-content');
    const filename = projectPages[projectId];

    if (!container || !content) return;

    if (!filename) {
      content.innerHTML = `
        <div class="error-message">
          <h3>Projekt nie został znaleziony</h3>
        </div>`;
      return;
    }

    try {
      content.innerHTML = '<div class="loading-spinner">Ładowanie projektu...</div>';
      container.style.display = 'block';
      container.classList.add('active');

      const response = await fetch(filename, {
        cache: 'no-store',
        headers: { 'Accept': 'text/html' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      content.innerHTML = doc.body.innerHTML;

      initializeProjectScripts();

      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      document.querySelectorAll('.portfolio-new-card').forEach(card => {
        card.classList.remove('active');
      });
      const activeCard = document.querySelector(`[data-project="${projectId}"]`);
      if (activeCard) {
        activeCard.classList.add('active');
      }

      history.pushState({ project: projectId }, '', `#${projectId}`);

    } catch (error) {
      content.innerHTML = `
        <div class="error-message">
          <h3>Nie udało się załadować projektu</h3>
          <p><a href="${filename}" target="_blank" rel="noopener">Otwórz projekt w nowej karcie →</a></p>
        </div>
      `;
      container.classList.add('active');
    }
  };

  function initializeProjectScripts() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
      const newLightbox = lightbox.cloneNode(true);
      lightbox.parentNode.replaceChild(newLightbox, lightbox);

      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      const lbCaption = document.getElementById('lightbox-caption');
      const lbClose = document.querySelector('.lightbox-close');

      document.querySelectorAll('.kwcs-gallery-grid img, img.lightbox-trigger').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
          lb.classList.add('active');
          lbImg.src = this.src;
          if (lbCaption) lbCaption.textContent = this.dataset.caption || this.alt || '';
          document.body.classList.add('lightbox-open');
        });
      });

      const closeLightbox = () => {
        lb.classList.remove('active');
        document.body.classList.remove('lightbox-open');
      };

      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('active')) closeLightbox();
      });
    }

    const accordionHeaders = document.querySelectorAll('.kwcs-header');
    if (accordionHeaders.length > 0) {
      accordionHeaders.forEach(header => {
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
      });

      document.querySelectorAll('.kwcs-header').forEach(header => {
        header.addEventListener('click', function() {
          const item = this.parentElement;
          const content = item.querySelector('.kwcs-content');
          const isOpen = item.classList.contains('open');

          document.querySelectorAll('.kwcs-item').forEach(i => {
            i.classList.remove('open');
            const c = i.querySelector('.kwcs-content');
            if (c) c.style.maxHeight = '0';
          });

          if (!isOpen && content) {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    }
  }

  window.closeProjectDetails = function() {
    const container = document.getElementById('project-details-container');
    if (!container) return;

    container.classList.remove('active');

    setTimeout(() => {
      container.style.display = 'none';
      document.getElementById('project-details-content').innerHTML = '';

      const grid = document.querySelector('.portfolio-new-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

    document.querySelectorAll('.portfolio-new-card').forEach(card => {
      card.classList.remove('active');
    });

    history.pushState('', document.title, window.location.pathname);
  };

  const cards = document.querySelectorAll('.portfolio-new-card');

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const id = this.getAttribute('data-project');
      if (id) showProjectDetails(id);
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const container = document.getElementById('project-details-container');
      if (container && container.classList.contains('active')) {
        closeProjectDetails();
      }
    }
  });

  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');

  if (track && prevBtn && nextBtn) {
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

    track.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item[data-project]');
      if (!item) return;
      const projectId = item.getAttribute('data-project');
      if (projectId) showProjectDetails(projectId.replace('.html', ''));
    });
  }

  const vizLink = document.getElementById('nav-wizualizacje');
  if (vizLink) {
    vizLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'projects/wizualizacje.html';
    });
  }

  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (projectPages[hash]) {
      setTimeout(() => showProjectDetails(hash), 500);
    }
  }

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.project) {
      showProjectDetails(event.state.project);
    } else {
      closeProjectDetails();
    }
  });
});
