// Interactive cursor
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorSize = 20;

// Variables for section scrolling
let sections = [];
let navLinks = [];
let isScrolling = false;
let currentSectionIndex = 0;
let allowScrolling = true;
let wheelDirection = 0;
let lastScrollTime = 0;
let scrollCooldown = 600; // ms between scroll actions

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Cursor animation
const animateCursor = () => {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    requestAnimationFrame(animateCursor);
};
animateCursor();

// Cursor hover effects
const setupCursorHoverEffects = () => {
    const hoverElements = document.querySelectorAll('a, button, .track, .platform-link, .social-link');
    hoverElements.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.backgroundColor = 'var(--secondary-color)';
        });

        link.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--primary-color)';
        });
    });
};

// Interactive background with Three.js
const createBackground = () => {
    const container = document.getElementById('canvas-container');

    // Only initialize if container exists
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    container.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;

    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;

        // Create gradient colors for particles
        if (i % 3 === 0) {
            colorArray[i] = 0.89;     // R: primary color value
            colorArray[i+1] = 0.17;   // G: primary color value
            colorArray[i+2] = 0.44;   // B: primary color value
        } else if (i % 5 === 0) {
            colorArray[i] = 0.23;     // R: secondary color value
            colorArray[i+1] = 0.51;   // G: secondary color value
            colorArray[i+2] = 0.96;   // B: secondary color value
        } else {
            colorArray[i] = 1;        // R: white
            colorArray[i+1] = 1;      // G: white
            colorArray[i+2] = 1;      // B: white
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        transparent: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 4;

    // Mouse movement effect
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        particlesMesh.rotation.x += mouseY * 0.003;
        particlesMesh.rotation.y += mouseX * 0.003;
    });

    // Mobile gyroscope support
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const x = event.beta ? event.beta / 180 : 0;
            const y = event.gamma ? event.gamma / 180 : 0;

            particlesMesh.rotation.x += x * 0.01;
            particlesMesh.rotation.y += y * 0.01;
        });
    }

    // Animation loop
    const animate = () => {
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize background
createBackground();

// Scroll animations with GSAP and ScrollTrigger
const initScrollAnimations = () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate header on scroll
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: 'header' }
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelectorAll('p, .music-container, .about-text, .contact-form, .social-links');

        if (title) {
            gsap.from(title, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            });
        }

        if (content.length) {
            gsap.from(content, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'top 40%',
                    scrub: 1
                }
            });
        }
    });

    // Parallax effect for about image
    gsap.to('.about-image', {
        y: -50,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Staggered animation for music platforms
    const platforms = document.querySelectorAll('.platform-link');
    gsap.from(platforms, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.music-platforms',
            start: 'top 80%'
        }
    });

    // Animate featured tracks
    const tracks = document.querySelectorAll('.track');
    gsap.from(tracks, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.featured-tracks',
            start: 'top 80%'
        }
    });

    // Change track color on hover
    tracks.forEach(track => {
        const color = track.getAttribute('data-color');
        track.addEventListener('mouseenter', () => {
            gsap.to(track, {
                boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${color}40`,
                duration: 0.3
            });
        });

        track.addEventListener('mouseleave', () => {
            gsap.to(track, {
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                duration: 0.3
            });
        });
    });
};

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize auto-scrolling and active menu functionality
const initSectionScrolling = () => {
    // Get all sections and navigation links
    sections = Array.from(document.querySelectorAll('section'));
    navLinks = Array.from(document.querySelectorAll('.nav-link'));

    // Set up scroll snap points
    gsap.utils.toArray('section').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                updateActiveSection(section.id);
            },
            onEnterBack: () => {
                updateActiveSection(section.id);
            }
        });
    });

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Set up wheel event listener for auto-scrolling
    window.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Prevent default arrow key scrolling and use our custom scrolling
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();

            if (!allowScrolling || isScrolling) return;

            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown) return;

            lastScrollTime = now;

            if (e.key === 'ArrowDown') {
                nextSection();
            } else {
                prevSection();
            }
        }
    });

    // Touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!allowScrolling || isScrolling) return;

        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;

        touchEndY = e.changedTouches[0].screenY;
        const touchDiff = touchStartY - touchEndY;

        if (Math.abs(touchDiff) < 50) return; // Ignore small swipes

        lastScrollTime = now;

        if (touchDiff > 0) {
            nextSection();
        } else {
            prevSection();
        }
    }, { passive: true });

    // Initial active section
    updateActiveSection(getCurrentSection());
};

// Get current section based on scroll position
const getCurrentSection = () => {
    // Check if at footer first
    if (isAtFooter()) {
        currentSectionIndex = sections.length - 1; // Set to last section index
        return 'contact'; // Return contact section ID when at footer
    }

    const scrollPosition = window.scrollY + (window.innerHeight / 3);

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionIndex = i;
            return section.id;
        }
    }

    // Default to first section if nothing else matches
    currentSectionIndex = 0;
    return sections[0].id;
};

// Update active class on navigation links
const updateActiveSection = (sectionId) => {
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Scroll to a specific section
const scrollToSection = (sectionId) => {
    if (!allowScrolling) return;

    allowScrolling = false;
    isScrolling = true;

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        allowScrolling = true;
        return;
    }

    // Use a custom scroll animation that's smoother
    gsap.to(window, {
        duration: 0.8, // Slightly faster for better responsiveness
        scrollTo: {
            y: targetSection,
            offsetY: 0,
            autoKill: false
        },
        ease: "power3.out", // Better easing function
        onComplete: () => {
            isScrolling = false;
            setTimeout(() => {
                allowScrolling = true;
                updateActiveSection(sectionId);
            }, 100);
        }
    });
};

// Handle wheel scrolling
const handleWheelScroll = (e) => {
    // Prevent default scrolling to take full control
    e.preventDefault();

    // Get current time to throttle scroll events
    const now = Date.now();

    if (!allowScrolling || isScrolling || now - lastScrollTime < scrollCooldown) {
        return;
    }

    // Determine scroll direction with a more significant threshold
    if (Math.abs(e.deltaY) < 5) return; // Ignore very small movements
    wheelDirection = e.deltaY > 0 ? 1 : -1;

    // Update current section before scrolling
    getCurrentSection();

    // Set last scroll time
    lastScrollTime = now;

    // Immediately scroll without setTimeout
    if (wheelDirection > 0) {
        nextSection();
    } else {
        prevSection();
    }
};

// Scroll to next section
const nextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
        // Not at the last section yet, go to next section
        const nextIndex = currentSectionIndex + 1;
        scrollToSection(sections[nextIndex].id);
    } else {
        // At the last section, scroll to footer
        scrollToFooter();
    }
};

// Scroll to previous section
const prevSection = () => {
    // If we're at the footer, scroll to the last section
    if (isAtFooter()) {
        scrollToSection(sections[sections.length - 1].id);
        return;
    }

    // Otherwise scroll to previous section normally
    if (currentSectionIndex > 0) {
        const prevIndex = currentSectionIndex - 1;
        scrollToSection(sections[prevIndex].id);
    }
};

// Check if currently at the footer
const isAtFooter = () => {
    const footer = document.querySelector('footer');
    if (!footer) return false;

    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // If footer is in view
    return footerTop < windowHeight - 100;
};

// Scroll to the footer
const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if (!allowScrolling) return;

    allowScrolling = false;
    isScrolling = true;

    gsap.to(window, {
        duration: 0.8,
        scrollTo: {
            y: footer,
            offsetY: 0,
            autoKill: false
        },
        ease: "power3.out",
        onComplete: () => {
            isScrolling = false;
            setTimeout(() => {
                allowScrolling = true;
                updateActiveSection('contact'); // Highlight contact in menu when at footer
            }, 100);
        }
    });
};

// Initialize scroll animations when content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize animations
    initScrollAnimations();

    // Initialize section scrolling
    initSectionScrolling();

    // Initialize cursor hover effects
    setupCursorHoverEffects();

    // Load GSAP ScrollTo plugin
    const scrollToScript = document.createElement('script');
    scrollToScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js';
    scrollToScript.onload = () => {
        console.log('ScrollToPlugin loaded');
    };
    document.head.appendChild(scrollToScript);

    // Add hover effects for contact person section
    const contactPerson = document.querySelector('.contact-person');
    if (contactPerson) {
        contactPerson.addEventListener('mouseenter', () => {
            gsap.to(contactPerson, {
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--primary-color)40',
                duration: 0.3
            });
        });

        contactPerson.addEventListener('mouseleave', () => {
            gsap.to(contactPerson, {
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                duration: 0.3
            });
        });
    }

    // Initialize music notes
    addMusicNotes();
    animateMusicNotes();
});

// Add page transition effects
window.addEventListener('beforeunload', () => {
    gsap.to('body', {
        opacity: 0,
        duration: 0.5
    });
});

// Music note SVG paths for different note symbols
const musicNoteSVGs = [
    // Quarter note
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.4 1.5l-304 48C153.1 51.4 144 61.7 144 73.9V372.7l-106.5 31C16 411 0 432.6 0 456.9 0 484.1 21.5 512 48 512c.5 0 1.1 0 1.6-.1l215.4-31.7c11.3-1.6 19.6-11.1 19.6-22.6 0-2.3-.3-4.6-.8-6.8-.1-.5-.2-.9-.3-1.4-.6-2.6-1.6-5-2.8-7.3-.5-1-1.1-1.9-1.7-2.8-1.6-2.2-3.4-4.1-5.6-5.7-1-.7-2-1.4-3.1-2-2.6-1.5-5.5-2.6-8.6-3.2l-74.3-15v-13.3l304-48c8.4-1.3 14.3-8.8 14.3-17.4V16.5c0-10.4-9.3-18.5-19.6-17zM88 448c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zM480 364.2L176 412.3v-338l304-48.1z"></path></svg>',
    // Eighth note
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M489.2 101.1l-13.4 75.7c-5.4-4.6-11.7-8.5-18.6-11.1V32.2L331.3 95.6l-132.5 46.3V389.3l-63.6 22.2c-5.5-5-13.2-8.1-21.8-8.1-17.7 0-31.9 11.8-31.9 26.4S95.7 456.2 113.4 456.2c17.7 0 31.9-11.8 31.9-26.4 0-2.1-.4-4.1-.9-6.1l84.4-29.5V176.1l132.5-46.3 99.6-53.1v65L454.4 133c-1.7-1.5-3.6-2.8-5.6-4.1 4.6-1.1 9.5-1.9 14.3-2.3 10.1-.7 19.9.5 28.6 3.1-1.2 12.3-1.9 30.9-2.5 71.4zm-349.5 333c-14.6 0-26.4-10.4-26.4-23 0-12.6 11.8-23 26.4-23s26.4 10.4 26.4 23c0 12.6-11.9 23-26.4 23zm336.3-326.5c-39.4 0-73.2 23.2-73.2 61.3 0 40.3 18.7 71.5 46.3 71.5 13.3 0 25.6-7.5 25.6-23.7 0-12.9-8.3-22.9-21.4-22.9-8.2 0-14.9 3-19.1 9.7-3.3-8.1-4.9-17.7-4.9-27.5 0-27.2 19.1-47.5 42.3-47.5 23.3 0 42.4 20.3 42.4 47.5 0 70.7-50.5 132.8-95.7 159.4-40.3 23.7-80.6 37.4-122.2 37.4h-40.9v20.9h40.9c45.3 0 89.2-15.1 131.7-39.9 43.7-25.6 106.3-90.9 106.3-177.8 0-37.5-26-58.4-58.1-58.4z"></path></svg>',
    // Sixteenth note
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M184.1 457c-15.4 0-28-10.8-28-24s12.6-24 28-24 28 10.8 28 24-12.6 24-28 24zm171-288.1c-41.8 0-77.5 24.2-77.5 63.4 0 42.3 20 74.9 49.5 74.9 14.6 0 27.6-8.1 27.6-25.4 0-13.9-9.2-24.7-23.3-24.7-9.6 0-17.1 4.2-21.7 12.2-3.8-9.1-6.1-19.6-6.1-31 0-30.4 21.7-48.2 45.7-48.2 25.5 0 45.7 18.5 45.7 48.2 0 56.6-35.4 104.2-84.2 135.4-33.1 21.1-68.3 35.1-106.4 37.5V118.7L70.7 144C65 139 56.9 136 48 136c-17.7 0-32 11.8-32 26.4s14.3 26.4 32 26.4c17.7 0 32-11.8 32-26.4 0-2.1-.4-4.1-.9-6.1L144 136v160.3c-30.6 4-50.3 30.7-50.3 69 0 38.3 23.3 62.7 57.3 62.7 23.3 0 45.8-12.2 55.9-33.1 3.7 20.3 21.6 33.1 45.5 33.1 33.5 0 59.3-23.2 59.3-55.6 0-11.3-2.6-21.9-7.5-30.9 34.8-26.4 74.4-69.9 74.4-138.9-.2-38.3-30.3-59.3-64.5-59.3zm-118.9 239c-1.3.7-2.6 1.2-3.8 1.8-8.1 3.9-15.4 5.8-21.8 5.8-23.3 0-38.5-15.4-38.5-43.3 0-36.1 24.2-49.2 47.5-50.2V374c.1 13.8 5.9 25.7 16.6 33.9zm81.7 10.2c-22.3 0-33.4-13.7-33.4-33.1 0-1.3.1-2.5.2-3.8 1.2-38.2 30.5-59 36.7-61l.7 58.2c0 24.4-11.7 39.7-4.2 39.7zm127.7-318.8l-13.4 75.7c-5.4-4.6-11.7-8.5-18.6-11.1V32.2L331.3 95.6l-82.1 28.7v289.9c-6.2.1-12 1.9-16.8 5.1l-26.6-8.9V176.1L322 129.5l99.6-53.1v65L454.4 133c-1.7-1.5-3.6-2.8-5.6-4.1 4.6-1.1 9.5-1.9 14.3-2.3 10.1-.7 19.9.5 28.6 3.1-1.3 12.3-2 30.9-2.6 71.4zM48 172c-5.1 0-9.2-4.1-9.2-9.2 0-5.1 4.2-9.2 9.2-9.2s9.2 4.1 9.2 9.2c0 5-4.1 9.2-9.2 9.2z"></path></svg>',
    // Treble clef
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M413.7 259.3c0-30-18.8-54-62.9-65.9 5.1-24.2 9.3-47.8 9.3-71.1 0-67.4-44.8-124.4-154.3-93-4.1 1.2-7.7 5.3-5.4 10.5 2.3 5.2 9.7 2.5 13.9 1.2 75.3-25.1 111.5 14.7 111.5 81.3 0 16.3-2.9 32.2-6 47.8-8.6-1.1-17.6-1.7-27.1-1.7-38.2 0-69.3 23.8-69.3 53.2 0 35.1 31.2 53.2 69.1 53.2 18.7 0 36.8-4.2 50-13.4 18.9 33.3 38.2 59.9 54.3 83.6 3.2 4.7 6.5 8.2 11.1 8.2 7 0 11.1-7.5 7.1-13.4-23.9-34.6-46.4-64.1-64.1-95 3.1-4.8 7.9-9.2 12.6-9.2 8.1 0 11.4 8.7 11.1 18.3-.3 6.7-1.1 13.2-2.3 19-1.2 5.6 3 8.4 7.6 8.4 5.5 0 9-2.9 10.1-9.5 1.4-8.5 3.4-12.3 9.5-12.3 5.6 0 7.6 3.6 7.7 9.8.1 5.7-.3 11.5-.8 17.2-.4 5.7 3.7 7.9 8.5 7.9 5 0 8.4-2.1 9.7-7.4 1.4-5.3 2.1-10.5 2.1-15.9 0-8.9-1.8-18.7-13-18.7-12.8 0-19.1 16.1-19.1 16.1s-4.6-16.1-17.2-16.1c-9.2 0-18.3 6.4-23.7 14 2.5-8.2 4.2-16.7 5.5-25.5 25.6 10.3 35.9 25.3 35.9 43.9zm-121.1 5.5c-14.9 0-30.9-6.4-30.9-25.9 0-19.5 16-25.9 30.9-25.9 3.1 0 6 .3 8.9.8-3.8 16.6-7.7 33.2-13.8 49.7-5.2-.2-10.4-1-18.9-1 2.9-4.2 5.4-8.7 7.8-13.3 1.9-3.9-1.1-10.1-6.2-10.1-1.8 0-3.8.9-5.2 3.4-8.4 14.9-14.7 22-26.4 31.2-2.3 1.8-2.2 6.9 1.3 8.7 2.8 1.5 7.2 1.2 9.2-.7 6.8-6.3 12.1-11.9 16.5-18.4 14.1 1.9 18.4 5.9 26.1 5.9 6.9 0 13.7-2 20.5-5.9 2.6 4.8 5.3 9.5 8.2 14.1-14.2 9.2-31.5 10.5-46.9 10.5z"></path></svg>',
    // Bass clef
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M461.9 243.9c0-81.4-43.6-107.5-87.7-101.4-13.2 1.8-29.1 12.4-49.5 14.1V83.2h37.5c7.3 0 13.2-5.9 13.2-13.2s-5.9-13.2-13.2-13.2h-37.5V46.7c0-7.3-5.9-13.2-13.2-13.2s-13.2 5.9-13.2 13.2V57H271c-7.3 0-13.2 5.9-13.2 13.2S263.7 83.5 271 83.5h27.1v73.6c-20.6-1.6-41.9-2.4-63-2.4-10.4 0-20.7 2.2-30.7 5.2 10.6-12.5 17.6-28.5 17.6-46.6 0-30-12.1-55.8-30.7-68.7-21.4-14.9-48.9-5.1-48.9 22.9 0 14.3 11.6 25.9 25.9 25.9s25.9-11.6 25.9-25.9c0-2.2-1.8-4-1.6-4.6.7-.5 1.4-.9 2.1-1.1 7.7-1.3 18 4.6 18 25.8 0 20.9-10.8 40.2-29.1 52.8-4.2 2.9-8.7 5.5-13.6 7.7-12.8 5.6-27.2 8.8-42.4 8.8-58.3 0-105.5-47.2-105.5-105.5v-.6c-2 1.4-4.3 2.2-6.6 2.2-6.6 0-12-5.4-12-12s5.4-12 12-12c2.3 0 4.6.7 6.6 2.2v-2.6c0-73.7 58.2-133.4 130.4-133.4 72.3 0 130.4 59.7 130.4 133.4v2.6c2-1.4 4.3-2.2 6.6-2.2 6.6 0 12 5.4 12 12s-5.4 12-12 12c-2.3 0-4.6-.7-6.6-2.2v.6c0 48.4-32.5 89.1-76.9 101.4 8.8-6.5 13.6-14.5 13.6-23.1 0-23-30.4-36.7-63.9-39.7-32.8-2.9-59.5 5.5-59.5 28.6 0 14.2 16.7 22.4 40.2 25.5 23.5 3.1 45.3-2.6 45.3-16.8 0-11.2-18.4-18.1-31.7-18.1-13.2 0-15.7 5.6-15.7 9.6.2 4 4.4 7.1 9.4 7.1 5.5 0 9.9-4.4 9.9-9.9 0-3.3-1.6-6.4-4.1-8.1-.6-.4-.9-.7-.4-1.1 1.3-1.1 4.8-1.1 8.4-1.1 8.1 0 16 3.3 16 11.6 0 10.1-14.5 14.1-30.4 11.9-15.9-2.1-30.7-10.4-30.7-21.3 0-10.1 9.5-18.8 35.4-16.5 25.9 2.4 52.1 13.6 52.1 27.7 0 14.6-16.9 25.1-36.4 30.5 56.2 5.7 100.1 53.5 100.1 111.1 0 58.2-44.6 106.3-101.4 111v5.2c2-1.4 4.3-2.2 6.6-2.2 6.6 0 12 5.4 12 12s-5.4 12-12 12c-2.3 0-4.6-.7-6.6-2.2v.6c0 73.7-58.2 133.4-130.4 133.4-72.3 0-130.4-59.7-130.4-133.4v-2.6c-2 1.4-4.3 2.2-6.6 2.2-6.6 0-12-5.4-12-12s5.4-12 12-12c2.3 0 4.6.7 6.6 2.2v-.6c0-61.6 49.9-111.5 111.5-111.5 24.1 0 46.3 7.9 64.6 21 7.4-2.2 14.6-5 21.4-8.3-5.2 2.4-10.7 4.3-16.6 5.8-8.2 2-15.1 4.5-20.9 7.6-17.8 9.5-30.2 27.2-30.2 48 0 30 12.1 55.8 30.7 68.7 21.4 14.9 48.9 5.1 48.9-22.9 0-14.3-11.6-25.9-25.9-25.9s-25.9 11.6-25.9 25.9c0 2.2 1.8 4 1.6 4.6-.7.5-1.4.9-2.1 1.1-7.7 1.3-18-4.6-18-25.8 0-21.3 11.5-40.9 30.7-53.5 4.9-3.2 10.1-5.9 15.7-8.1 5.3-2.1 12.5-3.2 19.6-3.2 3.6 0 19.7 1.8 26.9 1.8 41.6 0 82.5-12.5 82.5-61 0-48.6-41.5-73.9-79.1-73.9-8.6 0-15.1 2.3-20.7 4.3 11.2 11.4 18.1 27 18.1 44.2 0 34.7-28.1 62.8-62.8 62.8s-62.8-28.1-62.8-62.8c0-28.3 18.6-52.1 44.2-60.1-4.8-16.7-19.9-28.7-37.9-28.7-21.8 0-39.4 17.6-39.4 39.4 0 16 9.6 29.7 23.4 35.9-48.4-7.5-85.5-49.3-85.5-99.9 0-55.7 45.1-100.8 100.8-100.8 45.9 0 84.5 30.7 96.6 72.6 24.6-22.3 31.9-58.3 31.9-58.3s34.4 36.4 34.4 85.7c0 38.2-16.3 65.5-35.1 65.5-12.3 0-22.3-10-22.3-22.3V224c0-47.6 46.2-68.3 84.9-68.3 60.5 0 94.3 38.1 94.3 88.2zM167.8 401.2c-14.3 0-25.9-11.6-25.9-25.9s11.6-25.9 25.9-25.9 25.9 11.6 25.9 25.9-11.6 25.9-25.9 25.9zm226.5-158c0 21.9-20.8 34.5-56 34.5-3.6 0-6.9-.2-10-.4 17.3-8.1 29.4-25.6 29.4-45.9 0-9.6-2.7-18.5-7.4-26.2 6.8-2.7 15.4-4.3 25.4-4.3 38.5 0 18.6 42.3 18.6 42.3z"></path></svg>'
];

// Add music notes to sections
const addMusicNotes = () => {
    // First, make sure no existing notes are left
    document.querySelectorAll('.music-note').forEach(note => note.remove());

    // Only target music, about, and contact sections specifically by finding them directly
    const musicSection = document.getElementById('music');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');

    // Put all valid sections in an array (only if they exist)
    const targetSections = [];
    if (musicSection) targetSections.push(musicSection);
    if (aboutSection) targetSections.push(aboutSection);
    if (contactSection) targetSections.push(contactSection);

    console.log("Adding notes to these sections:", targetSections.map(s => s.id));

    // More notes per section
    const notesPerSide = 12;

    targetSections.forEach(section => {
        console.log(`Adding notes to ${section.id} section`);

        // Add left side notes
        for (let i = 1; i <= notesPerSide; i++) {
            const noteElement = document.createElement('div');

            // Add random positioning with offsets
            const topPosition = (i * (100 / notesPerSide)) + (Math.random() * 60 - 30); // Random ±30px offset
            const leftPosition = 5 + (Math.random() * 10 - 5); // Random 0-10% from left edge

            noteElement.className = `music-note ${Math.random() > 0.4 ? 'glitch' : ''}`;
            noteElement.style.top = `${topPosition}%`;
            noteElement.style.left = `${leftPosition}%`;
            noteElement.dataset.section = section.id; // Mark which section this belongs to

            // Select a random SVG music note
            const randomIndex = Math.floor(Math.random() * musicNoteSVGs.length);
            noteElement.innerHTML = musicNoteSVGs[randomIndex];

            // Randomly scale and rotate
            const scale = 0.7 + Math.random() * 0.6; // More size variation
            const rotate = Math.random() * 60 - 30; // More rotation variation
            noteElement.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

            section.appendChild(noteElement);
        }

        // Add right side notes
        for (let i = 1; i <= notesPerSide; i++) {
            const noteElement = document.createElement('div');

            // Add random positioning with offsets
            const topPosition = (i * (100 / notesPerSide)) + (Math.random() * 60 - 30); // Random ±30px offset
            const rightPosition = 5 + (Math.random() * 10 - 5); // Random 0-10% from right edge

            noteElement.className = `music-note ${Math.random() > 0.4 ? 'glitch' : ''}`;
            noteElement.style.top = `${topPosition}%`;
            noteElement.style.right = `${rightPosition}%`;
            noteElement.dataset.section = section.id; // Mark which section this belongs to

            // Select a random SVG music note
            const randomIndex = Math.floor(Math.random() * musicNoteSVGs.length);
            noteElement.innerHTML = musicNoteSVGs[randomIndex];

            // Randomly scale and rotate
            const scale = 0.7 + Math.random() * 0.6;
            const rotate = Math.random() * 60 - 30;
            noteElement.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

            section.appendChild(noteElement);
        }

        // Add some scattered notes in the middle area (sparser)
        for (let i = 1; i <= 8; i++) {
            const noteElement = document.createElement('div');

            // Position randomly across the section
            const topPosition = Math.random() * 90 + 5; // 5-95% vertical
            const leftPosition = 20 + Math.random() * 60; // 20-80% horizontal (middle area)

            noteElement.className = `music-note ${Math.random() > 0.7 ? 'glitch' : ''}`;
            noteElement.style.top = `${topPosition}%`;
            noteElement.style.left = `${leftPosition}%`;
            noteElement.dataset.section = section.id; // Mark which section this belongs to

            // Select a random SVG music note
            const randomIndex = Math.floor(Math.random() * musicNoteSVGs.length);
            noteElement.innerHTML = musicNoteSVGs[randomIndex];

            // Smaller scale for middle notes
            const scale = 0.5 + Math.random() * 0.3;
            const rotate = Math.random() * 60 - 30;
            noteElement.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
            noteElement.style.opacity = '0.4'; // More transparent

            section.appendChild(noteElement);
        }
    });
};

// Animate music notes with mouse movement
const animateMusicNotes = () => {
    const notes = document.querySelectorAll('.music-note');
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;

        updateNotesPosition(mouseX, mouseY);
    });

    // Track device orientation for mobile
    window.addEventListener('deviceorientation', (e) => {
        if (e.beta && e.gamma) {
            // Normalize values from device orientation
            const x = (e.gamma / 60) * 0.5; // gamma: left to right
            const y = (e.beta / 60) * 0.5;  // beta: front to back

            updateNotesPosition(x, y);
        }
    });

    // Update notes positions based on input
    const updateNotesPosition = (x, y) => {
        notes.forEach(note => {
            // Get current transform
            let transform = note.style.transform || '';

            // Get any existing scale and rotation
            let scale = 1;
            let rotate = 0;

            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            if (scaleMatch) scale = parseFloat(scaleMatch[1]);

            const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
            if (rotateMatch) rotate = parseFloat(rotateMatch[1]);

            // Determine note position (left, right or middle)
            let moveIntensity = 1;

            // Check if note has right styling
            if (note.style.right) {
                moveIntensity = 2; // Right side notes move more
            }
            // Check if note has left styling
            else if (parseFloat(note.style.left) < 20) {
                moveIntensity = 2; // Left side notes move more
            }
            // Middle notes
            else {
                moveIntensity = 0.5; // Middle notes move less
            }

            // Calculate movement amount
            const moveX = x * 20 * moveIntensity;
            const moveY = y * 15 * moveIntensity;

            // Apply movement, preserving scale and rotation
            note.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale}) rotate(${rotate}deg)`;

            // Add some subtle glitchy movement
            if (Math.random() < 0.005) {
                const glitchX = (Math.random() - 0.5) * 8;
                const glitchY = (Math.random() - 0.5) * 8;
                note.style.transform = `translate(${moveX + glitchX}px, ${moveY + glitchY}px) scale(${scale}) rotate(${rotate}deg)`;
            }
        });
    };
};
