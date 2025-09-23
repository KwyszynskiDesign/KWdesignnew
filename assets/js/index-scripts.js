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
                    const headerHeight = header ? header.offsetHeight : 0;
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
                    if (otherItem !== item && otherItem.classList.contains('active')) {
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
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        setSubmitButtonState(true);

        try {
            // In a real scenario, you would use fetch() to send data to a server.
            // For this demo, we'll just simulate it.
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('Dziękuję za wiadomość! Skontaktuję się w ciągu 24h.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Wystąpił błąd podczas wysyłania. Spróbuj ponownie.', 'error');
        } finally {
            setSubmitButtonState(false);
        }
    });
    
    function setSubmitButtonState(loading) {
        if (!submitBtn || !btnText || !btnLoader) return;
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

// Testimonials Carousel - Corrected Logic
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    
    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    const totalOriginalSlides = slides.length / 2;
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;

    function moveToSlide(instant = false) {
        const slideWidthPercentage = 100 / (totalOriginalSlides * 2);
        track.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * slideWidthPercentage}%)`;
    }

    function handleNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        moveToSlide();

        track.addEventListener('transitionend', () => {
            if (currentIndex >= totalOriginalSlides) {
                currentIndex = 0;
                moveToSlide(true);
            }
            isTransitioning = false;
        }, { once: true });
    }

    function handlePrev() {
        if (isTransitioning) return;
        isTransitioning = true;

        if (currentIndex === 0) {
            currentIndex = totalOriginalSlides;
            moveToSlide(true);

            setTimeout(() => {
                currentIndex--;
                moveToSlide();
                // Listen for this specific transition to end before allowing more clicks
                track.addEventListener('transitionend', () => isTransitioning = false, { once: true });
            }, 50);
        } else {
            currentIndex--;
            moveToSlide();
            track.addEventListener('transitionend', () => isTransitioning = false, { once: true });
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(handleNext, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        handleNext();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        handlePrev();
    });

    const wrapper = track.closest('.testimonials-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);
    }
    
    startAutoplay();
}


// Scroll-triggered animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-in, .animate-fade-in, .animate-scale-in');
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Notifications
function initNotifications() {
    window.showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, 5000);
    };
}

// Scroll to top button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
