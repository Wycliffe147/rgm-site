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
    const parentRow = btn.closest('.amt-row');
    const panel = btn.closest('.give-panel');
    
    parentRow.querySelectorAll('.amt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Toggle custom amount field visibility
    const customContainer = panel.querySelector('[id$="CustomAmtContainer"]');
    if (customContainer) {
      if (btn.getAttribute('data-value') === 'other') {
        customContainer.style.display = 'block';
        const customInput = customContainer.querySelector('input');
        if (customInput) customInput.focus();
      } else {
        customContainer.style.display = 'none';
      }
    }
  });
});

let appConfig = null;

async function fetchAppConfig() {
  if (appConfig) return appConfig;
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      appConfig = await res.json();
      return appConfig;
    }
  } catch (err) {
    console.warn('Could not fetch config from server, falling back to local defaults', err);
  }
  return {
    paychanguPublicKey: window.PAYCHANGU_PUBLIC_KEY || "",
    paypalDonateUrl: "https://www.paypal.com/donate"
  };
}

async function getPaychanguPublicKey() {
  const config = await fetchAppConfig();
  return config.paychanguPublicKey || "PUB-LIVE-VbwEYqIPZ0Lmu34aJC3ZXAyTEtPs6KTS";
}

async function initPaypalLinks() {
  const container = document.getElementById('paypal-container-B3HP9R34J74W2');
  if (!container) return;

  // Prevent double rendering
  if (container.dataset.rendered) return;
  container.dataset.rendered = "true";

  const script = document.createElement('script');
  script.src = "https://www.paypal.com/sdk/js?client-id=BAANlmTzZQ6wBucIDpQs0CgQwQEvdJNoar5iJHZYkhTK7GGjMMBRKMrW56_rnD_-zInowORcjuWGrafV5c&components=hosted-buttons&disable-funding=venmo&currency=USD";
  script.onload = () => {
    if (window.paypal && window.paypal.HostedButtons) {
      window.paypal.HostedButtons({
        hostedButtonId: "B3HP9R34J74W2"
      }).render("#paypal-container-B3HP9R34J74W2");
    }
  };
  document.head.appendChild(script);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaypalLinks);
} else {
  initPaypalLinks();
}

