// JavaScript specyficzny dla strony głównej index.html

document.addEventListener('DOMContentLoaded', function() {

    // Mobile navigation toggling
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('open');
        });

        // Close menu when clicking on links
        navList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
            });
        });
    }

    // FAQ accordions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Tutaj możesz dodać swój URL do Google Apps Script lub innej usługi
            const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

            // Pokaż loader lub zmień tekst buttona
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;

            fetch(scriptURL, {
                method: 'POST',
                body: new FormData(contactForm),
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Dziękuję za wiadomość! Skontaktuję się wkrótce.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch((error) => {
                console.error('Error!', error.message);
                showNotification('Wystąpił błąd podczas wysyłki. Spróbuj ponownie później.', 'error');
            })
            .finally(() => {
                // Przywróć oryginalny tekst i stan buttona
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Smooth scrolling for navigation links
    const smoothLinks = document.querySelectorAll('a.smooth');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations on scroll
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

    // Observe case study cards
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyCards.forEach(card => {
        observer.observe(card);
    });

    // Observe testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        observer.observe(card);
    });

    // Observe work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        observer.observe(item);
    });

    // Function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #3b82f6, #2563eb)';
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Package selection functionality
    const packageSelect = document.getElementById('packageSelect');
    if (packageSelect) {
        packageSelect.addEventListener('change', function() {
            const selectedPackage = this.value;
            const messageField = document.getElementById('message');

            if (selectedPackage && messageField) {
                const packageMessages = {
                    'start': 'Jestem zainteresowany pakietem Start. Proszę o więcej informacji na temat...',
                    'widocznosc': 'Chciałbym poznać szczegóły pakietu Widoczność. Moja firma...',
                    'pelny': 'Pakiet Pełny Start wydaje się odpowiedni dla mojego biznesu. Czy możemy omówić...'
                };

                if (messageField.value === '' || messageField.value.includes('Jestem zainteresowany') || messageField.value.includes('Chciałbym poznać') || messageField.value.includes('Pakiet Pełny')) {
                    messageField.value = packageMessages[selectedPackage];
                    messageField.focus();
                }
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScrollY = currentScrollY;
        });
    }

    // Parallax effect for case studies background
    const caseStudiesSection = document.querySelector('.case-studies-section');
    if (caseStudiesSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (caseStudiesSection.getBoundingClientRect().top < window.innerHeight && caseStudiesSection.getBoundingClientRect().bottom > 0) {
                caseStudiesSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }

});