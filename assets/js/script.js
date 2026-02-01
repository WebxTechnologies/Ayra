// Mobile menu toggle - FIXED VERSION
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    console.log('Mobile menu elements found, setting up listeners');
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        
        console.log('Mobile menu button clicked');
        console.log('Before - mobileMenuBtn active:', mobileMenuBtn.classList.contains('active'));
        console.log('Before - navLinks active:', navLinks.classList.contains('active'));
        
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        console.log('After - mobileMenuBtn active:', mobileMenuBtn.classList.contains('active'));
        console.log('After - navLinks active:', navLinks.classList.contains('active'));
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked, closing menu');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            console.log('Clicked outside menu, closing it');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu on window resize (for desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
} else {
    console.error('Mobile menu elements not found:', {
        mobileMenuBtn: mobileMenuBtn,
        navLinks: navLinks
    });
}

// Enhanced Typing Animation with Better Timing
class TypingAnimation {
    constructor(element) {
        this.element = element;
        this.text = element.getAttribute('data-text');
        this.cursor = element.nextElementSibling;
        this.speed = 70;
        this.deleteSpeed = 30;
        this.pauseDuration = 2000;
        this.currentText = '';
        this.isDeleting = false;
        this.charIndex = 0;
        this.isComplete = false;
        this.timeout = null;
        this.onComplete = null;
    }
    
    type() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        if (this.isDeleting) {
            this.currentText = this.text.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = this.text.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        typeSpeed += Math.random() * 20;
        
        if (!this.isDeleting && this.charIndex === this.text.length) {
            typeSpeed = this.pauseDuration;
            this.isDeleting = true;
            this.isComplete = true;
            
            this.timeout = setTimeout(() => {
                if (this.onComplete && typeof this.onComplete === 'function') {
                    this.onComplete();
                }
            }, this.pauseDuration);
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.isComplete = false;
            typeSpeed = 600;
        }
        
        this.timeout = setTimeout(() => this.type(), typeSpeed);
    }
    
    start() {
        this.currentText = '';
        this.charIndex = 0;
        this.isDeleting = false;
        this.isComplete = false;
        this.element.textContent = '';
        
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
        
        this.timeout = setTimeout(() => this.type(), 300);
    }
    
    stop() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.currentText = '';
        this.charIndex = 0;
        this.isDeleting = false;
        this.isComplete = false;
        this.element.textContent = '';
        
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
    }
    
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    
    skipToComplete() {
        this.stop();
        this.element.textContent = this.text;
        this.isComplete = true;
        
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
    }
}

// Hero Slider with Perfect Typing Animation Sync
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.slideDuration = 9000;
        this.typingAnimations = [];
        this.autoSlideEnabled = true;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        document.querySelectorAll('.typing-text').forEach((element, index) => {
            const typingAnimation = new TypingAnimation(element);
            
            typingAnimation.setOnComplete(() => {
                if (this.autoSlideEnabled && index === this.currentSlide && !this.isAnimating) {
                    setTimeout(() => {
                        if (this.autoSlideEnabled && index === this.currentSlide && !this.isAnimating) {
                            this.nextSlide();
                        }
                    }, 1000);
                }
            });
            
            this.typingAnimations.push(typingAnimation);
            
            if (index === 0) {
                setTimeout(() => {
                    typingAnimation.start();
                }, 500);
            }
        });
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index !== this.currentSlide && !this.isAnimating) {
                    this.handleManualSlideChange(() => this.goToSlide(index));
                }
            });
        });
        
        this.startAutoSlide();
        
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });
            
            slider.addEventListener('mouseleave', () => {
                if (this.autoSlideEnabled) {
                    this.startAutoSlide();
                }
            });
        }
    }
    
    handleManualSlideChange(slideChangeFunction) {
        this.autoSlideEnabled = false;
        this.stopAutoSlide();
        
        if (this.typingAnimations[this.currentSlide]) {
            this.typingAnimations[this.currentSlide].stop();
        }
        
        slideChangeFunction();
        
        setTimeout(() => {
            this.autoSlideEnabled = true;
            this.startAutoSlide();
        }, 15000);
    }
    
    showSlide(index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        if (this.typingAnimations[this.currentSlide]) {
            this.typingAnimations[this.currentSlide].stop();
        }
        
        this.currentSlide = index;
        if (this.currentSlide >= this.slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;
        
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            
            setTimeout(() => {
                if (this.typingAnimations[this.currentSlide]) {
                    this.typingAnimations[this.currentSlide].start();
                }
                this.isAnimating = false;
            }, 300);
        }, 400);
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        
        if (this.autoSlideEnabled) {
            this.slideInterval = setInterval(() => {
                const currentTyping = this.typingAnimations[this.currentSlide];
                if (currentTyping && currentTyping.isComplete && !this.isAnimating) {
                    this.nextSlide();
                } else if (!currentTyping && !this.isAnimating) {
                    this.nextSlide();
                }
            }, this.slideDuration);
        }
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Initialize slider only on homepage
if (document.querySelector('.hero-slider')) {
    const heroSlider = new HeroSlider();
}

