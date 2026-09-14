import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle
} from 'docx';
import { cvData } from './data.js';

const DOCX_FILE = 'I Gede Mahendra Wijaya_Master CV.docx';
const MD_FILE = 'I Gede Mahendra Wijaya_Master CV.md';

const PRIMARY_COLOR = '0F3A5D'; // Navy
const SECONDARY_COLOR = '0D9488'; // Teal
const TEXT_DARK = '1E293B'; // Slate Dark
const TEXT_MUTED = '64748B'; // Slate Muted

function createSectionHeading(title) {
  return [
    new Paragraph({
      spacing: { before: 280, after: 80 },
      border: {
        bottom: {
          color: SECONDARY_COLOR,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          color: PRIMARY_COLOR,
          font: 'Arial'
        })
      ]
    })
  ];
}

export function generateMasterMarkdown() {
  const p = cvData.en.personal;
  const stats = cvData.en.stats;
  const experiences = cvData.en.experience;
  const projects = cvData.en.projects;
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
  md += `- **${projects.length}** Completed High-Impact Projects & Technical Reports\n`;
  md += `- **${certs.length}+** Professional Certifications & Specialized Training Programs\n`;
  md += `- **${pubsExp}** Peer-Reviewed Scientific Publications & Conference Papers\n\n`;
  md += `---\n\n`;

  md += `## Education & Academic Background\n\n`;
  const educations = cvData.en.education || [];
  educations.forEach((edu, i) => {
    md += `${i + 1}. **${edu.degree}**\n`;
    md += `   - **Institution**: ${edu.institution}\n`;
    if (edu.faculty) md += `   - **Faculty / Program**: ${edu.faculty}\n`;
    md += `   - **Period**: ${edu.period}\n`;
    if (edu.details) md += `   - **Focus / Details**: ${edu.details}\n`;
    md += `\n`;
  });
  md += `---\n\n`;

  md += `## Professional Journey & Experience\n\n`;
  experiences.forEach((exp, i) => {
    md += `### ${i + 1}. ${exp.role}\n`;
    md += `**${exp.company}** | ${exp.location} | ${exp.period}  \n\n`;
    md += `${exp.description}\n\n`;
  });
  md += `---\n\n`;

  md += `## Key Projects & Technical Deliverables (Total: ${projects.length} Projects)\n\n`;
  projects.forEach((prj, i) => {
    md += `### ${i + 1}. ${prj.title}\n`;
    md += `- **Client / Partner**: ${prj.client}\n`;
    md += `- **Period**: ${prj.period}\n`;
    md += `- **Category / Focus**: ${prj.category.toUpperCase()} (${prj.tags ? prj.tags.join(', ') : ''})\n`;
    md += `- **Technical Scope & Output**: ${prj.description}\n\n`;
  });
  md += `---\n\n`;

  md += `## Professional Certifications & Specialized Training by Thematic Pillar (Total: ${certs.length})\n\n`;

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
    const pillarCerts = certs.filter(c => c.category === pillar.id);
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
  md += `## Peer-Reviewed Publications & Research Reports (Total: ${pubs.length})\n\n`;
  pubs.forEach((pub, i) => {
    md += `### ${i + 1}. ${pub.title}\n`;
    md += `- **Year**: ${pub.year}\n`;
    if (pub.publisher) {
      md += `- **Publisher / Conference**: ${pub.publisher}\n`;
    }
    if (pub.link) {
      md += `- **DOI / Link**: [${pub.link}](${pub.link})\n`;
    }
    if (pub.description) {
      md += `- **Summary**: ${pub.description}\n`;
    }
    md += `\n`;
  });

  md += `---\n\n`;
  md += `## Honors, Awards & Recognitions\n\n`;
  const awards = [
    { year: '2026', name: 'Fellowship in Green Economic Acceleration: A Japan-ASEAN Strategic Programme for Sustainable Green Finance', org: 'The United Nations Institute for Training and Research (UNITAR)' },
    { year: '2022', name: 'The 114th Prospective Innovation Award of Indonesia – 2022 Indonesia Scientist Award', org: 'Business Innovation Center (BIC) & Ministry of Research and Technology' },
    { year: '2022', name: 'Candidate in Youth Economic Leadership Program (YELP)', org: 'Bank Indonesia Institute' },
    { year: '2019', name: 'Speaker at DigiFish "Incubating Ecosystem of Digital Innovation"', org: 'DigiFish Network & Ministry of Marine Affairs and Fisheries' },
    { year: '2014', name: 'Indonesian Young Innovator Award', org: 'Inovasia Indonesia' },
    { year: '2013', name: 'Indonesian Youth Parliament Delegate for North Maluku', org: 'Indonesian Youth Parliament' },
    { year: '2012', name: 'The 104th Prospective Innovation Award of Indonesia – 2012 Indonesia Scientist Award', org: 'Business Innovation Center (BIC)' },
    { year: '2012', name: 'Candidate in Indonesian Leadership Camp', org: 'IPB University' }
  ];
  awards.forEach((aw, i) => {
    md += `${i + 1}. **[${aw.year}] ${aw.name}** — ${aw.org}\n`;
  });
  md += `\n---\n\n`;

  md += `## Professional References\n\n`;
  md += `1. **Dr. Lida Pet-Soede**  \n`;
  md += `   Director of Marine Unit Service, Hatfield Group  \n`;
  md += `   Email: [lpetsoede@hatfieldgroup.com](mailto:lpetsoede@hatfieldgroup.com) | Phone: +62 812 3818 742\n\n`;
  md += `2. **Dr. I Wayan Nurjaya**  \n`;
  md += `   Head of Department of Marine Science and Technology, IPB University  \n`;
  md += `   Email: [i.wayan.nurjaya@ipb.ac.id](mailto:i.wayan.nurjaya@ipb.ac.id) | Phone: +62 811 110 2525\n\n`;

  fs.writeFileSync(MD_FILE, md, 'utf8');
  console.log(`[Sync] Generated and updated ${MD_FILE} successfully!`);
}

