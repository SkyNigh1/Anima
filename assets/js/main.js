/* ============================================
   MAIN JAVASCRIPT - Anima Website
   ============================================ */

class App {
    constructor() {
        this.header = document.querySelector('.header');
        this.isIntroComplete = false;
        
        this.init();
    }
    
    init() {
        // Wait for intro to complete before initializing main functionality
        window.addEventListener('introComplete', () => {
            this.isIntroComplete = true;
            this.initMainFeatures();
        });
    }
    
    initMainFeatures() {
        this.initScrollEffects();
        this.initSmoothScroll();
        
        console.log('Main app initialized');
    }
    
    initScrollEffects() {
        // Header scroll effect
        if (this.header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            });
        }
    }
    
    initSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
