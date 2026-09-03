import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { cvData } from './data.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const PDFParse = pdfParse.PDFParse;

const CERT_SOURCE_DIR = 'Certificate';
const CERT_DEST_DIR = 'public/certificates';

// Ensure destination directory exists
if (!fs.existsSync(CERT_DEST_DIR)) {
  fs.mkdirSync(CERT_DEST_DIR, { recursive: true });
}

if (!fs.existsSync(CERT_SOURCE_DIR)) {
  console.error(`Source directory "${CERT_SOURCE_DIR}" does not exist.`);
  process.exit(1);
}

// Files that are purely duplicates or compiled collections
const EXCLUDED_FILES = new Set([
  'List of Certifications_IGMW.pdf',
  'c1f49f09-be60-4467-9301-4fab7b39a04a.pdf',
  '7b770b4a-066c-4225-af63-309878d120ef.pdf',
  'Certificate (1).pdf',
  'Certificate (2).pdf',
  'Certificate_WBG Self-Paced for PDF.pdf',
  'Certificate_WBG Self-Paced for print.pdf',
  'Certificate01.pdf',
  'Project Management Essential Skill.pdf',
  'Financial Management Essentials Certificate (DisasterReady).pdf',
  'Bukti_prestasi.pdf',
  'Certificate.bat'
]);

const files = fs.readdirSync(CERT_SOURCE_DIR).filter(file => {
  const ext = path.extname(file).toLowerCase();
  const isAllowedExt = ext === '.pdf' || ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  return isAllowedExt && !EXCLUDED_FILES.has(file);
});

console.log(`Found ${files.length} valid certificate files to process.`);

