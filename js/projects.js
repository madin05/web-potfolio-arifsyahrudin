const projects = [
  { id: 1, title: "E-Commerce Web", category: "Web Development", desc: "Platform e-commerce lengkap dengan fitur keranjang belanja, gateway pembayaran, dan panel admin.", image: "./assets/Project-1-1.png", link: "#" },
  { id: 2, title: "Mobile Banking App", category: "UI/UX Design", desc: "Desain UI/UX aplikasi perbankan modern yang memprioritaskan kemudahan transfer dan keamanan data.", image: "./assets/Project-2.png", link: "#" },
  { id: 3, title: "Company Profile Web", category: "Web Development", desc: "Website profil perusahaan profesional dengan performa optimal dan SEO-friendly.", image: "./assets/Project-3.png", link: "#" },
  { id: 4, title: "MyFinance Dashboard", category: "Web Development", desc: "Aplikasi keuangan pribadi untuk mencatat transaksi harian, visualisasi data, dan budget planner.", image: "./assets/Project-4.png", link: "https://myfinanceid.vercel.app/" },
  { id: 5, title: "KSM Edu Portal", category: "Web Development", desc: "Portal edukasi online interaktif untuk belajar materi sekolah dengan sistem gamifikasi.", image: "./assets/Project-5.png", link: "https://ksmedu.my.id/" },
  { id: 6, title: "Social Media Scheduler", category: "Web Development", desc: "Aplikasi SAAS untuk menjadwalkan postingan sosial media otomatis ke multi-platform.", image: "./assets/Project-1.png", link: "#" },
  { id: 7, title: "Health Monitor App", category: "UI/UX Design", desc: "Aplikasi pelacak kesehatan harian dengan integrasi smart-watch dan AI insight.", image: "./assets/Project-2-2.png", link: "#" },
  { id: 8, title: "Property Finder", category: "Web Development", desc: "Portal pencarian properti dengan fitur filter cerdas, peta interaktif, dan chat langsung agen.", image: "./assets/Project-3-3.png", link: "#" },
  { id: 9, title: "Task Manager Pro", category: "UI/UX Design", desc: "Desain kolaboratif tools manajemen tugas berbasis Kanban board dengan tema gelap.", image: "./assets/Project-4-4.png", link: "#" },
  { id: 10, title: "Smart Home System", category: "Web Development", desc: "Dashboard monitoring IoT rumah pintar untuk kontrol suhu, lampu, dan sistem keamanan.", image: "./assets/Project-5.png", link: "#" },
  { id: 11, title: "Recipe Finder App", category: "UI/UX Design", desc: "Desain aplikasi resep makanan sehat berdasarkan bahan yang tersisa di lemari es.", image: "./assets/Project-1-1.png", link: "#" },
  { id: 12, title: "Cryptocurrency Tracker", category: "Web Development", desc: "Dashboard pemantau harga crypto secara real-time dengan grafik teknikal lanjutan.", image: "./assets/Project-3.png", link: "#" }
];

let currentPage = 1;
const itemsPerPage = 6;
let currentLayout = 'grid'; // 'grid', 'list', 'asymmetric'

const container = document.getElementById('projects-container');
const paginationElement = document.getElementById('pagination');
const layoutToggles = document.querySelector('.layout-toggles');
const layoutButtons = document.querySelectorAll('.btn-toggle');

function updateLayoutIndicator() {
  if (!layoutToggles) return;
  const activeBtn = layoutToggles.querySelector('.btn-toggle.active');
  if (!activeBtn) return;

  layoutToggles.style.setProperty('--pill-x', `${activeBtn.offsetLeft}px`);
  layoutToggles.style.setProperty('--pill-y', `${activeBtn.offsetTop}px`);
  layoutToggles.style.setProperty('--pill-w', `${activeBtn.offsetWidth}px`);
  layoutToggles.style.setProperty('--pill-h', `${activeBtn.offsetHeight}px`);
}

function renderProjects() {
  container.innerHTML = '';
  
  // Apply layout class
  container.className = `projects-display ${currentLayout}-layout`;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = projects.slice(startIndex, endIndex);
  
  paginatedProjects.forEach((proj, idx) => {
    // Generate HTML for project item
    const projCard = document.createElement('div');
    projCard.className = 'content-project';
    
    // In asymmetric layout, we assign sizing classes to specific items on the page
    if (currentLayout === 'asymmetric') {
      if (idx === 0) {
        projCard.classList.add('item-large'); // Double column and row span
      } else if (idx === 3) {
        projCard.classList.add('item-wide');  // Double column span
      }
    }
    
    projCard.innerHTML = `
      <div class="project-img">
        <img src="${proj.image}" alt="${proj.title}" />
      </div>
      <div class="desc">
        <span class="project-tag">${proj.category}</span>
        <h4 class="project-title-page">${proj.title}</h4>
        <p class="desc-project">${proj.desc}</p>
      </div>
      <div class="link-project">
        <a href="${proj.link}">See Project <i class="ph ph-arrow-right"></i></a>
      </div>
    `;
    
    container.appendChild(projCard);
  });
  
  renderPagination();
}

