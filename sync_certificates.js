import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { cvData } from './data.js';

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

// Files that are duplicate variants or multi-page aggregate compilations
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
  'Bukti_prestasi - Copy.pdf',
  'Certificate.bat'
]);

const files = fs.readdirSync(CERT_SOURCE_DIR).filter(file => {
  const ext = path.extname(file).toLowerCase();
  const isAllowedExt = ext === '.pdf' || ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  return isAllowedExt && !EXCLUDED_FILES.has(file);
});

console.log(`Found ${files.length} valid certificate files to process.`);

// Comprehensive verified mapping for every certificate file in Certificate/
const MASTER_MAPPINGS = {
  '12440_3_576693_1757648957_Palo Alto Networks Course Certificate of Completion.pdf': {
    en: 'Network Security Fundamentals',
    id: 'Dasar-Dasar Keamanan Jaringan (Network Security Fundamentals)',
    issuer: 'Palo Alto Networks',
    date: 'Sep 2025',
    category: 'hse-quality',
    tags: ['Palo Alto', 'Cybersecurity', 'Network Security']
  },
  '53_8_14911_1697784847_Proforest FPIC - Bahasa Indonesia.pdf': {
    en: 'Free, Prior, and Informed Consent (FPIC) in Practice',
    id: 'Penerapan Konsep Free, Prior and Informed Consent (FPIC)',
    issuer: 'Proforest Academy',
    date: 'Oct 2023',
    category: 'safeguards-social',
    tags: ['Proforest', 'FPIC', 'Social Safeguards']
  },
  '9_7_14911_1697782730_Proforest FPIC - English.pdf': {
    en: 'Free, Prior, and Informed Consent (FPIC) - International Standards',
    id: 'Standar Internasional Free, Prior and Informed Consent (FPIC)',
    issuer: 'Proforest Academy',
    date: 'Oct 2023',
    category: 'safeguards-social',
    tags: ['Proforest', 'FPIC', 'Social Safeguards']
  },
  'ADB’s Environment Safeguard Requirements_Certificate of completion.pdf': {
    en: 'ADB’s Environment Safeguard Requirements',
    id: 'Persyaratan Perlindungan Lingkungan ADB (Environment Safeguards)',
    issuer: 'Asian Development Bank (ADB)',
    date: 'Sep 2024',
    category: 'safeguards-social',
    tags: ['ADB', 'Safeguards', 'Environmental Compliance']
  },
  'ADB’s Indigenous Peoples Safeguard Requirements_Certificate of completion.pdf': {
    en: 'ADB’s Indigenous Peoples Safeguard Requirements',
    id: 'Persyaratan Perlindungan Masyarakat Adat ADB (Indigenous Peoples Safeguards)',
    issuer: 'Asian Development Bank (ADB)',
    date: 'Sep 2024',
    category: 'safeguards-social',
    tags: ['ADB', 'Indigenous Peoples', 'Social Safeguards']
  },
  'APDI - I Gede Mahendra Wijaya.pdf': {
    en: 'Certified Remote Pilot (UAV / Drone Operator)',
    id: 'Sertifikasi Kompetensi Remote Pilot Drone (APDI)',
    issuer: 'Asosiasi Pilot Drone Indonesia (APDI)',
    date: 'Dec 2020',
    category: 'hse-quality',
    tags: ['APDI', 'Drone', 'UAV Remote Sensing']
  },
  'B20 AUG 277.pdf': {
    en: 'B20 Side Event: Technology & Market Innovation for Decarbonization',
    id: 'B20 Side Event: Inovasi Teknologi & Pasar untuk Dekarbonisasi',
    issuer: 'B20 Indonesia / KADIN',
    date: 'Aug 2022',
    category: 'carbon-climate',
    tags: ['B20', 'Decarbonization', 'Carbon Market']
  },
  'Baur E-Certificate_TOT for ASC and INDOGAP_I Gede Mahendra Wijaya.pdf': {
    en: 'Training of Trainers (ToT) for ASC and IndoGAP Sustainable Aquaculture Standards',
    id: 'Pelatihan Pelatih (ToT) Standar Akuakultur Berkelanjutan ASC & IndoGAP',
    issuer: 'Politeknik AUP & Kementerian Kelautan dan Perikanan (KKP)',
    date: 'Sep 2023',
    category: 'marine-fisheries',
    tags: ['KKP', 'Aquaculture', 'ASC', 'IndoGAP']
  },
  'BFA-I GEDE.pdf': {
    en: 'Basic First Aid (BFA) Training',
    id: 'Pelatihan Pertolongan Pertama Tingkat Dasar (Basic First Aid)',
    issuer: 'Barron International',
    date: 'Aug 2014',
    category: 'hse-quality',
    tags: ['Barron', 'First Aid', 'HSE']
  },
  'BSS-I GEDE.pdf': {
    en: 'Basic Sea Survival (BSS) Training',
    id: 'Pelatihan Keselamatan dan Bertahan Hidup di Laut (Basic Sea Survival)',
    issuer: 'Barron International',
    date: 'Aug 2014',
    category: 'hse-quality',
    tags: ['Barron', 'Sea Survival', 'Maritime Safety']
  },
  'brighttalk-viewing-certificate-navigating-data-privacy-and-cybersecurity-risks_-insight-for-investors.pdf': {
    en: 'Navigating Data Privacy and Cybersecurity Risks: Insight for Investors',
    id: 'Manajemen Risiko Privasi Data dan Keamanan Siber bagi Investor',
    issuer: 'BrightTALK',
    date: 'Nov 2023',
    category: 'safeguards-social',
    tags: ['BrightTALK', 'Risk Governance', 'Cybersecurity']
  },
  'BSAFE_Certificate.pdf': {
    en: 'BSAFE Security & Safety Certificate',
    id: 'Sertifikasi Keamanan dan Keselamatan Lapangan BSAFE',
    issuer: 'United Nations (UNDSS)',
    date: 'Feb 2026',
    category: 'safeguards-social',
    tags: ['United Nations', 'UNDSS', 'Field Safety']
  },
  'CAPNET CCA Certificate _ Cap-Net.pdf': {
    en: 'IWRM for Climate Resilience (20-Hour Training Course)',
    id: 'Pengelolaan Sumber Daya Air Terpadu untuk Ketahanan Iklim (IWRM for Climate Resilience)',
    issuer: 'Cap-Net UNDP & UNEP-DHI Centre',
    date: 'Aug 2026',
    category: 'marine-fisheries',
    tags: ['UNDP', 'UNEP-DHI', 'IWRM', 'Climate Resilience'],
    credentialUrl: 'https://campus.cap-net.org/certificates/fd36a0339b364500a601922c8fd08ba9',
    competencies: 'Integrated Water Resources Management (IWRM), Climate Change Adaptation, Watershed & Coastal Hydrology, Disaster Risk Reduction, Water Governance',
    description: '20-hour intensive training on Integrated Water Resources Management (IWRM) for Climate Resilience accredited by Cap-Net UNDP and UNEP-DHI Centre, addressing climate change adaptation in water resources, basin management, and resilient water governance frameworks.'
  },
  'Certificate Protected Area Technician Training Course - Infrastructure Fundamentals.pdf': {
    en: 'Protected Area Technician Training Course - Infrastructure Fundamentals',
    id: 'Kursus Teknisi Kawasan Konservasi - Fondasi Infrastruktur (Connected Conservation)',
    issuer: 'Connected Conservation',
    date: 'Jan 2026',
    category: 'safeguards-social',
    tags: ['Connected Conservation', 'Protected Areas', 'Infrastructure']
  },
  'Certificate Protected Area Technician Training Course - Tools for Informed Decision Making.pdf': {
    en: 'Protected Area Technician Training Course - Tools for Informed Decision Making',
    id: 'Kursus Teknisi Kawasan Konservasi - Perangkat Pengambilan Keputusan Berbasis Data',
    issuer: 'Connected Conservation',
    date: 'Jan 2026',
    category: 'safeguards-social',
    tags: ['Connected Conservation', 'Conservation Tools', 'Decision Making']
  },
  'Certificate WBG Blue Carbon.pdf': {
    en: 'Blue Carbon Fundamentals',
    id: 'Dasar-Dasar Karbon Biru (Blue Carbon Fundamentals)',
    issuer: 'World Bank Group',
    date: 'Jul 2026',
    category: 'carbon-climate',
    tags: ['World Bank', 'Blue Carbon', 'Climate Finance']
  },
  'Certificate WBG.pdf': {
    en: 'Training on Monitoring and Evaluation for EnABLE Projects',
    id: 'Pelatihan Monitoring & Evaluasi untuk Proyek EnABLE',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    category: 'safeguards-social',
    tags: ['World Bank', 'EnABLE', 'M&E']
  },
  'Certificate0000.pdf': {
    en: 'Conflict of Interest Risk Management for Your Project',
    id: 'Manajemen Risiko Benturan Kepentingan dalam Proyek',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    category: 'safeguards-social',
    tags: ['World Bank', 'Governance', 'Ethics']
  },
  'Certificate_01.pdf': {
    en: 'Sustainability Training and E-Learning Program (STEP)',
    id: 'Program Pelatihan Berkelanjutan & E-Learning (STEP)',
    issuer: 'World Bank Group',
    date: 'Nov 2023',
    category: 'safeguards-social',
    tags: ['World Bank', 'Sustainability', 'Safeguards']
  },
  'Certificate_Ocean Governance Elective Modules.pdf': {
    en: 'Ocean Governance Capacity Building Training Program (Elective Modules)',
    id: 'Program Peningkatan Kapasitas Tata Kelola Laut - Modul Pilihan',
    issuer: 'World Bank Group',
    date: 'Jul 2026',
    category: 'marine-fisheries',
    tags: ['World Bank', 'Ocean Governance', 'Marine Policy']
  },
  'Certificate_UNDSS.pdf': {
    en: 'Preparing and Responding to Active Shooter Incidents',
    id: 'Kesiapsiagaan dan Tanggap Insiden Keamanan (Preparing and Responding to Incidents)',
    issuer: 'United Nations (UNDSS)',
    date: 'Feb 2026',
    category: 'safeguards-social',
    tags: ['United Nations', 'UNDSS', 'Security']
  },
  'D3_ Define, Develop, Deliver.pdf': {
    en: 'D3: Define, Develop, Deliver Leadership Framework',
    id: 'Kerangka Kepemimpinan Proyek D3 (Define, Develop, Deliver)',
    issuer: 'Professional Institution',
    date: 'Nov 2023',
    category: 'project-leadership',
    tags: ['Leadership', 'Project Framework']
  },
  'E-Certificate - I Gede Mahendra Wijaya - YELP 2022.pdf': {
    en: 'Youth Economic Leadership Program (YELP Batch VI)',
    id: 'Program Kepemimpinan Ekonomi Muda (YELP Batch VI)',
    issuer: 'Bank Indonesia Institute',
    date: 'Jul 2022',
    category: 'project-leadership',
    tags: ['Bank Indonesia', 'Leadership', 'Economic Policy']
  },
  'ESG Job Simulation.pdf': {
    en: 'ESG Job Simulation: Sustainable Strategy & Stakeholder Advisory',
    id: 'Simulasi Praktik ESG: Strategi Keberlanjutan & Konsultasi Stakeholder',
    issuer: 'Forage',
    date: 'Feb 2024',
    category: 'safeguards-social',
    tags: ['Forage', 'ESG', 'Sustainability']
  },
  'Financial Management Essentials Certificate Program.pdf': {
    en: 'Financial Management Essentials Certificate',
    id: 'Sertifikasi Esensial Manajemen Keuangan Proyek',
    issuer: 'DisasterReady / Cornerstone OnDemand',
    date: 'Jul 2026',
    category: 'project-leadership',
    tags: ['DisasterReady', 'Financial Management']
  },
  'generate-pdf.pdf': {
    en: 'Blue Carbon Project Development & MRV Specialist Training',
    id: 'Pelatihan Spesialis Pengembangan Proyek Karbon Biru & MRV (PDD Module 3)',
    issuer: 'Fair Carbon (Blue Carbon Academy)',
    date: 'May 2026',
    category: 'carbon-climate',
    tags: ['Fair Carbon', 'Blue Carbon', 'PDD', 'MRV'],
    credentialUrl: 'https://faircarbon.mykajabi.com/library',
    competencies: 'Blue Carbon Project Development, Feasibility & PIN Assessment, Project Design Document (PDD), Investment Due Diligence, MRV Design & Verification',
    description: 'Comprehensive training covering the full project development lifecycle for coastal blue carbon (mangroves and seagrass), from baseline feasibility & Project Idea Note (PIN), standardized PDD design, investment due diligence, to scientific Monitoring, Reporting & Verification (MRV) systems and carbon credit integrity.'
  },
  'I-Gede-Mahendra-Wijaya–Climate-Change-and-Sovereign-Risk–Climate-Change-and-Sovereign-Risk–ADBI-E-Learning.pdf': {
    en: 'Climate Change and Sovereign Risk',
    id: 'Perubahan Iklim dan Risiko Fiskal/Sovereign Risk',
    issuer: 'Asian Development Bank Institute (ADBI)',
    date: 'Nov 2023',
    category: 'carbon-climate',
    tags: ['ADBI', 'Climate Risk', 'Green Finance'],
    credentialUrl: 'https://elearning-adbi.org/certificate-verifier/?&code=98936-170-081-2015'
  },
  'Introduction_to_forest_and_landscape_restoration.png': {
    en: 'Introduction to Forest and Landscape Restoration',
    id: 'Pengenalan Restorasi Lanskap Hutan (FLR)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    category: 'carbon-climate',
    tags: ['FAO', 'Forestry', 'Restoration']
  },
  'I-GEDE-MAHENDRA-WIJAYA-Biodiversity-Finance-Designing-and-Implementing-Finance-Plans-for-Nature-Biodiversity-Finance-Designing-and-Implementing-Finance-Plans-for-Nature-Self-paced-.pdf': {
    en: 'Biodiversity Finance: Designing and Implementing Finance Plans for Nature',
    id: 'Keuangan Keanekaragaman Hayati: Perancangan dan Implementasi Rencana Pembiayaan untuk Alam (Biodiversity Finance)',
    issuer: 'UNDP Biodiversity Finance Initiative (BIOFIN) & Learning for Nature',
    date: 'Sep 2026',
    category: 'carbon-climate',
    tags: ['BIOFIN', 'UNDP', 'Biodiversity Finance', 'Green Finance', 'Nature Credits'],
    credentialUrl: 'https://www.learningfornature.org/en/courses/biodiversity-finance-designing-and-implementing-finance-plans-for-nature-self-paced/',
    competencies: 'BIOFIN Methodology, Biodiversity Expenditure Review (BER), Financial Needs Assessment (FNA), Biodiversity Finance Plan (BFP), Nature-Positive Finance Mechanisms, Sustainable Blended Finance & Impact Investment',
    description: 'Comprehensive 12-hour specialized professional course developed by the UNDP Biodiversity Finance Initiative (BIOFIN) on Learning for Nature, based on the BIOFIN Workbook 2024. Covers the complete BIOFIN national methodology: Policy and Institutional Review (PIR), Biodiversity Expenditure Review (BER), Financial Needs Assessment (FNA), and designing and mobilizing high-impact national Biodiversity Finance Plans (BFP) to close global biodiversity financing gaps.'
  },
  'I-GEDE-MAHENDRA-WIJAYA-The-Use-of-the-IPCC-Inventory-Software-ICAT-E-learning-Course-on-the-Use-of-the-IPCC-Inventory-Software-Learning-for-Nature.pdf': {
    en: 'ICAT Training on the Use of the IPCC Inventory Software',
    id: 'Pelatihan ICAT tentang Penggunaan Perangkat Lunak Inventarisasi GRK IPCC (IPCC Inventory Software)',
    issuer: 'Initiative for Climate Action Transparency (ICAT), IPCC TSU & UNDP Learning for Nature',
    date: 'Sep 2026',
    category: 'carbon-climate',
    tags: ['ICAT', 'IPCC', 'GHG Inventory', 'Paris Agreement', 'ETF', 'LULUCF', 'AFOLU'],
    credentialUrl: 'https://www.learningfornature.org/en/courses/icat-training-on-the-use-of-the-ipcc-inventory-software/',
    competencies: 'IPCC Inventory Software, 2006 IPCC Guidelines for National GHG Inventories, Enhanced Transparency Framework (ETF), LULUCF & AFOLU Emission Estimation, UNFCCC ETF Reporting Tool Interoperability, Activity Data & Emission Factor Management',
    description: 'Specialized technical training program developed by the Initiative for Climate Action Transparency (ICAT) and the IPCC Task Force on National Greenhouse Gas Inventories Technical Support Unit (IPCC TSU) on UNDP Learning for Nature. Comprehensive operational training covering all IPCC sectors (Energy, IPPU, Agriculture, LULUCF/Forestry, and Waste) to calculate national GHG emissions and removals, apply 2006 IPCC Guidelines, and ensure interoperability with the UNFCCC ETF reporting tool under the Paris Agreement.'
  },
  'ISO.pdf': {
    en: 'Internal Quality Auditor ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018',
    id: 'Pelatihan Audit Mutu & Lingkungan Internal (ISO 9001, 14001, 45001)',
    issuer: 'Worldwide Quality Assurance (WQA)',
    date: 'Dec 2018',
    category: 'hse-quality',
    tags: ['ISO', 'Quality Audit', 'HSE']
  },
  'Measuring_the_role_of_forests_and_trees_in_household_welfare_and_livelihoods.png': {
    en: 'Measuring the Role of Forests and Trees in Household Welfare and Livelihoods',
    id: 'Pengukuran Peran Hutan dan Pohon dalam Kesejahteraan Rumah Tangga',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Nov 2023',
    category: 'safeguards-social',
    tags: ['FAO', 'Livelihoods', 'Socio-Economics']
  },
  'Moreton Bay Regional Council - Community Development Job Simulation.pdf': {
    en: 'Community Development Job Simulation',
    id: 'Simulasi Praktik Pengembangan Masyarakat (Community Development)',
    issuer: 'Moreton Bay Regional Council / Forage',
    date: 'Feb 2024',
    category: 'safeguards-social',
    tags: ['Forage', 'Community', 'Stakeholder Engagement']
  },
  'Project Management Essentials Certificate.pdf': {
    en: 'Project Management Essentials Certificate',
    id: 'Sertifikasi Esensial Manajemen Proyek',
    issuer: 'DisasterReady / Cornerstone OnDemand',
    date: 'Feb 2024',
    category: 'project-leadership',
    tags: ['DisasterReady', 'Project Management']
  },
  'PSEA_UN_LM_CRTERM.pdf': {
    en: 'Prevention of Sexual Exploitation and Abuse (PSEA)',
    id: 'Pencegahan Eksploitasi dan Pelecehan Seksual (PSEA) Personel PBB',
    issuer: 'United Nations',
    date: 'Feb 2026',
    category: 'safeguards-social',
    tags: ['United Nations', 'Safeguards', 'Ethics']
  },
  'WBG OLC - Saba_ Introduction to the Global Environment Facility (GEF).pdf': {
    en: 'Introduction to the Global Environment Facility (GEF)',
    id: 'Pengantar Fasilitas Lingkungan Global (GEF)',
    issuer: 'World Bank Group & GEF',
    date: 'Oct 2023',
    category: 'safeguards-social',
    tags: ['World Bank', 'GEF', 'Environmental Finance']
  },
  'certificate-acoustic-analysis-in-kaleidoscope-part-1-getting-started-64308a22d28ff5e07a0eef1e.pdf': {
    en: 'Acoustic Analysis in Kaleidoscope (Part 1): Getting Started',
    id: 'Analisis Akustik di Kaleidoscope (Bagian 1): Memulai',
    issuer: 'Wildlife Acoustics',
    date: 'Dec 2023',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Acoustic Monitoring']
  },
  'certificate-acoustic-analysis-in-kaleidoscope-part-2-batch-processing-64e4ebf2866ab6b7600d5956.pdf': {
    en: 'Acoustic Analysis in Kaleidoscope (Part 2): Batch Processing',
    id: 'Analisis Akustik di Kaleidoscope (Bagian 2): Pemrosesan Batch',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Acoustic Monitoring']
  },
  'certificate-feb-2-how-to-start-a-general-survey-with-kaleidoscope-pro-advanced-697118a96e3d1f4937000e8a.pdf': {
    en: 'How to Start a General Survey with Kaleidoscope Pro (Advanced)',
    id: 'Memulai Survei Umum dengan Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Survey Design']
  },
  'certificate-feb-4-intro-to-acoustic-indices-for-biodiversity-monitoring-intermediate-69711ab24c20c3c40105ab74.pdf': {
    en: 'Intro to Acoustic Indices for Biodiversity Monitoring (Intermediate)',
    id: 'Pengantar Indeks Akustik untuk Monitoring Keanekaragaman Hayati (Menengah)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Biodiversity Indices']
  },
  'certificate-feb-5-how-to-perform-a-targeted-search-with-kaleidoscope-pro-advanced-69711c08d783f039d707ffbe.pdf': {
    en: 'How to Perform a Targeted Search with Kaleidoscope Pro (Advanced)',
    id: 'Pencarian Tertarget dengan Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Signal Detection']
  },
  'certificate-feb-9-introduction-to-kaleidoscope-for-bat-sound-analysis-beginner-69711deadf3562274a0cffb8.pdf': {
    en: 'Introduction to Kaleidoscope for Bat Sound Analysis (Beginner)',
    id: 'Pengantar Kaleidoscope untuk Analisis Suara Kelelawar (Tingkat Dasar)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-11-introduction-to-kaleidoscope-for-bat-sound-analysis-beginner-69712121dd74a503020f5cd3.pdf': {
    en: 'Introduction to Kaleidoscope for Bat Sound Analysis (Beginner Batch 2)',
    id: 'Pengantar Kaleidoscope untuk Analisis Suara Kelelawar (Tingkat Dasar Gelombang 2)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  },
  'certificate-feb-19-how-to-use-bat-auto-id-in-kaleidoscope-pro-advanced-69712cf6618705c2e500f795.pdf': {
    en: 'How to Use Bat Auto-ID in Kaleidoscope Pro (Advanced)',
    id: 'Penggunaan Bat Auto-ID di Kaleidoscope Pro (Tingkat Lanjut)',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics', 'Auto Identification']
  },
  'certificate-kaleidoscope-lite-for-bat-analysis-651c2fdee341d6500b0b310c.pdf': {
    en: 'Kaleidoscope Lite for Bat Analysis',
    id: 'Penggunaan Kaleidoscope Lite untuk Analisis Kelelawar',
    issuer: 'Wildlife Acoustics',
    date: 'Feb 2026',
    category: 'marine-fisheries',
    tags: ['Wildlife Acoustics', 'Bioacoustics']
  }
};

// Additional verified training programs from Master CV (formal courses, online diplomas & specialized programs)
const ADDITIONAL_MASTER_TRAININGS = [
  {
    en: 'ICAT Training on the Use of the IPCC Inventory Software',
    id: 'Pelatihan ICAT tentang Penggunaan Perangkat Lunak Inventarisasi GRK IPCC (IPCC Inventory Software)',
    issuer: 'Initiative for Climate Action Transparency (ICAT), IPCC TSU & UNDP Learning for Nature',
    date: 'Sep 2026',
    category: 'carbon-climate',
    tags: ['ICAT', 'IPCC', 'GHG Inventory', 'Paris Agreement', 'ETF', 'LULUCF', 'AFOLU'],
    credentialUrl: 'https://www.learningfornature.org/en/courses/icat-training-on-the-use-of-the-ipcc-inventory-software/',
    competencies: 'IPCC Inventory Software, 2006 IPCC Guidelines for National GHG Inventories, Enhanced Transparency Framework (ETF), LULUCF & AFOLU Emission Estimation, UNFCCC ETF Reporting Tool Interoperability, Activity Data & Emission Factor Management',
    description: 'Specialized technical training program developed by the Initiative for Climate Action Transparency (ICAT) and the IPCC Task Force on National Greenhouse Gas Inventories Technical Support Unit (IPCC TSU) on UNDP Learning for Nature. Comprehensive operational training covering all IPCC sectors (Energy, IPPU, Agriculture, LULUCF/Forestry, and Waste) to calculate national GHG emissions and removals, apply 2006 IPCC Guidelines, and ensure interoperability with the UNFCCC ETF reporting tool under the Paris Agreement.'
  },
  {
    en: 'REDD+ Academy: Forest Carbon & National Strategy Capacity Building',
    id: 'Akademi REDD+: Peningkatan Kapasitas Karbon Hutan & Strategi Nasional',
    issuer: 'UN-REDD Programme (FAO, UNDP, UNEP)',
    date: 'Sep 2026',
    category: 'carbon-climate',
    tags: ['UN-REDD', 'REDD+', 'Forest Carbon', 'UNEP', 'UNDP', 'FAO'],
    credentialUrl: 'https://reddacademy.in.howspace.com/welcome',
    competencies: 'REDD+ Architecture & National Strategy, National Forest Monitoring Systems (NFMS), Forest Reference Emission Levels (FREL/FRL), Safeguard Information Systems (SIS), Results-Based Finance & Carbon Markets',
    description: 'Flagship capacity-building training program by the UN-REDD Programme (FAO, UNDP, UNEP), covering national REDD+ architecture, Forest Reference Emission Levels (FREL), National Forest Monitoring Systems (NFMS), Safeguards & Safeguard Information Systems (SIS), and results-based climate finance.'
  },
  {
    en: 'Diploma in Occupational Health, Safety and Environment (OHSE)',
    id: 'Diploma Kesehatan, Keselamatan Kerja dan Lingkungan Hidup (OHSE)',
    issuer: 'Alison',
    date: 'Sep 2026',
    category: 'hse-quality',
    tags: ['Alison', 'OHSE', 'HSE', 'Occupational Safety'],
    credentialUrl: 'https://alison.com/course/diploma-in-occupational-health-safety-and-environment-ohse',
    competencies: 'Occupational Health & Safety (OHS), Environmental Management Systems (EMS), Workplace Hazard & Risk Assessment, Emergency Preparedness, Incident Investigation, HSE Compliance',
    description: 'Comprehensive diploma program in Occupational Health, Safety, and Environment (OHSE) from Alison, covering hazard identification, workplace risk assessments, incident prevention & root cause analysis, environmental protection protocols, emergency response planning, and international HSE management standards.'
  },
  {
    en: 'Diploma in Environmental Management',
    id: 'Diploma Manajemen Lingkungan (Diploma in Environmental Management)',
    issuer: 'Alison',
    date: 'Sep 2026',
    category: 'hse-quality',
    tags: ['Alison', 'Environmental Management', 'EMS', 'ISO 14001', 'EHS'],
    credentialUrl: 'https://alison.com/verify/5b82d8b9ba',
    competencies: 'Environmental Management Systems (EMS / ISO 14001), Environmental Impact Assessment (EIA / ESIA), Environmental Auditing & Compliance, Pollution Prevention & Control, Ecological Sustainability & Resource Efficiency',
    description: 'Comprehensive professional diploma in Environmental Management accredited by Alison (Credential ID: 1917-10374639), covering environmental management systems (ISO 14001), EIA/ESIA screening and scoping, environmental auditing and compliance standards, waste and water resource governance, pollution abatement protocols, and strategic ecological sustainability.'
  },
  {
    en: 'The German Supply Chain Due Diligence Act (LkSG / SCDDA)',
    id: 'Kepatuhan Uji Tuntas Rantai Pasok Jerman (German Supply Chain Due Diligence Act - LkSG/SCDDA)',
    issuer: 'Import Promotion Desk (IPD Germany)',
    date: 'Aug 2026',
    category: 'carbon-climate',
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
    category: 'carbon-climate',
    tags: ['IPD Germany', 'EUDR', 'Deforestation'],
    credentialUrl: 'https://www.importpromotiondesk.com/exporters/en/market-information/e-learning',
    competencies: 'EU Deforestation Regulation (EUDR) Compliance, Supply Chain Geolocation & Traceability, Deforestation-Free Commodity Due Diligence, Legality & Risk Assessment',
    description: 'Specialized training on the EU Deforestation Regulation (EUDR), addressing regulatory compliance, supply chain due diligence, geolocation traceability, and legality verification for deforestation-free commodities entering the EU market (palm oil, wood, rubber, cocoa, coffee, soy, cattle).'
  },
  {
    en: 'Introduction to Modern Project Management Theory and Practice',
    id: 'Pengantar Teori dan Praktik Manajemen Proyek Modern (Modern Project Management)',
    issuer: 'Alison',
    date: 'Jul 2026',
    category: 'project-leadership',
    tags: ['Alison', 'Project Management', 'Agile', 'Methodology'],
    credentialUrl: 'https://alison.com/course/introduction-to-modern-project-management-theory-and-practice',
    competencies: 'Modern Project Management, Project Lifecycle Planning, Agile & Waterfall Methodologies, Work Breakdown Structure (WBS), Risk & Stakeholder Management, Resource Scheduling',
    description: 'CPD-certified professional course on modern project management methodologies from Alison, covering project lifecycle phases, project charter & WBS development, risk management frameworks, Agile & predictive delivery, and stakeholder engagement.'
  },
  {
    en: 'Green Economic Acceleration: A Japan-ASEAN Strategic Programme for Sustainable Green Finance',
    id: 'Akselerasi Ekonomi Hijau: Program Strategis Jepang-ASEAN untuk Keuangan Hijau Berkelanjutan',
    issuer: 'United Nations Institute for Training and Research (UNITAR)',
    date: 'Jul 2026',
    category: 'carbon-climate',
    tags: ['UNITAR', 'Green Finance', 'Climate Policy']
  },
  {
    en: 'Carbon Credits Project Fundamentals',
    id: 'Dasar-Dasar Proyek Kredit Karbon (Carbon Credits Project Fundamentals)',
    issuer: 'Blooms Academy',
    date: 'Apr 2026',
    category: 'carbon-climate',
    tags: ['Blooms Academy', 'Carbon Credits', 'Carbon Accounting']
  },
  {
    en: 'Global Carbon Summit Indonesia 2025',
    id: 'KTT Karbon Global Indonesia 2025 (Global Carbon Summit)',
    issuer: 'Global Carbon Summit',
    date: 'Nov 2025',
    category: 'carbon-climate',
    tags: ['Carbon Summit', 'Carbon Market', 'Climate Finance']
  },
  {
    en: 'Corporate Social Responsibility (CSR) Development Specialist',
    id: 'Spesialis Pengembangan Tanggung Jawab Sosial Perusahaan (CSR)',
    issuer: 'Corporate Forum for Community Development (CFCD)',
    date: 'Feb 2025',
    category: 'safeguards-social',
    tags: ['CFCD', 'CSR', 'Community Development']
  },
  {
    en: 'Human Dimensions of Forest and Landscape Restoration',
    id: 'Dimensi Manusia dalam Restorasi Lanskap Hutan',
    issuer: 'Society for Ecological Restoration (SER)',
    date: 'Jul 2024',
    category: 'carbon-climate',
    tags: ['SER', 'Forest Restoration', 'Landscape Governance']
  },
  {
    en: 'Climate Action Now Program',
    id: 'Program Aksi Iklim Global (Climate Action Now)',
    issuer: 'Pachamama Alliance',
    date: 'Jun 2024',
    category: 'carbon-climate',
    tags: ['Pachamama Alliance', 'Climate Action', 'Sustainability']
  },
  {
    en: 'Ground-Based Forest Carbon Stock Accounting (SNI 7724)',
    id: 'Perhitungan Cadangan Karbon Hutan Berbasis Terestrial (SNI 7724)',
    issuer: 'Generasi Biologi Indonesia',
    date: 'Jun 2024',
    category: 'carbon-climate',
    tags: ['Generasi Biologi', 'Carbon Accounting', 'SNI 7724']
  },
  {
    en: 'Sustainable Financing of Forest and Landscape Restoration',
    id: 'Pendanaan Berkelanjutan untuk Restorasi Lanskap Hutan',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    category: 'carbon-climate',
    tags: ['FAO', 'Sustainable Finance', 'Forest Finance']
  },
  {
    en: 'Practical Guidance: Respecting Free, Prior and Informed Consent (FPIC)',
    id: 'Panduan Praktis: Menghormati Free, Prior and Informed Consent (FPIC)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Apr 2024',
    category: 'safeguards-social',
    tags: ['FAO', 'FPIC', 'Social Safeguards']
  },
  {
    en: 'Social Network Analysis for Environmental Governance',
    id: 'Analisis Jaringan Sosial untuk Tata Kelola Lingkungan',
    issuer: 'International Network for Social Network Analysis (INSNA)',
    date: 'Feb 2024',
    category: 'marine-fisheries',
    tags: ['INSNA', 'Governance', 'Network Analysis']
  },
  {
    en: 'Ecosystem Approach to Fisheries Management (EAFM) Planning',
    id: 'Perencanaan Pendekatan Ekosistem untuk Pengelolaan Perikanan (EAFM)',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Oct 2023',
    category: 'marine-fisheries',
    tags: ['FAO', 'EAFM', 'Fisheries Governance']
  },
  {
    en: 'Evaluating Fisheries Co-Management Effectiveness',
    id: 'Evaluasi Efektivitas Ko-Manajemen Perikanan',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Sep 2023',
    category: 'marine-fisheries',
    tags: ['FAO', 'Fisheries Management', 'Co-Management']
  },
  {
    en: 'Institutionalization of Forest Data and National Forest Monitoring',
    id: 'Institusionalisasi Data Kehutanan & Pemantauan Hutan Nasional',
    issuer: 'Food and Agriculture Organization (FAO)',
    date: 'Aug 2023',
    category: 'safeguards-social',
    tags: ['FAO', 'Forest Data', 'MRV']
  },
  {
    en: 'Assessing Marine Ecosystem Health with Copernicus Marine Data',
    id: 'Penilaian Kesehatan Ekosistem Laut Berbasis Data Copernicus Marine',
    issuer: 'Copernicus Marine Service',
    date: 'Jul 2023',
    category: 'marine-fisheries',
    tags: ['Copernicus', 'Marine Data', 'Remote Sensing']
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
        category: mapping.category || 'safeguards-social',
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
        category: mapping.category || 'safeguards-social',
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
        category: tr.category || 'carbon-climate',
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
        category: tr.category || 'carbon-climate',
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

  // Helper to parse dates like "Nov 2023", "July 2026", "2024" for sorting
  function parseDateForSort(dateStr) {
    if (!dateStr) return 0;
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 2) {
      const m = months[parts[0].toLowerCase()] ?? 0;
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

  console.log(`Total active certificates in portfolio: ${cvData.en.certificates.length}`);

  // Update data.js
  const fileContent = `export const cvData = ${JSON.stringify(cvData, null, 2)};\n`;
  fs.writeFileSync('data.js', fileContent, 'utf8');
  console.log(`Updated data.js successfully with ${cvData.en.certificates.length} complete certificates.`);

  // Build the website
  console.log('Building Vite site...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Vite build complete.');
}

main().catch(err => {
  console.error('Error syncing certificates:', err);
  process.exit(1);
});
