/**
 * Chamath Poorna Danthanarayana - Portfolio JavaScript
 * Micro-interactions, ScrollSpy, Navigation, Modals & Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Modals
  const aboutModal = document.getElementById('aboutModal');
  const cvModal = document.getElementById('cvModal');
  const openAboutDetailsBtn = document.getElementById('openAboutDetailsBtn');
  const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');
  const openCvModalBtn = document.getElementById('openCvModalBtn');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');
  const downloadPdfActionBtn = document.getElementById('downloadPdfActionBtn');
  const copyContactInfoBtn = document.getElementById('copyContactInfoBtn');

  // Contact Form & Toast
  const contactForm = document.getElementById('contactForm');
  const submitFormBtn = document.getElementById('submitFormBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Year in Footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. Header Scroll Shadow & Blur
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
      mobileNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close when clicking mobile nav links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Toast Notification Helper
     -------------------------------------------------------------------------- */
  let toastTimeout = null;
  const showToast = (message, duration = 3800) => {
    if (!toastNotification || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  };

  /* --------------------------------------------------------------------------
     4. Modal Handlers (About & CV)
     -------------------------------------------------------------------------- */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openAboutDetailsBtn && aboutModal) {
    openAboutDetailsBtn.addEventListener('click', () => openModal(aboutModal));
  }
  if (closeAboutModalBtn && aboutModal) {
    closeAboutModalBtn.addEventListener('click', () => closeModal(aboutModal));
  }

  if (openCvModalBtn && cvModal) {
    openCvModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(cvModal);
    });
  }
  if (closeCvModalBtn && cvModal) {
    closeCvModalBtn.addEventListener('click', () => closeModal(cvModal));
  }

  // Close modals on clicking backdrop
  [aboutModal, cvModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(aboutModal);
      closeModal(cvModal);
    }
  });

  /* --------------------------------------------------------------------------
     5. CV Actions (Download & Copy Contact)
     -------------------------------------------------------------------------- */
  if (downloadPdfActionBtn) {
    downloadPdfActionBtn.addEventListener('click', () => {
      // Trigger browser print for high-fidelity printable view or provide feedback
      window.print();
      showToast('Opening print dialog for Chamath Poorna CV...');
      closeModal(cvModal);
    });
  }

  if (copyContactInfoBtn) {
    copyContactInfoBtn.addEventListener('click', () => {
      const contactText = `Chamath Poorna Danthanarayana\nSoftware Developer\nEmail: dcpoorna887@gmail.com\nPhone: +94 76 688 7096\nLocation: Colombo, Sri Lanka\nLinkedIn: https://linkedin.com/in/chamath-danthanarayana\nGitHub: https://github.com/CPdanthanarayana`;
      
      navigator.clipboard.writeText(contactText).then(() => {
        showToast('Contact information copied to clipboard!');
        closeModal(cvModal);
      }).catch(() => {
        showToast('Direct contact: dcpoorna887@gmail.com');
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Contact Form Submission
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showToast('Please provide a valid email address.');
        return;
      }

      // Submit state
      const originalText = submitFormBtn.innerHTML;
      submitFormBtn.disabled = true;
      submitFormBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="animate-spin" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Sending...</span>
      `;

      setTimeout(() => {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = originalText;
        contactForm.reset();
        showToast(`Thank you, ${nameInput.value.trim()}! Chamath will respond shortly.`);
      }, 900);
    });
  }

  /* --------------------------------------------------------------------------
     7. Scroll Reveal Animation for Glass Cards
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.glass-card, .service-card, .project-card, .process-step-card, .tech-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.08}s`;
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     8. Project External Link Handlers
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.project-action-link, .project-title a').forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');
      if (url && url.startsWith('http')) {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

});
