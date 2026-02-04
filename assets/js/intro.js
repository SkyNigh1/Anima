/* ============================================
   INTRO ANIMATION - Anima Website
   Professional GSAP Animation Sequence
   ============================================ */

class IntroAnimation {
    constructor() {
        // DOM Elements
        this.overlay = document.getElementById('intro-overlay');
        this.mainContent = document.getElementById('main-content');
        this.wipeOverlay = document.getElementById('wipe-overlay');
        this.box = document.querySelector('.intro-box');
        this.letterLeft = document.querySelector('.letter-left');
        this.letterRight = document.querySelector('.letter-right');
        this.centerTextContainer = document.querySelector('.center-text-container');
        this.centerText = document.querySelector('.center-text');
        this.taglineContainer = document.querySelector('.tagline-container');
        this.taglineText = document.querySelector('.tagline-text');
        this.webglBoxCanvas = document.getElementById('webgl-box-bg');
        
        // Animation settings
        this.boxSize = 450;
        this.initialFontSize = 180;
        this.duration = {
            boxOpen: 0.92,
            lettersIn: 0.92,
            boxExpand: 1.23,
            textReveal: 1.38,
            textHide: 0.77,
            taglineReveal: 1.08,
            wipeOut: 0.62
        };
        
        // Easing
        this.ease = {
            smooth: 'power3.inOut',
            elastic: 'elastic.out(1, 0.5)',
            expo: 'expo.inOut',
            back: 'back.out(1.2)',
            circ: 'circ.inOut'
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set initial states
        this.setInitialStates();
        
        // Start animation after a small delay
        setTimeout(() => {
            this.playIntro();
        }, 500);
    }
    
    setInitialStates() {
        // Box starts with width but no height, centered
        gsap.set(this.box, {
            width: this.boxSize,
            height: 0,
            opacity: 1
        });
        
        // Letters start ABOVE the box (will slide down into view)
        // Left letter comes from above
        gsap.set(this.letterLeft, {
            top: '0%',
            transform: 'translateY(-100%)'
        });
        
        // Right letter comes from below
        gsap.set(this.letterRight, {
            top: '100%',
            transform: 'translateY(0%)'
        });
        
        // Center text hidden
        gsap.set(this.centerTextContainer, {
            opacity: 0
        });
        
        gsap.set(this.centerText, {
            yPercent: 100
        });
        
        // Tagline hidden
        gsap.set(this.taglineContainer, {
            opacity: 0
        });
        
        gsap.set(this.taglineText, {
            yPercent: 100
        });
        
        // Main content ready but hidden
        gsap.set(this.mainContent, {
            opacity: 1,
            visibility: 'visible'
        });
    }
    
    playIntro() {
        // Create master timeline
        const master = gsap.timeline({
            onComplete: () => this.onIntroComplete()
        });
        
        // Phase 1: Box opens + Letters animate in
        master.add(this.phase1());
        
        // Phase 2: Box expands + "nim" text reveal
        master.add(this.phase2(), '+=0.4');
        
        // Phase 3: "anima" disappears + tagline appears
        master.add(this.phase3(), '+=0.6');
        
        // Phase 4: Wipe transition to reveal main content
        master.add(this.phase4(), '+=0.5');
    }
    
    phase1() {
        // Phase 1: Square opens from center, letters animate in
        const tl = gsap.timeline();
        
        // Box height animation - grows to become a square
        tl.to(this.box, {
            height: this.boxSize,
            duration: this.duration.boxOpen,
            ease: this.ease.expo
        });
        
        // Left "a" slides down from above to center
        tl.to(this.letterLeft, {
            top: '50%',
            transform: 'translateY(-50%)',
            duration: this.duration.lettersIn,
            ease: this.ease.smooth
        }, 0.15);
        
        // Right "a" slides up from below to center
        tl.to(this.letterRight, {
            top: '50%',
            transform: 'translateY(-50%)',
            duration: this.duration.lettersIn,
            ease: this.ease.smooth
        }, 0.15);
        
        return tl;
    }
    
    phase2() {
        // Phase 2: Box expands to fullscreen, text clip reveal from bottom
        const tl = gsap.timeline();
        
        // Calculate full screen dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate the final font size so "anima" fills most of the width
        // Even larger now
        const finalFontSize = viewportWidth / 2.5;
        const letterPadding = viewportWidth * 0.005;
        
        // Expand box to full screen
        tl.to(this.box, {
            width: viewportWidth,
            height: viewportHeight,
            duration: this.duration.boxExpand,
            ease: this.ease.expo
        }, 0);
        
        // Animate left letter to edge with new font size
        tl.to(this.letterLeft, {
            left: letterPadding,
            fontSize: finalFontSize,
            duration: this.duration.boxExpand,
            ease: this.ease.expo
        }, 0);
        
        // Animate right letter to edge with new font size
        tl.to(this.letterRight, {
            right: letterPadding,
            fontSize: finalFontSize,
            duration: this.duration.boxExpand,
            ease: this.ease.expo
        }, 0);
        
        // Show center text container
        tl.to(this.centerTextContainer, {
            opacity: 1,
            duration: 0.3
        }, 0.3);
        
        // Scale up center text font
        tl.to(this.centerText, {
            fontSize: finalFontSize,
            duration: this.duration.boxExpand,
            ease: this.ease.expo
        }, 0);
        
        // Text clip reveal animation from bottom - slow and fluid
        tl.to(this.centerText, {
            yPercent: 0,
            duration: this.duration.textReveal,
            ease: 'power2.out'
        }, 0.4);
        
        return tl;
    }
    
    phase3() {
        // Phase 3: "anima" text disappears with clip to top, tagline appears
        const tl = gsap.timeline();
        
        // Animate left letter up and out
        tl.to(this.letterLeft, {
            top: '-50%',
            duration: this.duration.textHide,
            ease: 'power3.inOut'
        }, 0);
        
        // Animate right letter up and out
        tl.to(this.letterRight, {
            top: '-50%',
            duration: this.duration.textHide,
            ease: 'power3.inOut'
        }, 0);
        
        // Center text goes up
        tl.to(this.centerText, {
            yPercent: -100,
            duration: this.duration.textHide,
            ease: 'power3.inOut'
        }, 0);
        
        // Fade out center text container
        tl.to(this.centerTextContainer, {
            opacity: 0,
            duration: 0.2
        }, this.duration.textHide - 0.2);
        
        // Show tagline container
        tl.to(this.taglineContainer, {
            opacity: 1,
            duration: 0.3
        }, this.duration.textHide * 0.4);
        
        // Tagline text clip reveal from bottom
        tl.to(this.taglineText, {
            yPercent: 0,
            duration: this.duration.taglineReveal,
            ease: 'power2.out'
        }, this.duration.textHide * 0.5);
        
        return tl;
    }
    
    phase4() {
        // Phase 4: Tagline text-clip up + box slides up (simultaneous)
        const tl = gsap.timeline();
        
        // Brief pause to appreciate the tagline
        tl.to({}, { duration: 0.8 });
        
        // Make intro overlay transparent and show main content
        tl.call(() => {
            this.mainContent.classList.add('visible');
            this.mainContent.style.opacity = '1';
        });
        
        tl.to(this.overlay, {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            duration: 0.3,
            ease: 'none'
        });
        
        // 1. Tagline disappears with text-clip to the top (slow)
        tl.to(this.taglineText, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power2.inOut'
        }, '-=0.2');
        
        // 2. The intro box slides up - starts slightly after tagline begins (overlap)
        tl.to(this.box, {
            y: '-100vh',
            duration: 1.5,
            ease: 'power3.inOut',
            onComplete: () => {
                // Hide intro completely
                this.overlay.style.display = 'none';
            }
        }, '-=1.0'); // Start 1s before tagline finishes (overlap)
        
        return tl;
    }
    
