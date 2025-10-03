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
    initCounters();
    console.log('Website initialized successfully');
});

// Configuration - WSTAW TUTAJ SWÓJ URL Z APPS SCRIPT
const CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbw9J3rXN178Nj4QGaO5hiMgRCKsyaSLxQ4eIUkkhqci7vn-g3uP7wXg4P7h5l1UP0wA/exec';

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // 1.5 seconds
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                counter.innerText = target;
            } else {
                counter.innerText = Math.ceil(current);
            }
        }, stepTime);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
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

// Get current status based on time
function getCurrentStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Weekend
    if (day === 0 || day === 6) {
        return { status: 'away', text: 'Odpoczywam - odezwę się w poniedziałek' };
    }

    // Weekday hours
    if (hour >= 9 && hour < 17) {
        return { status: 'available', text: 'Dostępny - odpowiem szybko' };
    } else if (hour >= 17 && hour < 21) {
        return { status: 'busy', text: 'Ograniczona dostępność' };
    } else {
        return { status: 'away', text: 'Niedostępny - odezwę się jutro' };
    }
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
    const smoothLinks = document.querySelectorAll('a.smooth');
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

// Enhanced Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateContactForm(contactForm)) return;

        setSubmitButtonState(true, submitBtn, btnText, btnLoader);

        try {
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                projectType: formData.get('projectType') || '',
                budget: formData.get('budget') || '',
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('🎉 Dziękuję za wiadomość! Odezwę się w ciągu 24h.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Błąd serwera');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('❌ Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub napisz bezpośrednio na email.', 'error');
        } finally {
            setSubmitButtonState(false, submitBtn, btnText, btnLoader);
        }
    });
}

// Validate Contact Form
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Reset previous error states
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });

    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Validate email format
    const email = form.querySelector('input[name="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
        email.classList.add('error');
        showNotification('❌ Podaj prawidłowy adres email', 'error');
        isValid = false;
    }

    // Validate message length
    const message = form.querySelector('textarea[name="message"]');
    if (message && message.value.trim().length < 10) {
        message.classList.add('error');
        showNotification('❌ Opis projektu powinien mieć minimum 10 znaków', 'error');
        isValid = false;
    }

    if (!isValid) {
        showNotification('❌ Proszę wypełnić wszystkie wymagane pola poprawnie', 'error');
        
        // Scroll to first error field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    return isValid;
}

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Set submit button state
function setSubmitButtonState(loading, submitBtn, btnText, btnLoader) {
    if (!submitBtn || !btnText || !btnLoader) return;
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');

    if (!track || !prevBtn || !nextBtn) {
        console.error('Testimonials carousel elements not found.');
        return;
    }

    const cards = Array.from(track.children);
    const originalCardCount = cards.length / 2; // Since we have duplicates for the loop
    let currentIndex = 0;
    let isTransitioning = false;

    function getScrollWidth() {
        const card = cards[0];
        const style = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const gap = parseFloat(style.marginRight) || parseFloat(window.getComputedStyle(track).gap) || 0;
        return cardWidth + gap;
    }

    const slideWidth = getScrollWidth();

    function updateCarousel(instant = false) {
        isTransitioning = true;
        track.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex >= originalCardCount) {
            currentIndex = 0;
            updateCarousel(true);
        } else if (currentIndex < 0) {
            currentIndex = originalCardCount - 1;
            updateCarousel(true);
        }
    });

    function moveToNext() {
        if (isTransitioning) return;
        currentIndex++;
        updateCarousel();
    }

    function moveToPrev() {
        if (isTransitioning) return;
        if (currentIndex === 0) {
            // Jump to the end of the cloned slides to create a seamless loop
            isTransitioning = true;
            track.style.transition = 'none';
            currentIndex = originalCardCount;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Force reflow before applying the transition back
            track.offsetHeight;

            // Go to the slide before the first one
            currentIndex--;
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            setTimeout(() => { isTransitioning = false; }, 500);

        } else {
            currentIndex--;
            updateCarousel();
        }
    }

    nextBtn.addEventListener('click', moveToNext);
    prevBtn.addEventListener('click', moveToPrev);

    console.log('Testimonials carousel initialized with fully functional JS control.');
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
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.innerHTML = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    z-index: 10000;
                    border-left: 4px solid #007bff;
                }
                .notification.notification-success { border-left-color: #28a745; }
                .notification.notification-error { border-left-color: #dc3545; }
                .notification.show { transform: translateX(0); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                }
                .notification-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: 10px;
                    opacity: 0.7;
                }
                .notification-close:hover { opacity: 1; }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
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
