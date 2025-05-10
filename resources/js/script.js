// DOM Elements
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const scrollElements = document.querySelectorAll('[data-scroll]');
const sections = document.querySelectorAll('.section');
const scrollIndicator = document.querySelector('.scroll-indicator');
const profileContainer = document.querySelector('.profile-image-container');
const orbs = document.querySelectorAll('.orb');
const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');

// Animation timing variables
const SCROLL_ANIMATION_TRIGGER_PERCENT = 0.15;
let lastScrollTop = 0;
let scrollDirection = 'down';
let ticking = false;
let pageLoaded = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initial check for elements in view
  setTimeout(() => {
    handleScrollAnimations();
    heroTitle.classList.add('in-view');
    heroSubtitle.classList.add('in-view');
    setTimeout(() => {
      scrollIndicator.classList.add('show');
    }, 2000);
    pageLoaded = true;
  }, 100);
});

// Navigation Handling
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a nav link
navLinksItems.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = e.target.getAttribute('href');

    // Only prevent default for in-page links
    if (target && target.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(target);

      if (targetElement) {
        // Close menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');

        // Smooth scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Scroll to section when clicking scroll indicator
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 60,
        behavior: 'smooth'
      });
    }
  });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollTop = window.scrollY;

      // Determine scroll direction
      scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
      lastScrollTop = currentScrollTop;

      // Add scrolled class to header
      if (currentScrollTop > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Handle scroll animations
      handleScrollAnimations();

      // Handle hero parallax if in view
      if (currentScrollTop < window.innerHeight) {
        applyHeroParallax(currentScrollTop);
      }

      ticking = false;
    });

    ticking = true;
  }
});

// Apple-style scroll animations
function handleScrollAnimations() {
  const triggerBottom = window.innerHeight * (1 - SCROLL_ANIMATION_TRIGGER_PERCENT);

  // Handle section-specific animations
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionId = section.getAttribute('id');

    // Add active class to nav links
    if (sectionTop < triggerBottom && sectionTop > -section.offsetHeight + 100) {
      navLinksItems.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Animate section elements that are now in view
    const animatableElements = section.querySelectorAll('[data-scroll]');
    animatableElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      // Element enters viewport
      if (elementTop < triggerBottom && elementBottom > 0) {
        element.classList.add('in-view');
      }

      // Optional: Element exits viewport (for elements that should animate out)
      // if (elementBottom < 0 || elementTop > window.innerHeight) {
      //   element.classList.remove('in-view');
      // }
    });
  });
}

// Apply parallax effect to hero section
function applyHeroParallax(scrollPosition) {
  if (!hero) return;

  const scrollPercent = scrollPosition / window.innerHeight;
  const moveY = scrollPosition * 0.4; // Move down slower than scroll

  // Apply parallax to hero container
  if (profileContainer) {
    profileContainer.style.transform = `translateY(${moveY}px) scale(${1 - scrollPercent * 0.15})`;
  }

  // Parallax for orbs
  orbs.forEach((orb, index) => {
    const speed = 0.2 + (index * 0.1);
    const x = (index % 2 === 0) ? scrollPosition * speed : -scrollPosition * speed;
    const y = scrollPosition * (0.5 + (index * 0.1));
    orb.style.transform = `translate(${x}px, ${y}px)`;
    orb.style.opacity = Math.max(0, 1 - scrollPercent * 2);
  });

  // Fade out scroll indicator
  if (scrollIndicator) {
    scrollIndicator.style.opacity = Math.max(0, 1 - scrollPercent * 3);
  }
}

// Mouse movement effect on hero section
document.addEventListener('mousemove', (e) => {
  if (!pageLoaded || window.innerWidth < 768) return;

  if (hero && profileContainer) {
    const heroRect = hero.getBoundingClientRect();
    const mouseX = e.clientX - heroRect.left - (heroRect.width / 2);
    const mouseY = e.clientY - heroRect.top - (heroRect.height / 2);

    // Calculate rotation based on mouse position
    const rotateX = mouseY * -0.01;
    const rotateY = mouseX * 0.01;

    // Apply rotation transform to profile container
    profileContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Apply parallax to orbs
    orbs.forEach((orb, index) => {
      const orbSpeed = 0.02 + (index * 0.01);
      const orbX = mouseX * orbSpeed * (index % 2 === 0 ? 1 : -1);
      const orbY = mouseY * orbSpeed;

      orb.style.transform = `translate(${orbX}px, ${orbY}px)`;
    });
  }
});

// Reset transforms when mouse leaves hero section
hero?.addEventListener('mouseleave', () => {
  if (profileContainer) {
    profileContainer.style.transform = '';
  }

  orbs.forEach(orb => {
    orb.style.transform = '';
  });
});

// Handle resize events
window.addEventListener('resize', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScrollAnimations();
      ticking = false;
    });
    ticking = true;
  }
});

// Ensure transformations are reset when page is not in view
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    handleScrollAnimations();
  }
});
