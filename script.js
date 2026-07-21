import { cvData } from './data.js';

// --- Application State ---
let currentLang = localStorage.getItem('preferredLanguage') || 'en';
let currentProjectFilter = 'all';
let currentCertSearch = '';

// --- DOM Elements ---
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const navMenu = document.getElementById('nav-menu');
const langSwitch = document.getElementById('lang-switch');
const statsGrid = document.getElementById('stats-grid');
const timelineContainer = document.getElementById('experience-timeline');
const projectsGrid = document.getElementById('projects-grid');
const publicationsList = document.getElementById('publications-list');
const certificatesGrid = document.getElementById('certificates-grid');
const referencesGrid = document.getElementById('references-grid');
const projectFilterBtns = document.querySelectorAll('.filter-btn');
const certSearchInput = document.getElementById('cert-search');
const contactForm = document.getElementById('contact-form');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formStatus = document.getElementById('form-status');

// --- Helper: Resolve Nested Objects ---
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// --- Dynamic Rendering Functions ---

// Render Stats Counters
function renderStats(lang) {
  if (!statsGrid) return;
  const stats = cvData[lang].stats;
  statsGrid.innerHTML = stats.map(stat => `
    <div class="stat-item">
      <h3>${stat.value}</h3>
      <p>${stat.label}</p>
    </div>
  `).join('');
}

// Render Professional Journey Timeline
function renderTimeline(lang) {
  if (!timelineContainer) return;
  const experience = cvData[lang].experience;
  timelineContainer.innerHTML = experience.map((exp, index) => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content glass">
        <div class="card-glow"></div>
        <div class="timeline-header">
          <div>
            <h3>${exp.role}</h3>
            <div class="timeline-company">${exp.company}</div>
          </div>
          <span class="timeline-period">${exp.period}</span>
        </div>
        <p>${exp.description}</p>
      </div>
    </div>
  `).join('');
}

// Render Key Projects
function resolveImgUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return './' + cleanPath;
}

function renderProjects(lang, filter = 'all') {
  if (!projectsGrid) return;
  const projects = cvData[lang].projects;
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);
  
  projectsGrid.innerHTML = filteredProjects.map(proj => `
    <div class="project-card glass${proj.restricted ? ' is-restricted' : ''}">
      <div class="card-glow"></div>
      <div class="project-card-body">
        <div class="project-card-top">
          <span class="project-category-badge">${cvData[lang].ui[`project${capitalize(proj.category)}`] || proj.category}</span>
          ${proj.restricted ? `<span class="restricted-badge"><i class="fa-solid fa-lock"></i> ${lang === 'id' ? 'Akses Terbatas' : 'Restricted'}</span>` : ''}
        </div>
        <h3>${proj.title}</h3>
        <div class="project-client">
          <i class="fa-solid fa-briefcase"></i> <span>${proj.client} (${proj.period})</span>
        </div>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">#${tag}</span>`).join('')}
        </div>
        ${proj.restricted ? `
          <div class="project-actions">
            <button class="btn btn-secondary btn-sm btn-request-access" data-report="${encodeURIComponent(proj.title)}">
              <i class="fa-solid fa-lock"></i> ${lang === 'id' ? 'Minta Akses Laporan' : 'Request Access'}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Bind click handlers to request access buttons
  document.querySelectorAll('.btn-request-access').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const reportTitle = decodeURIComponent(e.currentTarget.getAttribute('data-report'));
      openRequestAccessModal(reportTitle);
    });
  });
}

// Render Publications
function renderPublications(lang) {
  if (!publicationsList) return;
  const publications = cvData[lang].publications;
  publicationsList.innerHTML = publications.map(pub => `
    <div class="publication-item glass">
      <div class="card-glow"></div>
      <div class="pub-year-badge">${pub.year}</div>
      <div class="pub-info">
        <h3>
          <a href="${pub.link}" target="_blank" class="pub-link">
            ${pub.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem; margin-left: 6px; color: var(--primary-teal);"></i>
          </a>
        </h3>
        <p class="pub-journal">${pub.publisher}</p>
      </div>
    </div>
  `).join('');
}

// Render Certifications Grid
function renderCertificates(lang, query = '') {
  if (!certificatesGrid) return;
  const certificates = cvData[lang].certificates;
  const filteredCerts = query.trim() === ''
    ? certificates
    : certificates.filter(cert => {
        const searchStr = `${cert.name} ${cert.issuer} ${cert.tags.join(' ')}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });

  certificatesGrid.innerHTML = filteredCerts.map(cert => {
    const titleHtml = cert.link 
      ? `<a href="${cert.link}" target="_blank" class="cert-link">${cert.name} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 6px; color: var(--primary-teal);"></i></a>`
      : cert.name;

    return `
      <div class="certificate-card glass${cert.link ? ' has-link' : ''}">
        <div class="card-glow"></div>
        <div class="cert-icon">
          <i class="fa-solid fa-certificate"></i>
        </div>
        <h3>${titleHtml}</h3>
        <div class="cert-issuer">
          <i class="fa-solid fa-award"></i> <span>${cert.issuer}</span>
        </div>
        <div class="cert-date">${cert.date}</div>
      </div>
    `;
  }).join('');
}

// Render References Cards
function renderReferences(lang) {
  if (!referencesGrid) return;
  const references = cvData[lang].references;
  referencesGrid.innerHTML = references.map(ref => `
    <div class="reference-card glass">
      <div class="card-glow"></div>
      <div class="ref-avatar">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="ref-info">
        <h3>${ref.name}</h3>
        <p class="ref-role">${ref.role}</p>
        <p class="ref-company">${ref.company}</p>
        <p class="ref-contact">${ref.contact}</p>
      </div>
    </div>
  `).join('');
}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Translation Engine ---
function translateUI(lang) {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    const translatedText = getNestedValue(cvData[lang], key) || getNestedValue(cvData[lang].ui, key);
    if (translatedText) {
      if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
        elem.value = translatedText;
      } else {
        elem.innerHTML = translatedText;
      }
    }
  });

  // Handle placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    const translatedPlaceholder = getNestedValue(cvData[lang], key) || getNestedValue(cvData[lang].ui, key);
    if (translatedPlaceholder) {
      elem.setAttribute('placeholder', translatedPlaceholder);
    }
  });

  // Re-render components with translated content
  renderStats(lang);
  renderTimeline(lang);
  renderProjects(lang, currentProjectFilter);
  renderPublications(lang);
  renderCertificates(lang, currentCertSearch);
  renderReferences(lang);
}

