import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos principais de navegação
  const navbar = document.getElementById('navbar');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const iconOpen = mobileToggle?.querySelector('.icon-open');
  const iconClose = mobileToggle?.querySelector('.icon-close');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // 2. Estado de rolagem do Header com requestAnimationFrame (Sem engasgos / jank)
  let lastScrollY = window.scrollY;
  let isTicking = false;

  const updateScrollState = () => {
    const scrollY = lastScrollY;
    
    // Header scrolled state (apenas alterna classe; sem animar padding/reflows)
    if (scrollY > 30) {
      if (!navbar?.classList.contains('scrolled')) {
        navbar?.classList.add('scrolled');
      }
    } else {
      if (navbar?.classList.contains('scrolled')) {
        navbar?.classList.remove('scrolled');
      }
    }

    // Ocultar indicador de scroll após primeira rolagem
    if (scrollY > 60) {
      if (!scrollIndicator?.classList.contains('hidden-scroll')) {
        scrollIndicator?.classList.add('hidden-scroll');
      }
    } else {
      if (scrollIndicator?.classList.contains('hidden-scroll')) {
        scrollIndicator?.classList.remove('hidden-scroll');
      }
    }

    isTicking = false;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;
    if (!isTicking) {
      window.requestAnimationFrame(updateScrollState);
      isTicking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateScrollState(); // Verificação inicial

  // 3. Controle do Menu Mobile Drawer
  const openMobileMenu = () => {
    mobileDrawer?.classList.add('active');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    iconOpen?.classList.add('hidden');
    iconClose?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileDrawer?.classList.remove('active');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    iconOpen?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer?.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  mobileToggle?.addEventListener('click', toggleMobileMenu);

  // Fechar menu mobile ao clicar em qualquer link de navegação
  document.querySelectorAll('.mobile-nav-item, .mobile-nav-ig').forEach((item) => {
    item.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 4. Rolagem suave para links de âncora com compensação precisa do header fixo
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navbarHeight = navbar?.offsetHeight || 60;
          const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 4;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 5. Scroll Spy Otimizado (apenas atualiza o DOM quando a seção ativa realmente muda)
  const sections = document.querySelectorAll('section[id], article[id]');
  let currentActiveId = '';

  if ('IntersectionObserver' in window && sections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          if (currentId && currentId !== currentActiveId) {
            currentActiveId = currentId;

            // Atualiza links desktop
            navLinks.forEach((link) => {
              const href = link.getAttribute('href')?.replace('#', '');
              if (href === currentId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            // Atualiza links mobile se o drawer estiver acessível
            mobileNavItems.forEach((link) => {
              const href = link.getAttribute('href')?.replace('#', '');
              if (href === currentId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.05
    });

    sections.forEach((sec) => spyObserver.observe(sec));
  }

  // 6. Scroll Reveal Observer Otimizado (Animação leve 350ms executada uma única vez)
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // Libera o observer imediatamente
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ==========================================================================
  // 7. LIGHTBOX INTERATIVO — LIFESTYLE 2001 (Leve & Acessível)
  // ==========================================================================
  const lifestyleImages = [
    {
      src: '/assets/lifestyle-estudio-opt.jpg',
      alt: 'Lifestyle 2001 - Campanha Editorial Cinco Modelos em Estúdio',
      caption: 'Campanha Estúdio // Identidade & Presença Coletiva'
    },
    {
      src: '/assets/lifestyle-loja.jpg',
      alt: 'Lifestyle 2001 - Três Modelos em Frente à Loja',
      caption: 'Cultura Urbana // Raízes & Conexão Real com as Ruas'
    },
    {
      src: '/assets/lifestyle-noturno.jpg',
      alt: 'Lifestyle 2001 - Três Modelos com Looks Coordenados em Ambiente Noturno',
      caption: 'Movimento Noturno // Presença & Atitude Noturna'
    }
  ];

  const lightbox = document.getElementById('lifestyle-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  let currentLightboxIndex = 0;
  let lastActiveElement = null;

  const updateLightboxContent = (index) => {
    currentLightboxIndex = index;
    const item = lifestyleImages[currentLightboxIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.classList.add('switching');
      
      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxImg.classList.remove('switching');
      }, 100);
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lifestyleImages.length}`;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }
  };

  const openLightbox = (index) => {
    lastActiveElement = document.activeElement;
    updateLightboxContent(index);
    
    lightbox?.classList.add('active');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      lightboxCloseBtn?.focus();
    }, 50);
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  const nextLightboxImage = () => {
    const nextIdx = (currentLightboxIndex + 1) % lifestyleImages.length;
    updateLightboxContent(nextIdx);
  };

  const prevLightboxImage = () => {
    const prevIdx = (currentLightboxIndex - 1 + lifestyleImages.length) % lifestyleImages.length;
    updateLightboxContent(prevIdx);
  };

  // Disparar abertura ao clicar ou pressionar Enter/Espaço nos cards
  document.querySelectorAll('.lifestyle-card').forEach((card) => {
    const triggerOpen = () => {
      const idxAttr = card.getAttribute('data-lightbox-index');
      const idx = idxAttr ? parseInt(idxAttr, 10) : 0;
      openLightbox(idx);
    };

    card.addEventListener('click', triggerOpen);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpen();
      }
    });
  });

  // Eventos de controles do lightbox
  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  lightboxNextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    nextLightboxImage();
  });
  lightboxPrevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    prevLightboxImage();
  });

  // Navegação global por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeMobileMenu();
      return;
    }

    if (lightbox?.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevLightboxImage();
      }
    }
  });

  // Navegação por gesto touch / swipe em dispositivos móveis
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextLightboxImage();
      } else {
        prevLightboxImage();
      }
    }
  }, { passive: true });
});
