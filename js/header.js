document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.navbar-toggler');
  const mobileMenu = document.querySelector('.navbar-collapse');
  const mobileMenuOverlay = document.createElement('div');
  mobileMenuOverlay.className = 'mobile-menu-overlay';
  document.body.appendChild(mobileMenuOverlay);

  function toggleMobileMenu() {
    mobileMenu.classList.toggle('show');
    mobileMenuOverlay.classList.toggle('show');
    document.body.classList.toggle('menu-open');
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking overlay
  mobileMenuOverlay.addEventListener('click', function() {
    mobileMenu.classList.remove('show');
    this.classList.remove('show');
    document.body.classList.remove('menu-open');
  });

  // Handle dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = this.parentElement;
        const isOpen = parent.classList.contains('show');
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          if (dropdown !== this.nextElementSibling) {
            dropdown.classList.remove('show');
          }
        });
        
        // Toggle current dropdown
        if (this.nextElementSibling && this.nextElementSibling.classList.contains('dropdown-menu')) {
          this.nextElementSibling.classList.toggle('show');
        }
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.matches('.dropdown-toggle')) {
      document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      });
    }
  });

  // Sticky header on scroll
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
      }
      
      if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
    });
  }

  // Add active class to current page link
  const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
      link.classList.add('active');
      
      // If it's a dropdown item, also highlight the parent
      let parent = link.parentElement;
      while (parent && !parent.classList.contains('navbar-nav')) {
        if (parent.classList.contains('dropdown')) {
          parent.querySelector('.dropdown-toggle').classList.add('active');
        }
        parent = parent.parentElement;
      }
    }
  });

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
