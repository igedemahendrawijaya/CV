import fs from 'fs';
import mammoth from 'mammoth';
import { cvData } from './data.js';

const DOCX_FILE = 'I Gede Mahendra Wijaya_Master CV.docx';
const MD_FILE = 'I Gede Mahendra Wijaya_Master CV.md';

function extractDate(line) {
  const match = line.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/i);
  if (match) return match[0];
  const yearMatch = line.match(/\b(201\d|202\d)\b/);
  if (yearMatch) return yearMatch[0];
  return 'Recent';
}

function detectIssuer(line) {
  const lower = line.toLowerCase();
  if (lower.includes('redd') || lower.includes('un-redd')) return 'UN-REDD Programme (FAO, UNDP, UNEP)';
  if (lower.includes('alison')) return 'Alison';
  if (lower.includes('cap-net') || lower.includes('iwrm') || lower.includes('unep-dhi')) return 'Cap-Net UNDP & UNEP-DHI Centre';
  if (lower.includes('import promotion desk') || lower.includes('ipd germany') || lower.includes('scdda') || lower.includes('eudr')) return 'Import Promotion Desk (IPD Germany)';
  if (lower.includes('fair carbon') || lower.includes('blue carbon academy')) return 'Fair Carbon (Blue Carbon Academy)';
  if (lower.includes('world bank') || lower.includes('wbg') || lower.includes('open learning campus') || lower.includes('enable') || lower.includes('gef')) return 'World Bank Group';
  if (lower.includes('unitar')) return 'United Nations Institute for Training and Research (UNITAR)';
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
  if (lower.includes('cfcd') || lower.includes('csr development')) return 'Corporate Forum for Community Development (CFCD)';
  if (lower.includes('society for ecological restoration') || lower.includes('ser')) return 'Society for Ecological Restoration (SER)';
  if (lower.includes('pachamama alliance')) return 'Pachamama Alliance';
  if (lower.includes('generasi biologi')) return 'Generasi Biologi Indonesia';
  if (lower.includes('insna')) return 'International Network for Social Network Analysis (INSNA)';
  if (lower.includes('copernicus')) return 'Copernicus Marine Service';
  if (lower.includes('politeknik ahli usaha perikanan') || lower.includes('poltek aup')) return 'Politeknik AUP & Kementerian Kelautan dan Perikanan (KKP)';
  if (lower.includes('wwf')) return 'WWF Indonesia';
  return 'Professional Institution';
}

function detectCategory(str) {
  const lower = str.toLowerCase();
  if (lower.includes('carbon') || lower.includes('climate') || lower.includes('forest') || lower.includes('eudr') || lower.includes('scdda') || lower.includes('lksg') || lower.includes('green finance') || lower.includes('sovereign risk') || lower.includes('restoration') || lower.includes('decarbonization')) {
    return 'carbon-climate';
  }
  if (lower.includes('marine') || lower.includes('ocean') || lower.includes('fisher') || lower.includes('iwrm') || lower.includes('acoustic') || lower.includes('kaleidoscope') || lower.includes('asc') || lower.includes('indogap') || lower.includes('eafm') || lower.includes('copernicus') || lower.includes('sea survival')) {
    return 'marine-fisheries';
  }
  if (lower.includes('safeguard') || lower.includes('indigenous') || lower.includes('fpic') || lower.includes('esf') || lower.includes('enable') || lower.includes('gef') || lower.includes('psea') || lower.includes('bsafe') || lower.includes('esg') || lower.includes('csr') || lower.includes('community') || lower.includes('sexual exploitation') || lower.includes('privacy') || lower.includes('social impact') || lower.includes('protected area')) {
    return 'safeguards-social';
  }
  if (lower.includes('ohse') || lower.includes('hse') || lower.includes('safety') || lower.includes('first aid') || lower.includes('iso') || lower.includes('audit') || lower.includes('drone') || lower.includes('apdi') || lower.includes('quality assurance') || lower.includes('network security')) {
    return 'hse-quality';
  }
  return 'project-leadership';
}

function cleanTitle(str) {
  return str
    .replace(/^[\d\.\-\•\*\s]+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\|\.\,\–\-]\s*$/g, '')
    .replace(/^[\|\.\,\–\-]\s*/g, '')
    .trim();
}

