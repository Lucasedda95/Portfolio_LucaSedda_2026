/* ==========================================
   Luca Sedda Portfolio - Interactive JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initProjectFilters();
  initContactForm();
  initCopyToClipboard();
  initImageUploadHelpers();
  initSmoothTransitions();
});

/* Sticky Header Active State & Scroll Effects */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // Mark current active link based on window location
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href.includes('#') && window.location.hash) {
      if (href.endsWith(window.location.hash)) {
        link.classList.add('active');
      }
    }
  });
}

/* Mobile Nav Drawer Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      mobileNav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileNav.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking outside or clicking a link
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
}

/* Project Category Filtering (All, Branding, Coursework) */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'grid';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Check URL query parameters for direct tab filtering (e.g. projects.html?filter=branding)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }
}

/* Contact Form Validation & Submission */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Submit animation simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fas fa-check"></i> Sent Successfully!`;
      submitBtn.style.backgroundColor = '#6CBCA5';
      showToast('Thank you, Luca will respond to your message shortly!', 'success');
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.disabled = false;
      }, 3500);
    }, 1000);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* Copy to Clipboard Helper for Email / Phone */
function initCopyToClipboard() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
}

/* Image Upload Helper Simulation (For Luca to easily preview custom headshot/project images) */
function initImageUploadHelpers() {
  const uploadInputs = document.querySelectorAll('.file-input-hidden');
  
  uploadInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const targetId = input.getAttribute('data-target-img');
      const targetImg = document.getElementById(targetId);

      if (targetImg) {
        const reader = new FileReader();
        reader.onload = function(event) {
          targetImg.src = event.target.result;
          showToast('Image updated! Luca can save this layout or upload permanent assets.', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

/* Toast Notification Utility */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* Smooth Scrolling & Transition Effects */
function initSmoothTransitions() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Add CSS keyframe animation dynamically
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