export async function generateMasterDocx(outputFile = DOCX_FILE) {
  const p = cvData.en.personal;
  const stats = cvData.en.stats;
  const exps = cvData.en.experience;
  const projs = cvData.en.projects;
  const certs = cvData.en.certificates;
  const pubs = cvData.en.publications;

  const docChildren = [];

  // Header Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'I GEDE MAHENDRA WIJAYA, S.Pi.',
          bold: true,
          size: 34, // 17pt
          color: PRIMARY_COLOR,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: 'Marine Environmental Specialist | Carbon & Fisheries Management | Coastal & Ocean Governance',
          bold: true,
          size: 20, // 10pt
          color: SECONDARY_COLOR,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180 },
      children: [
        new TextRun({ text: `Email: ${p.email}  |  Phone/WA: ${p.phone}  |  Location: ${p.location}`, size: 18, color: TEXT_MUTED, font: 'Arial' }),
        new TextRun({ text: '\n' }),
        new TextRun({ text: `LinkedIn: linkedin.com/in/gmwijaya  |  ORCID: 0000-0003-2312-7031`, size: 18, color: TEXT_MUTED, font: 'Arial' })
      ]
    })
  );

  // 1. Executive Summary
  docChildren.push(...createSectionHeading('Executive Profile Summary'));
  docChildren.push(
    new Paragraph({
      spacing: { before: 60, after: 120 },
      alignment: AlignmentType.JUSTIFY,
      children: [
        new TextRun({
          text: p.profileSummary,
          size: 20,
          color: TEXT_DARK,
          font: 'Arial'
        })
      ]
    })
  );

  // 2. Metrics & Stats
  docChildren.push(...createSectionHeading('Key Core Metrics & Statistics'));
  stats.forEach(st => {
    docChildren.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 20, after: 30 },
        children: [
          new TextRun({ text: `${st.value} `, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: st.label, size: 20, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 3. Education
  docChildren.push(...createSectionHeading('Education & Academic Background'));
  const educations = cvData.en.education || [];
  educations.forEach((edu, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: idx === 0 ? 60 : 40, after: 20 },
        children: [
          new TextRun({ text: edu.degree, bold: true, size: 21, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `  |  ${edu.period}`, italic: true, size: 19, color: TEXT_MUTED, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: edu.details ? 20 : 100 },
        children: [
          new TextRun({ text: edu.institution, bold: true, size: 19, color: TEXT_DARK, font: 'Arial' }),
          ...(edu.faculty ? [new TextRun({ text: ` — ${edu.faculty}`, size: 19, color: TEXT_MUTED, font: 'Arial' })] : [])
        ]
      })
    );
    if (edu.details) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 0, after: 100 },
          children: [
            new TextRun({ text: `${edu.details}`, size: 19, color: TEXT_DARK, font: 'Arial' })
          ]
        })
      );
    }
  });

  // 4. Employment History
  docChildren.push(...createSectionHeading('Professional Journey & Employment History'));
  exps.forEach((exp, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${exp.role}`, bold: true, size: 21, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({ text: exp.company, bold: true, size: 19, color: SECONDARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `  |  ${exp.location}  |  ${exp.period}`, italic: true, size: 19, color: TEXT_MUTED, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 120 },
        alignment: AlignmentType.JUSTIFY,
        children: [
          new TextRun({ text: exp.description, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 5. Key Projects
  docChildren.push(...createSectionHeading(`Key Project Experiences (Total: ${projs.length} Projects)`));
  projs.forEach((prj, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${prj.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 30 },
        children: [
          new TextRun({ text: `Client/Partner: `, bold: true, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `${prj.client}  |  `, size: 18, color: SECONDARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `Period: `, bold: true, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `${prj.period}  |  `, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `Category: `, bold: true, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `${prj.category.toUpperCase()}`, bold: true, size: 18, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 100 },
        alignment: AlignmentType.JUSTIFY,
        children: [
          new TextRun({ text: prj.description, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 6. Certifications
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

  docChildren.push(...createSectionHeading(`Professional Certifications & Specialized Training (Total: ${certs.length})`));

  pillars.forEach(pil => {
    const pCerts = certs.filter(c => c.category === pil.id);
    docChildren.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [
          new TextRun({ text: `${pil.title} (${pCerts.length} Programs)`, bold: true, size: 21, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      })
    );

    pCerts.forEach((c) => {
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${c.name}`, bold: true, size: 19, color: TEXT_DARK, font: 'Arial' }),
            new TextRun({ text: ` — ${c.issuer} (${c.date})`, italic: true, size: 18, color: TEXT_MUTED, font: 'Arial' })
          ]
        })
      );
      if (c.competencies) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 0, after: 20 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: 'Competencies: ', bold: true, size: 18, color: SECONDARY_COLOR, font: 'Arial' }),
              new TextRun({ text: c.competencies, size: 18, color: TEXT_DARK, font: 'Arial' })
            ]
          })
        );
      }
      if (c.description) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 0, after: 40 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: c.description, size: 18, color: TEXT_MUTED, font: 'Arial' })
            ]
          })
        );
      }
    });
  });

  // 7. Publications
  docChildren.push(...createSectionHeading(`Peer-Reviewed Publications & Research Reports (Total: ${pubs.length})`));
  pubs.forEach((pub, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${pub.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({ text: `Year: ${pub.year}  |  Publisher: ${pub.publisher || 'Research Journal'}`, italic: true, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          pub.link ? new TextRun({ text: `  |  Link: ${pub.link}`, size: 18, color: SECONDARY_COLOR, font: 'Arial' }) : new TextRun({ text: '' })
        ]
      })
    );
  });

  // 8. Awards
  docChildren.push(...createSectionHeading('Honors, Awards & Recognitions'));
  const awards = [
    { year: '2026', name: 'Fellowship in Green Economic Acceleration: A Japan-ASEAN Strategic Programme for Sustainable Green Finance', org: 'The United Nations Institute for Training and Research (UNITAR)' },
    { year: '2022', name: 'The 114th Prospective Innovation Award of Indonesia – 2022 Indonesia Scientist Award', org: 'Business Innovation Center (BIC) & Ministry of Research and Technology' },
    { year: '2022', name: 'Candidate in Youth Economic Leadership Program (YELP)', org: 'Bank Indonesia Institute' },
    { year: '2019', name: 'Speaker at DigiFish "Incubating Ecosystem of Digital Innovation"', org: 'DigiFish Network & Ministry of Marine Affairs and Fisheries' },
    { year: '2014', name: 'Indonesian Young Innovator Award', org: 'Inovasia Indonesia' },
    { year: '2013', name: 'Indonesian Youth Parliament Delegate for North Maluku', org: 'Indonesian Youth Parliament' },
    { year: '2012', name: 'The 104th Prospective Innovation Award of Indonesia – 2012 Indonesia Scientist Award', org: 'Business Innovation Center (BIC)' },
    { year: '2012', name: 'Candidate in Indonesian Leadership Camp', org: 'IPB University' }
  ];

  awards.forEach(aw => {
    docChildren.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 20, after: 30 },
        children: [
          new TextRun({ text: `[${aw.year}] `, bold: true, size: 19, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `${aw.name} `, bold: true, size: 19, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `— ${aw.org}`, italic: true, size: 18, color: TEXT_MUTED, font: 'Arial' })
        ]
      })
    );
  });

  // 9. References
  docChildren.push(...createSectionHeading('Professional References'));
  const refs = [
    {
      name: 'Dr. Lida Pet-Soede',
      title: 'Director of Marine Unit Service',
      org: 'Hatfield Group',
      contact: 'Email: lpetsoede@hatfieldgroup.com | Phone: +62 812 3818 742'
    },
    {
      name: 'Dr. I Wayan Nurjaya',
      title: 'Head of Department of Marine Science and Technology',
      org: 'Faculty of Fisheries and Marine Sciences, IPB University',
      contact: 'Email: i.wayan.nurjaya@ipb.ac.id | Phone: +62 811 110 2525'
    }
  ];

  refs.forEach(r => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({ text: r.name, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: ` — ${r.title}, ${r.org}`, italic: true, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({ text: r.contact, size: 18, color: TEXT_MUTED, font: 'Arial' })
        ]
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 in
              right: 1080,
              bottom: 1080,
              left: 1080
            }
          }
        },
        children: docChildren
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFile, buffer);
  console.log(`[Docx] Master Word CV generated successfully: ${outputFile} (${buffer.length} bytes)`);
}

async function runMasterSync() {
  console.log('[1/2] Generating Master Markdown CV...');
  generateMasterMarkdown();

  console.log('[2/2] Generating Master Word CV (.docx)...');
  await generateMasterDocx();

  console.log('\n======================================================');
  console.log('✓ MASTER CV SYNC COMPLETE (Markdown + Word + data.js)');
  console.log('======================================================\n');
}

runMasterSync().catch(err => {
  console.error('Error during master sync:', err);
});