function generateMasterMarkdown() {
  const p = cvData.en.personal;
  const stats = cvData.en.stats;
  const experiences = cvData.en.experience;
  const certs = cvData.en.certificates;
  const pubs = cvData.en.publications;

  const yearsExp = stats.find(s => s.label.includes('Experience'))?.value || '13+';
  const projExp = stats.find(s => s.label.includes('Projects'))?.value || '30+';
  const pubsExp = stats.find(s => s.label.includes('Publications'))?.value || '15+';

  let md = `# ${p.name}, S.Pi.\n`;
  md += `**${p.title}**  \n`;
  md += `*${p.subtitle}*\n\n`;
  md += `- **Email**: [${p.email}](mailto:${p.email})\n`;
  md += `- **Phone / WA**: [${p.phone}](https://wa.me/6281297429227)\n`;
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
  md += `- **${certs.length}+** Professional Certifications & Specialized Training Programs\n`;
  md += `- **${pubsExp}** Peer-Reviewed Scientific Publications & Conference Papers\n\n`;
  md += `---\n\n`;

  md += `## Education\n\n`;
  md += `1. **Bachelor of Marine Science and Technology (S.Pi.)**\n`;
  md += `   - **Institution**: Bogor Agricultural University (IPB University), Indonesia\n`;
  md += `   - **Faculty**: Faculty of Fisheries and Marine Sciences\n`;
  md += `   - **Period**: June 2008 – April 2013\n`;
  md += `   - **Major / Focus**: Marine Acoustic and Remote Sensing Technology | GPA: 3.04\n\n`;
  md += `2. **Diploma in Carbon Management** *(Online - Ongoing)*\n`;
  md += `   - **Institution**: The Greenhouse Gas Management Institute (GHGMI)\n`;
  md += `   - **Focus**: Greenhouse Gas Accounting, Carbon Project Development & MRV Frameworks\n\n`;
  md += `---\n\n`;

  md += `## Professional Journey & Experience\n\n`;
  experiences.forEach((exp, i) => {
    md += `### ${i + 1}. ${exp.role}\n`;
    md += `**${exp.company}** | ${exp.period}  \n`;
    md += `${exp.description}\n\n`;
  });
  md += `---\n\n`;

  md += `## Professional Certifications & Specialized Training by Thematic Pillar (Total: ${certs.length})\n\n`;

  // Define 5 Core Pillars
  const pillars = [
    {
      id: 'carbon-climate',
      title: '1. Carbon, Climate & Ecosystem Services (Blue Carbon, Forest Carbon & Climate Finance)'
    },
    {
      id: 'marine-fisheries',
      title: '2. Marine, Coastal & Fisheries Governance (Ocean Governance, IWRM & Bioacoustics)'
    },
    {
      id: 'safeguards-social',
      title: '3. Environmental, Social & Safeguards (ADB/World Bank Safeguards, FPIC, ESG & Community)'
    },
    {
      id: 'hse-quality',
      title: '4. Occupational Health, Safety, EHS & Quality Assurance (OHSE, ISO Auditing, APDI Drone)'
    },
    {
      id: 'project-leadership',
      title: '5. Project Management & Institutional Leadership (Modern PM, MEAL & Strategic Leadership)'
    }
  ];

  pillars.forEach(pillar => {
    const pillarCerts = certs.filter(c => (c.category || detectCategory(c.name)) === pillar.id);
    md += `### ${pillar.title} (${pillarCerts.length} Trainings)\n\n`;
    if (pillarCerts.length === 0) {
      md += `*No certifications listed under this pillar.*\n\n`;
    } else {
      pillarCerts.forEach((c, idx) => {
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
  });

  md += `---\n\n`;
  md += `## Peer-Reviewed Publications & Research\n\n`;
  pubs.forEach((pub, i) => {
    md += `### ${i + 1}. ${pub.title}\n`;
    md += `- **Year**: ${pub.year}\n`;
    if (pub.publisher) {
      md += `- **Publisher / Conference**: ${pub.publisher}\n`;
    }
    if (pub.link) {
      md += `- **DOI / Publication Link**: [${pub.link}](${pub.link})\n`;
    }
    if (pub.description) {
      md += `- **Summary**: ${pub.description}\n`;
    }
    md += `\n`;
  });

  fs.writeFileSync(MD_FILE, md, 'utf8');
  console.log(`[Sync] Generated and updated ${MD_FILE} successfully!`);
}

async function syncFromWord() {
  if (!fs.existsSync(DOCX_FILE)) {
    console.log(`Word file "${DOCX_FILE}" not found. Generating Markdown from data.js.`);
    generateMasterMarkdown();
    return;
  }

  console.log(`[1/4] Reading ${DOCX_FILE} with Mammoth...`);
  const { value } = await mammoth.extractRawText({ path: DOCX_FILE });
  const lines = value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  console.log(`[2/4] Analyzing ${lines.length} lines from Word CV...`);

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
    /^\|/,
    /^psea course/i,
    /^first aid kid/i,
    /^basic sea survival training/i
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

      let parsedTitle = line;
      const parts = line.split('.').map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length >= 2 && parts[0].length > 10) {
        parsedTitle = parts[0];
      }

      parsedTitle = cleanTitle(parsedTitle);

      if (parsedTitle.length > 8 && parsedTitle.length < 120 && !parsedTitle.startsWith('|')) {
        const norm = parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        const words = parsedTitle.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3);

        const exists = cvData.en.certificates.some(c => {
          const cn = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cn === norm) return true;
          if (cn.includes(norm) || norm.includes(cn)) return true;
          const cWords = c.name.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3);
          const common = words.filter(w => cWords.includes(w));
          if (words.length >= 2 && common.length >= Math.min(words.length, 2)) return true;
          return false;
        });

        if (!exists) {
          const category = detectCategory(parsedTitle);
          const newCert = {
            name: parsedTitle,
            issuer: issuer,
            date: date,
            category: category,
            tags: [issuer, 'Training']
          };

          cvData.en.certificates.push(newCert);
          if (cvData.id && cvData.id.certificates) {
            cvData.id.certificates.push({
              name: parsedTitle,
              issuer: issuer,
              date: date,
              category: category,
              tags: [issuer, 'Pelatihan']
            });
          }
          console.log(`+ Added from Word CV: "${parsedTitle}" (${issuer}, ${date})`);
          addedFromWord++;
        }
      }
    }
  }

  // Write updated data.js
  const fileContent = `export const cvData = ${JSON.stringify(cvData, null, 2)};\n`;
  fs.writeFileSync('data.js', fileContent, 'utf8');
  console.log(`[3/4] Database data.js updated! Total certificates: ${cvData.en.certificates.length} (New added: ${addedFromWord})`);

  // Generate Master Markdown
  console.log(`[4/4] Synchronizing Markdown Master CV...`);
  generateMasterMarkdown();

  console.log('\n======================================================');
  console.log('✓ ALL FILES SYNCHRONIZED (Word -> MD -> data.js -> Web)');
  console.log('======================================================\n');
}

syncFromWord().catch(err => {
  console.error('Error during Word sync:', err);
});
