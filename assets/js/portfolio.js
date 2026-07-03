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

  if (window.location.hash) {
    const slug = window.location.hash.substring(1);
    if (projectPages[slug]) {
      window.location.replace(projectPages[slug]);
    }
  }

  const cards = document.querySelectorAll('.portfolio-new-card, .nc-card[data-project]');

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', function(e) {
      if (window.__ncDidDrag && window.__ncDidDrag()) return;
      e.preventDefault();
      e.stopPropagation();
      const id = this.getAttribute('data-project');
      if (id && projectPages[id]) {
        window.location.href = projectPages[id];
      }
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
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
});