// Comprehensive verified mapping for every certificate file
const MASTER_MAPPINGS = {
  '12440_3_576693_1757648957_Palo Alto Networks Course Certificate of Completion.pdf': {
    en: 'Security Operations Fundamentals',
    id: 'Dasar-Dasar Operasi Keamanan Siber (Security Operations Fundamentals)',
    issuer: 'Palo Alto Networks',
    date: 'Sep 2025',
    tags: ['Palo Alto', 'Cybersecurity']
  },
  '53_8_14911_1697784847_Proforest FPIC - Bahasa Indonesia.pdf': {
    en: 'Introduction to Free, Prior, and Informed Consent (FPIC)',
    id: 'Pengenalan Konsep Free, Prior and Informed Consent (FPIC)',
    issuer: 'Proforest Academy',
    date: 'Oct 2023',
    tags: ['Proforest', 'FPIC']
  },
  '9_7_14911_1697782730_Proforest FPIC - English.pdf': {
    en: 'Introduction to Free, Prior, and Informed Consent (FPIC) - English Course',
    id: 'Pengenalan Konsep Free, Prior and Informed Consent (FPIC) - Kursus Bahasa Inggris',
    issuer: 'Proforest Academy',
    date: 'Oct 2023',
    tags: ['Proforest', 'FPIC']
  },
  'ADB’s Environment Safeguard Requirements_Certificate of completion.pdf': {
    en: 'Environment Safeguard Requirements',
    id: 'Persyaratan Perlindungan Lingkungan (Environment Safeguards)',
    issuer: 'Asian Development Bank (ADB)',
    date: 'Nov 2023',
    tags: ['ADB', 'Safeguards']
  },
  'ADB’s Indigenous Peoples Safeguard Requirements_Certificate of completion.pdf': {
    en: 'Indigenous Peoples Safeguard Requirements',
    id: 'Persyaratan Perlindungan Masyarakat Adat (Indigenous Peoples Safeguards)',
    issuer: 'Asian Development Bank (ADB)',
    date: 'Nov 2023',
    tags: ['ADB', 'Safeguards']
  },
  'APDI - I Gede Mahendra Wijaya.pdf': {
    en: 'Remote Pilot Certification (Drone Operator)',
    id: 'Sertifikasi Remote Pilot Drone',
    issuer: 'Asosiasi Pilot Drone Indonesia (APDI)',
    date: 'Oct 2023',
    tags: ['APDI', 'Drone']
  },
  'B20 AUG 277.pdf': {
    en: 'B20 Side Event: Technology & Market Innovation for Decarbonization',
    id: 'B20 Side Event: Inovasi Teknologi & Pasar untuk Dekarbonisasi',
    issuer: 'B20 Indonesia / KADIN',
    date: 'Aug 2022',
    tags: ['B20', 'Decarbonization']
  },
  'Baur E-Certificate_TOT for ASC and INDOGAP_I Gede Mahendra Wijaya.pdf': {
    en: 'ToT Materials for ASC and IndoGAP Sustainable Aquaculture Standards',
    id: 'Penyusunan Materi Pelatihan (ToT) Standar ASC & IndoGAP untuk Budidaya Berkelanjutan',
    issuer: 'Politeknik AUP & The Baur Project',
    date: 'May 2020',
    tags: ['AUP', 'Aquaculture']
  },
  'BFA-I GEDE.pdf': {
    en: 'Basic First Aid (BFA)',
    id: 'Sertifikasi Pertolongan Pertama (Basic First Aid)',
    issuer: 'Barron International',
    date: 'Aug 2014',
    tags: ['Barron', 'First Aid']
  },
  'BSS-I GEDE.pdf': {
    en: 'Basic Sea Survival (BSS)',
    id: 'Sertifikasi Keselamatan Laut (Basic Sea Survival)',
    issuer: 'Barron International',
    date: 'Aug 2014',
    tags: ['Barron', 'Sea Survival']
  },
  'brighttalk-viewing-certificate-navigating-data-privacy-and-cybersecurity-risks_-insight-for-investors.pdf': {
    en: 'Navigating Data Privacy and Cybersecurity Risks: Insight for Investors',
    id: 'Navigasi Privasi Data dan Risiko Keamanan Siber bagi Investor',
    issuer: 'BrightTALK',
    date: 'Dec 2023',
    tags: ['BrightTALK', 'Cybersecurity']
  },
  'BSAFE_Certificate.pdf': {
    en: 'BSAFE Security Certification',
    id: 'Sertifikasi Keamanan Lapangan BSAFE',
    issuer: 'United Nations (UNDSS)',
    date: 'Feb 2026',
    tags: ['UNDSS', 'Security']
  },
  'Certificate Protected Area Technician Training Course - Infrastructure Fundamentals.pdf': {
    en: 'Protected Area Technician Training: Infrastructure Fundamentals',
    id: 'Pelatihan Teknisi Kawasan Konservasi: Dasar-Dasar Infrastruktur',
    issuer: 'Connected Conservation',
    date: 'Jan 2026',
    tags: ['Connected Conservation', 'Infrastructure']
  },
  'Certificate Protected Area Technician Training Course - Tools for Informed Decision Making.pdf': {
    en: 'Protected Area Technician Training: Tools for Informed Decision Making',
    id: 'Pelatihan Teknisi Kawasan Konservasi: Alat Pengambilan Keputusan Berbasis Data',
    issuer: 'Connected Conservation',
    date: 'Jan 2026',
    tags: ['Connected Conservation', 'Decision Making']
  },
  'Certificate WBG Blue Carbon.pdf': {
    en: 'Blue Carbon Fundamentals',
    id: 'Dasar-Dasar Karbon Biru (Blue Carbon Fundamentals)',
    issuer: 'World Bank Group',
    date: 'Jul 2026',
    tags: ['World Bank', 'Blue Carbon']
  },
  'generate-pdf.pdf': {
    en: 'Blue Carbon Project Development & MRV Specialist Training',
    id: 'Pelatihan Spesialis Pengembangan Proyek Karbon Biru & MRV (Blue Carbon Project Development & MRV Specialist)',
    issuer: 'Fair Carbon (Blue Carbon Academy)',
    date: 'May 2026',
    tags: ['Fair Carbon', 'Blue Carbon', 'MRV'],
    credentialUrl: 'https://faircarbon.mykajabi.com/library',
    description: 'Comprehensive training covering full project development lifecycle for coastal blue carbon (mangroves, seagrass), from baseline feasibility & PIN, PDD design under global carbon standards, investment due diligence, to scientific MRV systems and carbon credit integrity.',
    competencies: 'Blue Carbon Project Development, Feasibility & PIN Assessment, Project Design Document (PDD), Investment Due Diligence, MRV Design & Verification'
  },
  'Certificate WBG.pdf': {
    en: 'Environmental and Social Framework (ESF) Fundamentals',
    id: 'Dasar-Dasar Kerangka Kerja Lingkungan dan Sosial (ESF Fundamentals)',
    issuer: 'World Bank Group',
    date: 'Oct 2023',
    tags: ['World Bank', 'Safeguards']
  },
  'Certificate0000.pdf': {
    en: 'Conflict of Interest Risk Management for Your Project',
    id: 'Manajemen Risiko Konflik Kepentingan Proyek',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    tags: ['World Bank', 'Risk Management']
  },
  'Certificate_01.pdf': {
    en: 'Sustainability Training and E-Learning Program (STEP)',
    id: 'Program Pelatihan Keberlanjutan & E-Learning (STEP)',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    tags: ['World Bank', 'Sustainability']
  },
  'Certificate_Ocean Governance Elective Modules.pdf': {
    en: 'Ocean Governance Capacity Building Training Program (Elective Modules)',
    id: 'Program Peningkatan Kapasitas Tata Kelola Kelautan (Modul Pilihan)',
    issuer: 'World Bank Group',
    date: 'Jul 2026',
    tags: ['World Bank', 'Ocean Governance']
  },
  'Certificate_UNDSS.pdf': {
    en: 'Preparing and Responding to Active Shooter Incidents',
    id: 'Kesiapsiagaan & Respon Insiden Keamanan Lapangan',
    issuer: 'United Nations (UNDSS)',
    date: 'Feb 2026',
    tags: ['UNDSS', 'Security']
  },
  'D3_ Define, Develop, Deliver.pdf': {
    en: 'Training on Monitoring and Evaluation for EnABLE Projects',
    id: 'Pelatihan Monitoring dan Evaluasi untuk Proyek EnABLE',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    tags: ['World Bank', 'M&E']
  },
  'E-Certificate - I Gede Mahendra Wijaya - YELP 2022.pdf': {
    en: 'Youth Economic Leadership Program (YELP) Batch VI',
    id: 'Youth Economic Leadership Program (YELP) Angkatan VI',
    issuer: 'Bank Indonesia Institute',
    date: 'Jul 2022',
    tags: ['Bank Indonesia', 'Leadership']
  },
  'ESG Job Simulation.pdf': {
    en: 'Global Corporate ESG & Sustainability Job Simulation',
    id: 'Simulasi Praktik ESG & Keberlanjutan Korporasi Global',
    issuer: 'Forage',
    date: 'Feb 2024',
    tags: ['Forage', 'ESG']
  },
  'Financial Management Essentials Certificate Program.pdf': {
    en: 'Financial Management Essentials Certificate Program',
    id: 'Program Sertifikasi Dasar-Dasar Manajemen Keuangan',
    issuer: 'DisasterReady / Cornerstone OnDemand',
    date: 'Jul 2026',
    tags: ['DisasterReady', 'Finance']
  },
  'I-Gede-Mahendra-Wijaya–Climate-Change-and-Sovereign-Risk–Climate-Change-and-Sovereign-Risk–ADBI-E-Learning.pdf': {
    en: 'Climate Change and Sovereign Risk',
    id: 'Perubahan Iklim dan Risiko Berdaulat (Sovereign Risk)',
    issuer: 'Asian Development Bank Institute (ADBI)',
    date: 'Nov 2023',
    tags: ['ADBI', 'Climate Finance']
  },
  'Introduction_to_forest_and_landscape_restoration.png': {
    en: 'Introduction to Forest and Landscape Restoration (FLR)',
    id: 'Pengantar Restorasi Lanskap Hutan (FLR)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    tags: ['FAO', 'Forestry']
  },
  'ISO.pdf': {
    en: 'Internal Quality Auditor ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018',
    id: 'Pelatihan Audit Mutu & Lingkungan Internal (ISO 9001, 14001, 45001)',
    issuer: 'Worldwide Quality Assurance (WQA)',
    date: 'Dec 2018',
    tags: ['ISO', 'Quality Audit']
  },
  'Measuring_the_role_of_forests_and_trees_in_household_welfare_and_livelihoods.png': {
    en: 'Measuring the Role of Forests and Trees in Household Welfare and Livelihoods',
    id: 'Pengukuran Peran Hutan dan Pohon dalam Kesejahteraan Rumah Tangga',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Nov 2023',
    tags: ['FAO', 'Livelihoods']
  },
  'Moreton Bay Regional Council - Community Development Job Simulation.pdf': {
    en: 'Community Development Job Simulation',
    id: 'Simulasi Praktik Pengembangan Masyarakat (Community Development)',
    issuer: 'Moreton Bay Regional Council / Forage',
    date: 'Feb 2024',
    tags: ['Forage', 'Community']
  },
  'Project Management Essentials Certificate.pdf': {
    en: 'Project Management Essentials Certificate',
    id: 'Sertifikasi Esensial Manajemen Proyek',
    issuer: 'DisasterReady / Cornerstone OnDemand',
    date: 'Feb 2024',
    tags: ['DisasterReady', 'Project Management']
  },
  'PSEA_UN_LM_CRTERM.pdf': {
    en: 'Prevention of Sexual Exploitation and Abuse (PSEA)',
    id: 'Pencegahan Eksploitasi dan Pelecehan Seksual (PSEA) Personel PBB',
    issuer: 'United Nations',
    date: 'Feb 2026',
    tags: ['United Nations', 'Safeguards']
  },
  'WBG OLC - Saba_ Introduction to the Global Environment Facility (GEF).pdf': {
    en: 'Introduction to the Global Environment Facility (GEF)',
    id: 'Pengantar Fasilitas Lingkungan Global (GEF)',
    issuer: 'World Bank Group & GEF',
    date: 'Oct 2023',
    tags: ['World Bank', 'GEF']
  },
  'certificate-acoustic-analysis-in-kaleidoscope-part-1-getting-started-64308a22d28ff5e07a0eef1e.pdf': {
    en: 'Acoustic Analysis in Kaleidoscope (Part 1): Getting Started',
    id: 'Analisis Akustik di Kaleidoscope (Bagian 1): Memulai',
    issuer: 'Wildlife Acoustics',
    date: 'Dec 2023',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-acoustic-analysis-in-kaleidoscope-part-2-batch-processing-64e4ebf2866ab6b7600d5956.pdf': {
    en: 'Acoustic Analysis in Kaleidoscope (Part 2): Batch Processing',
    id: 'Analisis Akustik di Kaleidoscope (Bagian 2): Pemrosesan Batch',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-2-how-to-start-a-general-survey-with-kaleidoscope-pro-advanced-697118a96e3d1f4937000e8a.pdf': {
    en: 'How to Start a General Survey with Kaleidoscope Pro (Advanced)',
    id: 'Memulai Survei Umum dengan Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-4-intro-to-acoustic-indices-for-biodiversity-monitoring-intermediate-69711ab24c20c3c40105ab74.pdf': {
    en: 'Intro to Acoustic Indices for Biodiversity Monitoring (Intermediate)',
    id: 'Pengantar Indeks Akustik untuk Monitoring Keanekaragaman Hayati (Menengah)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-5-how-to-perform-a-targeted-search-with-kaleidoscope-pro-advanced-69711c08d783f039d707ffbe.pdf': {
    en: 'How to Perform a Targeted Search with Kaleidoscope Pro (Advanced)',
    id: 'Pencarian Tertarget dengan Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-9-introduction-to-kaleidoscope-for-bat-sound-analysis-beginner-69711deadf3562274a0cffb8.pdf': {
    en: 'Introduction to Kaleidoscope for Bat Sound Analysis (Beginner)',
    id: 'Pengantar Kaleidoscope untuk Analisis Suara Kelelawar (Tingkat Dasar)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-11-introduction-to-kaleidoscope-for-bat-sound-analysis-beginner-69712121dd74a503020f5cd3.pdf': {
    en: 'Introduction to Kaleidoscope for Bat Sound Analysis (Beginner Batch 2)',
    id: 'Pengantar Kaleidoscope untuk Analisis Suara Kelelawar (Tingkat Dasar Gelombang 2)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-19-how-to-use-bat-auto-id-in-kaleidoscope-pro-advanced-69712cf6618705c2e500f795.pdf': {
    en: 'How to Use Bat Auto-ID in Kaleidoscope Pro (Advanced)',
    id: 'Penggunaan Bat Auto-ID di Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-kaleidoscope-lite-for-bat-analysis-651c2fdee341d6500b0b310c.pdf': {
    en: 'Kaleidoscope Lite for Bat Analysis',
    id: 'Penggunaan Kaleidoscope Lite untuk Analisis Kelelawar',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  }
};

// Additional verified training programs from Master CV (formal courses, fellowships & specialized workshops)
const ADDITIONAL_MASTER_TRAININGS = [
  {
    en: 'Green Economic Acceleration: A Japan-ASEAN Strategic Programme for Sustainable Green Finance',
    id: 'Akselerasi Ekonomi Hijau: Program Strategis Jepang-ASEAN untuk Keuangan Hijau Berkelanjutan',
    issuer: 'United Nations Institute for Training and Research (UNITAR)',
    date: 'Jul 2026',
    tags: ['UNITAR', 'Green Finance']
  },
  {
    en: 'Carbon Credits Project Fundamentals',
    id: 'Dasar-Dasar Proyek Kredit Karbon (Carbon Credits Project Fundamentals)',
    issuer: 'Blooms Academy',
    date: 'Apr 2026',
    tags: ['Blooms Academy', 'Carbon Credits']
  },
  {
    en: 'Global Carbon Summit Indonesia 2025',
    id: 'KTT Karbon Global Indonesia 2025 (Global Carbon Summit)',
    issuer: 'Global Carbon Summit',
    date: 'Nov 2025',
    tags: ['Carbon Summit', 'Carbon Market']
  },
  {
    en: 'Corporate Social Responsibility (CSR) Development Specialist',
    id: 'Spesialis Pengembangan Tanggung Jawab Sosial Perusahaan (CSR)',
    issuer: 'Corporate Forum for Community Development (CFCD)',
    date: 'Feb 2025',
    tags: ['CFCD', 'CSR']
  },
  {
    en: 'Human Dimensions of Forest and Landscape Restoration',
    id: 'Dimensi Manusia dalam Restorasi Lanskap Hutan',
    issuer: 'Society for Ecological Restoration (SER)',
    date: 'Jul 2024',
    tags: ['SER', 'Forest Restoration']
  },
  {
    en: 'Climate Action Now Program',
    id: 'Program Aksi Iklim Global (Climate Action Now)',
    issuer: 'Pachamama Alliance',
    date: 'Jun 2024',
    tags: ['Pachamama Alliance', 'Climate Action']
  },
  {
    en: 'Ground-Based Forest Carbon Stock Accounting (SNI 7724)',
    id: 'Perhitungan Cadangan Karbon Hutan Berbasis Terestrial (SNI 7724)',
    issuer: 'Generasi Biologi Indonesia',
    date: 'Jun 2024',
    tags: ['Generasi Biologi', 'Carbon Accounting']
  },
  {
    en: 'Sustainable Financing of Forest and Landscape Restoration',
    id: 'Pendanaan Berkelanjutan untuk Restorasi Lanskap Hutan',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    tags: ['FAO', 'Sustainable Finance']
  },
  {
    en: 'Practical Guidance: Respecting Free, Prior and Informed Consent (FPIC)',
    id: 'Panduan Praktis: Menghormati Free, Prior and Informed Consent (FPIC)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    tags: ['FAO', 'FPIC']
  },
  {
    en: 'Social Network Analysis for Environmental Governance',
    id: 'Analisis Jaringan Sosial untuk Tata Kelola Lingkungan',
    issuer: 'International Network for Social Network Analysis (INSNA)',
    date: 'Feb 2024',
    tags: ['INSNA', 'Governance']
  },
  {
    en: 'Ecosystem Approach to Fisheries Management (EAFM) Planning',
    id: 'Perencanaan Pendekatan Ekosistem untuk Pengelolaan Perikanan (EAFM)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Oct 2023',
    tags: ['FAO', 'EAFM']
  },
  {
    en: 'Evaluating Fisheries Co-Management Effectiveness',
    id: 'Evaluasi Efektivitas Ko-Manajemen Perikanan',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Sep 2023',
    tags: ['FAO', 'Fisheries Management']
  },
  {
    en: 'Institutionalization of Forest Data and National Forest Monitoring',
    id: 'Institusionalisasi Data Kehutanan & Pemantauan Hutan Nasional',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Aug 2023',
    tags: ['FAO', 'Forest Data']
  },
  {
    en: 'Assessing Marine Ecosystem Health with Copernicus Marine Data',
    id: 'Penilaian Kesehatan Ekosistem Laut Berbasis Data Copernicus Marine',
    issuer: 'Copernicus Marine Service',
    date: 'Jul 2023',
    tags: ['Copernicus', 'Marine Data']
  },
  {
    en: 'The German Supply Chain Due Diligence Act (LkSG / SCDDA)',
    id: 'Kepatuhan Uji Tuntas Rantai Pasok Jerman (German Supply Chain Due Diligence Act - LkSG/SCDDA)',
    issuer: 'Import Promotion Desk (IPD Germany)',
    date: 'Aug 2026',
    tags: ['IPD Germany', 'Supply Chain', 'Due Diligence'],
    credentialUrl: 'https://www.importpromotiondesk.com/exporters/en/market-information/e-learning',
    competencies: 'Supply Chain Due Diligence (LkSG / SCDDA), Human Rights & Environmental Risk Analysis, EU Market Compliance, Sustainable Sourcing',
    description: 'Comprehensive e-learning program on complying with the German Supply Chain Due Diligence Act (Lieferkettensorgfaltspflichtengesetz - LkSG), addressing human rights and environmental risk analysis, grievance mechanisms, and sustainable supply chain governance for international exporters.'
  },
  {
    en: 'EU Deforestation Regulation (EUDR) Compliance & Due Diligence',
    id: 'Regulasi Bebas Deforestasi Uni Eropa (EU Deforestation Regulation - EUDR)',
    issuer: 'Import Promotion Desk (IPD Germany)',
    date: 'Aug 2026',
    tags: ['IPD Germany', 'EUDR', 'Deforestation'],
    credentialUrl: 'https://www.importpromotiondesk.com/exporters/en/market-information/e-learning',
    competencies: 'EU Deforestation Regulation (EUDR) Compliance, Supply Chain Geolocation & Traceability, Deforestation-Free Commodity Due Diligence, Legality & Risk Assessment',
    description: 'Specialized training on the EU Deforestation Regulation (EUDR), addressing regulatory compliance, supply chain due diligence, geolocation traceability, and legality verification for deforestation-free commodities entering the EU market (palm oil, wood, rubber, cocoa, coffee, soy, cattle).'
  },
  {
    en: 'IWRM for Climate Resilience (20-Hour Training Course)',
    id: 'Pengelolaan Sumber Daya Air Terpadu untuk Ketahanan Iklim (IWRM for Climate Resilience)',
    issuer: 'Cap-Net UNDP & UNEP-DHI Centre',
    date: 'Aug 2026',
    tags: ['UNDP', 'UNEP-DHI', 'IWRM', 'Climate Resilience'],
    credentialUrl: 'https://campus.cap-net.org/certificates/fd36a0339b364500a601922c8fd08ba9',
    competencies: 'Integrated Water Resources Management (IWRM), Climate Change Adaptation, Watershed & Coastal Hydrology, Disaster Risk Reduction, Water Governance',
    description: '20-hour intensive training on Integrated Water Resources Management (IWRM) for Climate Resilience accredited by Cap-Net UNDP and UNEP-DHI Centre, addressing climate change adaptation in water resources, basin management, flood/drought risk assessment, and resilient water governance frameworks.'
  },
  {
    en: 'Diploma in Occupational Health, Safety and Environment (OHSE)',
    id: 'Diploma Kesehatan, Keselamatan Kerja dan Lingkungan Hidup (OHSE)',
    issuer: 'Alison',
    date: 'Sep 2026',
    tags: ['Alison', 'OHSE', 'HSE', 'Occupational Safety'],
    credentialUrl: 'https://alison.com/course/diploma-in-occupational-health-safety-and-environment-ohse',
    competencies: 'Occupational Health & Safety (OHS), Environmental Management Systems (EMS), Workplace Hazard & Risk Assessment, Emergency Preparedness, Incident Investigation, HSE Compliance',
    description: 'Comprehensive diploma program in Occupational Health, Safety, and Environment (OHSE) from Alison, covering hazard identification, workplace risk assessments, incident prevention & root cause analysis, environmental protection protocols, emergency response planning, and international HSE management standards.'
  },
  {
    en: 'Introduction to Modern Project Management Theory and Practice',
    id: 'Pengantar Teori dan Praktik Manajemen Proyek Modern (Modern Project Management)',
    issuer: 'Alison',
    date: 'Jul 2026',
    tags: ['Alison', 'Project Management', 'Agile', 'Methodology'],
    credentialUrl: 'https://alison.com/course/introduction-to-modern-project-management-theory-and-practice',
    competencies: 'Modern Project Management, Project Lifecycle Planning, Agile & Waterfall Methodologies, Work Breakdown Structure (WBS), Risk & Stakeholder Management, Resource Scheduling',
    description: 'CPD-certified professional course on modern project management methodologies from Alison, covering project lifecycle phases, project charter & WBS development, risk management frameworks, Agile & predictive delivery, and stakeholder engagement.'
  }
];

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function main() {
  let count = 0;

  cvData.en.certificates = [];
  if (cvData.id) cvData.id.certificates = [];

  // Process files in Certificate folder
  for (const file of files) {
    const cleanExt = path.extname(file).toLowerCase();
    const baseNameWithoutExt = path.basename(file, cleanExt);
    const safeBaseName = baseNameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/_+/g, '_');
    const safeFileName = `${safeBaseName}${cleanExt}`;

    const srcPath = path.join(CERT_SOURCE_DIR, file);
    const destPath = path.join(CERT_DEST_DIR, safeFileName);
    const relativeLink = `certificates/${safeFileName}`;

    fs.copyFileSync(srcPath, destPath);

    const mapping = MASTER_MAPPINGS[file];
    if (mapping) {
      const newCertEn = {
        name: mapping.en,
        issuer: mapping.issuer,
        date: mapping.date,
        tags: mapping.tags || ['Certification'],
        link: relativeLink,
        ...(mapping.credentialUrl && { credentialUrl: mapping.credentialUrl }),
        ...(mapping.description && { description: mapping.description }),
        ...(mapping.competencies && { competencies: mapping.competencies })
      };

      const newCertId = {
        name: mapping.id,
        issuer: mapping.issuer,
        date: mapping.date,
        tags: mapping.tags || ['Sertifikasi'],
        link: relativeLink,
        ...(mapping.credentialUrl && { credentialUrl: mapping.credentialUrl }),
        ...(mapping.description && { description: mapping.description }),
        ...(mapping.competencies && { competencies: mapping.competencies })
      };

      cvData.en.certificates.push(newCertEn);
      if (cvData.id && cvData.id.certificates) {
        cvData.id.certificates.push(newCertId);
      }
      count++;
    }
  }

  // Add additional master trainings
  for (const tr of ADDITIONAL_MASTER_TRAININGS) {
    const alreadyExists = cvData.en.certificates.some(c => normalize(c.name) === normalize(tr.en));
    if (!alreadyExists) {
      const newCertEn = {
        name: tr.en,
        issuer: tr.issuer,
        date: tr.date,
        tags: tr.tags,
        link: null,
        ...(tr.credentialUrl && { credentialUrl: tr.credentialUrl }),
        ...(tr.description && { description: tr.description }),
        ...(tr.competencies && { competencies: tr.competencies })
      };
      const newCertId = {
        name: tr.id,
        issuer: tr.issuer,
        date: tr.date,
        tags: tr.tags,
        link: null,
        ...(tr.credentialUrl && { credentialUrl: tr.credentialUrl }),
        ...(tr.description && { description: tr.description }),
        ...(tr.competencies && { competencies: tr.competencies })
      };
      cvData.en.certificates.push(newCertEn);
      if (cvData.id && cvData.id.certificates) {
        cvData.id.certificates.push(newCertId);
      }
      count++;
    }
  }

  // Helper to parse dates like "Nov 2023" for sorting
  function parseDateForSort(dateStr) {
    if (!dateStr) return 0;
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 2) {
      const m = months[parts[0].toLowerCase()] || 0;
      const y = parseInt(parts[1]) || 0;
      return y * 12 + m;
    }
    const yearOnly = parseInt(dateStr);
    if (!isNaN(yearOnly)) return yearOnly * 12;
    return 0;
  }

  cvData.en.certificates.sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
  if (cvData.id && cvData.id.certificates) {
    cvData.id.certificates.sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
  }

  // Update stats in data.js to reflect the rich certification count
  const certCount = cvData.en.certificates.length;
  console.log(`Total active certificates in portfolio: ${certCount}`);

  // Write updated cvData to data.js
  const updatedDataContent = `export const cvData = ${JSON.stringify(cvData, null, 2)};\n`;
  fs.writeFileSync('data.js', updatedDataContent, 'utf8');

  console.log(`Updated data.js successfully with ${certCount} complete certificates.`);

  // Build the website
  try {
    console.log('Building Vite site...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Vite build complete.');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

main();
