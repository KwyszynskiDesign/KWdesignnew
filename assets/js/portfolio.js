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
    'cyfradruk': 'projects/cyfradruk.html',
  };

  const viewer = document.getElementById('case-viewer');
  let activeProjectId = null;
  let activeCard = null;

  function openProject(id, cardEl) {
    const url = projectPages[id];
    if (!url || !viewer) return;

    if (activeCard) activeCard.classList.remove('active');
    activeCard = cardEl || document.querySelector(`[data-project="${id}"]`);
    if (activeCard) activeCard.classList.add('active');
    activeProjectId = id;

    viewer.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#64748b;font-size:1.1rem;">Wczytywanie projektu…</div>';
    viewer.classList.remove('hidden');
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    history.replaceState(null, '', '#' + id);

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const section = doc.querySelector('section.kwcs');

        if (!section) {
          viewer.innerHTML = '<div class="error-msg">Nie udało się wczytać projektu.</div>';
          return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'project-content';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-button';
        closeBtn.textContent = '← Wróć do listy projektów';
        closeBtn.setAttribute('aria-label', 'Zamknij case study');
        closeBtn.addEventListener('click', closeViewer);

        wrapper.appendChild(closeBtn);
        wrapper.appendChild(section);

        viewer.innerHTML = '';
        viewer.appendChild(wrapper);

        if (typeof initAccordion === 'function') initAccordion();
        if (typeof initChapterRail === 'function') initChapterRail();
      })
      .catch(() => {
        viewer.innerHTML = '<div class="error-msg">Błąd wczytywania projektu. Spróbuj ponownie.</div>';
      });
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.classList.add('hidden');
    viewer.innerHTML = '';
    if (activeCard) activeCard.classList.remove('active');
    activeCard = null;
    activeProjectId = null;
    history.replaceState(null, '', window.location.pathname);
  }

  if (window.location.hash) {
    const slug = window.location.hash.substring(1);
    if (projectPages[slug]) {
      openProject(slug, null);
    }
  }

  window.addEventListener('hashchange', () => {
    const slug = window.location.hash.substring(1);
    if (slug && projectPages[slug]) {
      if (activeProjectId !== slug) openProject(slug, null);
    } else if (!slug && activeProjectId) {
      closeViewer();
    }
  });

  document.querySelectorAll('.portfolio-new-card').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-project');
      if (!id || !projectPages[id]) return;

      if (activeProjectId === id) {
        closeViewer();
        return;
      }

      openProject(id, this);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeProjectId) {
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('active')) return;
      closeViewer();
    }
  });
});
