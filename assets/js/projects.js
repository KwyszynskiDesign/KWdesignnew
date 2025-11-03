'use strict';

console.log('🚀 Script loaded - testing lightbox...');

// ========================================
// LIGHTBOX
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📌 DOM ready - initializing lightbox');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!lightbox || !lightboxImg || !closeBtn) {
    console.error('❌ LIGHTBOX ELEMENTS NOT FOUND');
    return;
  }

  console.log('✅ Lightbox elements found');

  // Get ALL images
  const images = document.querySelectorAll('.kwcs-gallery-grid img, .hero-image img.cover, .showcase-item img');
  console.log('🖼️ IMAGES FOUND:', images.length);

  if (images.length === 0) {
    console.error('❌ NO IMAGES TO CLICK');
    return;
  }

  // Open lightbox
  function open(img) {
    console.log('🔓 OPENING LIGHTBOX');
    lightbox.classList.add('active');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.dataset.caption || img.alt || '';
    document.body.classList.add('lightbox-open');
  }

  // Close lightbox
  function close() {
    console.log('🔒 CLOSING LIGHTBOX');
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
  }

  // Click each image
  images.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log(`🖱️ CLICKED IMAGE ${i + 1}/${images.length}`);
      open(this);
    });
  });

  // Close button
  closeBtn.addEventListener('click', close);

  // Click on background
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      close();
    }
  });

  console.log('✅ LIGHTBOX READY - CLICK IMAGES');
});

// ========================================
// ACCORDION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📌 Initializing accordion');

  const items = document.querySelectorAll('.kwcs-item');
  console.log('📋 Accordion items:', items.length);

  items.forEach((item, i) => {
    const header = item.querySelector('.kwcs-header');
    const content = item.querySelector('.kwcs-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(it => it.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  console.log('✅ ACCORDION READY');
});
