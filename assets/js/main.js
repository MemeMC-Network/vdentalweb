// Global state
let contentData = null;
let currentLightboxIndex = 0;

// Initialize site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSite();
});

// Main initialization function
async function initSite() {
    try {
        // Fetch content data
        await fetchContent();
        
        // Render all sections
        renderContent();
        
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing site:', error);
        showError('Failed to load site content. Please refresh the page.');
    }
}

// Fetch content from content.json
async function fetchContent() {
    try {
        // Try API endpoint first, fallback to direct file
        let response = await fetch('/api/content').catch(() => fetch('/content.json'));
        if (!response.ok) {
            throw new Error('Failed to fetch content');
        }
        contentData = await response.json();
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
    }
}

// Render all content sections
function renderContent() {
    if (!contentData) return;
    
    // Update site title
    document.getElementById('site-title').textContent = contentData.siteTitle || 'Velic Dental Laboratory';
    document.title = contentData.siteTitle || 'Velic Dental Laboratory';
    
    // Render hero section
    renderHero();
    
    // Render services
    renderServices();
    
    // Render about section
    renderAbout();
    
    // Render gallery
    renderGallery();
    
    // Render contact section
    renderContact();
    
    // Render footer
    renderFooter();
}

// Render hero section
function renderHero() {
    const hero = contentData.hero;
    if (!hero) return;
    
    document.getElementById('hero-title').textContent = hero.title || '';
    document.getElementById('hero-subtitle').textContent = hero.subtitle || '';
    
    // Set background if provided
    if (hero.background) {
        const heroSection = document.querySelector('.hero');
        heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${hero.background}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
    }
}

// Render services section
function renderServices() {
    const services = contentData.services;
    if (!services || !Array.isArray(services)) return;
    
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = '';
    
    services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.setAttribute('data-aos', 'fade-up');
        serviceCard.setAttribute('data-aos-delay', (index * 100).toString());
        
        serviceCard.innerHTML = `
            <div class="icon">${service.icon || '🦷'}</div>
            <h3>${service.title || ''}</h3>
            <p>${service.description || ''}</p>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

// Render about section
function renderAbout() {
    const about = contentData.about;
    if (!about) return;
    
    document.getElementById('about-title').textContent = about.title || '';
    document.getElementById('about-description').textContent = about.description || '';
    
    // Render highlights
    if (about.highlights && Array.isArray(about.highlights)) {
        const highlightsList = document.getElementById('about-highlights');
        highlightsList.innerHTML = '';
        
        about.highlights.forEach(highlight => {
            const li = document.createElement('li');
            li.textContent = highlight;
            highlightsList.appendChild(li);
        });
    }
}

// Render gallery section
function renderGallery() {
    const gallery = contentData.gallery;
    if (!gallery || !Array.isArray(gallery)) return;
    
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    gallery.forEach((imagePath, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-aos', 'zoom-in');
        galleryItem.setAttribute('data-aos-delay', (index * 50).toString());
        galleryItem.setAttribute('data-index', index.toString());
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Gallery image ${index + 1}`;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
}

// Render contact section
function renderContact() {
    const contact = contentData.contact;
    if (!contact) return;
    
    document.getElementById('contact-phone').textContent = contact.phone || '';
    document.getElementById('contact-email').textContent = contact.email || '';
    document.getElementById('contact-address').textContent = contact.address || '';
    document.getElementById('contact-hours').textContent = contact.hours || '';
}

// Render footer
function renderFooter() {
    const footer = contentData.footer;
    if (!footer) return;
    
    document.getElementById('footer-text').textContent = footer.text || '';
    
    // Render social links
    if (footer.social) {
        const socialLinks = document.getElementById('social-links');
        socialLinks.innerHTML = '';
        
        const socialIcons = {
            facebook: '📘',
            instagram: '📷',
            linkedin: '💼',
            twitter: '🐦'
        };
        
        Object.entries(footer.social).forEach(([platform, url]) => {
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = socialIcons[platform] || '🔗';
                link.title = platform.charAt(0).toUpperCase() + platform.slice(1);
                socialLinks.appendChild(link);
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Gallery lightbox
    setupLightbox();
    
    // Contact form submission
    setupContactForm();
    
    // Header scroll effect
    setupHeaderScroll();
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // Open lightbox when clicking gallery item
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            const index = parseInt(galleryItem.getAttribute('data-index'));
            openLightbox(index);
        }
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

// Open lightbox with specific image
function openLightbox(index) {
    if (!contentData || !contentData.gallery) return;
    
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightboxImg.src = contentData.gallery[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigate lightbox (prev/next)
function navigateLightbox(direction) {
    if (!contentData || !contentData.gallery) return;
    
    const gallery = contentData.gallery;
    currentLightboxIndex = (currentLightboxIndex + direction + gallery.length) % gallery.length;
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = gallery[currentLightboxIndex];
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message (in a real app, you would send the form data to a server)
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    });
}

// Setup header scroll effect
function setupHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Export functions for external use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSite,
        fetchContent,
        renderContent
    };
}
