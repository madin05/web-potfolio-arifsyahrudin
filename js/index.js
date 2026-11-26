// navbar style
const navbar = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  const scrollThreshold = 250;

  if (scrollPosition > scrollThreshold) {
    navbar.style.backdropFilter = "blur(10px)";
  } else {
    navbar.style.backdropFilter = "";
  }
});
// navbar style

// jumbotron style
const typed = new Typed(".auto-type", {
  strings: ["Arif", "Web Developer", "UI/X Designer"],
  typeSpeed: 150,
  backSpeed: 20,
  loop: true,
});
// jumbotron style

// Mobile menu toggle
const hamburgerCheckbox = document.getElementById('hamburger-checkbox');
const navList = document.querySelector('.navigasi');
const navLinks = document.querySelectorAll('.navigasi ul li a');

if (hamburgerCheckbox) {
  hamburgerCheckbox.addEventListener('change', () => {
    if (hamburgerCheckbox.checked) {
      navList.classList.add('active');
      document.body.classList.add('menu-open');
    } else {
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Close sidebar when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerCheckbox.checked = false;
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburgerCheckbox.checked && !navList.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburgerCheckbox.checked = false;
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// Sosmed Tooltips Auto-Generator
const sosmedLinks = document.querySelectorAll('.sosmed a');
sosmedLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href !== '#') {
    // Extract username from URL (gets the last part after /)
    const urlParts = href.split('/');
    const username = urlParts.pop() || urlParts.pop(); // handles trailing slashes
    link.setAttribute('data-username', '@' + username);
  } else {
    // Default placeholder if href is empty or just '#'
    link.setAttribute('data-username', '@username');
  }
});// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Fluent Design Reveal Highlight for Skill Items
document.querySelectorAll('.card-skill-tool').forEach(container => {
  container.addEventListener('mousemove', (e) => {
    const items = container.querySelectorAll('.skill-item');
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});

// Parallax Fade Effect for Sections
const parallaxSections = document.querySelectorAll('section:not(#jumbotron):not(#contact)');

let isParallaxTicking = false;

window.addEventListener('scroll', () => {
  if (!isParallaxTicking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      parallaxSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Only start fading when the user has seen the bottom of the section,
        // or when the top of the section reaches the top of the viewport (for shorter sections).
        const fadeStartPoint = Math.max(sectionTop, sectionTop + sectionHeight - viewportHeight);
        
        if (scrolled > fadeStartPoint) {
          const pastFadeStart = scrolled - fadeStartPoint;
          
          // Calculate opacity: fades out over the height of the viewport
          const opacity = 1 - (pastFadeStart / (viewportHeight * 0.8));
          
          // Calculate parallax translation: moves down slightly to create depth (using 3d for GPU acceleration)
          const translateY = pastFadeStart * 0.4;
          
          section.style.opacity = Math.max(0, opacity);
          section.style.transform = `translate3d(0, ${translateY}px, 0)`;
          section.style.pointerEvents = opacity <= 0 ? 'none' : 'auto'; 
        } else {
          // Reset styles when section is normally in view
          section.style.opacity = '';
          section.style.transform = '';
          section.style.pointerEvents = 'auto';
        }
      });
      isParallaxTicking = false;
    });
    isParallaxTicking = true;
  }
});

// FAB Back to Top
const fabTop = document.getElementById('fab-top');

if (fabTop) {
  window.addEventListener('scroll', () => {
    // Show FAB when scrolled down 400px
    if (window.scrollY > 400) {
      fabTop.classList.add('show');
    } else {
      fabTop.classList.remove('show');
    }
  });

  fabTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Intersection Observer for scroll entrance animations (About Me & Skills)
const revealElements = document.querySelectorAll('.reveal-item, .reveal-pict, .reveal-card, .education-timeline, .skills-card-display');

console.log('[Portfolio Debug] Found reveal elements:', revealElements.length);

if (revealElements.length > 0) {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        console.log('[Portfolio Debug] Element intersecting state changed:', entry.target.className, 'isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Remove active class when scrolling out of view to allow re-triggering
          entry.target.classList.remove('active');
        }
      });
    }, {
      threshold: 0.05, // Trigger when at least 5% of the element is visible
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    console.log('[Portfolio Debug] IntersectionObserver not supported by browser. Falling back to active state.');
    revealElements.forEach(el => el.classList.add('active'));
  }
}

// Contact Form Submission (FormSubmit AJAX -> arifsyah1018@gmail.com)
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm && submitBtn && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const honey = document.getElementById('honeypot')?.value || '';

    if (!name || !email || !message) return;

    const btnText = submitBtn.querySelector('.button-span');
    const originalText = btnText ? btnText.textContent : 'Submit Message';

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch('https://formsubmit.co/ajax/arifsyah1018@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _honey: honey,
          _subject: `Pesan Baru dari Portfolio: ${name}`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        formStatus.textContent = 'Thanks for contacting me 😊';
        formStatus.classList.add('success');
        contactForm.reset();
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        formStatus.textContent = 'Form perlu aktivasi 1x: silakan cek inbox/spam arifsyah1018@gmail.com lalu klik link "Activate Form", setelah itu coba kirim lagi.';
        formStatus.classList.add('error');
      } else {
        throw new Error(data.message || 'Gagal mengirim pesan.');
      }
    } catch (error) {
      formStatus.textContent = error.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    }
  });
}
