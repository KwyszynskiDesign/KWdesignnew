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

  // Kolejność i etykiety projektów dla pływającej nawigacji
  const projectOrder = ['RazDwa', 'karoma', 'power-of-mind', 'cyfradruk', 'KW-Design', 'sir-roger', 'savage', 'voucher-magdy'];
  const projectLabels = {
    'voucher-magdy': 'Voucher Salon u Magdy',
    'karoma': 'Karoma',
    'power-of-mind': 'Power of Mind',
    'KW-Design': 'KW Design',
    'sir-roger': 'Sir Roger',
    'savage': 'Savage',
    'RazDwa': 'Raz Dwa Druk',
    'cyfradruk': 'CyfraDruk'
  };

  function getAdjacentProjects(currentId) {
    const idx = projectOrder.indexOf(currentId);
    if (idx === -1) return { prev: null, next: null };
    const len = projectOrder.length;
    return {
      prev: projectOrder[(idx - 1 + len) % len],
      next: projectOrder[(idx + 1) % len]
    };
  }

  function renderProjectNavigation(currentId) {
    const existing = document.getElementById('project-floating-nav');
    if (existing) existing.remove();

    const { prev, next } = getAdjacentProjects(currentId);
    if (!prev && !next) return;

    const nav = document.createElement('div');
    nav.id = 'project-floating-nav';
    nav.setAttribute('aria-label', 'Nawigacja między projektami');

    nav.innerHTML = `
      ${prev ? `
        <button class="pfn-btn pfn-prev" data-target="${prev}" aria-label="Poprzedni projekt: ${projectLabels[prev]}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span class="pfn-label">
            <small>Poprzedni</small>
            <strong>${projectLabels[prev]}</strong>
          </span>
        </button>
      ` : ''}
      ${next ? `
        <button class="pfn-btn pfn-next" data-target="${next}" aria-label="Następny projekt: ${projectLabels[next]}">
          <span class="pfn-label">
            <small>Następny</small>
            <strong>${projectLabels[next]}</strong>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      ` : ''}
    `;
    document.body.appendChild(nav);

    nav.querySelectorAll('.pfn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && window.showProjectDetails) {
          window.showProjectDetails(target);
        }
      });
    });
  }

  function removeProjectNavigation() {
    const existing = document.getElementById('project-floating-nav');
    if (existing) existing.remove();
  }

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

      document.querySelectorAll('.portfolio-new-card, .nc-card[data-project]').forEach(card => {
        card.classList.remove('active');
      });
      const activeCard = document.querySelector(`[data-project="${projectId}"]`);
      if (activeCard) {
        activeCard.classList.add('active');
      }

      history.pushState({ project: projectId }, '', `#${projectId}`);

      // Renderuj pływającą nawigację Poprzedni/Następny
      renderProjectNavigation(projectId);

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

    initializeChapterRail();

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

  function removeChapterRail() {
    // Usuwaj tylko rail przeniesiony do body w poprzednim cyklu —
    // świeżo wstrzyknięty rail w #project-details-content zostaje
    document.querySelectorAll('body > #razdwa-chapter-rail').forEach(el => el.remove());
    if (window.__razdwaRailObserver) {
      window.__razdwaRailObserver.disconnect();
      window.__razdwaRailObserver = null;
    }
  }

  function initializeChapterRail() {
    // Sprzątanie po poprzednim projekcie / przeładowaniu
    removeChapterRail();

    const rail = document.getElementById('razdwa-chapter-rail');
    if (!rail) return;

    // .project-details-container ma transform → tworzy containing block
    // dla position:fixed. Przenosimy rail do body, żeby pozostał przyklejony
    // do viewportu podczas scrollowania całego case study.
    document.body.appendChild(rail);

    const links = Array.from(rail.querySelectorAll('.razdwa-chapter-link'));
    if (!links.length) return;

    const getTargetId = (link) =>
      link.dataset.railTarget || (link.getAttribute('href') || '').replace('#', '');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = getTargetId(link);
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });

    const targets = links
      .map(link => document.getElementById(getTargetId(link)))
      .filter(Boolean);

    if ('IntersectionObserver' in window && targets.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('is-active', getTargetId(l) === id);
          });
        });
      }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      });
      targets.forEach(t => observer.observe(t));
      window.__razdwaRailObserver = observer;
    }
  }

  function showNcOverlay(card, projectId) {
    closeNcOverlay();

    const cardNumClass = Array.from(card.classList).find(c => /^nc-card-\d+$/.test(c)) || '';
    const contentEl = card.querySelector('.nc-content');

    const overlay = document.createElement('div');
    overlay.className = 'nc-overlay';
    overlay.id = 'nc-overlay';

    overlay.innerHTML = `
      <div class="nc-overlay-inner">
        <div class="nc-card ${cardNumClass} nc-overlay-card">
          <div class="nc-bg"></div>
          <div class="nc-particles">
            <span class="nc-particle"></span>
            <span class="nc-particle"></span>
            <span class="nc-particle"></span>
            <span class="nc-particle"></span>
            <span class="nc-particle"></span>
          </div>
          <div class="nc-glow"></div>
          ${contentEl ? contentEl.outerHTML : ''}
        </div>
        <button class="nc-overlay-cta" id="nc-overlay-cta">
          Zobacz projekt
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="nc-overlay-close" aria-label="Zamknij">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('nc-overlay-open');

    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.querySelector('#nc-overlay-cta').addEventListener('click', () => {
      closeNcOverlay();
      showProjectDetails(projectId);
    });

    overlay.querySelector('.nc-overlay-close').addEventListener('click', closeNcOverlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeNcOverlay();
    });
  }

  function closeNcOverlay() {
    const overlay = document.getElementById('nc-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.classList.remove('nc-overlay-open');
    setTimeout(() => overlay.remove(), 300);
  }

  window.closeProjectDetails = function() {
    const container = document.getElementById('project-details-container');
    if (!container) return;

    container.classList.remove('active');

    setTimeout(() => {
      container.style.display = 'none';
      document.getElementById('project-details-content').innerHTML = '';

      const section = document.getElementById('portfolio-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

    document.querySelectorAll('.portfolio-new-card, .nc-card[data-project]').forEach(card => {
      card.classList.remove('active');
    });

    // Usuń pływającą nawigację
    removeProjectNavigation();

    // Usuń sticky chapter rail (przeniesiony do body w initializeChapterRail)
    removeChapterRail();

    history.pushState('', document.title, window.location.pathname);
  };

  const cards = document.querySelectorAll('.portfolio-new-card, .nc-card[data-project]');

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', function(e) {
      if (window.__ncDidDrag && window.__ncDidDrag()) return;
      e.preventDefault();
      e.stopPropagation();
      const id = this.getAttribute('data-project');
      if (id) {
        if (this.classList.contains('nc-card')) {
          showNcOverlay(this, id);
        } else {
          showProjectDetails(id);
        }
      }
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
      if (document.getElementById('nc-overlay')) {
        closeNcOverlay();
        return;
      }
      const container = document.getElementById('project-details-container');
      if (container && container.classList.contains('active')) {
        closeProjectDetails();
      }
    }
  });

  const neonWrapper = document.getElementById('neonCarouselWrapper');
  const neonTrack = document.getElementById('neonCarouselTrack');

  if (neonWrapper && neonTrack) {
    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let currentX = 0;

    function getNcTranslateX() {
      return new DOMMatrix(window.getComputedStyle(neonTrack).transform).m41;
    }

    function onNcDragStart(e) {
      isDragging = true;
      didDrag = false;
      startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
      currentX = getNcTranslateX();
      neonTrack.style.animation = 'none';
      neonTrack.style.transform = `translateX(${currentX}px)`;
      neonTrack.classList.add('nc-dragging');
      e.preventDefault();
    }

    function onNcDragMove(e) {
      if (!isDragging) return;
      const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
      const dx = x - startX;
      if (Math.abs(dx) > 5) didDrag = true;
      neonTrack.style.transform = `translateX(${currentX + dx}px)`;
    }

    function onNcDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      neonTrack.classList.remove('nc-dragging');
      const finalX = getNcTranslateX();
      const cardW = parseFloat(getComputedStyle(neonTrack).getPropertyValue('--nc-card-w')) || 340;
      const gap = parseFloat(getComputedStyle(neonTrack).getPropertyValue('--nc-gap')) || 32;
      const singleSetW = 8 * (cardW + gap);
      let norm = finalX % singleSetW;
      if (norm > 0) norm -= singleSetW;
      const progress = Math.abs(norm) / singleSetW;
      neonTrack.style.transform = '';
      neonTrack.style.animation = '';
      neonTrack.style.animationDelay = `calc(${-progress} * var(--nc-speed))`;
    }

    window.__ncDidDrag = () => didDrag;

    neonWrapper.addEventListener('mousedown', onNcDragStart);
    neonWrapper.addEventListener('mousemove', onNcDragMove);
    neonWrapper.addEventListener('mouseup', onNcDragEnd);
    neonWrapper.addEventListener('mouseleave', onNcDragEnd);
    neonWrapper.addEventListener('touchstart', onNcDragStart, { passive: false });
    neonWrapper.addEventListener('touchmove', onNcDragMove, { passive: true });
    neonWrapper.addEventListener('touchend', onNcDragEnd);
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
