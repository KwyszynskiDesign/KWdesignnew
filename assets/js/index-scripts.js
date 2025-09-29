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
    initAvailabilityStatus();
    initCounters(); // Add this call
    console.log('Website initialized successfully');
});

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    counters.forEach(counter => {
        counter.isAnimating = false;
        counter.animationInterval = null;
    });

    const animateCounter = (counter) => {
        if (counter.isAnimating) return;

        counter.isAnimating = true;
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        counter.innerText = '0'; // Start from 0 visually

        counter.animationInterval = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(counter.animationInterval);
                counter.innerText = target;
                counter.isAnimating = false;
            } else {
                counter.innerText = Math.ceil(current);
            }
        }, stepTime);
    };

    const resetCounter = (counter) => {
        if (counter.animationInterval) {
            clearInterval(counter.animationInterval);
        }
        counter.isAnimating = false;
        counter.innerText = '0';
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            } else {
                resetCounter(entry.target);
            }
        });
    }, { threshold: 0.8 });

    counters.forEach(counter => observer.observe(counter));
}

// Availability Status
function initAvailabilityStatus() {
    const dot = document.getElementById('availability-dot');
    const text = document.getElementById('availability-text');

    if (!dot || !text) return;

    function updateStatus() {
        const status = getCurrentStatus();
        dot.className = `dot ${status.status}`;
        text.textContent = status.text;
    }

    updateStatus(); // Initial call
    setInterval(updateStatus, 60000); // Update every minute
}

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
    
    // Smooth scrolling for on-page anchor links
    const smoothLinks = document.querySelectorAll('.nav-list a[href^="#"], .cta-group a[href^="#"], .footer a[href^="#"], a.smooth');
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

// Testimonials Carousel
function initTestimonialsCarousel() {
    const wrapper = document.querySelector('.testimonials-carousel-wrapper');
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');

    if (!track || !prevBtn || !nextBtn || !wrapper) {
        return;
    }

    const scrollCarousel = (direction) => {
        wrapper.classList.add('paused');
        const scrollAmount = track.clientWidth * direction;
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        // Resume animation after a delay
        setTimeout(() => {
            if (!wrapper.matches(':hover')) {
                wrapper.classList.remove('paused');
            }
        }, 5000);
    };

    wrapper.addEventListener('mouseenter', () => wrapper.classList.add('paused'));
    wrapper.addEventListener('mouseleave', () => wrapper.classList.remove('paused'));

    prevBtn.addEventListener('click', () => {
        scrollCarousel(-1);
    });

    nextBtn.addEventListener('click', () => {
        scrollCarousel(1);
    });

    console.log('Testimonials carousel initialized with button functionality.');
}


// Scroll-triggered animations
function initAnimations() {
    // Add .process-item to the list of elements to observe
    const animatedElements = document.querySelectorAll('.animate-in, .animate-fade-in, .animate-scale-in, .process-item');
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use a more specific class to avoid conflicts and match new CSS
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation a bit before it's fully in view
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
