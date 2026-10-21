import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink
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
  const projExp = stats.find(s => s.label.includes('Projects'))?.value || `${projects.length}`;
  const pubsExp = stats.find(s => s.label.includes('Publications'))?.value || `${pubs.length}`;

  let md = `# ${p.name.toUpperCase()}\n`;
  md += `**${p.title} | ${p.subtitle}**  \n`;
  md += `[LinkedIn](https://${p.linkedin}) | [Project Portofolio](${p.portfolio || 'https://gedemahendraw.github.io/'}) | [ORCID: ${p.orcid}](https://orcid.org/${p.orcid})  \n`;
  md += `${p.location} | Email: [${p.email}](mailto:${p.email}) | Phone: [${p.phone}](https://wa.me/6281297429227)\n\n`;
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

  md += `## Formal Education & Academic Qualifications\n\n`;
  const educations = cvData.en.education || [];
  educations.forEach((edu, idx) => {
    md += `${idx + 1}. **${edu.degree}**\n`;
    md += `   - **Institution**: ${edu.institution || edu.school}\n`;
    md += `   - **Faculty / Program**: ${edu.faculty || edu.field}\n`;
    md += `   - **Period**: ${edu.period}\n`;
    md += `   - **Focus / Details**: ${edu.details}\n\n`;
  });
  md += `---\n\n`;

  md += `## Professional Journey & Experience\n\n`;
  experiences.forEach((exp, idx) => {
    md += `### ${idx + 1}. ${exp.role}\n`;
    md += `**${exp.company}** | ${exp.location} | ${exp.period}  \n\n`;
    md += `${exp.description}\n\n`;
  });
  md += `---\n\n`;

  md += `## Key Projects & Technical Deliverables (Total: ${projects.length} Projects)\n\n`;
  projects.forEach((proj, idx) => {
    md += `### ${idx + 1}. ${proj.title}\n`;
    md += `- **Client / Partner**: ${proj.client}\n`;
    md += `- **Period**: ${proj.period}\n`;
    md += `- **Category / Focus**: ${proj.category || proj.focus || 'GENERAL'}\n`;
    md += `- **Technical Scope & Output**: ${proj.desc}\n\n`;
  });
  md += `---\n\n`;

  md += `## Peer-Reviewed Scientific Publications & Technical Papers (Total: ${pubs.length})\n\n`;
  pubs.forEach((pub, idx) => {
    md += `### ${idx + 1}. ${pub.title}\n`;
    md += `- **Authors**: ${pub.authors}\n`;
    md += `- **Year**: ${pub.year}\n`;
    md += `- **Publisher / Conference**: ${pub.publisher || pub.journal}\n`;
    if (pub.link) {
      md += `- **DOI / Link**: [${pub.link}](${pub.link})\n`;
    }
    if (pub.metrics) {
      md += `- **Metrics / Citations**: ${pub.metrics}\n`;
    }
    md += `\n`;
  });
  md += `---\n\n`;

  md += `## Professional Certifications & Specialized Training (Total: ${certs.length})\n\n`;
  certs.forEach((cert, idx) => {
    md += `### ${idx + 1}. ${cert.name}\n`;
    md += `- **Issuer**: ${cert.issuer}\n`;
    md += `- **Date / Period**: ${cert.date}\n`;
    md += `- **Category**: ${cert.category || 'Professional Credential'}\n`;
    if (cert.credentialId) {
      md += `- **Credential ID**: ${cert.credentialId}\n`;
    }
    if (cert.skills && cert.skills.length > 0) {
      md += `- **Competencies**: ${cert.skills.join(', ')}\n`;
    }
    md += `\n`;
  });
  md += `---\n\n`;

  md += `## Honors & National Innovation Awards\n\n`;
  const awards = cvData.en.awards || [];
  awards.forEach((aw, idx) => {
    md += `### ${idx + 1}. ${aw.title}\n`;
    md += `- **Issuer / Organization**: ${aw.issuer}\n`;
    md += `- **Year**: ${aw.year}\n`;
    md += `- **Scope / Significance**: ${aw.desc}\n\n`;
  });
  md += `---\n\n`;

  md += `## Professional Memberships & Scientific Societies\n\n`;
  const memberships = cvData.en.memberships || [];
  memberships.forEach((m, idx) => {
    md += `### ${idx + 1}. ${m.title}\n`;
    md += `- **Role / Status**: ${m.role}\n`;
    md += `- **Scope / Contribution**: ${m.desc}\n\n`;
  });
  md += `---\n\n`;

  md += `## Professional References\n\n`;
  const referencesList = cvData.en.references || [];
  referencesList.forEach((ref, idx) => {
    md += `${idx + 1}. **${ref.name}**\n`;
    md += `   - **Position**: ${ref.role}\n`;
    md += `   - **Affiliation**: ${ref.company}\n`;
    md += `   - **Contact / Relationship**: ${ref.contact} (${ref.relation})\n\n`;
  });

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
          text: p.name.toUpperCase(),
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
          text: `${p.title} | ${p.subtitle}`,
          bold: true,
          size: 20, // 10pt
          color: SECONDARY_COLOR,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: 'LinkedIn',
              size: 19,
              color: SECONDARY_COLOR,
              underline: {},
              font: 'Arial'
            })
          ],
          link: `https://${p.linkedin}`
        }),
        new TextRun({ text: '  |  ', size: 19, color: TEXT_MUTED, font: 'Arial' }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: 'Project Portofolio',
              size: 19,
              color: SECONDARY_COLOR,
              underline: {},
              font: 'Arial'
            })
          ],
          link: p.portfolio || 'https://gedemahendraw.github.io/'
        }),
        new TextRun({ text: '  |  ', size: 19, color: TEXT_MUTED, font: 'Arial' }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: `ORCID: ${p.orcid}`,
              size: 19,
              color: SECONDARY_COLOR,
              underline: {},
              font: 'Arial'
            })
          ],
          link: `https://orcid.org/${p.orcid}`
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180 },
      children: [
        new TextRun({
          text: `${p.location}  |  Email: ${p.email}  |  Phone/WA: ${p.phone}`,
          size: 18,
          color: TEXT_MUTED,
          font: 'Arial'
        })
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
        spacing: { before: 30, after: 30 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${st.value}: `, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `${st.label} - ${st.desc || ''}`, size: 20, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 3. Formal Education
  docChildren.push(...createSectionHeading('Formal Education & Academic Background'));
  const educations = cvData.en.education || [];
  educations.forEach((edu, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 30 },
        children: [
          new TextRun({ text: `${idx + 1}. ${edu.degree}`, bold: true, size: 21, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        indent: { left: 360 },
        children: [
          new TextRun({ text: `Institution: `, bold: true, size: 19, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `${edu.institution || edu.school} (${edu.period})`, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 20, after: 60 },
        indent: { left: 360 },
        children: [
          new TextRun({ text: `Curriculum Scope: `, bold: true, size: 19, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `${edu.details}`, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 4. Professional Experience
  docChildren.push(...createSectionHeading('Professional Experience & Career History'));
  exps.forEach((exp, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 30 },
        children: [
          new TextRun({ text: `${idx + 1}. ${exp.role}`, bold: true, size: 21, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `  |  ${exp.company}`, bold: true, size: 20, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 20, after: 40 },
        children: [
          new TextRun({ text: `${exp.location}  |  ${exp.period}`, italics: true, size: 18, color: TEXT_MUTED, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 20, after: 80 },
        alignment: AlignmentType.JUSTIFY,
        children: [
          new TextRun({ text: exp.description, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 5. Key Projects
  docChildren.push(...createSectionHeading(`Key Projects & Technical Deliverables (${projs.length} Projects)`));
  projs.forEach((proj, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${proj.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 30 },
        children: [
          new TextRun({ text: `Client: `, bold: true, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `${proj.client}  |  `, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `Period: `, bold: true, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `${proj.period}  |  `, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `Focus: `, bold: true, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: `${proj.category || proj.focus || 'GENERAL'}`, size: 18, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 20, after: 70 },
        alignment: AlignmentType.JUSTIFY,
        children: [
          new TextRun({ text: proj.desc, size: 19, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 6. Publications
  docChildren.push(...createSectionHeading(`Peer-Reviewed Publications & Papers (${pubs.length} Publications)`));
  pubs.forEach((pub, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 70, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${pub.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 60 },
        children: [
          new TextRun({ text: `${pub.authors} (${pub.year}). `, size: 18, color: TEXT_DARK, font: 'Arial' }),
          new TextRun({ text: `${pub.publisher || pub.journal}. `, italics: true, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: pub.link ? `DOI/Link: ${pub.link}` : '', size: 18, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      })
    );
  });

  // 7. Certifications
  docChildren.push(...createSectionHeading(`Professional Certifications & Specialized Training (${certs.length} Credentials)`));
  certs.forEach((cert, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 40, after: 20 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${cert.name} `, bold: true, size: 19, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: `— ${cert.issuer} (${cert.date})`, size: 18, color: TEXT_MUTED, font: 'Arial' }),
          new TextRun({ text: cert.credentialId ? ` [ID: ${cert.credentialId}]` : '', size: 17, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      })
    );
  });

  // 8. Awards
  docChildren.push(...createSectionHeading('Honors & National Innovation Awards'));
  const awards = cvData.en.awards || [];
  awards.forEach((aw, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${aw.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: ` — ${aw.issuer} (${aw.year})`, size: 18, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 50 },
        children: [
          new TextRun({ text: aw.desc, size: 18, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 9. Memberships
  docChildren.push(...createSectionHeading('Professional Memberships & Scientific Societies'));
  const memberships = cvData.en.memberships || [];
  memberships.forEach((m, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${m.title}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: ` — ${m.role}`, size: 18, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 50 },
        children: [
          new TextRun({ text: m.desc, size: 18, color: TEXT_DARK, font: 'Arial' })
        ]
      })
    );
  });

  // 10. References
  docChildren.push(...createSectionHeading('Professional References'));
  const refs = cvData.en.references || [];
  refs.forEach((ref, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. ${ref.name}`, bold: true, size: 20, color: PRIMARY_COLOR, font: 'Arial' }),
          new TextRun({ text: ` — ${ref.role}, ${ref.company}`, size: 18, color: SECONDARY_COLOR, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 50 },
        children: [
          new TextRun({ text: `Contact / Context: ${ref.contact} (${ref.relation})`, size: 18, color: TEXT_MUTED, font: 'Arial' })
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
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000
            }
          }
        },
        children: docChildren
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFile, buffer);
  fs.writeFileSync('I Gede Mahendra Wijaya_Master CV_latest.docx', buffer);
  console.log(`[Docx] Master Word CV generated successfully: ${outputFile} (${buffer.length} bytes)`);
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('sync_master_docx.js')) {
  console.log('Regenerating Master Word & Markdown CV...');
  console.log('[1/2] Generating Master Markdown CV...');
  generateMasterMarkdown();
  console.log('[2/2] Generating Master Word CV (.docx)...');
  generateMasterDocx().then(() => {
    console.log('\n======================================================');
    console.log('✓ MASTER CV SYNC COMPLETE (Markdown + Word + data.js)');
    console.log('======================================================\n');
  });
}
