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

      document.querySelectorAll('.portfolio-new-card').forEach(card => {
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
    if (window.__razdwaRailEscHandler) {
      document.removeEventListener('keydown', window.__razdwaRailEscHandler);
      window.__razdwaRailEscHandler = null;
    }
    document.body.classList.remove('razdwa-rail-open');
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

    const trigger = rail.querySelector('.razdwa-rail-mobile-trigger');
    const triggerLabel = trigger ? trigger.querySelector('[data-current-section]') : null;
    const closeBtn = rail.querySelector('.razdwa-rail-close');
    const backdrop = rail.querySelector('[data-rail-backdrop]');
    const toggles = Array.from(rail.querySelectorAll('.razdwa-rail-toggle'));
    const labelByTarget = Object.fromEntries(
      links.map(l => [getTargetId(l), l.textContent.trim()])
    );

    // Drawer open/close (mobile)
    const openDrawer = () => {
      document.body.classList.add('razdwa-rail-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    };
    const closeDrawer = () => {
      document.body.classList.remove('razdwa-rail-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    };
    if (trigger) {
      trigger.addEventListener('click', () => {
        if (document.body.classList.contains('razdwa-rail-open')) closeDrawer();
        else openDrawer();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    const escHandler = (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('razdwa-rail-open')) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', escHandler);
    window.__razdwaRailEscHandler = escHandler;

    // Toggle buttons (desktop collapsible groups)
    toggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const group = btn.closest('.razdwa-rail-group');
        if (!group) return;
        const isOpen = group.getAttribute('data-open') === 'true';
        group.setAttribute('data-open', isOpen ? 'false' : 'true');
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
    });

    // Link clicks — scroll, set active, close drawer
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = getTargetId(link);
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
        closeDrawer();
      });
    });

    // Scroll spy
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
          // Update mobile trigger label
          if (triggerLabel && labelByTarget[id]) {
            triggerLabel.textContent = labelByTarget[id];
          }
          // Auto-expand parent group when L2 is active
          const activeLink = links.find(l => getTargetId(l) === id);
          if (activeLink && activeLink.dataset.railLevel === '2') {
            const parentGroup = activeLink.closest('.razdwa-rail-group');
            if (parentGroup) {
              parentGroup.setAttribute('data-open', 'true');
              const toggleBtn = parentGroup.querySelector('.razdwa-rail-toggle');
              if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
            }
          }
        });
      }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      });
      targets.forEach(t => observer.observe(t));
      window.__razdwaRailObserver = observer;
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

    // Usuń pływającą nawigację
    removeProjectNavigation();

    // Usuń sticky chapter rail (przeniesiony do body w initializeChapterRail)
    removeChapterRail();

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
