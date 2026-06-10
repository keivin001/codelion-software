/**
 * CODELION SOFTWARE - Core Javascript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // Preloader animation
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    });
  }

  // Navbar Scroll Class Toggle
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const toggleNavbarScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };
    
    window.addEventListener('scroll', toggleNavbarScroll);
    toggleNavbarScroll(); // Run initially to check position
  }

  // Back to Top Button Behavior
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      const showBtn = window.scrollY > 400;
      backBtn.style.opacity = showBtn ? '1' : '0';
      backBtn.style.pointerEvents = showBtn ? 'all' : 'none';
    });
    
    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Cookie Banner Behavior
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');

  if (cookieBanner) {
    if (!localStorage.getItem('cookieAccepted')) {
      cookieBanner.style.display = 'flex';
    }
    
    if (acceptBtn) {
      acceptBtn.onclick = () => {
        localStorage.setItem('cookieAccepted', 'true');
        cookieBanner.style.display = 'none';
      };
    }
    
    if (declineBtn) {
      declineBtn.onclick = () => {
        cookieBanner.style.display = 'none';
      };
    }
  }

  // Dynamic Navigation Highlight
  // Extract the current page file name from URL path
  const currentPath = window.location.pathname;
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (pageName === '' || pageName === '/') {
    pageName = 'index.html';
  }

  // Highlight matching navbar and bottom nav links
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const bottomItems = document.querySelectorAll('.bottom-nav-item');

  const highlightNav = (hrefAttribute, element) => {
    let linkPath = hrefAttribute;
    if (linkPath.startsWith('#') && pageName === 'index.html') {
      return;
    }
    
    if (pageName.includes(linkPath) && linkPath !== '') {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  };

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      highlightNav(href, link);
    }
  });

  bottomItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href) {
      highlightNav(href, item);
    }
  });

  // ========== DARK/LIGHT THEME COORDINATION ==========
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const navbarLogo = document.getElementById('navbarLogo');
  const favicon = document.getElementById('favicon');

  const updateBranding = (isDark) => {
    const footerLogo = document.getElementById('footerLogo');
    if (isDark) {
      document.body.classList.add('dark-mode');
      if (themeIcon) {
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
      }
      if (navbarLogo) navbarLogo.src = 'images/logo_dark.jpg';
      if (footerLogo) footerLogo.src = 'images/logo_dark.jpg';
    } else {
      document.body.classList.remove('dark-mode');
      if (themeIcon) {
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
      }
      if (navbarLogo) navbarLogo.src = 'images/logo_light.jpg';
      if (footerLogo) footerLogo.src = 'images/logo_light.jpg';
    }
  };

  // Check initial state
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDarkSetting = savedTheme === 'dark' || (!savedTheme && prefersDark);

  updateBranding(isDarkSetting);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isDarkSetting = !document.body.classList.contains('dark-mode');
      updateBranding(isDarkSetting);
      localStorage.setItem('theme', isDarkSetting ? 'dark' : 'light');
    });
  }

  // ========== MOBILE MENU CLOSE ICON TRANSITION ==========
  const menuToggleIcon = document.getElementById('menuToggleIcon');
  const navbarMain = document.getElementById('navbarMain');

  if (navbarMain && menuToggleIcon) {
    navbarMain.addEventListener('show.bs.collapse', () => {
      menuToggleIcon.classList.remove('bi-list');
      menuToggleIcon.classList.add('bi-x-lg');
    });
    
    navbarMain.addEventListener('hide.bs.collapse', () => {
      menuToggleIcon.classList.remove('bi-x-lg');
      menuToggleIcon.classList.add('bi-list');
    });
  }

  // Animated Stats Counter (runs if counter elements are present in the viewport)
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0 && typeof IntersectionObserver !== 'undefined') {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          let cur = 0;
          const duration = 1200; // ms
          const stepTime = 15; // ms
          const steps = duration / stepTime;
          const inc = target / steps;
          
          const updateCounter = () => {
            cur += inc;
            if (cur < target) {
              el.innerText = Math.floor(cur);
              setTimeout(updateCounter, stepTime);
            } else {
              let suffix = '';
              if (target === 99.9) suffix = '%';
              else if (target === 50 || target === 20) suffix = '+';
              else suffix = '+';
              
              el.innerText = target === 99.9 ? '99.9%' : Math.floor(target) + suffix;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  }
});
