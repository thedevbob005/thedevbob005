// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = function() {
        for (let i = 0; i < revealElements.length; i++) {
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

    // Add reveal class to section elements
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('reveal')) {
            section.classList.add('reveal');
        }
    });

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

    // Add staggered animation delays to elements
    const staggeredElements = [
        '.music-platforms .platform-card',
        '.social-links .social-link'
    ];

    staggeredElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    });

    // Add animated skill bars
    const animateSkills = function() {
        const skills = document.querySelectorAll('.skill-progress');
        if (!skills.length) return;

        const skillsSection = document.querySelector('.skills');
        const skillsPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (skillsPosition < screenPosition) {
            skills.forEach(skill => {
                skill.style.width = skill.style.width || '0%';
                const targetWidth = skill.parentElement.parentElement.querySelector('.skill-name').nextElementSibling.style.width;
                skill.style.width = targetWidth;
            });
        }
    };

    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Initial check

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