    onIntroComplete() {
        // Add class to hide intro overlay completely
        this.overlay.classList.add('hidden');
        this.mainContent.classList.add('visible');
        
        // Optional: Remove intro from DOM after animation
        setTimeout(() => {
            this.overlay.style.display = 'none';
            // Stop WebGL animation to save resources
            if (window.webglBg && window.webglBg.stop) {
                window.webglBg.stop();
            }
        }, 100);
        
        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('introComplete'));
        
        console.log('Intro animation complete');
    }
    
    // Method to replay animation (useful for development)
    replay() {
        this.overlay.style.display = 'flex';
        this.overlay.style.opacity = '1';
        this.overlay.classList.remove('hidden');
        this.mainContent.classList.remove('visible');
        
        // Reset wipe overlay
        gsap.set(this.wipeOverlay, { y: '0%' });
        
        // Reset box styles
        this.box.style.width = '';
        this.box.style.height = '';
        
        // Reset letter styles
        this.letterLeft.style.left = '';
        this.letterLeft.style.fontSize = '';
        this.letterLeft.style.top = '';
        this.letterLeft.style.transform = '';
        this.letterRight.style.right = '';
        this.letterRight.style.fontSize = '';
        this.letterRight.style.top = '';
        this.letterRight.style.transform = '';
        this.centerText.style.fontSize = '';
        
        // Reset tagline
        this.taglineContainer.style.opacity = '';
        this.taglineText.style.transform = '';
        
        // Restart WebGL
        if (window.webglBg && window.webglBg.start) {
            window.webglBg.start();
        }
        
        this.setInitialStates();
        
        setTimeout(() => {
            this.playIntro();
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.introAnimation = new IntroAnimation();
});

// Handle window resize for responsive animations
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update any responsive values if needed during animation
    }, 250);
});
