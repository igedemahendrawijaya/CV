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

const ATS_BLACK = '000000'; // Pure Monochrome ATS Black

function createSectionHeading(title) {
  return [
    new Paragraph({
      spacing: { before: 240, after: 80 },
      keepNext: true,
      border: {
        bottom: {
          color: ATS_BLACK,
          space: 3,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: ATS_BLACK,
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
  const pubsExp = stats.find(s => s.label.includes('Publications'))?.value || `${pubs.length}`;

  let md = `# ${p.name.toUpperCase()}\n`;
  md += `**${p.title} | ${p.subtitle}**  \n`;
  md += `[LinkedIn](https://${p.linkedin}) | [Project Portfolio](${p.portfolio || 'https://gedemahendraw.github.io/'}) | [ORCID: ${p.orcid}](https://orcid.org/${p.orcid})  \n`;
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
    if (edu.faculty || edu.field) {
      md += `   - **Faculty / Program**: ${edu.faculty || edu.field}\n`;
    }
    md += `   - **Period**: ${edu.period}\n`;
    if (edu.details) {
      md += `   - **Focus / Details**: ${edu.details}\n`;
    }
    md += `\n`;
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
  md += `Over the past 13+ years, I Gede Mahendra Wijaya has directed, managed, and contributed to ${projects.length} high-impact multidisciplinary projects spanning marine environmental assessments, nature-based climate solutions, sustainable fisheries governance, and environmental and social compliance across the Indonesian archipelago. His technical involvement encompasses leading international financial institution (IFI) and UN-backed programs (World Bank, ADB, AFD, FAO, UNDP), directing large-scale AFOLU carbon feasibility and ecosystem restoration concessions (>200,000 ha), conducting ecological baselines, formulating ESMP/ESIA safeguards, and deploying digital marine monitoring technologies. Below is the detailed catalog of key project assignments, technical scopes, and deliverables.\n\n`;
  projects.forEach((proj, idx) => {
    md += `### ${idx + 1}. ${proj.title}\n`;
    md += `- **Client / Partner**: ${proj.client}\n`;
    md += `- **Period**: ${proj.period}\n`;
    md += `- **Category / Focus**: ${proj.category || proj.focus || 'GENERAL'}\n`;
    md += `- **Technical Scope & Output**: ${proj.description || proj.desc}\n\n`;
  });
  md += `---\n\n`;

  md += `## Peer-Reviewed Scientific Publications & Technical Papers (Total: ${pubs.length})\n\n`;
  pubs.forEach((pub, idx) => {
    md += `### ${idx + 1}. ${pub.title}\n`;
    if (pub.authors) {
      md += `- **Authors**: ${pub.authors}\n`;
    }
    md += `- **Year**: ${pub.year}\n`;
    md += `- **Publisher / Conference**: ${pub.publisher || pub.journal}\n`;
    if (pub.link) {
      md += `- **DOI / Link**: [${pub.link}](${pub.link})\n`;
    }
    if (pub.description) {
      md += `- **Scope / Summary**: ${pub.description}\n`;
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
    const awName = aw.name || aw.title;
    const awDesc = aw.description || aw.desc;
    md += `### ${idx + 1}. ${awName}\n`;
    md += `- **Issuer / Organization**: ${aw.issuer}\n`;
    md += `- **Year**: ${aw.year || aw.date}\n`;
    if (awDesc) {
      md += `- **Scope / Significance**: ${awDesc}\n`;
    }
    md += `\n`;
  });
  md += `---\n\n`;

  md += `## Professional Memberships & Scientific Societies\n\n`;
  const memberships = cvData.en.memberships || [];
  memberships.forEach((m, idx) => {
    const mName = m.name || m.title;
    const mDesc = m.description || m.desc;
    md += `### ${idx + 1}. ${mName}\n`;
    md += `- **Role / Status**: ${m.role}\n`;
    if (m.period) {
      md += `- **Period**: ${m.period}\n`;
    }
    if (mDesc) {
      md += `- **Scope / Contribution**: ${mDesc}\n`;
    }
    md += `\n`;
  });
  md += `---\n\n`;

  md += `## Professional References\n\n`;
  const referencesList = cvData.en.references || [];
  referencesList.forEach((ref, idx) => {
    md += `${idx + 1}. **${ref.name}**\n`;
    md += `   - **Position**: ${ref.role}\n`;
    md += `   - **Affiliation**: ${ref.company}\n`;
    md += `   - **Contact / Relationship**: ${ref.contact}${ref.relation ? ` (${ref.relation})` : ''}\n\n`;
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

  const portfolioUrl = p.portfolio || 'https://gedemahendraw.github.io/';
  const portfolioDisplay = portfolioUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const docChildren = [];

  // Header Title (Pure Black & White ATS Executive Header)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: p.name.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: ATS_BLACK,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: `${p.title} | ${p.subtitle}`,
          bold: true,
          size: 20, // 10pt
          color: ATS_BLACK,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: `${p.location}  |  ${p.email}  |  ${p.phone}`,
          size: 19, // 9.5pt
          color: ATS_BLACK,
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({ text: 'LinkedIn: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: p.linkedin,
              size: 18,
              color: ATS_BLACK,
              underline: {},
              font: 'Arial'
            })
          ],
          link: `https://${p.linkedin}`
        }),
        new TextRun({ text: '  |  ', size: 18, color: ATS_BLACK, font: 'Arial' }),
        new TextRun({ text: 'Portfolio: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: portfolioDisplay,
              size: 18,
              color: ATS_BLACK,
              underline: {},
              font: 'Arial'
            })
          ],
          link: portfolioUrl
        }),
        new TextRun({ text: '  |  ', size: 18, color: ATS_BLACK, font: 'Arial' }),
        new TextRun({ text: 'ORCID: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: p.orcid,
              size: 18,
              color: ATS_BLACK,
              underline: {},
              font: 'Arial'
            })
          ],
          link: `https://orcid.org/${p.orcid}`
        })
      ]
    })
  );

  // 1. Professional Summary
  docChildren.push(...createSectionHeading('Professional Summary'));
  docChildren.push(
    new Paragraph({
      spacing: { before: 60, after: 100 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: p.profileSummary,
          size: 20, // 10pt
          color: ATS_BLACK,
          font: 'Arial'
        })
      ]
    })
  );

  // 2. Core Career Highlights
  docChildren.push(...createSectionHeading('Core Career Highlights'));
  stats.forEach(st => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 30, after: 30 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${st.value} `, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: st.desc ? `${st.label} - ${st.desc}` : st.label, size: 20, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
  });

  // 3. Education
  docChildren.push(...createSectionHeading('Education'));
  const educations = cvData.en.education || [];
  educations.forEach((edu) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 20 },
        keepNext: true,
        children: [
          new TextRun({ text: edu.degree, bold: true, size: 21, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: edu.details ? 20 : 60 },
        keepNext: Boolean(edu.details),
        children: [
          new TextRun({ text: `${edu.institution || edu.school}`, bold: true, size: 19, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${edu.period}`, italics: true, size: 19, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
    if (edu.details) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 10, after: 60 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: 'Curriculum Focus: ', bold: true, size: 19, color: ATS_BLACK, font: 'Arial' }),
            new TextRun({ text: `${edu.details}`, size: 19, color: ATS_BLACK, font: 'Arial' })
          ]
        })
      );
    }
  });

  // 4. Professional Experience
  docChildren.push(...createSectionHeading('Professional Experience'));
  exps.forEach((exp) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 20 },
        keepNext: true,
        children: [
          new TextRun({ text: exp.role, bold: true, size: 21, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${exp.company}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 40 },
        keepNext: true,
        children: [
          new TextRun({ text: `${exp.location} | ${exp.period}`, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: exp.description, size: 19, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
  });

  // 5. Key Projects & Technical Deliverables
  docChildren.push(...createSectionHeading(`Key Projects & Technical Deliverables (${projs.length} Projects)`));
  
  docChildren.push(
    new Paragraph({
      spacing: { before: 60, after: 100 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `Over the past 13+ years, I Gede Mahendra Wijaya has directed, managed, and contributed to ${projs.length} high-impact multidisciplinary projects spanning marine environmental assessments, nature-based climate solutions, sustainable fisheries governance, and environmental and social compliance across the Indonesian archipelago. His technical involvement encompasses leading international financial institution (IFI) and UN-backed programs (World Bank, ADB, AFD, FAO, UNDP), directing large-scale AFOLU carbon feasibility and ecosystem restoration concessions (>200,000 ha), conducting ecological baselines, formulating ESMP/ESIA safeguards, and deploying digital marine monitoring technologies. Below is the detailed catalog of key project assignments, technical scopes, and deliverables.`,
          size: 19,
          color: ATS_BLACK,
          font: 'Arial'
        })
      ]
    })
  );

  projs.forEach((proj, idx) => {
    const projDesc = proj.description || proj.desc || '';
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 20 },
        keepNext: true,
        children: [
          new TextRun({ text: `${idx + 1}. ${proj.title}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 30 },
        keepNext: true,
        children: [
          new TextRun({ text: 'Client: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: `${proj.client} | `, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: 'Period: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: `${proj.period} | `, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: 'Focus: ', bold: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: `${proj.category || proj.focus || 'GENERAL'}`, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 70 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: projDesc, size: 19, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
  });

  // 6. Publications & Technical Papers
  docChildren.push(...createSectionHeading(`Publications & Technical Papers (${pubs.length} Publications)`));
  pubs.forEach((pub, idx) => {
    const pubAuthors = pub.authors ? `${pub.authors} (${pub.year}). ` : `(${pub.year}). `;
    const pubPub = pub.publisher || pub.journal ? `${pub.publisher || pub.journal}. ` : '';
    const pubLink = pub.link ? `DOI/Link: ${pub.link}` : '';

    docChildren.push(
      new Paragraph({
        spacing: { before: 70, after: 20 },
        keepNext: true,
        children: [
          new TextRun({ text: `${idx + 1}. ${pub.title}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: pub.description ? 20 : 60 },
        keepNext: Boolean(pub.description),
        children: [
          new TextRun({ text: pubAuthors, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: pubPub, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: pubLink, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );

    if (pub.description) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 10, after: 60 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: pub.description, size: 18, color: ATS_BLACK, font: 'Arial' })
          ]
        })
      );
    }
  });

  // 7. Certifications & Specialized Training
  docChildren.push(...createSectionHeading(`Certifications & Specialized Training (${certs.length} Credentials)`));
  certs.forEach((cert) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 35, after: 20 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${cert.name}`, bold: true, size: 19, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${cert.issuer} (${cert.date})`, size: 18, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: cert.credentialId ? ` [ID: ${cert.credentialId}]` : '', italics: true, size: 17, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
  });

  // 8. Honors & Awards
  const awards = cvData.en.awards || [];
  docChildren.push(...createSectionHeading(`Honors & Awards (${awards.length} Honors)`));
  awards.forEach((aw, idx) => {
    const awName = aw.name || aw.title || '';
    const awDesc = aw.description || aw.desc || '';
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        keepNext: Boolean(awDesc),
        children: [
          new TextRun({ text: `${idx + 1}. ${awName}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${aw.issuer} (${aw.year || aw.date})`, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
    if (awDesc) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 10, after: 50 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: awDesc, size: 18, color: ATS_BLACK, font: 'Arial' })
          ]
        })
      );
    }
  });

  // 9. Professional Memberships
  const memberships = cvData.en.memberships || [];
  docChildren.push(...createSectionHeading('Professional Memberships'));
  memberships.forEach((m, idx) => {
    const mName = m.name || m.title || '';
    const mDesc = m.description || m.desc || '';
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        keepNext: Boolean(mDesc),
        children: [
          new TextRun({ text: `${idx + 1}. ${mName}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${m.role}${m.period ? ` (${m.period})` : ''}`, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
    if (mDesc) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 10, after: 50 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: mDesc, size: 18, color: ATS_BLACK, font: 'Arial' })
          ]
        })
      );
    }
  });

  // 10. Professional References
  docChildren.push(...createSectionHeading('Professional References'));
  const refs = cvData.en.references || [];
  refs.forEach((ref, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 60, after: 20 },
        keepNext: true,
        children: [
          new TextRun({ text: `${idx + 1}. ${ref.name}`, bold: true, size: 20, color: ATS_BLACK, font: 'Arial' }),
          new TextRun({ text: ` | ${ref.role}, ${ref.company}`, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      }),
      new Paragraph({
        spacing: { before: 10, after: 50 },
        children: [
          new TextRun({ text: `Contact / Context: ${ref.contact}${ref.relation ? ` (${ref.relation})` : ''}`, italics: true, size: 18, color: ATS_BLACK, font: 'Arial' })
        ]
      })
    );
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 20,
            color: ATS_BLACK
          }
        },
        hyperlink: {
          run: {
            color: ATS_BLACK,
            underline: {}
          }
        }
      }
    },
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
  try {
    fs.writeFileSync(outputFile, buffer);
    console.log(`[Docx] Master Word CV generated successfully: ${outputFile} (${buffer.length} bytes)`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`[Docx Warning] File ${outputFile} sedang dibuka di Microsoft Word. Harap tutup Word agar berkas ini dapat diperbarui.`);
    } else {
      throw err;
    }
  }
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
