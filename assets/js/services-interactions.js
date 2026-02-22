// Services Page Interactions
document.addEventListener('DOMContentLoaded', function () {
    initGuideOptions();
    initPackageButtons();
});

// Guide option selection – single select per question card
function initGuideOptions() {
    const guideCards = document.querySelectorAll('.guide-card');

    guideCards.forEach(function (card) {
        const options = card.querySelectorAll('.guide-option');

        options.forEach(function (option) {
            // Make option keyboard-accessible
            option.setAttribute('role', 'button');
            option.setAttribute('tabindex', '0');

            function selectOption() {
                // Deselect all options in this card
                options.forEach(function (o) {
                    o.classList.remove('selected');
                    o.setAttribute('aria-pressed', 'false');
                });
                // Select the clicked option
                option.classList.add('selected');
                option.setAttribute('aria-pressed', 'true');
            }

            option.addEventListener('click', selectOption);
            option.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption();
                }
            });
        });
    });
}

// Package card button – remember selected package
function initPackageButtons() {
    const pkgButtons = document.querySelectorAll('.card-btn[data-package]');

    pkgButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Visually mark this button as selected
            pkgButtons.forEach(function (b) {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');

            // Persist the chosen package so the contact form can use it
            try {
                sessionStorage.setItem('selectedPackage', btn.getAttribute('data-package'));
            } catch (_) {}
        });
    });

    // Restore previously selected package on page load
    try {
        const saved = sessionStorage.getItem('selectedPackage');
        if (saved) {
            const savedBtn = document.querySelector('.card-btn[data-package="' + CSS.escape(saved) + '"]');
            if (savedBtn) {
                savedBtn.classList.add('selected');
            }
        }
    } catch (_) {}
}
