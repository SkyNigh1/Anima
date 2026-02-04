/* ============================================
   SCROLL ANIMATIONS - Anima Website
   Complete rewrite with smooth animations
   ============================================ */

// Global Lenis instance
let lenis = null;

// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

class ScrollAnimations {
    constructor() {
        this.scrollEnabled = false;
        this.init();
    }
    
    init() {
        // Force scroll to top again
        window.scrollTo(0, 0);
        
        this.setupLenis();
        this.setupHeroAnimation();
        this.setupStatsAnimation();
        this.setupHoverTooltip();
        this.setupZoomParallax();
        this.setupCTAAnimation();
        this.setupOrganizationsCarousel();
        this.setupFooterReveal();
    }
    
    setupLenis() {
        // Initialize Lenis smooth scroll - DISABLED until hero text appears
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });
        
        // STOP Lenis initially - scroll disabled until hero text appears
        lenis.stop();
        
        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        
        // Use GSAP ticker for Lenis
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        
        // Disable GSAP's lagSmoothing for better sync
        gsap.ticker.lagSmoothing(0);
        
        // Store lenis globally for access
        window.lenis = lenis;
    }
    
    enableScroll() {
        if (this.scrollEnabled) return;
        this.scrollEnabled = true;
        
        // Start Lenis
        if (lenis) {
            lenis.start();
        }
        
        // Show scroll indicator
        this.showScrollIndicator();
    }
    
    showScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;
        
        // Animate in
        gsap.to(indicator, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Animate the line organically
        this.animateScrollLine();
    }
    
    animateScrollLine() {
        const line = document.querySelector('.scroll-indicator-line');
        if (!line) return;
        
        // Organic line animation - grows and shrinks
        const animateLine = () => {
            gsap.to(line, {
                height: gsap.utils.random(30, 60),
                duration: gsap.utils.random(0.8, 1.5),
                ease: 'power2.inOut',
                onComplete: animateLine
            });
        };
        
        animateLine();
        
        // Hide indicator when user scrolls
        const hideOnScroll = () => {
            if (window.scrollY > 50) {
                gsap.to('.scroll-indicator', {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                window.removeEventListener('scroll', hideOnScroll);
            }
        };
        
        window.addEventListener('scroll', hideOnScroll);
    }
    
    setupHoverTooltip() {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'hover-tooltip';
        tooltip.innerHTML = `
            <span class="tooltip-text">visit</span>
            <svg class="tooltip-arrow" width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        document.body.appendChild(tooltip);
        
        const tooltipText = tooltip.querySelector('.tooltip-text');
        
        // Track mouse on links
        const links = document.querySelectorAll('a[href^="http"], .stat-source');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                tooltip.classList.add('visible');
                // Check if we're in the stats section (white bg) - invert colors
                const inStatsSection = link.closest('.stats-section') !== null;
                tooltip.classList.toggle('inverted', inStatsSection);
                
                // Check if it's a story link with organization name
                const orgName = link.dataset.org;
                if (orgName) {
                    tooltipText.textContent = `visit ${orgName}`;
                } else {
                    tooltipText.textContent = 'visit';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
            
            link.addEventListener('mousemove', (e) => {
                gsap.to(tooltip, {
                    x: e.clientX + 15,
                    y: e.clientY + 15,
                    duration: 0.15,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    setupHeroAnimation() {
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero-image');
        const heroBackground = document.querySelector('.hero-background');
        const heroTextContainer = document.querySelector('.hero-text-container');
        const heroText = document.querySelector('.hero-text');
        
        if (!hero || !heroImage) return;
        
        // Initial state - hero image starts at scale 1.15 (zoomed in)
        gsap.set(heroImage, { 
            scale: 1.15,
            opacity: 0 
        });
        
        gsap.set(heroBackground, {
            opacity: 0
        });
        
        // Set initial brightness to 1 (normal) so darkening animation works correctly
        gsap.set(heroImage, {
            filter: 'brightness(1)'
        });
        
        gsap.set(heroText, {
            yPercent: 100
        });
        
        gsap.set(heroTextContainer, {
            opacity: 0
        });
        
        // Wait for intro complete event
        window.addEventListener('introComplete', () => {
            this.playHeroSequence();
        });
    }
    
    playHeroSequence() {
        const heroImage = document.querySelector('.hero-image');
        const heroBackground = document.querySelector('.hero-background');
        const heroTextContainer = document.querySelector('.hero-text-container');
        const heroText = document.querySelector('.hero-text');
        
        // Phase 1: Hero image appears with zoom out animation (2x faster = 1s instead of 2s)
        const heroTimeline = gsap.timeline();
        
        // Fade in and zoom out to normal size - FASTER (was 2s, now 1s)
        heroTimeline.to(heroImage, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
        });
        
        // Phase 2: Shrink to 90% and darken - speed x1.3 (was 1.5s, now ~1.15s)
        heroTimeline.to(heroImage, {
            scale: 0.9,
            filter: 'brightness(0.7)',
            duration: 1.15,
            ease: 'power3.inOut'
        }, '+=0.25');
        
        // Reveal the background behind
        heroTimeline.to(heroBackground, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out'
        }, '-=0.9');
        
        // Show text container
        heroTimeline.to(heroTextContainer, {
            opacity: 1,
            duration: 0.25
        }, '-=0.6');
        
        // Text clip animation - reveal "it feels."
        heroTimeline.to(heroText, {
            yPercent: 0,
            duration: 1.1,
            ease: 'power2.out',
            onComplete: () => {
                // Enable scroll after "it feels." is displayed
                this.enableScroll();
            }
        }, '-=0.5');
        
        // Setup scroll-based animations after initial animation
        heroTimeline.call(() => {
            this.setupScrollTriggers();
        });
    }
    
    setupScrollTriggers() {
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero-image');
        const heroText = document.querySelector('.hero-text');
        const heroTextContainer = document.querySelector('.hero-text-container');
        const statsSection = document.querySelector('.stats-section');
        
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Parallax effect: Hero moves up 3x slower than normal scroll
        // Stats section (white background) overlaps the hero as user scrolls
        ScrollTrigger.create({
            trigger: statsSection,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.5,
            onUpdate: (self) => {
                // Hero moves at 1/3 speed (0.33) - stats will overlap it
                const heroY = self.progress * window.innerHeight * 0.33;
                gsap.set(hero, { y: -heroY });
                
                // Text disappears simultaneously with scroll
                const textProgress = Math.min(self.progress * 2, 1);
                gsap.set(heroText, { yPercent: -100 * textProgress });
                gsap.set(heroTextContainer, { opacity: 1 - textProgress });
            }
        });
    }
    
    setupZoomParallax() {
        this.setupAnimalStories();
    }
    
    setupAnimalStories() {
        const mosaicContainer = document.querySelector('.mosaic-container');
        const mosaicGrid = document.querySelector('.mosaic-grid');
        const mosaicCenter = document.querySelector('.mosaic-center');
        const mosaicOverlay = mosaicCenter?.querySelector('.mosaic-overlay');
        const pandaText = document.querySelector('.panda-text-container');
        const mosaicItems = document.querySelectorAll('.mosaic-item:not(.mosaic-center)');
        const storySlides = document.querySelectorAll('.story-slide');
        
        if (!mosaicContainer || !mosaicCenter) return;
        
        const initAnimalStories = () => {
            if (typeof ScrollTrigger === 'undefined') {
                setTimeout(initAnimalStories, 100);
                return;
            }
            
            gsap.registerPlugin(ScrollTrigger);
            
            // Store initial dimensions before any transform
            const initialRect = mosaicCenter.getBoundingClientRect();
            const initialWidth = initialRect.width;
            const initialHeight = initialRect.height;
            
            const getFullscreenScale = () => {
                return Math.max(window.innerWidth / initialWidth, window.innerHeight / initialHeight) * 1.15;
            };
            
            // Initial state
            gsap.set(pandaText, { opacity: 0, y: 30 });
            gsap.set(mosaicOverlay, { backgroundColor: 'transparent' });
            
            // Phase 1: Mosaic - Red Panda zooms to fullscreen, then text appears
            // The panda image stays in place via CSS sticky while the next image covers it from below
            ScrollTrigger.create({
                trigger: mosaicContainer,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const fullScale = getFullscreenScale();
                    
                    // Add zooming class when scale starts
                    if (progress > 0.05) {
                        mosaicCenter.classList.add('zooming');
                    } else {
                        mosaicCenter.classList.remove('zooming');
                    }
                    
                    if (progress <= 0.3) {
                        // 0 -> 0.3: Zoom to fullscreen (Faster)
                        const zoomProg = progress / 0.3;
                        const scale = 1 + (fullScale - 1) * zoomProg;
                        
                        gsap.set(mosaicCenter, { scale: scale });
                        gsap.set(mosaicGrid, { 
                            gap: 10 * (1 - zoomProg) + 'px',
                            padding: 10 * (1 - zoomProg) + 'px'
                        });
                        
                        mosaicItems.forEach(item => {
                            gsap.set(item, { 
                                opacity: 1 - zoomProg,
                                scale: 1 - zoomProg * 0.2
                            });
                        });
                        
                        gsap.set(pandaText, { opacity: 0 });
                        pandaText.classList.remove('visible');
                        gsap.set(mosaicOverlay, { backgroundColor: 'transparent' });
                        
                    } else if (progress <= 0.55) {
                        // 0.3 -> 0.55: Text appears
                        const textProg = (progress - 0.3) / 0.25;
                        // Continue slight zoom during text phase
                        const continuedZoom = fullScale * (1 + textProg * 0.05);
                        
                        gsap.set(mosaicCenter, { scale: continuedZoom });
                        gsap.set(mosaicOverlay, { backgroundColor: `rgba(0,0,0,${textProg * 0.4})` });
                        gsap.set(pandaText, { opacity: textProg, y: 30 * (1 - textProg) });
                        if (textProg > 0.1) pandaText.classList.add('visible');
                        
                        mosaicItems.forEach(item => gsap.set(item, { opacity: 0 }));
                        gsap.set(mosaicGrid, { gap: '0px', padding: '0px' });
                        
                    } else if (progress <= 0.75) {
                        // 0.55 -> 0.75: Text visible, continue zoom
                        const holdZoomProg = (progress - 0.55) / 0.2;
                        const continuedZoom = fullScale * 1.05 * (1 + holdZoomProg * 0.03);
                        
                        gsap.set(mosaicCenter, { scale: continuedZoom });
                        gsap.set(mosaicOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' });
                        gsap.set(pandaText, { opacity: 1, y: 0 });
                        pandaText.classList.add('visible');
                        
                    } else {
                        // 0.75 -> 1: Text fades, darken for transition, zoom continues
                        // Panda stays in place via sticky, next image covers it from below
                        const fadeProg = (progress - 0.75) / 0.25;
                        const finalZoom = fullScale * 1.08 * (1 + fadeProg * 0.07);
                        
                        gsap.set(mosaicCenter, { scale: finalZoom });
                        gsap.set(mosaicOverlay, { backgroundColor: `rgba(0,0,0,${0.4 + fadeProg * 0.5})` });
                        gsap.set(pandaText, { opacity: 1 - fadeProg, y: -30 * fadeProg });
                        if (fadeProg > 0.9) pandaText.classList.remove('visible');
                    }
                }
            });
            
            // Phase 2: Story slides - CSS Sticky handles layering
            const totalSlides = storySlides.length;
            
            storySlides.forEach((slide, index) => {
                const wrapper = slide.querySelector('.story-image-wrapper');
                const img = slide.querySelector('img');
                const overlay = slide.querySelector('.story-overlay');
                const text = slide.querySelector('.story-text');
                const isLastSlide = index === totalSlides - 1;
                
                if (!wrapper || !img) return;
                
                // Initial state
                gsap.set(img, { scale: 1 });
                gsap.set(overlay, { backgroundColor: 'transparent' });
                gsap.set(text, { opacity: 0, y: 30 });
                
                if (isLastSlide) {
                    // LAST SLIDE (WHALE): Same behavior as other slides but with fade out at end
                    // The slide has extra height (250vh) to allow for the fade out
                    ScrollTrigger.create({
                        trigger: slide,
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: 0.5,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            
                            if (progress <= 0.2) {
                                // 0 -> 0.2: Entering phase
                                gsap.set(img, { scale: 1, opacity: 1 });
                                gsap.set(wrapper, { opacity: 1 });
                                gsap.set(overlay, { backgroundColor: 'transparent' });
                                gsap.set(text, { opacity: 0, y: 30 });
                                
                            } else if (progress <= 0.35) {
                                // 0.2 -> 0.35: Text appears, zoom starts
                                const textProg = (progress - 0.2) / 0.15;
                                
                                gsap.set(img, { scale: 1 + textProg * 0.08, opacity: 1 });
                                gsap.set(wrapper, { opacity: 1 });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${textProg * 0.4})` });
                                gsap.set(text, { opacity: textProg, y: 30 * (1 - textProg) });
                                
                            } else if (progress <= 0.5) {
                                // 0.35 -> 0.5: Text visible, continue zoom (reading time)
                                const holdZoomProg = (progress - 0.35) / 0.15;
                                
                                gsap.set(img, { scale: 1.08 + holdZoomProg * 0.04, opacity: 1 });
                                gsap.set(wrapper, { opacity: 1 });
                                gsap.set(overlay, { backgroundColor: 'rgba(0,0,0,0.4)' });
                                gsap.set(text, { opacity: 1, y: 0 });
                                
                            } else if (progress <= 0.65) {
                                // 0.5 -> 0.65: Text fades out, zoom continues
                                const fadeProg = (progress - 0.5) / 0.15;
                                
                                gsap.set(img, { scale: 1.12 + fadeProg * 0.06, opacity: 1 });
                                gsap.set(wrapper, { opacity: 1 });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${0.4 + fadeProg * 0.2})` });
                                gsap.set(text, { opacity: 1 - fadeProg, y: -30 * fadeProg });
                                
                            } else {
                                // 0.65 -> 1: Image fades out to reveal CTA section
                                const fadeOutProg = (progress - 0.65) / 0.35;
                                const finalZoom = 1.18 + fadeOutProg * 0.12;
                                
                                gsap.set(img, { scale: finalZoom, opacity: 1 - fadeOutProg });
                                gsap.set(wrapper, { opacity: 1 - fadeOutProg });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${0.6 + fadeOutProg * 0.4})`, opacity: 1 - fadeOutProg });
                                gsap.set(text, { opacity: 0 });
                            }
                        }
                    });
                } else {
                    // OTHER SLIDES: Normal behavior
                    ScrollTrigger.create({
                        trigger: slide,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            
                            if (progress <= 0.25) {
                                // 0 -> 0.25: Entering phase
                                gsap.set(img, { scale: 1, opacity: 1 });
                                gsap.set(overlay, { backgroundColor: 'transparent' });
                                gsap.set(text, { opacity: 0 });
                                
                            } else if (progress <= 0.4) {
                                // 0.25 -> 0.4: Text appears, zoom starts
                                const textProg = (progress - 0.25) / 0.15;
                                const zoomProg = (progress - 0.25) / 0.15;
                                
                                gsap.set(img, { scale: 1 + zoomProg * 0.08, opacity: 1 });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${textProg * 0.4})` });
                                gsap.set(text, { opacity: textProg, y: 30 * (1 - textProg) });
                                
                            } else if (progress <= 0.55) {
                                // 0.4 -> 0.55: Text visible, continue zoom
                                const holdZoomProg = (progress - 0.4) / 0.15;
                                
                                gsap.set(img, { scale: 1.08 + holdZoomProg * 0.04, opacity: 1 });
                                gsap.set(overlay, { backgroundColor: 'rgba(0,0,0,0.4)' });
                                gsap.set(text, { opacity: 1, y: 0 });
                                
                            } else if (progress <= 0.7) {
                                // 0.55 -> 0.7: Text fades out, zoom continues
                                const fadeProg = (progress - 0.55) / 0.15;
                                const continuedZoom = 1.12 + fadeProg * 0.06;
                                
                                gsap.set(img, { scale: continuedZoom, opacity: 1 });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${0.4 + fadeProg * 0.2})` });
                                gsap.set(text, { opacity: 1 - fadeProg, y: -30 * fadeProg });
                                
                            } else {
                                // 0.7 -> 1: Continue zoom and darken while next image covers
                                const darkProg = (progress - 0.7) / 0.3;
                                const finalZoom = 1.18 + darkProg * 0.12;
                                
                                gsap.set(img, { scale: finalZoom, opacity: 1 });
                                gsap.set(overlay, { backgroundColor: `rgba(0,0,0,${0.6 + darkProg * 0.4})` });
                                gsap.set(text, { opacity: 0 });
                            }
                        }
                    });
                }
            });
        };
        
        initAnimalStories();
    }
    
    setupStatsAnimation() {
        // Species data
        const speciesData = {
            number: '48,646',
            percentage: '28.18%'
        };
        
        // Proportions data
        const proportionsData = [
            { name: 'Amphibians', percentage: '41%' },
            { name: 'Mammals', percentage: '26%' },
            { name: 'Conifers', percentage: '34%' },
            { name: 'Birds', percentage: '11%' },
            { name: 'Sharks & Rays', percentage: '38%' },
            { name: 'Reef corals', percentage: '44%' },
            { name: 'Selected Crustaceans', percentage: '28%' },
            { name: 'Reptiles', percentage: '21%' },
            { name: 'Cycads', percentage: '71%' }
        ];
        
        // Animate species counter alternation
        this.animateSpeciesCounter(speciesData);
        
        // Animate proportions alternation
        this.animateProportions(proportionsData);
        
        // Setup scroll animations for stats
        this.setupStatsScrollAnimations();
    }
    
    animateSpeciesCounter(data) {
        const speciesNumber = document.querySelector('.species-number');
        const speciesPercent = document.querySelector('.species-percent');
        
        if (!speciesNumber || !speciesPercent) return;
        
        let showNumber = true;
        
        const toggle = () => {
            if (showNumber) {
                // Hide number, show percent
                gsap.to(speciesNumber, {
                    yPercent: -100,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
                gsap.to(speciesPercent, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
            } else {
                // Hide percent, show number
                gsap.to(speciesPercent, {
                    yPercent: 100,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
                gsap.to(speciesNumber, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
            }
            showNumber = !showNumber;
        };
        
        // Initial state
        gsap.set(speciesPercent, { yPercent: 100, opacity: 0 });
        gsap.set(speciesNumber, { yPercent: 0, opacity: 1 });
        
        // Start alternation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.speciesInterval = setInterval(toggle, 3000);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const container = document.querySelector('.species-stat');
        if (container) observer.observe(container);
    }
    
    animateProportions(data) {
        const proportionName = document.querySelector('.proportion-name');
        const proportionPercent = document.querySelector('.proportion-percent');
        
        if (!proportionName || !proportionPercent) return;
        
        let currentIndex = 0;
        
        const showNext = () => {
            // Animate out
            gsap.to([proportionName, proportionPercent], {
                yPercent: -100,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentIndex = (currentIndex + 1) % data.length;
                    const current = data[currentIndex];
                    
                    // Update content
                    proportionName.textContent = current.name;
                    proportionPercent.textContent = current.percentage;
                    
                    // Reset position below
                    gsap.set([proportionName, proportionPercent], { yPercent: 100 });
                    
                    // Animate in
                    gsap.to([proportionName, proportionPercent], {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        stagger: 0.1
                    });
                }
            });
        };
        
        // Initial setup
        if (data[0]) {
            proportionName.textContent = data[0].name;
            proportionPercent.textContent = data[0].percentage;
        }
        
        // Start animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.proportionInterval = setInterval(showNext, 2500);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const container = document.querySelector('.proportion-stat');
        if (container) observer.observe(container);
    }
    
    setupStatsScrollAnimations() {
        // Wait for ScrollTrigger to be ready
        if (typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.setupStatsScrollAnimations(), 100);
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate text paragraphs on scroll
        const textLines = document.querySelectorAll('.stats-text-line');
        textLines.forEach((line, index) => {
            gsap.from(line, {
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                yPercent: 50,
                opacity: 0,
                duration: 1,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
        
        // Animate stats boxes
        const statsBoxes = document.querySelectorAll('.stat-box');
        statsBoxes.forEach((box, index) => {
            gsap.from(box, {
                scrollTrigger: {
                    trigger: box,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                yPercent: 30,
                opacity: 0,
                duration: 1.2,
                delay: index * 0.15,
                ease: 'power3.out'
            });
        });
    }
    
    setupCTAAnimation() {
        const ctaSection = document.querySelector('.cta-section');
        const ctaText = document.querySelector('.cta-text');
        
        if (!ctaSection || !ctaText) return;
        
        // Wait for ScrollTrigger
        if (typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.setupCTAAnimation(), 100);
            return;
        }
        
        // Set initial state - text starts from right side (visible entering)
        gsap.set(ctaText, { 
            x: '100vw',
            opacity: 1
        });
        
        // Calculate the text width to know how far left we need to go
        // The text needs to completely exit the screen on the left
        const getTextOffset = () => {
            const textWidth = ctaText.offsetWidth;
            const viewportWidth = window.innerWidth;
            // We need to move: 100vw (start) + textWidth (to fully exit left)
            // Convert textWidth to vw units
            const textWidthVw = (textWidth / viewportWidth) * 100;
            return 100 + textWidthVw + 10; // +10vw extra buffer
        };
        
        // Horizontal scroll animation from right to left
        ScrollTrigger.create({
            trigger: ctaSection,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalTravel = getTextOffset();
                // Move from right (100vw) through center to far left (completely off-screen)
                const xPos = 100 - (progress * totalTravel);
                gsap.set(ctaText, { 
                    x: `${xPos}vw`
                });
            }
        });
    }
    
    setupOrganizationsCarousel() {
        const carouselSection = document.querySelector('.organizations-carousel');
        const carouselContainer = document.querySelector('.carousel-inner-container');
        const carouselTrack = document.querySelector('.org-carousel-track');
        const slides = document.querySelectorAll('.org-carousel-slide');
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        if (!carouselTrack || slides.length === 0) return;
        
        let currentIndex = 0;
        let autoPlayInterval = null;
        const autoPlayDelay = 5000; // 5 seconds per slide
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.carousel-dot');
        
        // Go to specific slide with improved transition
        function goToSlide(index) {
            const direction = index > currentIndex ? 1 : -1;
            const previousIndex = currentIndex;
            currentIndex = index;
            
            // Animate track with smoother easing
            gsap.to(carouselTrack, {
                x: `-${currentIndex * 100}%`,
                duration: 1,
                ease: 'power3.inOut'
            });
            
            // Update dots with scale animation
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                    gsap.to(dot, { scale: 1.2, duration: 0.3 });
                } else {
                    dot.classList.remove('active');
                    gsap.to(dot, { scale: 1, duration: 0.3 });
                }
            });
            
            // Animate leaving slide
            const leavingSlide = slides[previousIndex];
            if (leavingSlide) {
                const leavingImg = leavingSlide.querySelector('img');
                const leavingContent = leavingSlide.querySelector('.org-content');
                
                if (leavingContent) {
                    gsap.to(leavingContent, {
                        opacity: 0,
                        x: direction * -30,
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                }
                
                if (leavingImg) {
                    gsap.to(leavingImg, {
                        scale: 1.15,
                        duration: 1,
                        ease: 'power2.out'
                    });
                }
            }
            
            // Animate entering slide
            const enteringSlide = slides[currentIndex];
            if (enteringSlide) {
                const enteringImg = enteringSlide.querySelector('img');
                const enteringContent = enteringSlide.querySelector('.org-content');
                
                // Reset and animate image
                if (enteringImg) {
                    gsap.fromTo(enteringImg,
                        { scale: 1.05 },
                        { scale: 1.12, duration: autoPlayDelay / 1000, ease: 'none' }
                    );
                }
                
                // Fade in content with slide effect
                if (enteringContent) {
                    gsap.fromTo(enteringContent,
                        { opacity: 0, x: direction * 30, y: 0 },
                        { 
                            opacity: 1, 
                            x: 0, 
                            y: 0, 
                            duration: 0.7, 
                            ease: 'power2.out', 
                            delay: 0.3 
                        }
                    );
                }
            }
            
            // Reset autoplay
            resetAutoPlay();
        }
        
        // Navigate
        function nextSlide() {
            goToSlide((currentIndex + 1) % slides.length);
        }
        
        function prevSlide() {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const carousel = document.querySelector('.organizations-carousel');
            if (!carousel) return;
            
            const rect = carousel.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (diff > swipeThreshold) {
                nextSlide();
            } else if (diff < -swipeThreshold) {
                prevSlide();
            }
        }
        
        // Auto-play
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }
        
        function resetAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
            startAutoPlay();
        }
        
        // Pause on hover
        const carousel = document.querySelector('.organizations-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }
        
        // Setup scroll-triggered shrink and fade for carousel container
        this.setupCarouselScrollTransition(carouselSection, carouselContainer);
        
        // Initialize first slide
        goToSlide(0);
    }
    
    setupCarouselScrollTransition(carouselSection, carouselContainer) {
        if (!carouselSection || !carouselContainer) return;
        
        // Wait for ScrollTrigger
        if (typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.setupCarouselScrollTransition(carouselSection, carouselContainer), 100);
            return;
        }
        
        // Create ScrollTrigger for carousel container shrink/fade when scrolling to footer
        ScrollTrigger.create({
            trigger: '.site-footer',
            start: 'top bottom',
            end: 'top 20%',
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Scale down from 1 to 0.85
                const scale = 1 - (progress * 0.15);
                // Fade from 1 to 0
                const opacity = 1 - progress;
                // Move down slightly
                const y = progress * 30;
                
                gsap.set(carouselContainer, {
                    scale: scale,
                    opacity: opacity,
                    y: y
                });
            }
        });
    }
    
    setupFooterReveal() {
        const footer = document.querySelector('.site-footer');
        const globeCanvas = document.getElementById('globe-canvas');
        
        if (!footer) return;
        
        // Initialize globe if canvas exists
        if (globeCanvas) {
            this.initGlobe(globeCanvas);
        }
        
        // Simple scroll animation for footer elements
        this.setupFooterScrollAnimations();
    }
    
    setupFooterScrollAnimations() {
        // Wait for ScrollTrigger
        if (typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.setupFooterScrollAnimations(), 100);
            return;
        }
        
        const words = document.querySelectorAll('.footer-phrase-word');
        const footerBrand = document.querySelector('.footer-brand-section');
        const footerSocials = document.querySelector('.footer-socials');
        const footerCopyright = document.querySelector('.footer-copyright');
        
        // Set initial states
        gsap.set(words, { opacity: 0, rotateX: 90, y: 20 });
        gsap.set(footerBrand, { opacity: 0, y: 20 });
        gsap.set(footerSocials, { opacity: 0, x: 30 });
        gsap.set(footerCopyright, { opacity: 0 });
        
        // Create timeline for footer animations
        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.site-footer',
                start: 'top 50%',
                end: 'top 10%',
                scrub: 1
            }
        });
        
        // Animate words one by one
        words.forEach((word, index) => {
            footerTl.to(word, {
                opacity: 1,
                rotateX: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, index * 0.1);
        });
        
        // Animate brand
        footerTl.to(footerBrand, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.3);
        
        // Animate socials
        footerTl.to(footerSocials, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.5);
        
        // Animate copyright
        footerTl.to(footerCopyright, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        }, 0.7);
    }
    
    initGlobe(canvas) {
        // Three.js Globe with particles from GLB model
        if (typeof THREE === 'undefined') {
            // Load Three.js dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                // Load GLTFLoader
                const loaderScript = document.createElement('script');
                loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
                loaderScript.onload = () => {
                    this.createGlobeScene(canvas);
                };
                document.head.appendChild(loaderScript);
            };
            document.head.appendChild(script);
        } else {
            this.createGlobeScene(canvas);
        }
    }
    
    createGlobeScene(canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        camera.position.z = 4;
        
        // Mouse tracking for interaction
        const mouse = new THREE.Vector2(9999, 9999);
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.5;
        
        // Track mouse position
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.x = 9999;
            mouse.y = 9999;
        });
        
        // Load GLB model and create particles
        const loader = new THREE.GLTFLoader();
        loader.load('assets/models/globe.glb', (gltf) => {
            const model = gltf.scene;
            
            // Extract vertices from the model - x10 particles
            const particles = [];
            model.traverse((child) => {
                if (child.isMesh) {
                    const geometry = child.geometry;
                    const positionAttribute = geometry.getAttribute('position');
                    
                    if (positionAttribute) {
                        // Get all vertices, not just every 3rd
                        for (let i = 0; i < positionAttribute.count; i++) {
                            // Add original vertex
                            particles.push(
                                positionAttribute.getX(i),
                                positionAttribute.getY(i),
                                positionAttribute.getZ(i)
                            );
                            // Add 9 more particles nearby for x10 density
                            for (let j = 0; j < 9; j++) {
                                const offset = 0.02;
                                particles.push(
                                    positionAttribute.getX(i) + (Math.random() - 0.5) * offset,
                                    positionAttribute.getY(i) + (Math.random() - 0.5) * offset,
                                    positionAttribute.getZ(i) + (Math.random() - 0.5) * offset
                                );
                            }
                        }
                    }
                }
            });
            
            // Create particle geometry
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particles);
            const originalPositions = new Float32Array(particles);
            // Random offsets for swarming effect
            const swarmOffsets = new Float32Array(particles.length);
            const swarmSpeeds = new Float32Array(particles.length / 3);
            const particleSizes = new Float32Array(particles.length / 3);
            
            for (let i = 0; i < particles.length; i++) {
                swarmOffsets[i] = Math.random() * Math.PI * 2;
            }
            for (let i = 0; i < swarmSpeeds.length; i++) {
                swarmSpeeds[i] = (0.5 + Math.random() * 1.5) * 3; // x3 speed
            }
            for (let i = 0; i < particleSizes.length; i++) {
                particleSizes[i] = 0.0167 * (0.7 + Math.random() * 0.6); // 0.05/3 with ±30% variation
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particleGeometry.setAttribute('customSize', new THREE.BufferAttribute(particleSizes, 1));
            
            // Store original positions and swarm data
            particleGeometry.userData.originalPositions = originalPositions;
            particleGeometry.userData.swarmOffsets = swarmOffsets;
            particleGeometry.userData.swarmSpeeds = swarmSpeeds;
            
            // Particle material - bright white, round particles with varying sizes
            const particleMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.0167, // Base size (0.05 / 3)
                transparent: true,
                opacity: 0,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                vertexColors: false
            });
            
            // Use custom shader for varying particle sizes
            particleMaterial.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    'void main() {',
                    'attribute float customSize;\nvoid main() {'
                );
                shader.vertexShader = shader.vertexShader.replace(
                    'gl_PointSize = size * ( scale / - mvPosition.z );',
                    'gl_PointSize = customSize * ( scale / - mvPosition.z );'
                );
            };
            
            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            particleSystem.scale.set(0.35, 0.35, 0.35);
            
            scene.add(particleSystem);
            
            // Fade in globe after a short delay
            setTimeout(() => {
                gsap.to(particleSystem.material, {
                    opacity: 0.95,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }, 500);
            
            // Time for animation
            let time = 0;
            let lastTime = performance.now();
            
            // Store mouse world position persistently
            const mouseWorld = new THREE.Vector3(9999, 9999, 9999);
            
            // Animation loop with mouse interaction and swarming
            const animate = () => {
                requestAnimationFrame(animate);
                
                // Calculate delta time for consistent animation speed
                const now = performance.now();
                const deltaTime = (now - lastTime) / 1000;
                lastTime = now;
                
                time += deltaTime;
                
                // Slow rotation
                particleSystem.rotation.y += 0.002;
                
                // Get mouse position in world space - project onto a plane at z=0
                if (mouse.x !== 9999) {
                    // Create a plane at z=0 to intersect with
                    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                    raycaster.setFromCamera(mouse, camera);
                    raycaster.ray.intersectPlane(planeZ, mouseWorld);
                    if (!mouseWorld) mouseWorld.set(9999, 9999, 9999);
                } else {
                    mouseWorld.set(9999, 9999, 9999);
                }
                
                // Transform mouse to local particle space (accounting for scale and rotation)
                const localMouse = mouseWorld.clone();
                particleSystem.updateMatrixWorld();
                const inverseMatrix = new THREE.Matrix4().copy(particleSystem.matrixWorld).invert();
                localMouse.applyMatrix4(inverseMatrix);
                
                const positions = particleGeometry.attributes.position.array;
                const originals = particleGeometry.userData.originalPositions;
                const offsets = particleGeometry.userData.swarmOffsets;
                const speeds = particleGeometry.userData.swarmSpeeds;
                
                // Adjusted values for better visibility - TANGENTIAL movement on surface
                const repelRadius = 4.0;
                const repelStrength = 1.5;
                const returnSpeed = 0.08;
                const swarmAmount = 0.12; // Angular displacement amount (radians)
                
                for (let i = 0; i < positions.length; i += 3) {
                    const idx = i / 3;
                    const ox = originals[i];
                    const oy = originals[i + 1];
                    const oz = originals[i + 2];
                    
                    // Calculate the radius (distance from center) to keep particles on surface
                    const radius = Math.sqrt(ox * ox + oy * oy + oz * oz);
                    if (radius < 0.001) continue; // Skip center particles
                    
                    // Convert original position to spherical coordinates
                    const theta = Math.atan2(oz, ox); // Angle in XZ plane
                    const phi = Math.acos(oy / radius); // Angle from Y axis
                    
                    // Apply angular displacement (swarm on the surface)
                    const angularSpeed1 = speeds[idx] * 0.3;
                    const angularSpeed2 = speeds[idx] * 0.25;
                    
                    const thetaOffset = Math.sin(time * angularSpeed1 + offsets[i]) * swarmAmount;
                    const phiOffset = Math.cos(time * angularSpeed2 + offsets[i + 1]) * swarmAmount * 0.5;
                    
                    // New spherical coordinates with swarm
                    const newTheta = theta + thetaOffset;
                    const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + phiOffset)); // Clamp phi
                    
                    // Convert back to Cartesian (target position on surface)
                    const targetX = radius * Math.sin(newPhi) * Math.cos(newTheta);
                    const targetY = radius * Math.cos(newPhi);
                    const targetZ = radius * Math.sin(newPhi) * Math.sin(newTheta);
                    
                    // Distance from mouse in local space
                    const dx = positions[i] - localMouse.x;
                    const dy = positions[i + 1] - localMouse.y;
                    const dz = positions[i + 2] - localMouse.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    
                    if (dist < repelRadius && mouse.x !== 9999) {
                        // Repel particles away from mouse - tangentially on the surface
                        const force = Math.pow(1 - dist / repelRadius, 2) * repelStrength;
                        const len = dist || 0.001;
                        
                        // Push away from mouse
                        let newX = positions[i] + (dx / len) * force;
                        let newY = positions[i + 1] + (dy / len) * force;
                        let newZ = positions[i + 2] + (dz / len) * force;
                        
                        // Re-project onto the surface (maintain radius)
                        const newRadius = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
                        if (newRadius > 0.001) {
                            positions[i] = (newX / newRadius) * radius;
                            positions[i + 1] = (newY / newRadius) * radius;
                            positions[i + 2] = (newZ / newRadius) * radius;
                        }
                    } else {
                        // Smoothly move to swarming target position (already on surface)
                        positions[i] += (targetX - positions[i]) * returnSpeed;
                        positions[i + 1] += (targetY - positions[i + 1]) * returnSpeed;
                        positions[i + 2] += (targetZ - positions[i + 2]) * returnSpeed;
                    }
                }
                
                particleGeometry.attributes.position.needsUpdate = true;
                
                renderer.render(scene, camera);
            };
            
            animate();
        }, undefined, (error) => {
            console.warn('Could not load globe model, creating fallback sphere');
            // Fallback: Create a simple sphere of particles
            this.createFallbackGlobe(scene, camera, renderer, canvas, mouse, raycaster);
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    }
    
    createFallbackGlobe(scene, camera, renderer, canvas, mouse, raycaster) {
        // Create sphere particles as fallback - x10 particles
        const particleCount = 30000;
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const swarmOffsets = new Float32Array(particleCount * 3);
        const swarmSpeeds = new Float32Array(particleCount);
        const particleSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.6;
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;
            
            swarmOffsets[i * 3] = Math.random() * Math.PI * 2;
            swarmOffsets[i * 3 + 1] = Math.random() * Math.PI * 2;
            swarmOffsets[i * 3 + 2] = Math.random() * Math.PI * 2;
            swarmSpeeds[i] = (0.5 + Math.random() * 1.5) * 3; // x3 speed
            particleSizes[i] = 0.0167 * (0.7 + Math.random() * 0.6); // Variable size
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('customSize', new THREE.BufferAttribute(particleSizes, 1));
        geometry.userData.originalPositions = originalPositions;
        geometry.userData.swarmOffsets = swarmOffsets;
        geometry.userData.swarmSpeeds = swarmSpeeds;
        
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.0167, // 0.05 / 3
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Custom shader for varying sizes
        material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                'attribute float customSize;\nvoid main() {'
            );
            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size * ( scale / - mvPosition.z );',
                'gl_PointSize = customSize * ( scale / - mvPosition.z );'
            );
        };
        
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Fade in after short delay
        setTimeout(() => {
            gsap.to(material, {
                opacity: 0.95,
                duration: 1.5,
                ease: 'power2.out'
            });
        }, 500);
        
        let time = 0;
        let lastTime = performance.now();
        const mouseWorld = new THREE.Vector3(9999, 9999, 9999);
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            const now = performance.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;
            
            time += deltaTime;
            particles.rotation.y += 0.002;
            
            // Get mouse position in world space - project onto a plane at z=0
            if (mouse.x !== 9999) {
                const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                raycaster.setFromCamera(mouse, camera);
                raycaster.ray.intersectPlane(planeZ, mouseWorld);
                if (!mouseWorld) mouseWorld.set(9999, 9999, 9999);
            } else {
                mouseWorld.set(9999, 9999, 9999);
            }
            
            const pos = geometry.attributes.position.array;
            const orig = geometry.userData.originalPositions;
            const offsets = geometry.userData.swarmOffsets;
            const speeds = geometry.userData.swarmSpeeds;
            
            const repelRadius = 2.5;
            const repelStrength = 1.2;
            const returnSpeed = 0.08;
            const swarmAmount = 0.12; // Angular displacement
            
            for (let i = 0; i < pos.length; i += 3) {
                const idx = i / 3;
                const ox = orig[i];
                const oy = orig[i + 1];
                const oz = orig[i + 2];
                
                // Calculate the radius (distance from center) to keep particles on surface
                const radius = Math.sqrt(ox * ox + oy * oy + oz * oz);
                if (radius < 0.001) continue;
                
                // Convert to spherical coordinates
                const theta = Math.atan2(oz, ox);
                const phi = Math.acos(oy / radius);
                
                // Angular swarm displacement (tangential to surface) - faster
                const angularSpeed1 = speeds[idx] * 0.9; // 0.3 * 3
                const angularSpeed2 = speeds[idx] * 0.75; // 0.25 * 3
                
                const thetaOffset = Math.sin(time * angularSpeed1 + offsets[i]) * swarmAmount;
                const phiOffset = Math.cos(time * angularSpeed2 + offsets[i + 1]) * swarmAmount * 0.5;
                
                const newTheta = theta + thetaOffset;
                const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + phiOffset));
                
                // Convert back to Cartesian (on surface)
                const targetX = radius * Math.sin(newPhi) * Math.cos(newTheta);
                const targetY = radius * Math.cos(newPhi);
                const targetZ = radius * Math.sin(newPhi) * Math.sin(newTheta);
                
                const dx = pos[i] - mouseWorld.x;
                const dy = pos[i + 1] - mouseWorld.y;
                const dz = pos[i + 2] - mouseWorld.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < repelRadius && mouse.x !== 9999) {
                    const force = Math.pow(1 - dist / repelRadius, 2) * repelStrength;
                    const len = dist || 0.001;
                    
                    let newX = pos[i] + (dx / len) * force;
                    let newY = pos[i + 1] + (dy / len) * force;
                    let newZ = pos[i + 2] + (dz / len) * force;
                    
                    // Re-project onto surface
                    const newRadius = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
                    if (newRadius > 0.001) {
                        pos[i] = (newX / newRadius) * radius;
                        pos[i + 1] = (newY / newRadius) * radius;
                        pos[i + 2] = (newZ / newRadius) * radius;
                    }
                } else {
                    pos[i] += (targetX - pos[i]) * returnSpeed;
                    pos[i + 1] += (targetY - pos[i + 1]) * returnSpeed;
                    pos[i + 2] += (targetZ - pos[i + 2]) * returnSpeed;
                }
            }
            
            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };
        
        animate();
    }
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Load ScrollTrigger plugin
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    script.onload = () => {
        new ScrollAnimations();
    };
    document.head.appendChild(script);
});