// STEAM Programs Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
        }
    }
});

// Form submission handling for quote form
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc3545';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your quote request! We will get back to you within 24 hours.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 1500);
        } else {
            alert('Please fill in all required fields marked with *.');
        }
    });
}

// Modern Testimonial Carousel
if (document.querySelector('.testimonial-slide')) {
    document.addEventListener('DOMContentLoaded', function() {
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.service-indicator');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const currentIndexSpan = document.querySelector('.current-index');
        const totalTestimonialsSpan = document.querySelector('.total-testimonials');
        
        let currentSlide = 0;
        let rotationInterval;
        let webTestimonials = [
            {
                quote: "Working with Ayra was seamless. They delivered a sleek, high-performing website that clearly showcases our fitout, MEP, and digital signage services with precision and professionalism. Highly recommended.",
                author: "Adarsh M Alex",
                role: "ADMAL LLC",
                rating: 4.5,
                image: ""
            },
            {
                quote: "Ayra elevated Admalstar Trading's digital presence with a refined, high-performance website that truly reflects our brand. Fast, elegant, and mobile-optimized, their work has given our automotive spare parts and lubricants business a strong competitive edge. A truly reliable partner for premium digital solutions.",
                author: "Abel M Alocious",
                role: "Admalstar Trading Pvt. Ltd.",
                rating: 5,
                image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2D5uDs85a7Iy8Z_cLJWRY6XUQKXAGu8_DVA&s"
            },
        ];
        
        // let steamTestimonials = [
        //     {
        //         quote: "The STEAM program implementation at our school has been transformative. Students are more engaged, collaborative, and excited about learning.",
        //         author: "Robert Chen",
        //         role: "Curriculum Director, Innovation Academy",
        //         rating: 5
        //     },
        //     {
        //         quote: "Our robotics club went from 5 to 50 students after implementing AYRA's STEAM program. The hands-on kits have sparked incredible interest in engineering.",
        //         author: "Maria Rodriguez",
        //         role: "STEM Coordinator, Lincoln Middle School",
        //         rating: 5
        //     },
        //     {
        //         quote: "Teacher training provided by AYRA has empowered our educators with new strategies and resources to effectively teach STEAM subjects.",
        //         author: "David Wilson",
        //         role: "Superintendent, Innovation School District",
        //         rating: 4.5
        //     }
        // ];
        
        let webIndex = 0;
        let steamIndex = 0;
        
        if (totalTestimonialsSpan) {
            totalTestimonialsSpan.textContent = testimonialSlides.length;
        }
        
        function updateTestimonialContent(slideType, index) {
            const slide = document.querySelector('.testimonial-slide.active');
            if (!slide) return;
            
            const testimonial = slideType === 'web' ? webTestimonials[index] : steamTestimonials[index];
            
            const quoteText = slide.querySelector('.quote-text');
            if (quoteText) quoteText.textContent = `"${testimonial.quote}"`;
            
            const authorName = slide.querySelector('.author-info h4');
            if (authorName) authorName.textContent = testimonial.author;
            
            const authorRole = slide.querySelector('.author-info p');
            if (authorRole) authorRole.textContent = testimonial.role;
                        const authorAvatar = slide.querySelector('.author-avatar');
            if (authorAvatar && testimonial.image) {
                // Clear the icon and add image
                authorAvatar.innerHTML = '';
                const img = document.createElement('img');
                img.src = testimonial.image;
                img.alt = testimonial.author;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                authorAvatar.appendChild(img);
            } else if (authorAvatar && !testimonial.image) {
                // Fallback to icon if no image
                authorAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
            }
            
            const ratingElement = slide.querySelector('.testimonial-rating');
            if (ratingElement) {
                ratingElement.innerHTML = '';
                const fullStars = Math.floor(testimonial.rating);
                const hasHalfStar = testimonial.rating % 1 >= 0.5;
                
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement('i');
                    if (i < fullStars) {
                        star.className = 'fas fa-star';
                    } else if (i === fullStars && hasHalfStar) {
                        star.className = 'fas fa-star-half-alt';
                    } else {
                        star.className = 'far fa-star';
                    }
                    ratingElement.appendChild(star);
                }
            }
        }
        
        function showSlide(index) {
            if (index < 0 || index >= testimonialSlides.length) return;
            
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            testimonialSlides[index].classList.add('active');
            
            const slideType = testimonialSlides[index].dataset.type;
            indicators.forEach(indicator => {
                if (indicator.dataset.type === slideType) {
                    indicator.classList.add('active');
                }
            });
            
            if (currentIndexSpan) {
                currentIndexSpan.textContent = index + 1;
            }
            currentSlide = index;
            
            if (slideType === 'web') {
                updateTestimonialContent('web', webIndex);
                webIndex = (webIndex + 1) % webTestimonials.length;
            } else if (slideType === 'steam') {
                updateTestimonialContent('steam', steamIndex);
                steamIndex = (steamIndex + 1) % steamTestimonials.length;
            }
            
            resetAutoRotation();
        }
        
        function showNextSlide() {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= testimonialSlides.length) {
                nextSlide = 0;
            }
            showSlide(nextSlide);
        }
        
        function showPrevSlide() {
            let prevSlide = currentSlide - 1;
            if (prevSlide < 0) {
                prevSlide = testimonialSlides.length - 1;
            }
            showSlide(prevSlide);
        }
        
        function resetAutoRotation() {
            clearInterval(rotationInterval);
            rotationInterval = setInterval(showNextSlide, 6000);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', showPrevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', showNextSlide);
        }
        
        indicators.forEach((indicator) => {
            indicator.addEventListener('click', () => {
                let slideIndex = 0;
                testimonialSlides.forEach((slide, idx) => {
                    if (slide.dataset.type === indicator.dataset.type) {
                        slideIndex = idx;
                    }
                });
                showSlide(slideIndex);
            });
        });
        
        if (testimonialSlides.length > 0) {
            showSlide(0);
            resetAutoRotation();
            
            const carousel = document.querySelector('.testimonial-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', () => {
                    clearInterval(rotationInterval);
                });
                
                carousel.addEventListener('mouseleave', () => {
                    resetAutoRotation();
                });
            }
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('AYRA website loaded successfully');
    
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Add email to contact info
    const emailElements = document.querySelectorAll('.contact-info li:nth-child(3) i.fa-envelope');
    emailElements.forEach(element => {
        if (!element.nextSibling || !element.nextSibling.textContent.includes('@')) {
            const emailSpan = document.createElement('span');
            emailSpan.textContent = 'info@ayra.com';
            element.parentNode.insertBefore(emailSpan, element.nextSibling);
        }
    });
    
    document.documentElement.style.scrollBehavior = 'smooth';
});
class URLManager {
    constructor() {
        this.mainPage = 'index.html';
        this.init();
    }

    init() {
        // Remove hash from URL without reloading
        this.removeHashFromURL();
        
        // Prevent hash changes from appearing
        this.preventHashInURL();
        
        // Replace state on page load
        this.replaceHistoryState();
    }

    removeHashFromURL() {
        // Remove hash on page load
        if (window.location.hash) {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    }

    preventHashInURL() {
        // Intercept hash changes
        window.addEventListener('hashchange', (e) => {
            e.preventDefault();
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
            return false;
        });

        // Intercept click events on anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                return false;
            }
        });
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            // Smooth scroll without changing URL
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // replaceHistoryState() {
    //     // Replace current URL with just the page name
    //     const cleanUrl = window.location.origin + '/' + this.mainPage;
    //     window.history.replaceState(null, null, cleanUrl);
    // }
}

// Initialize
new URLManager();