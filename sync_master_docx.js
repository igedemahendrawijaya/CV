import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { cvData } from './data.js';

const DOCX_PATH = 'I Gede Mahendra Wijaya_Master CV.docx';
const MD_PATH = 'I Gede Mahendra Wijaya_Master CV.md';
const CERT_PUBLIC_DIR = 'public/certificates';

// Helper to normalize strings for comparison
function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Helper to extract date from a string
function extractDate(str) {
  if (!str) return '2024';
  const months = {
    january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May', june: 'Jun',
    july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',
    jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec'
  };

  // Check Month YYYY
  let match = str.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);
  if (match) {
    const m = months[match[1].toLowerCase()];
    return `${m} ${match[2]}`;
  }

  // Check DD Month YYYY
  match = str.match(/\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);
  if (match) {
    const m = months[match[1].toLowerCase()];
    return `${m} ${match[2]}`;
  }

  // Check Year only
  match = str.match(/\b(201\d|202\d)\b/);
  if (match) {
    return match[1];
  }

  return '2024';
}

// Helper to find matching certificate PDF file
function findMatchingPdf(title) {
  if (!fs.existsSync(CERT_PUBLIC_DIR)) return null;
  const files = fs.readdirSync(CERT_PUBLIC_DIR);
  const normTitle = normalize(title);

  for (const f of files) {
    const normFile = normalize(f);
    if (normFile.includes(normTitle) || normTitle.includes(normFile.replace(/pdf$/i, ''))) {
      return `certificates/${f}`;
    }
  }
  return null;
}

// Intelligent issuer detector
function detectIssuer(line) {
  const lower = line.toLowerCase();
  if (lower.includes('cap-net') || lower.includes('iwrm') || lower.includes('unep-dhi')) return 'Cap-Net UNDP & UNEP-DHI Centre';
  if (lower.includes('import promotion desk') || lower.includes('ipd germany') || lower.includes('scdda') || lower.includes('eudr')) return 'Import Promotion Desk (IPD Germany)';
  if (lower.includes('fair carbon') || lower.includes('blue carbon academy')) return 'Fair Carbon (Blue Carbon Academy)';
  if (lower.includes('world bank') || lower.includes('wbg') || lower.includes('open learning campus') || lower.includes('enable') || lower.includes('gef')) return 'World Bank Group';
  if (lower.includes('unitar')) return 'United Nations (UNITAR)';
  if (lower.includes('undss')) return 'United Nations (UNDSS)';
  if (lower.includes('united nations') || lower.includes('un personnel') || lower.includes('psea')) return 'United Nations';
  if (lower.includes('food and agriculture') || lower.includes('fao')) return 'Food and Agriculture Organization (FAO)';
  if (lower.includes('asian development bank') || lower.includes('adbi') || lower.includes('adb')) {
    if (lower.includes('institute') || lower.includes('adbi')) return 'Asian Development Bank Institute (ADBI)';
    return 'Asian Development Bank (ADB)';
  }
  if (lower.includes('wildlife acoustics') || lower.includes('kaleidoscope')) return 'Wildlife Acoustics';
  if (lower.includes('proforest')) return 'Proforest Academy';
  if (lower.includes('connected conservation')) return 'Connected Conservation';
  if (lower.includes('palo alto')) return 'Palo Alto Networks';
  if (lower.includes('disasterready') || lower.includes('cornerstone')) return 'DisasterReady / Cornerstone OnDemand';
  if (lower.includes('forage')) return 'Forage';
  if (lower.includes('bank indonesia') || lower.includes('yelp')) return 'Bank Indonesia Institute';
  if (lower.includes('pilot drone') || lower.includes('apdi')) return 'Asosiasi Pilot Drone Indonesia (APDI)';
  if (lower.includes('worldwide quality assurance') || lower.includes('wqa') || lower.includes('iso')) return 'Worldwide Quality Assurance (WQA)';
  if (lower.includes('barron international')) return 'Barron International';
  if (lower.includes('brighttalk')) return 'BrightTALK';
  if (lower.includes('blooms academy')) return 'Blooms Academy';
  if (lower.includes('global carbon summit')) return 'Global Carbon Summit';
  if (lower.includes('cfcd') || lower.includes('csr development')) return 'Corporate Forum for CSR Development (CFCD)';
  if (lower.includes('society for ecological restoration') || lower.includes('ser')) return 'Society for Ecological Restoration (SER)';
  if (lower.includes('pachamama alliance')) return 'Pachamama Alliance';
  if (lower.includes('generasi biologi')) return 'Generasi Biologi Indonesia';
  if (lower.includes('insna')) return 'INSNA';
  if (lower.includes('copernicus')) return 'Copernicus Marine Service';
  if (lower.includes('politeknik ahli usaha perikanan') || lower.includes('poltek aup')) return 'Politeknik AUP';
  if (lower.includes('bappenas') || lower.includes('kemenkomarinvest')) return 'BAPPENAS & Kemenko Marves';
  if (lower.includes('wwf')) return 'WWF Indonesia';
  return 'Professional Institution';
}

