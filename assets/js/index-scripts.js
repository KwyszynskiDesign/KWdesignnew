// Enhanced Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFAQ();
    initContactForm();
    initAnimations();
    initScrollEffects();
    initNotifications();
    initTestimonialsCarousel();
    initScrollToTop();
    console.log('Website initialized successfully');
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const header = document.querySelector('.header');
    
    // Mobile menu toggle
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const smoothLinks = document.querySelectorAll('a.smooth, a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            setSubmitButtonState(true);
            
            try {
                const formData = new FormData(contactForm);
                
                // Simulate form submission (replace with actual implementation)
                await simulateFormSubmission(formData);
                
                // Show success message
                showNotification('Dziękuję za wiadomość! Skontaktuję się w ciągu 24h.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub wyślij email bezpośrednio.', 'error');
            } finally {
                setSubmitButtonState(false);
            }
        });
    }
    
    function setSubmitButtonState(loading) {
        if (submitBtn && btnText && btnLoader) {
            if (loading) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'block';
                submitBtn.disabled = true;
            } else {
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        }
    }
    
    // Simulate form submission
    async function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    }
    
    // Auto-fill message based on project type
    const projectTypeSelect = contactForm?.querySelector('#projectType');
    const messageField = contactForm?.querySelector('#message');
    
    if (projectTypeSelect && messageField) {
        projectTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            if (selectedType && messageField.value.trim() === '') {
                const templates = {
                    'logo': 'Potrzebuję projektu logo i identyfikacji wizualnej dla mojej firmy. Branża: [wpisz branżę]. Chciałbym/chciałabym, żeby...',
                    'website': 'Szukam projektanta do stworzenia strony internetowej. Typ strony: [firmowa/portfolio/blog]. Oczekiwania: ...',
                    'ecommerce': 'Planuję uruchomić sklep internetowy. Branża: [wpisz branżę]. Liczba produktów: około [ile]. Potrzebuję...',
                    'full': 'Potrzebuję kompleksowego rebrandingu firmy. Obecna sytuacja: [opisz]. Cele: ...',
                    'other': 'Mam projekt, który nie mieści się w standardowych kategoriach. Chodzi o...'
                };
                
                messageField.value = templates[selectedType] || '';
                messageField.focus();
                messageField.setSelectionRange(messageField.value.length, messageField.value.length);
            }
        });
    }
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    
    if (!track) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    const totalSlides = 3; // Original slides count
    
    // Auto-play functionality
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function updateCarousel() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const translateX = -(currentIndex * (100 / 6)); // 6 total slides including duplicates
        track.style.transform = `translateX(${translateX}%)`;
        
        setTimeout(() => {
            isTransitioning = false;
            
            // Handle infinite loop
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(0%)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                }, 50);
            }
        }, 500);
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % (totalSlides + 1);
        updateCarousel();
    }
    
    function prevSlide() {
        if (currentIndex === 0) {
            currentIndex = totalSlides;
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(totalSlides * 100) / 6}%)`;
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease
