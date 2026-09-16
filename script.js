import { cvData } from './data.js';

// --- Application State ---
let currentLang = localStorage.getItem('preferredLanguage') || 'en';
let currentProjectFilter = 'all';
let currentCertCategory = 'all';
let currentCertSearch = '';

// --- DOM Elements ---
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const navMenu = document.getElementById('nav-menu');
const langSwitch = document.getElementById('lang-switch');
const statsGrid = document.getElementById('stats-grid');
const timelineContainer = document.getElementById('experience-timeline');
const educationGrid = document.getElementById('education-grid');
const projectsGrid = document.getElementById('projects-grid');
const publicationsList = document.getElementById('publications-list');
const certificatesGrid = document.getElementById('certificates-grid');
const referencesGrid = document.getElementById('references-grid');
const projectFilterBtns = document.querySelectorAll('[data-filter]');
const certFilterBtns = document.querySelectorAll('[data-cert-filter]');
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

// Render Formal Education
function renderEducation(lang) {
  if (!educationGrid) return;
  const education = cvData[lang].education || [];
  educationGrid.innerHTML = education.map(edu => `
    <div class="education-card glass" style="padding: 24px; border-radius: 16px; position: relative; overflow: hidden; background: #ffffff; border: 1px solid rgba(14, 148, 136, 0.15); box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);">
      <div class="card-glow"></div>
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div class="edu-icon" style="width: 46px; height: 46px; border-radius: 12px; background: rgba(13, 148, 136, 0.12); color: var(--primary-teal); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; border: 1px solid rgba(13, 148, 136, 0.25);">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 4px; font-weight: 700;">${edu.degree}</h3>
          <div style="font-size: 0.95rem; color: var(--primary-teal); font-weight: 600; margin-bottom: 2px;">${edu.institution}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">${edu.faculty} | <span style="color: var(--text-secondary); font-weight: 600;">${edu.period}</span></div>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${edu.details}</p>
        </div>
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
        ${pub.description ? `<p class="pub-desc" style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">${pub.description}</p>` : ''}
      </div>
    </div>
  `).join('');
}

// Render Certificates Cards
function renderCertificates(lang, query = currentCertSearch, category = currentCertCategory) {
  if (!certificatesGrid) return;
  const certificates = cvData[lang].certificates;

  const categoryLabels = {
    'carbon-climate': { en: 'Carbon, Climate & Forest', id: 'Karbon, Iklim & Hutan' },
    'marine-fisheries': { en: 'Marine & Fisheries', id: 'Kelautan & Perikanan' },
    'safeguards-social': { en: 'ESG & Safeguards', id: 'ESG & Safeguards' },
    'hse-quality': { en: 'HSE & Quality', id: 'K3L & Mutu' },
    'project-leadership': { en: 'Project & Leadership', id: 'Manajemen Proyek' }
  };

  const filteredCerts = certificates.filter(cert => {
    const matchesCategory = (category === 'all' || cert.category === category);
    const searchStr = `${cert.name} ${cert.issuer} ${(cert.tags || []).join(' ')} ${cert.category || ''} ${cert.competencies || ''}`.toLowerCase();
    const matchesSearch = query.trim() === '' || searchStr.includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredCerts.length === 0) {
    certificatesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 45px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; margin-bottom: 14px; color: var(--primary-teal); opacity: 0.6;"></i>
        <p style="font-size: 0.95rem;">${lang === 'id' ? 'Tidak ada sertifikasi yang cocok dengan filter kategori atau kata kunci pencarian.' : 'No certifications match the selected category filter or search query.'}</p>
      </div>
    `;
    return;
  }

  certificatesGrid.innerHTML = filteredCerts.map(cert => {
    const titleHtml = cert.link 
      ? `<a href="${cert.link}" target="_blank" class="cert-link">${cert.name} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 6px; color: var(--primary-teal);"></i></a>`
      : cert.name;

    const credLinkHtml = cert.credentialUrl
      ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-cred-link" style="font-size: 0.75rem; color: var(--primary-teal); margin-left: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;" title="View Online Course / Platform"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i> Platform</a>`
      : '';

    const catInfo = categoryLabels[cert.category];
    const catBadge = catInfo 
      ? `<span class="cert-cat-badge" style="font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; background: rgba(13, 148, 136, 0.12); color: var(--primary-teal); border: 1px solid rgba(13, 148, 136, 0.25); font-weight: 600; white-space: nowrap;">${lang === 'id' ? catInfo.id : catInfo.en}</span>`
      : '';

    return `
      <div class="certificate-card glass${cert.link ? ' has-link' : ''}">
        <div class="card-glow"></div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px;">
          <div class="cert-icon">
            <i class="fa-solid fa-certificate"></i>
          </div>
          ${catBadge}
        </div>
        <h3>${titleHtml}</h3>
        <div class="cert-issuer">
          <i class="fa-solid fa-award"></i> <span>${cert.issuer}</span>${credLinkHtml}
        </div>
        <div class="cert-date">${cert.date}</div>
        ${cert.competencies ? `<div class="cert-competencies" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; line-height: 1.4;"><strong>${lang === 'id' ? 'Kompetensi' : 'Competencies'}:</strong> ${cert.competencies}</div>` : ''}
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
        <p class="ref-contact"><i class="fa-solid fa-user-shield" style="font-size: 0.8rem; margin-right: 6px; color: var(--primary-teal);"></i> ${ref.contact}</p>
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
  renderEducation(lang);
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

// --- Certificate Filter System ---
function setupCertificateFilters() {
  const certBtns = document.querySelectorAll('[data-cert-filter]');
  certBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentCertCategory = btn.getAttribute('data-cert-filter');
      renderCertificates(currentLang, currentCertSearch, currentCertCategory);
    });
  });
}

// --- Certificate Search ---
function setupCertificateSearch() {
  if (!certSearchInput) return;
  certSearchInput.addEventListener('input', (e) => {
    currentCertSearch = e.target.value;
    renderCertificates(currentLang, currentCertSearch, currentCertCategory);
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
  setupCertificateFilters();
  setupCertificateSearch();
  setupContactForm();
  setupModalLogic();
});