async function handlePaychanguCheckout(type) {
  const isCharity = type === 'charity';
  const prefix = isCharity ? 'charity' : 'give';
  
  const panel = document.querySelector(isCharity ? '.give-panel' : '#give .give-panel');
  if (!panel) return;

  // 1. Get amount
  const activeAmtBtn = panel.querySelector('.amt.active');
  let amount = 0;
  
  if (!activeAmtBtn) {
    alert('Please select or enter a donation amount.');
    return;
  }
  
  const val = activeAmtBtn.getAttribute('data-value');
  if (val === 'other') {
    const customInput = document.getElementById(`${prefix}CustomAmt`);
    amount = parseFloat(customInput ? customInput.value : '0');
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
  } else {
    amount = parseFloat(val);
  }

  // 2. Get Name
  const nameInput = document.getElementById(`${prefix}Name`);
  const fullName = nameInput ? nameInput.value.trim() : '';
  if (!fullName) {
    alert('Please enter your full name.');
    if (nameInput) nameInput.focus();
    return;
  }

  // 3. Get Contact details
  const contactInput = document.getElementById(`${prefix}Email`);
  const rawContact = contactInput ? contactInput.value.trim() : '';
  if (!rawContact) {
    alert('Please enter your email address or phone number.');
    if (contactInput) contactInput.focus();
    return;
  }

  // Parse Name
  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0] || 'Donor';
  const lastName = nameParts.slice(1).join(' ') || 'Partner';

  // Parse Email & Phone
  let email = '';
  let phone = '';
  if (rawContact.includes('@')) {
    email = rawContact;
  } else {
    phone = rawContact;
    // PayChangu expects a valid email format for receipts
    email = `donor-${rawContact.replace(/[^a-zA-Z0-9]/g, '')}@rgmmalawi.org`;
  }

  // Fetch Public Key
  const publicKey = await getPaychanguPublicKey();
  const txRef = `rgm-${isCharity ? 'charity' : 'general'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    if (typeof PaychanguCheckout === 'undefined') {
      alert('Payment gateway is loading. Please wait a moment and click again.');
      return;
    }

    PaychanguCheckout({
      "public_key": publicKey,
      "tx_ref": txRef,
      "amount": amount,
      "currency": "MWK",
      "callback_url": window.location.origin,
      "return_url": window.location.href,
      "customer": {
        "email": email,
        "first_name": firstName,
        "last_name": lastName
      },
      "customization": {
        "title": "Revealed Gospel Ministries",
        "description": isCharity ? "Support RGM Charity Works" : "Support Revealed Gospel Ministries"
      },
      "meta": {
        "phone": phone,
        "donor_name": fullName
      }
    });
  } catch (err) {
    console.error('PayChangu Checkout initialization failed:', err);
    alert('Could not initialize payment. Please check your internet connection and try again.');
  }
}

// Give now button handler
const giveBtn = document.querySelector('#give .btn-primary[data-action="give"]');
if (giveBtn) {
  giveBtn.addEventListener('click', () => {
    handlePaychanguCheckout('general');
  });
}

// Charity Works giving panel handler
const charityGiveBtn = document.querySelector('.btn-primary[data-action="charity-give"]');
if (charityGiveBtn) {
  charityGiveBtn.addEventListener('click', () => {
    handlePaychanguCheckout('charity');
  });
}

// ===== LIGHTBOX =====
(function () {
  // Build overlay HTML
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = `
    <button class="lightbox-close" id="lightboxClose" aria-label="Close image viewer">&#x2715;</button>
    <img class="lightbox-img" id="lightboxImg" src="" alt="">
    <span class="lightbox-caption" id="lightboxCaption"></span>
  `;
  document.body.appendChild(overlay);

  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lbImg.classList.remove('loaded');
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbImg.onload = () => lbImg.classList.add('loaded');
    lbClose.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after fade-out so next open always animates
    setTimeout(() => { lbImg.src = ''; lbImg.classList.remove('loaded'); }, 320);
  }

  lbClose.addEventListener('click', closeLightbox);

  // Click on backdrop (not on the image itself) closes lightbox
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === lbCaption) closeLightbox();
  });

  // Escape key closes lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

  // ---- Which images should open in the lightbox? ----
  // Use CSS selector list — these are the image classes we want to intercept.
  // Images inside <a> tags (YouTube thumbnails etc.) are intentionally excluded.
  const LIGHTBOX_SELECTORS = [
    '.poster-img',           // crusade posters
    '.founder-photo',        // founder card on homepage
    '.trustee-avatar-img',   // trustee photos on about page
  ];

  // For .thumb-img we only lightbox if NOT inside an <a> (story cards without links)
  function isLightboxTarget(el) {
    if (!el || el.tagName !== 'IMG' || !el.src) return false;
    if (LIGHTBOX_SELECTORS.some(sel => el.matches(sel))) return true;
    if (el.matches('.thumb-img') && !el.closest('a')) return true;
    return false;
  }

  // Event delegation — works for dynamically rendered cards too
  document.addEventListener('click', (e) => {
    if (!isLightboxTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    openLightbox(e.target.src, e.target.alt);
  }, true); // capture phase so we fire before card's own click handlers
})();

// ============================================================
// GLOBAL NEWSLETTER SIGNUP HANDLER
// ============================================================
window.submitNewsletter = async function(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.nextElementSibling;

  if (!input || !btn || !msg) return;

  const email = input.value.trim();
  if (!email) return;

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = '...';
  msg.style.display = 'none';

  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Subscription failed');

    msg.textContent = '🎉 ' + (data.message || 'Subscribed successfully!');
    msg.style.color = '#81c784';
    msg.style.display = 'block';
    form.reset();
  } catch (err) {
    msg.textContent = err.message;
    msg.style.color = '#e57373';
    msg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
};

window.submitContact = async function(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput = form.querySelector('#contactName');
  const emailInput = form.querySelector('#contactEmail');
  const subjectInput = form.querySelector('#contactSubject');
  const messageInput = form.querySelector('#contactMessage');
  const btn = form.querySelector('button[type="submit"]');
  const msg = document.getElementById('contactMsg');

  if (!nameInput || !emailInput || !messageInput || !btn || !msg) return;

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  msg.style.display = 'none';

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subjectInput ? subjectInput.value.trim() : '',
    message: messageInput.value.trim()
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');

    msg.textContent = '🎉 ' + (data.message || 'Message sent successfully!');
    msg.style.color = '#81c784';
    msg.style.display = 'block';
    form.reset();
  } catch (err) {
    msg.textContent = err.message;
    msg.style.color = '#e57373';
    msg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
};

