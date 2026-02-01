
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initTestimonialsSlider();
    initCommonFeatures();
});

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    console.log('Mobile Menu Elements:', {
        mobileMenuBtn: mobileMenuBtn,
        navLinks: navLinks
    });

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            console.log('Menu button clicked');
            
            this.classList.toggle('active');

            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Mobile menu elements not found!');
        return;
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close menu
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            if (this.classList.contains('nav-cta')) {
                return true;
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on window resize (if resizing to desktop)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                // If we're on desktop, close mobile menu
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // Prevent clicks inside nav from closing immediately
    navLinks.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Testimonials Slider Functionality - SIMPLIFIED
function initTestimonialsSlider() {
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonialDots.length === 0 || testimonials.length === 0) {
        console.log('No testimonials found on this page');
        return;
    }
    
    let currentTestimonial = 0;
    
    // Function to show testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active from all dots
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected testimonial
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        
        // Activate corresponding dot
        if (testimonialDots[index]) {
            testimonialDots[index].classList.add('active');
        }
        
        currentTestimonial = index;
    }
    
    // Add click events to dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Show first testimonial
    showTestimonial(0);
}

// Common Features
function initCommonFeatures() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for anchor links - IMPROVED
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                // Calculate target position
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set active nav link
    setActiveNavLink();
}

// Set active navigation link - SIMPLIFIED
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Default to index.html if on root
    if (currentPage === '' || currentPage === '/') {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            }
        });
        return;
    }
    
    // For specific pages
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

function addDebugCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Debug styles for mobile menu */
        .mobile-menu-btn.active {
            background: rgba(67, 97, 238, 0.1) !important;
        }
        
        .nav-links.active {
            border: 2px solid var(--primary) !important;
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2) !important;
        }
        
        /* Mobile menu debug */
        @media (max-width: 768px) {
            .nav-links:not(.active) {
                display: none !important;
            }
            
            .nav-links.active {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(style);
}

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', addDebugCSS);
}