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

  document.querySelectorAll('.portfolio-new-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
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
});
