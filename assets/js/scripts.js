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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({
      behavior:'smooth'
    });
  });
});

// Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
hamburger.addEventListener('click', ()=> nav.classList.toggle('open'));

// Portfolio filter
document.querySelectorAll('.portfolio .filter button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.portfolio .grid .item').forEach(item=>{
      item.style.display = (filter==='all' || item.getAttribute('data-category')===filter) ? 'block' : 'none';
    });
  });
});

// Slider
let current = 0;
const slides = document.querySelectorAll('.slide');
document.querySelector('.next').addEventListener('click', () => changeSlide(1));
document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
function changeSlide(dir){
  slides[current].classList.remove('active');
  current = (current + dir + slides.length) % slides.length;
  slides[current].classList.add('active');
}

// FAQ toggle
document.querySelectorAll('.q-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const ans = btn.nextElementSibling;
    ans.style.display = ans.style.display === 'block' ? 'none' : 'block';
  });
});

// Kontakt – integracja Google Apps Script (przykładowy URL)
document.getElementById('contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  const url = 'https://script.google.com/macros/s/🧩/exec';
  const data = new FormData(e.target);
  fetch(url, { method:'POST', body:data })
    .then(r => alert('Wiadomość wysłana!'))
    .catch(err => alert('Coś poszło nie tak.'));
});
