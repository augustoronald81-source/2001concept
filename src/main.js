import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scrolled State
  const navbar = document.getElementById('navbar');
  const scrollIndicator = document.getElementById('scroll-indicator');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollY > 60) {
      scrollIndicator?.classList.add('hidden-scroll');
    } else {
      scrollIndicator?.classList.remove('hidden-scroll');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 2. Mobile Drawer Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const iconOpen = mobileToggle?.querySelector('.icon-open');
  const iconClose = mobileToggle?.querySelector('.icon-close');

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer?.classList.contains('active');
    if (isOpen) {
      mobileDrawer?.classList.remove('active');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      document.body.style.overflow = '';
    } else {
      mobileDrawer?.classList.add('active');
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  mobileToggle?.addEventListener('click', toggleMobileMenu);

  // Close mobile drawer when clicking any nav item
  document.querySelectorAll('.mobile-nav-item, .mobile-nav-ig').forEach((item) => {
    item.addEventListener('click', () => {
      mobileDrawer?.classList.remove('active');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });

  // 3. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // 4. Smooth Anchor Link Handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navbarHeight = navbar?.offsetHeight || 70;
          const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 10;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