function renderPagination() {
  paginationElement.innerHTML = '';
  
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = '<i class="ph ph-caret-left"></i>';
  if (currentPage > 1) {
    prevBtn.addEventListener('click', () => {
      currentPage--;
      renderProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  paginationElement.appendChild(prevBtn);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
    pageBtn.innerText = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationElement.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = '<i class="ph ph-caret-right"></i>';
  if (currentPage < totalPages) {
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  paginationElement.appendChild(nextBtn);
}

// Layout toggle handlers (click + Apple Music-style press & drag)
let suppressNextClick = false;

function setActiveLayoutButton(targetBtn, shouldRender = true) {
  layoutButtons.forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');
  updateLayoutIndicator();

  const nextLayout = targetBtn.getAttribute('data-layout');
  if (shouldRender && nextLayout && nextLayout !== currentLayout) {
    currentLayout = nextLayout;
    renderProjects();
  }
}

layoutButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    setActiveLayoutButton(btn, true);
  });
});

if (layoutToggles && layoutButtons.length > 0) {
  let isPointerDown = false;
  let hasDragged = false;
  let startX = 0;
  let activeDragBtn = null;

  const getClosestButton = (localX) => {
    let closest = layoutButtons[0];
    let minDist = Infinity;
    layoutButtons.forEach(btn => {
      const center = btn.offsetLeft + btn.offsetWidth / 2;
      const dist = Math.abs(localX - center);
      if (dist < minDist) {
        minDist = dist;
        closest = btn;
      }
    });
    return closest;
  };

  layoutToggles.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerDown = true;
    hasDragged = false;
    startX = e.clientX;
    activeDragBtn = layoutToggles.querySelector('.btn-toggle.active') || layoutButtons[0];

    layoutToggles.classList.add('is-pressed');
    try {
      layoutToggles.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  layoutToggles.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;

    if (!hasDragged && Math.abs(e.clientX - startX) > 4) {
      hasDragged = true;
      layoutToggles.classList.add('is-dragging');
    }

    if (!hasDragged) return;

    const rect = layoutToggles.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const targetBtn = getClosestButton(localX);
    activeDragBtn = targetBtn;

    const firstBtn = layoutButtons[0];
    const lastBtn = layoutButtons[layoutButtons.length - 1];
    const pillW = targetBtn.offsetWidth;
    const minX = firstBtn.offsetLeft;
    const maxX = lastBtn.offsetLeft + lastBtn.offsetWidth - pillW;
    const clampedX = Math.max(minX, Math.min(maxX, localX - pillW / 2));

    layoutToggles.style.setProperty('--pill-x', `${clampedX}px`);
    layoutToggles.style.setProperty('--pill-y', `${targetBtn.offsetTop}px`);
    layoutToggles.style.setProperty('--pill-w', `${pillW}px`);
    layoutToggles.style.setProperty('--pill-h', `${targetBtn.offsetHeight}px`);

    layoutButtons.forEach(b => b.classList.toggle('active', b === targetBtn));
  });

  const endDrag = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    layoutToggles.classList.remove('is-pressed', 'is-dragging');

    try {
      if (layoutToggles.hasPointerCapture(e.pointerId)) {
        layoutToggles.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (hasDragged && activeDragBtn) {
      suppressNextClick = true;
      setTimeout(() => { suppressNextClick = false; }, 0);
      setActiveLayoutButton(activeDragBtn, true);
    }
    hasDragged = false;
    activeDragBtn = null;
  };

  layoutToggles.addEventListener('pointerup', endDrag);
  layoutToggles.addEventListener('pointercancel', endDrag);
}

window.addEventListener('resize', updateLayoutIndicator);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateLayoutIndicator);
}

// Initial render
renderProjects();
updateLayoutIndicator();
requestAnimationFrame(() => {
  if (layoutToggles) layoutToggles.classList.add('is-ready');
});

// Mobile menu toggle
const hamburgerCheckbox = document.getElementById('hamburger-checkbox');
const navList = document.querySelector('.navigasi');
const navLinks = document.querySelectorAll('.navigasi ul li a');

if (hamburgerCheckbox && navList) {
  hamburgerCheckbox.addEventListener('change', () => {
    navList.classList.toggle('active', hamburgerCheckbox.checked);
    document.body.classList.toggle('menu-open', hamburgerCheckbox.checked);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerCheckbox.checked = false;
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburgerCheckbox.checked && !navList.contains(e.target) && (!mobileMenu || !mobileMenu.contains(e.target))) {
      hamburgerCheckbox.checked = false;
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}