// --- Language Toggle Handler ---
function setupLanguageSwitcher() {
  if (!langSwitch) return;

  // Set initial state
  if (currentLang === 'id') {
    langSwitch.classList.add('id-active');
  } else {
    langSwitch.classList.remove('id-active');
  }
  
  translateUI(currentLang);

  const toggleAction = () => {
    currentLang = currentLang === 'en' ? 'id' : 'en';
    localStorage.setItem('preferredLanguage', currentLang);
    
    if (currentLang === 'id') {
      langSwitch.classList.add('id-active');
    } else {
      langSwitch.classList.remove('id-active');
    }
    
    translateUI(currentLang);
  };

  langSwitch.addEventListener('click', toggleAction);
  langSwitch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAction();
    }
  });
}

// --- Navigation Scroll Handling ---
function setupNavigationScroll() {
  // Toggle Header background on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active Link Highlighter on Scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth Navigation Links scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = 70;
          const elementPosition = targetSection.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }

      // Close mobile navigation menu on click
      navMenu.classList.remove('open');
      mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

// --- Mobile Navigation Setup ---
function setupMobileNav() {
  if (!mobileNavToggle || !navMenu) return;

  mobileNavToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileNavToggle.querySelector('i').className = isOpen 
      ? 'fa-solid fa-xmark' 
      : 'fa-solid fa-bars';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
    }
  });
}

// --- Project Filter System ---
function setupProjectFilters() {
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentProjectFilter = btn.getAttribute('data-filter');
      renderProjects(currentLang, currentProjectFilter);
    });
  });
}

// --- Certificate Search ---
function setupCertificateSearch() {
  if (!certSearchInput) return;
  certSearchInput.addEventListener('input', (e) => {
    currentCertSearch = e.target.value;
    renderCertificates(currentLang, currentCertSearch);
  });
}

// --- Contact Form Submission ---
function setupContactForm() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // UI Feedback
    const originalText = formSubmitBtn.innerHTML;
    formSubmitBtn.disabled = true;
    formSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${cvData[currentLang].ui.formSending}`;
    
    // Simulate API request (e.g. EmailJS, formspree, etc.)
    setTimeout(() => {
      formStatus.className = 'form-message-status success';
      formStatus.innerText = cvData[currentLang].ui.formSuccess;
      
      // Reset form
      contactForm.reset();
      formSubmitBtn.disabled = false;
      formSubmitBtn.innerHTML = originalText;
      
      // Clear status after 5s
      setTimeout(() => {
        formStatus.innerText = '';
      }, 5000);
    }, 1500);
  });
}

// --- Modal Request Access Logic ---
const requestModal = document.getElementById('request-access-modal');
const closeModalBtn = document.getElementById('close-access-modal');
const requestForm = document.getElementById('request-access-form');
const modalReportTitle = document.getElementById('modal-report-title');
const modalReportInput = document.getElementById('modal-report-title-input');
const modalStatusMsg = document.getElementById('modal-status-msg');

function openRequestAccessModal(reportTitle) {
  if (!requestModal) return;
  if (modalReportTitle) modalReportTitle.textContent = reportTitle;
  if (modalReportInput) modalReportInput.value = reportTitle;
  if (modalStatusMsg) {
    modalStatusMsg.innerHTML = '';
    modalStatusMsg.className = 'form-message-status';
  }
  requestModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeRequestAccessModal() {
  if (!requestModal) return;
  requestModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function setupModalLogic() {
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeRequestAccessModal);
  }

  if (requestModal) {
    requestModal.addEventListener('click', (e) => {
      if (e.target === requestModal) {
        closeRequestAccessModal();
      }
    });
  }

  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-requester-name').value;
      const email = document.getElementById('modal-requester-email').value;
      const purpose = document.getElementById('modal-requester-purpose').value;
      const report = modalReportInput ? modalReportInput.value : 'Report Access Request';

      const subject = encodeURIComponent(`[Report Access Request] ${report}`);
      const body = encodeURIComponent(`Hello Gede,\n\nI am writing to request access to the following restricted technical report:\n"${report}"\n\nRequester Information:\n- Name / Organization: ${name}\n- Work Email: ${email}\n\nPurpose of Request:\n${purpose}\n\nBest regards,\n${name}`);

      window.location.href = `mailto:gedemahendrawijaya@gmail.com?subject=${subject}&body=${body}`;

      if (modalStatusMsg) {
        modalStatusMsg.className = 'form-message-status success';
        modalStatusMsg.textContent = currentLang === 'id' 
          ? 'Permintaan akses berhasil disiapkan! Email permohonan telah dibuka untuk dikirim.'
          : 'Access request prepared! Request email launched for author review.';
      }

      setTimeout(() => {
        closeRequestAccessModal();
        requestForm.reset();
      }, 3000);
    });
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupLanguageSwitcher();
  setupNavigationScroll();
  setupMobileNav();
  setupProjectFilters();
  setupCertificateSearch();
  setupContactForm();
  setupModalLogic();
});