function cleanTitle(str) {
  return str
    .replace(/^[\d\.\-\•\*\s]+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\|\.\,\–\-]\s*$/g, '')
    .replace(/^[\|\.\,\–\-]\s*/g, '')
    .trim();
}

// Function to generate and synchronize I Gede Mahendra Wijaya_Master CV.md
function generateMasterMarkdown() {
  const p = cvData.en.personal;
  const stats = cvData.en.stats;
  const experiences = cvData.en.experience;
  const certs = cvData.en.certificates;
  const pubs = cvData.en.publications;

  // Group certificates chronologically
  const certs2026 = certs.filter(c => c.date.includes('2026') || c.date.includes('2027'));
  const certs2024 = certs.filter(c => c.date.includes('2024') || c.date.includes('2025'));
  const certsPrior = certs.filter(c => !c.date.includes('2026') && !c.date.includes('2027') && !c.date.includes('2024') && !c.date.includes('2025'));

  const yearsExp = stats.find(s => s.label.includes('Experience'))?.value || '13+';
  const projExp = stats.find(s => s.label.includes('Projects'))?.value || '30+';
  const pubsExp = stats.find(s => s.label.includes('Publications'))?.value || '15+';

  let md = `# ${p.name}, S.Pi., M.Si.\n`;
  md += `**${p.title}**  \n`;
  md += `*${p.subtitle}*\n\n`;
  md += `- **Email**: ${p.email}\n`;
  md += `- **Phone / WA**: ${p.phone}\n`;
  md += `- **Location**: ${p.location}\n`;
  md += `- **LinkedIn**: [${p.linkedin}](https://${p.linkedin})\n`;
  md += `- **ORCID**: [${p.orcid}](https://orcid.org/${p.orcid})\n\n`;
  md += `---\n\n`;

  md += `## Executive Profile Summary\n\n`;
  md += `${p.profileSummary}\n\n`;
  md += `---\n\n`;

  md += `## Key Core Metrics & Statistics\n`;
  md += `- **${yearsExp}** Years Professional Experience\n`;
  md += `- **${projExp}** Completed High-Impact Projects & Technical Reports\n`;
  md += `- **${certs.length}+** Professional Certifications & Specialized Training\n`;
  md += `- **${pubsExp}** Peer-Reviewed Scientific Publications & Conference Papers\n\n`;
  md += `---\n\n`;

  md += `## Professional Journey & Experience\n\n`;
  experiences.forEach((exp, i) => {
    md += `### ${i + 1}. ${exp.role}\n`;
    md += `**${exp.company}** | ${exp.period}  \n`;
    md += `${exp.description}\n\n`;
  });
  md += `---\n\n`;

  md += `## Full Master List of Certifications & Training (Chronologically Ordered - Total: ${certs.length})\n\n`;

  if (certs2026.length > 0) {
    md += `### 2026 – 2027\n`;
    certs2026.forEach((c, idx) => {
      const linkPart = c.credentialUrl ? ` — [${c.issuer}](${c.credentialUrl})` : ` — ${c.issuer}`;
      md += `${idx + 1}. **${c.name}**${linkPart} *(${c.date})*\n`;
      if (c.competencies) {
        md += `   - **Competencies**: ${c.competencies}\n`;
      }
      if (c.description) {
        md += `   - **Summary**: ${c.description}\n`;
      }
    });
    md += `\n`;
  }

  if (certs2024.length > 0) {
    md += `### 2024 – 2025\n`;
    certs2024.forEach((c, idx) => {
      const linkPart = c.credentialUrl ? ` — [${c.issuer}](${c.credentialUrl})` : ` — ${c.issuer}`;
      md += `${idx + 1}. **${c.name}**${linkPart} *(${c.date})*\n`;
      if (c.competencies) {
        md += `   - **Competencies**: ${c.competencies}\n`;
      }
      if (c.description) {
        md += `   - **Summary**: ${c.description}\n`;
      }
    });
    md += `\n`;
  }

  if (certsPrior.length > 0) {
    md += `### 2023 & Prior\n`;
    certsPrior.forEach((c, idx) => {
      const linkPart = c.credentialUrl ? ` — [${c.issuer}](${c.credentialUrl})` : ` — ${c.issuer}`;
      md += `${idx + 1}. **${c.name}**${linkPart} *(${c.date})*\n`;
      if (c.competencies) {
        md += `   - **Competencies**: ${c.competencies}\n`;
      }
      if (c.description) {
        md += `   - **Summary**: ${c.description}\n`;
      }
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `## Peer-Reviewed Publications & Research\n\n`;
  pubs.forEach((pub, i) => {
    md += `${i + 1}. **${pub.title}** — *${pub.journal} (${pub.year})*\n`;
  });
  md += `\n`;

  fs.writeFileSync(MD_PATH, md, 'utf8');
  console.log(`[Sync] Generated and updated ${MD_PATH} successfully!`);
}

async function syncDocx() {
  if (!fs.existsSync(DOCX_PATH)) {
    console.log(`[Info] ${DOCX_PATH} not found. Skipping Word sync.`);
    return;
  }

  console.log(`[1/4] Reading ${DOCX_PATH} with Mammoth...`);
  const { value: rawText } = await mammoth.extractRawText({ path: DOCX_PATH });
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 8);

  console.log(`[2/4] Analyzing ${lines.length} lines from Word CV...`);

  // Ignored patterns that are not training courses
  const IGNORE_PATTERNS = [
    /^responsible for/i,
    /^cv\s*[-–]/i,
    /^http/i,
    /^email:/i,
    /^phone:/i,
    /^report provided to/i,
    /^presented to/i,
    /^employment history/i,
    /^education/i,
    /^refference/i,
    /^award/i,
    /^research and publications/i,
    /^certificate & trainings$/i,
    /^professional profile/i,
    /^project manager/i,
    /^deputy unit leader/i,
    /^marine environmental specialist/i,
    /^assistant project director/i,
    /^marine mammal observer/i,
    /^marine research assistant/i,
    /^\|\s*(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /^\|/
  ];

  let addedFromWord = 0;

  for (const line of lines) {
    if (IGNORE_PATTERNS.some(p => p.test(line))) continue;

    const lower = line.toLowerCase();
    const isCertCandidate = (
      lower.includes('training') ||
      lower.includes('certificate') ||
      lower.includes('course') ||
      lower.includes('fellowship') ||
      lower.includes('workshop') ||
      lower.includes('job simulation') ||
      lower.includes('academy') ||
      lower.includes('safeguard') ||
      lower.includes('fundamentals') ||
      lower.includes('e-learning')
    ) && line.length < 200 && line.split(' ').length >= 3;

    if (isCertCandidate) {
      const date = extractDate(line);
      const issuer = detectIssuer(line);

      // Extract cleanly
      let parsedTitle = line;
      const parts = line.split('.').map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length >= 2 && parts[0].length > 10) {
        parsedTitle = parts[0];
      }

      parsedTitle = cleanTitle(parsedTitle);

      if (parsedTitle.length > 8 && parsedTitle.length < 120 && !parsedTitle.startsWith('|')) {
        const normTitle = normalize(parsedTitle);
        const alreadyExists = cvData.en.certificates.some(c => {
          const normExisting = normalize(c.name);
          return normExisting === normTitle || normExisting.includes(normTitle) || normTitle.includes(normExisting);
        });

        if (!alreadyExists) {
          const matchedPdf = findMatchingPdf(parsedTitle);
          const newCertEn = {
            name: parsedTitle,
            issuer: issuer,
            date: date,
            tags: [issuer.split(' ')[0], "Certification"],
            link: matchedPdf
          };
          const newCertId = {
            name: parsedTitle,
            issuer: issuer,
            date: date,
            tags: [issuer.split(' ')[0], "Sertifikasi"],
            link: matchedPdf
          };

          cvData.en.certificates.push(newCertEn);
          if (cvData.id && cvData.id.certificates) {
            cvData.id.certificates.push(newCertId);
          }
          console.log(`+ Added from Word CV: "${parsedTitle}" (${issuer}, ${date})`);
          addedFromWord++;
        }
      }
    }
  }

  // Sort chronologically descending
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

  // Write updated data.js
  const updatedDataContent = `export const cvData = ${JSON.stringify(cvData, null, 2)};\n`;
  fs.writeFileSync('data.js', updatedDataContent, 'utf8');

  console.log(`[3/4] Database data.js updated! Total certificates: ${cvData.en.certificates.length} (New added: ${addedFromWord})`);

  // Regenerate Master Markdown file automatically
  console.log(`[4/4] Synchronizing Markdown Master CV...`);
  generateMasterMarkdown();

  console.log(`\n======================================================`);
  console.log(`✓ ALL FILES SYNCHRONIZED (Word -> MD -> data.js -> Web)`);
  console.log(`======================================================\n`);
}

syncDocx();
