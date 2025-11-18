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
    initServiceCardsAnimation();
    console.log('Website initialized successfully');
});

// Configuration
const CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbz7q6dEJrmXBq2WKjcVuLUub0nSTNV1I2F7a8n6UgieHmiESbaxHG-nxrx7sT3AJiCz/exec';

// Test API Function
// NOWY TEST API - tylko GET (bez błędów CORS)
window.testAPI = async function() {
    console.clear();
    console.log('=== TEST GET API ===');
    console.log('🌐 URL:', CONTACT_API_URL);
    
    try {
        // Test 1: Podstawowy GET
        console.log('📡 Test 1: Podstawowy GET...');
        const basicResponse = await fetch(CONTACT_API_URL, { method: 'GET' });
        console.log('✅ Status:', basicResponse.status);
        const basicText = await basicResponse.text();
        console.log('📄 Response:', basicText);
        
        // Test 2: GET z danymi
        console.log('📡 Test 2: GET z danymi testowymi...');
        const testData = {
            name: 'Jan Testowy',
            email: 'test@example.com',
            phone: '123456789',
            projectType: 'website',
            budget: '5000-10000',
            message: 'To jest test GET API'
        };
        
        const params = new URLSearchParams(testData);
        const dataResponse = await fetch(`${CONTACT_API_URL}?${params}`, { method: 'GET' });
        console.log('✅ Status z danymi:', dataResponse.status);
        const dataText = await dataResponse.text();
        console.log('📄 Response z danymi:', dataText);
        
        if (dataText === 'SUCCESS') {
            console.log('🎉 TEST ZAKOŃCZONY SUKCESEM - sprawdź arkusz KONTAKTY w Google Sheets!');
        } else {
            console.log('⚠️ Niespodziewana odpowiedź:', dataText);
        }
        
    } catch (error) {
        console.error('❌ Błąd testu:', error);
    }
    
    console.log('=== KONIEC TESTU ===');
};

// Contact form functionality
// Contact form functionality - WERSJA GET (OMIJA CORS)
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

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
                message: formData.get('message')
            };

            console.log('📤 Wysyłam dane przez GET:', data);

            // WYSYŁANIE PRZEZ GET - OMIJA CORS!
            const params = new URLSearchParams(data);
            const response = await fetch(`${CONTACT_API_URL}?${params}`, {
                method: 'GET'
            });

            console.log('📡 Response status:', response.status);
            const result = await response.text();
            console.log('📄 Response:', result);

            if (result === 'SUCCESS') {
                showNotification('🎉 Dziękuję za wiadomość! Odezwę się w ciągu 24h.', 'success');
                contactForm.reset();
                console.log('✅ Formularz wysłany pomyślnie');
            } else if (result.startsWith('ERROR:')) {
                throw new Error(result.replace('ERROR: ', ''));
            } else {
                throw new Error('Nieoczekiwana odpowiedź serwera');
            }
            
        } catch (error) {
            console.error('❌ Form error:', error);
            showNotification(`❌ Błąd: ${error.message}. Spróbuj ponownie lub napisz bezpośrednio na email.`, 'error');
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
    const day = now.getDay(); // 0 = niedziela, 6 = sobota

    console.log(`DEBUG: Godzina ${hour}, dzień ${day}`);

    // Weekend (sobota i niedziela)
    if (day === 0 || day === 6) {
        return { 
            status: 'away', 
            text: 'odezwę się w poniedziałek' 
        };
    }

    // Godziny pracy (6:00 - 22:00) - zielony
    if (hour >= 6 && hour < 22) {
        return { 
            status: 'available', 
            text: 'odpowiem szybko' 
        };
    } 
    // Noc (22:00 - 6:00) - żółty
    else {
        return { 
            status: 'busy', 
            text: 'Odpowiem rano' 
        };
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
    const carousel = document.querySelector('.testimonials-carousel');
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!carousel || !track || !prevBtn || !nextBtn || cards.length === 0) {
        console.warn('Testimonials carousel elements not found');
        return;
    }

    let currentIndex = 0;
    const totalCards = cards.length / 2; // Mamy duplikaty (6 kart = 3 oryginały)
    let isAnimating = false;
    
    // Funkcja obliczania szerokości slajdu
    function getSlideWidth() {
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const gap = 32; // var(--space-8)
        return cardWidth + gap;
    }
    
    let slideWidth = getSlideWidth();
    
    // Funkcja aktualizacji karuzeli
    function updateCarousel(instant = false) {
        const offset = -(currentIndex * slideWidth);
        
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        track.style.transform = `translateX(${offset}px)`;
    }
    
    // Przycisk NEXT
    nextBtn.addEventListener('click', function() {
        if (isAnimating) return;
        isAnimating = true;
        
        currentIndex++;
        updateCarousel(false);
        
        // Infinite loop - po ostatnim slajdzie wracamy do początku
        if (currentIndex >= totalCards) {
            setTimeout(() => {
                currentIndex = 0;
                updateCarousel(true);
                setTimeout(() => { isAnimating = false; }, 50);
            }, 500);
        } else {
            setTimeout(() => { isAnimating = false; }, 500);
        }
    });
    
    // Przycisk PREVIOUS
    prevBtn.addEventListener('click', function() {
        if (isAnimating) return;
        isAnimating = true;
        
        if (currentIndex === 0) {
            // Jesteśmy na początku - skocz do końca
            currentIndex = totalCards;
            updateCarousel(true);
            
            setTimeout(() => {
                currentIndex--;
                updateCarousel(false);
                setTimeout(() => { isAnimating = false; }, 500);
            }, 50);
        } else {
            currentIndex--;
            updateCarousel(false);
            setTimeout(() => { isAnimating = false; }, 500);
        }
    });
    
    // Pauza przy hover
    carousel.addEventListener('mouseenter', function() {
        carousel.closest('.testimonials-carousel-wrapper')?.classList.add('paused');
    });
    
    carousel.addEventListener('mouseleave', function() {
        carousel.closest('.testimonials-carousel-wrapper')?.classList.remove('paused');
    });
    
    // Responsive - przelicz przy zmianie rozmiaru
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            slideWidth = getSlideWidth();
            updateCarousel(true);
        }, 250);
    });
    
    // Touch/Swipe support dla mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    }
    
    console.log('✅ Testimonials carousel initialized');
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
    window.showNotification = (message, type = 'success') => {
        console.log(`POWIADOMIENIE ${type.toUpperCase()}: ${message}`);
        
        // BACKUP 1: Spróbuj normalnego powiadomienia
        try {
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: ${type === 'success' ? '#d4edda' : '#f8d7da'}; 
                    color: ${type === 'success' ? '#155724' : '#721c24'}; 
                    border: 2px solid ${type === 'success' ? '#28a745' : '#dc3545'};
                    padding: 15px 20px; 
                    border-radius: 8px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                    z-index: 999999; 
                    max-width: 400px; 
                    font-family: Arial; 
                    font-size: 16px; 
                    font-weight: bold;
                    cursor: pointer;
                " onclick="this.remove()">
                    ${message}
                    <button onclick="this.parentElement.remove()" style="
                        float: right; 
                        background: none; 
                        border: none; 
                        font-size: 20px; 
                        cursor: pointer; 
                        margin-left: 10px;
                        color: inherit;
                    ">×</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
            
        } catch (error) {
            console.error('Błąd powiadomienia:', error);
            // BACKUP 2: Użyj alert
            alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
        }
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
function initServiceCardsAnimation() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-slide-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

console.log('🔧 Funkcja testAPI() dostępna. Wpisz w konsoli: testAPI()');
