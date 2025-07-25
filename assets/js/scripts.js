/*
 * Simple JavaScript to handle mobile navigation toggling.
 * When the hamburger icon is clicked, it toggles the visibility of
 * the navigation menu by adding or removing the `.open` class on the
 * `<ul>` element. Additional interactions could be added here later.
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('header nav ul');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
  }
});
