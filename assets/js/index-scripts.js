// Enhanced Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
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

// Configuration
const CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbzh5ogu5vSsXkS-pLgYwaFx26FLX_MNsbK0zUUuf2T2NWiKMbspPGWg7f4ZR8joWUL9/exec';

// Test API Function
window.testAPI = async function() {
    console.clear();
    console.log('=== TEST POŁĄCZENIA Z API ===');
    console.log('🌐 URL:', CONTACT_API_URL);
    
    try {
        console.log('📡 Test GET...');
        const getResponse = await fetch(CONTACT_API_URL, { method: 'GET' });
        console.log('✅ GET Status:', getResponse.status, getResponse.statusText);
        const getText = await getResponse.text();
        console.log('📄 GET Response:', getText);
    } catch (error) {
        console.error('❌ GET Error:', error);
    }
    
    try {
        console.log('📡 Test POST...');
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '123456789',
            projectType: 'website',
            budget: '5000-10000',
            message: 'To jest testowa wiadomość'
        };
        
        const postResponse = await fetch(CONTACT_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        console.log('✅ POST Status:', postResponse.status, postResponse.statusText);
        const postText = await postResponse.text();
        console.log('📄 POST Response:', postText);
        
        try {
            const json = JSON.parse(postText);
            console.log('📨 Parsed JSON:', json);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
        }
        
    } catch (error) {
        console.error('❌ POST Error:', error);
    }
    
    console.log('=== KONIEC TESTU ===');
};

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        if (!validateContactForm(contactForm)) {
            console.log('Form validation failed');
            return;
        }

        setSubmitButtonState(true, submitBtn, btnText, btnLoader);

        try {
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                projectType: formData.get('projectType') || '',
                budget: formData.get('budget') || '',
                message: formData.get('message')
            };

            console.log('📤 Wysyłam dane:', data);

            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const responseText = await response.text();
            console.log('📄 Raw response:', responseText);

            const result = JSON.parse(responseText);
            console.log('📨 Parsed response:', result);

            if (result.status === 'success') {
                showNotification('🎉 Dziękuję za wiadomość! Odezwę się w ciągu 24h.', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Nieznany błąd serwera');
            }
            
        } catch (error) {
            console.error('❌ Form error:', error);
            showNotification(`❌ Błąd: ${error.message}`, 'error');
        } finally {
            setSubmitButtonState(false, submitBtn, btnText, btnLoader);
        }
    });
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
    });

    const email = form.querySelector('input[name="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
        email.classList.add('error');
        showNotification('❌ Podaj prawidłowy adres email', 'error');
        isValid = false;
    }

    if (!isValid) {
        showNotification('❌ Proszę wypełnić wszystkie wymagane pola', 'error');
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setSubmitButtonState(loading, submitBtn, btnText, btnLoader) {
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

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
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

function initAvailabilityStatus() {
    const dot = document.getElementById('availability-dot');
    const text = document.getElementById('availability-text');

    if (!dot || !text) return;

    function updateStatus() {
        const status = getCurrentStatus();
        dot.className = `dot ${status.status}`;
        text.textContent = status.text;
    }

    updateStatus();
    setInterval(updateStatus, 60000);
}

function getCurrentStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    if (day === 0 || day === 6) {
        return { status: 'away', text: 'Odpoczywam - odezwę się w poniedziałek' };
    }

    if (hour >= 9 && hour < 17) {
        return { status: 'available', text: 'Dostępny - odpowiem szybko' };
    } else if (hour >= 17 && hour < 21) {
        return { status: 'busy', text: 'Ograniczona dostępność' };
    } else {
        return { status: 'away', text: 'Niedostępny - odezwę się jutro' };
    }
}

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const header = document.querySelector('.header');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    }
    
    const smoothLinks = document.querySelectorAll('a.smooth');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
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

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active', !isActive);
            });
        }
    });
}

function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.children);
    const originalCardCount = cards.length / 2;
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
            isTransitioning = true;
            track.style.transition = 'none';
            currentIndex = originalCardCount;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.offsetHeight;
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
}

function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-in, .animate-fade-in, .animate-scale-in, .process-item');
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

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

function initNotifications() {
    window.showNotification = (message, type = 'info') => {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

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

console.log('🔧 Funkcja testAPI() dostępna. Wpisz w konsoli: testAPI()');
