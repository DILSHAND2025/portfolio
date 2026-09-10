/**
 * DILSHAND B — DEVELOPER PORTFOLIO JAVASCRIPT
 * Performance-focused vanilla JS: navigation, modal, copy-to-clipboard, back-to-top, form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 01. Elements & Selectors ---
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const caseStudyModal = document.getElementById('case-study-modal');
  const openCaseStudyBtns = document.querySelectorAll('.open-case-study-btn');
  const closeCaseStudyBtn = document.getElementById('close-case-study-btn');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const toastAlert = document.getElementById('toast-alert');
  const contactForm = document.getElementById('contact-form');
  const currentYearSpan = document.getElementById('current-year');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  // --- 02. Dynamic Copyright Year ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- 03. Sticky Navbar & Back to Top Scroll Effect ---
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Sticky Navbar
    if (navbar) {
      if (scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to Top Button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 04. Active Navigation Link Spy (IntersectionObserver) ---
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --- 05. Mobile Navigation Drawer ---
  const openMobileMenu = () => {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileCloseBtn?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- 06. MAVERICK Case Study Modal ---
  let lastFocusedElement = null;

  const openCaseStudy = (e) => {
    if (e) e.preventDefault();
    if (!caseStudyModal) return;
    lastFocusedElement = document.activeElement;
    caseStudyModal.classList.add('open');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeCaseStudyBtn?.focus();
  };

  const closeCaseStudy = () => {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('open');
    caseStudyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  openCaseStudyBtns.forEach((btn) => {
    btn.addEventListener('click', openCaseStudy);
  });

  if (closeCaseStudyBtn) {
    closeCaseStudyBtn.addEventListener('click', closeCaseStudy);
  }

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) {
        closeCaseStudy();
      }
    });
  }

  // Global ESC key listener for overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (caseStudyModal && caseStudyModal.classList.contains('open')) {
        closeCaseStudy();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });

  // --- 07. Copy Email Toast Notification ---
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toastAlert) return;
    const msgEl = toastAlert.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;
    toastAlert.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastAlert.classList.remove('show');
    }, 3200);
  };

  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'dilshandcse@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  });

  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
  copyPhoneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone') || '+91 9944667158';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone).then(() => {
          showToast(`Copied ${phone} to clipboard!`);
        }).catch(() => {
          fallbackCopy(phone);
        });
      } else {
        fallbackCopy(phone);
      }
    });
  });

  const fallbackCopy = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      window.prompt('Copy text:', text);
    }
    document.body.removeChild(tempInput);
  };

  // --- 08. Functional Contact Form ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Software Engineering Opportunity / Portfolio Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Generate mailto link with encoded parameters
      const emailBody = `From: ${name} (${email})\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:dilshandcse@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      showToast('Opening email client to send message...');
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      contactForm.reset();
    });
  }

  // --- 09. Smooth In-Page Anchor Scrolling with Offset ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
