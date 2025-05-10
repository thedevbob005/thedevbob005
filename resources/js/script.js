// DOM Elements
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const animateElements = document.querySelectorAll('.animate-on-scroll');

// Navigation Handling
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a nav link
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Scroll to section when clicking nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Smooth scroll to target
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Adjust for header height
        behavior: 'smooth'
      });
    }
  });
});

// Scroll indicator functionality
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll animation observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with animation class
animateElements.forEach(element => {
  observer.observe(element);
});

// Preload animations on page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Add visible class to elements in viewport on load
  setTimeout(() => {
    const scrollPosition = window.scrollY + window.innerHeight;

    animateElements.forEach(el => {
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;

      if (elementPosition < scrollPosition) {
        el.classList.add('visible');
      }
    });
  }, 100);
});

// Parallax effect on hero section
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
  });
}

// Animate orbs on mousemove for interactive effect
const profileContainer = document.querySelector('.profile-image-container');
if (profileContainer) {
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = profileContainer.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from center
    const deltaX = (clientX - centerX) / 25;
    const deltaY = (clientY - centerY) / 25;

    // Apply subtle movement to orbs
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
      const factor = (index + 1) * 0.5;
      orb.style.transform = `translate(${deltaX * factor}px, ${deltaY * factor}px)`;
    });
  });
}
