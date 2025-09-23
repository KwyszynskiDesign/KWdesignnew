document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Hamburger menu for mobile
  const burger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // Carousel functionality
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const projectViewer = document.getElementById('project-viewer');

  if (!track || !prevBtn || !nextBtn || !projectViewer) {
    return;
  }

  const VISIBLE_COUNT = 3;

  function getItemWidth() {
    const firstItem = track.querySelector('.carousel-item');
    if (!firstItem) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return firstItem.offsetWidth + gap;
  }

  function updateArrows() {
    // A small buffer to account for sub-pixel rendering issues
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

  track.addEventListener('click', async (e) => {
    const item = e.target.closest('.carousel-item[data-project]');
    if (!item) return;

    const file = item.getAttribute('data-project');
    if (file) {
      projectViewer.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch('./projects/' + file, { cache: 'no-store' });
        if (response.ok) {
          const html = await response.text();
          projectViewer.innerHTML = html;
          projectViewer.classList.remove('hidden');
          projectViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Re-initialize accordion script for the newly loaded content
          const newScripts = Array.from(projectViewer.querySelectorAll('script'));
          newScripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if(oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });

        } else {
          console.error('Failed to load project:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        projectViewer.setAttribute('aria-busy', 'false');
      }
    }
    history.replaceState(null, '', '#' + item.id);
  });

  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });

  updateArrows();

  // Handle loading project from URL hash
  if (window.location.hash) {
    const project_id = window.location.hash.substring(1);
    const project_item = document.getElementById(project_id);
    if (project_item) {
      // Use a small timeout to ensure the page is fully ready
      setTimeout(() => {
        project_item.click();
      }, 100);
    }
  }

  // Initialize scroll-triggered animations for portfolio page
  function initPortfolioAnimations() {
    const animatedElements = document.querySelectorAll('.superpower-card');
    if (typeof IntersectionObserver === 'undefined' || animatedElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  initPortfolioAnimations();
});
