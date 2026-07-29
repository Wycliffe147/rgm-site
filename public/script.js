// Mobile hamburger menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Dropdown menus — tap to toggle open/close, close others
document.querySelectorAll('.nav-drop-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const dropdown = btn.closest('.nav-dropdown');
    const wasOpen = dropdown.classList.contains('open');
    // Close all open dropdowns
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    if (!wasOpen) {
      dropdown.classList.add('open');
    }
  });
});

// Remove sticky open class when mouse leaves dropdown on Desktop
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  dropdown.addEventListener('mouseleave', () => {
    dropdown.classList.remove('open');
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
});


// Scroll reveal animation
const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
    }
  });
}, { threshold: 0.15 });
els.forEach(el => io.observe(el));

// Count-up animation for hero stats
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseInt(el.dataset.countTo, 10);
  const suffix = el.dataset.suffix || '';

  if (prefersReducedMotion) {
    el.textContent = target.toLocaleString() + suffix;
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll('.stat b[data-count-to]');
if (statEls.length) {
  const statsIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statsIo.observe(el));
}

// Donation amount selector
document.querySelectorAll('.amt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Give now button placeholder
const giveBtn = document.querySelector('#give .btn-primary[data-action="give"]');
if (giveBtn) {
  giveBtn.addEventListener('click', () => {
    alert('Payment gateway to be connected. Options: PayChangu, Airtel Money, or bank transfer.');
  });
}

// Charity Works giving panel placeholder
const charityGiveBtn = document.querySelector('.btn-primary[data-action="charity-give"]');
if (charityGiveBtn) {
  charityGiveBtn.addEventListener('click', () => {
    alert('Payment gateway to be connected. Options: PayChangu, Airtel Money, or bank transfer.');
  });
}
