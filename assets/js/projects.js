document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.kwcs-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.kwcs-header');
    if (header) {
      header.addEventListener('click', () => {
        // Toggle the 'open' class on the clicked item
        const wasOpen = item.classList.contains('open');

        // Optional: Close all other items
        accordionItems.forEach(otherItem => {
          if (otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
          }
        });

        // If the clicked item wasn't open, open it
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    }
  });
});
