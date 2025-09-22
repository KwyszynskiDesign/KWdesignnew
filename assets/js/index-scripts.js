// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFAQ();
    initContactForm();
    initAnimations();
    initScrollEffects();
    initNotifications();
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
    
    // Google Apps Script URL (you need to replace this with your actual URL)
    const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            setSubmitButtonState(true);
            
            try {
                const formData = new FormData(contactForm);
                
                // You can either use Google Apps Script or a backend service
                // For now, we'll simulate the form submission
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
    
    // Simulate form submission (replace with actual implementation)
    async function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Here you would normally send the data to your backend
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
                // Move cursor to end
                messageField.setSelectionRange(messageField.value.length, messageField.value.length);
            }
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class
        if (currentScrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header?.classList.add('header-hidden');
        } else {
            header?.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Animation on scroll
function initAnimations() {
    const animateElements = document.querySelectorAll('.benefit-card, .service-card, .testimonial-card, .process-step, .portfolio-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Notification system
function initNotifications() {
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 350);
        }, duration);
        
        // Allow manual close by clicking
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 350);
        });
    };
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', optimizeImages);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to a logging service
});

// Service worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
