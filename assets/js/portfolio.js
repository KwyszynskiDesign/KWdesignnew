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

  // --- Dynamic Project Loading ---
  const projectViewer = document.getElementById('project-viewer');
  if (!projectViewer) return;

  async function loadProject(filePath, sectionId) {
    projectViewer.innerHTML = ''; // Clear previous project
    projectViewer.setAttribute('aria-busy', 'true');
    projectViewer.classList.remove('hidden');

    try {
      const response = await fetch(filePath, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.statusText}`);
      }
      const html = await response.text();
      projectViewer.innerHTML = html;

      // Re-initialize any scripts within the loaded content
      Array.from(projectViewer.querySelectorAll('script')).forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
      });

    } catch (error) {
      console.error('Error fetching project:', error);
      projectViewer.innerHTML = `<p class="error-msg">Nie udało się załadować projektu. Spróbuj ponownie.</p>`;
    } finally {
      projectViewer.setAttribute('aria-busy', 'false');
      projectViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sectionId) {
        history.replaceState(null, '', '#' + sectionId);
      }
    }
  }

  // --- Carousel Functionality ---
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

    // Event listener for project items in the carousel
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item[data-project]');
      if (!item) return;
      const file = item.getAttribute('data-project');
      if (file) {
        loadProject(`./projects/${file}`, item.id);
      }
    });
  }

  // --- "Wizualizacje" Nav Link ---
  const vizLink = document.getElementById('nav-wizualizacje');
  if (vizLink) {
    vizLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadProject('./projects/wizualizacje.html', 'wizualizacje');
    });
  }

  // Handle loading project from URL hash on page load
  if (window.location.hash) {
    const projectId = window.location.hash.substring(1);
    const projectItem = document.getElementById(projectId);
    if (projectItem && projectItem.matches('.carousel-item')) {
      setTimeout(() => projectItem.click(), 100);
    } else if (projectId === 'wizualizacje') {
      // Handle direct link to visualizations
      setTimeout(() => vizLink.click(), 100);
    }
  }
});