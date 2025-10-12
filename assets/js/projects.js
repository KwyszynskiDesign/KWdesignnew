function initAccordion() {
  const accordionItems = document.querySelectorAll('.kwcs-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.kwcs-header');
    if (header) {
      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');

        // Zamknij wszystkie inne elementy
        accordionItems.forEach(otherItem => {
          if (otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
          }
        });

        // Otwórz kliknięty, jeśli był zamknięty
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

// Bezpieczne uruchomienie - działa nawet jeśli DOM jest już załadowany
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordion);
} else {
  initAccordion();
}
