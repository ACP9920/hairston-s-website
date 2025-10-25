// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav){
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Active link highlight
const path = location.pathname.replace(/\/index\.html$/, '/');
document.querySelectorAll('.nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && (location.pathname.endsWith(href) || (href === '/index.html' && path === '/'))) {
    a.classList.add('active');
  }
});

// Hero slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.slideshow-indicator');

function showSlide(index) {
  // Remove active class from all slides and indicators
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  
  // Add active class to current slide and indicator
  if (slides[index]) slides[index].classList.add('active');
  if (indicators[index]) indicators[index].classList.add('active');
  
  currentSlide = index;
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

// Auto-advance slideshow every 5 seconds
let slideshowInterval = setInterval(nextSlide, 5000);

// Add click handlers to indicators
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    showSlide(index);
    // Reset auto-advance timer
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, 5000);
  });
});

// Pause slideshow on hover
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mouseenter', () => clearInterval(slideshowInterval));
  hero.addEventListener('mouseleave', () => {
    slideshowInterval = setInterval(nextSlide, 5000);
  });
}

// Initialize slideshow
if (slides.length > 0) {
  showSlide(0);
}

// Timeline animation on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -50px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Initialize timeline items with hidden state
timelineItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  timelineObserver.observe(item);
});

// Gallery lightbox functionality
const galleryItems = document.querySelectorAll('.gallery-item img');
if (galleryItems.length > 0) {
  // Create lightbox modal
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-image" src="" alt="" />
      <div class="lightbox-nav">
        <button class="lightbox-prev">&larr;</button>
        <button class="lightbox-next">&rarr;</button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Add lightbox styles
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .lightbox.active {
      display: flex;
    }
    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
    }
    .lightbox-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 30px;
      cursor: pointer;
      z-index: 1001;
    }
    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .lightbox-prev, .lightbox-next {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 18px;
      pointer-events: auto;
    }
    .lightbox-prev {
      margin-left: 20px;
    }
    .lightbox-next {
      margin-right: 20px;
    }
  `;
  document.head.appendChild(lightboxStyles);

  let currentImageIndex = 0;
  const images = Array.from(galleryItems);

  // Open lightbox
  galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      lightbox.querySelector('.lightbox-image').src = img.src;
      lightbox.querySelector('.lightbox-image').alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Navigation
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightbox.querySelector('.lightbox-image').src = images[currentImageIndex].src;
    lightbox.querySelector('.lightbox-image').alt = images[currentImageIndex].alt;
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightbox.querySelector('.lightbox-image').src = images[currentImageIndex].src;
    lightbox.querySelector('.lightbox-image').alt = images[currentImageIndex].alt;
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightbox.querySelector('.lightbox-image').src = images[currentImageIndex].src;
        lightbox.querySelector('.lightbox-image').alt = images[currentImageIndex].alt;
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightbox.querySelector('.lightbox-image').src = images[currentImageIndex].src;
        lightbox.querySelector('.lightbox-image').alt = images[currentImageIndex].alt;
      }
    }
  });
}

// Basic client-side form handler (demo only)
const form = document.getElementById('estimate-form');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(!form.checkValidity()){
      alert('Please fill required fields and accept consent.');
      return;
    }
    console.log('Form submission (demo):', data);
    alert('Thanks! We received your request. We\'ll be in touch shortly.');
    form.reset();
  });
}
