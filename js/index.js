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
  strings: ["Arif", "Full-Stack", "Designer"],
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
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
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
