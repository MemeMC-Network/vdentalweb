// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const founderStickyText = document.querySelector('.founder-sticky-text');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class and shadow on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    }
    
    // Show founder sticky text on scroll (only on founder page)
    if (founderStickyText) {
        if (currentScroll > 300) {
            founderStickyText.classList.add('visible');
        } else {
            founderStickyText.classList.remove('visible');
        }
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations with stagger
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a slight delay for stagger effect
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.service-card, .highlight-card, .reason-item, .info-card, .credential-card, .faq-item, .gallery-item');
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        fadeInObserver.observe(el);
    });

    // Animate section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    headerObserver.unobserve(entry.target);
                }
            });
        });
        
        headerObserver.observe(header);
    });
});

// Form submission handler
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        
        try {
            // If using Formspree, the form action will handle this automatically
            // For demonstration, we'll show a manual fetch
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                showFormMessage('success', 'Thank you for your message! We will contact you within 24 hours.');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            showFormMessage('error', 'Sorry, there was an error sending your message. Please try calling us directly or email us at info@velicdentalarts.com');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form message display function
function showFormMessage(type, message) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 8px;
        font-weight: 500;
        animation: slideInDown 0.4s ease;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    
    contactForm.insertAdjacentElement('afterend', messageDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => messageDiv.remove(), 400);
    }, 8000);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Lazy loading for images (when you add actual images)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add CSS class for active mobile menu toggle
if (mobileMenuToggle) {
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    `;
    document.head.appendChild(style);
}

// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
