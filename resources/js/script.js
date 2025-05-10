// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fix for animations - ensure all content is visible regardless of animation state
    document.querySelectorAll('.fade-in, .slide-in-right, .slide-in-left, .scale-up, .reveal').forEach(el => {
        // Make sure all elements with animation classes are visible
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Update active navigation link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Modified reveal function to ensure elements are always visible
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = function() {
        for (let i = 0; i < revealElements.length; i++) {
            revealElements[i].style.opacity = '1'; // Ensure visibility
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check on page load

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.boxShadow = 'none';
        }

        // Update active navigation based on scroll position
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('href') === `#${current}`) {
                navLink.classList.add('active');
            }
        });

        lastScrollTop = scrollTop;
    });

    // Modified animated skill bars to ensure visibility
    const animateSkills = function() {
        const skills = document.querySelectorAll('.skill-progress');
        if (!skills.length) return;

        skills.forEach(skill => {
            // Get the width directly from the style attribute set in HTML
            const width = skill.getAttribute('style') ?
                          skill.getAttribute('style').replace('width:', '').trim() :
                          '85%'; // Default fallback width
            skill.style.width = width;
        });
    };

    animateSkills(); // Run once on page load

    // Mobile navigation toggle (for responsive design)
    const createMobileNav = function() {
        if (window.innerWidth <= 768) {
            const navList = document.querySelector('.nav-list');

            if (!document.querySelector('.mobile-toggle')) {
                const mobileToggle = document.createElement('button');
                mobileToggle.classList.add('mobile-toggle');
                mobileToggle.innerHTML = '<span></span><span></span><span></span>';

                document.querySelector('.header .container').appendChild(mobileToggle);

                mobileToggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navList.classList.toggle('active');
                });
            }
        } else {
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (mobileToggle) {
                mobileToggle.remove();
            }
            document.querySelector('.nav-list').classList.remove('active');
        }
    };

    window.addEventListener('resize', createMobileNav);
    createMobileNav(); // Initial check
});
