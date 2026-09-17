import { jsPDF } from 'jspdf';
import type { Lecture, TranscriptChunk } from '../types';
import { formatDuration } from './formatTime';
import { LECTURE_CURRICULUM, type LectureCurriculum } from '../data/lectureCurriculum';

interface TimelineSegment {
  timeRange: string;
  summary: string;
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function buildChronologicalStory(chunks: TranscriptChunk[], curriculum: LectureCurriculum): TimelineSegment[] {
  if (chunks && chunks.length > 0) {
    const totalDuration = chunks[chunks.length - 1].end || 1200;
    const targetSegments = 14; // 14 chronological moments across the full video
    const interval = Math.max(50, totalDuration / targetSegments);

    const segments: TimelineSegment[] = [];
    let currentGroup: TranscriptChunk[] = [];
    let segmentStart = chunks[0].start || 0;
    let nextBoundary = segmentStart + interval;

    for (const c of chunks) {
      if (c.end >= nextBoundary && currentGroup.length > 0) {
        const text = currentGroup
          .map((x) => x.text.trim())
          .join(' ')
          .replace(/\s+/g, ' ');

        segments.push({
          timeRange: `${formatSeconds(segmentStart)} – ${formatSeconds(c.start)}`,
          summary: text.length > 340 ? text.slice(0, 337) + '...' : text,
        });

        currentGroup = [c];
        segmentStart = c.start;
        nextBoundary += interval;
      } else {
        currentGroup.push(c);
      }
    }

    if (currentGroup.length > 0) {
      const last = currentGroup[currentGroup.length - 1];
      const text = currentGroup
        .map((x) => x.text.trim())
        .join(' ')
        .replace(/\s+/g, ' ');

      segments.push({
        timeRange: `${formatSeconds(segmentStart)} – ${formatSeconds(last.end)}`,
        summary: text.length > 340 ? text.slice(0, 337) + '...' : text,
      });
    }

    return segments.slice(0, 16);
  }

  // Fallback to milestones if transcript chunks not provided
  if (curriculum.milestones && curriculum.milestones.length > 0) {
    return curriculum.milestones.map((m) => ({
      timeRange: m.time,
      summary: m.text,
    }));
  }

  return [];
}

export async function generateLecturePdfSummary(
  lecture: Lecture,
  chunks: TranscriptChunk[] = []
): Promise<void> {
  const cleanNum = lecture.number ? String(parseInt(lecture.number, 10)) : '1';

  // 1. Ensure full transcript chunks are loaded if empty
  let activeChunks = chunks;
  if (!activeChunks || activeChunks.length === 0) {
    try {
      const res = await fetch(`/transcripts/${cleanNum}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.chunks && data.chunks.length > 0) {
          activeChunks = data.chunks;
        }
      }
    } catch {
      // Proceed with available curriculum data
    }
  }

  const curriculum: LectureCurriculum = LECTURE_CURRICULUM[cleanNum] || {
    title: lecture.title,
    category: 'Full Stack Web Development Curriculum',
    overview: `In this lecture of the Sigma Web Development Course, the instructor explains the core mechanics of ${lecture.title}. The lesson covers technical definitions, structural principles, live coding demos, and professional web engineering best practices.`,
    theory: [
      {
        subheading: `1. Core Architecture of ${lecture.title}`,
        content: `This video explores ${lecture.title} from first principles. It provides step-by-step explanations of the relevant syntax, browser rendering behaviors, and practical examples essential for modern web applications.`,
      },
      {
        subheading: `2. Browser Execution & The Document Object Model (DOM)`,
        content: `Web browsers parse raw HTML into an in-memory tree of nodes known as the DOM. Understanding how elements nest and inherit styles ensures that your webpages render reliably across desktop and mobile devices.`,
      },
    ],
    code_samples: [
      {
        caption: `Starter implementation for ${lecture.title}`,
        code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>${lecture.title}</title>\n</head>\n<body>\n    <h1>${lecture.title} Demo</h1>\n    <p>Code examples and production markup.</p>\n</body>\n</html>`,
      },
    ],
    reference_table: [
      {
        item: lecture.title,
        type: 'Core Concept',
        description: `Fundamental building block taught in Lecture ${lecture.number}.`,
      },
    ],
    milestones: [],
    key_takeaways: [
      `Master the core architectural concepts of ${lecture.title}.`,
      'Write clean, accessible, and standards-compliant production markup.',
      'Inspect elements and debug styles using modern browser Developer Tools.',
      'Organize your project directory with consistent file and folder naming.',
    ],
    pitfalls: [
      'Avoid skipping foundational syntax rules; always validate code directly in the browser.',
      'Do not overlook accessibility attributes or mobile responsive breakpoints.',
    ],
    exercise: `Create a new project folder, scaffold the code examples demonstrated in Video ${lecture.number}, and verify the rendering in your web browser.`,
    quiz: [
      {
        question: `What is the primary technical purpose of ${lecture.title}?`,
        answer: `It provides the foundational structures and design patterns required to build responsive, accessible, and high-performance web applications.`,
      },
    ],
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeaderStrip = () => {
    doc.setFillColor(74, 124, 111); // Brand Accent (#4A7C6F)
    doc.rect(margin, y, contentWidth, 1.2, 'F');
    y += 6;
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin;
      addHeaderStrip();
    }
  };

  // ─── 1. Header Banner ───────────────────────────────────────
  doc.setFillColor(245, 248, 247);
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
  doc.setDrawColor(205, 225, 220);
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'S');

  // Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 124, 111);
  doc.text(`🎓 LECTUREAI MASTER STUDY GUIDE · ${curriculum.category.toUpperCase()}`, margin + 6, y + 8);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 23, 23);
  const titleLines = doc.splitTextToSize(`Video ${lecture.number}: ${curriculum.title}`, contentWidth - 12);
  doc.text(titleLines, margin + 6, y + 17);

  // Metadata Bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(85, 85, 85);
  const durationText = lecture.duration > 0 ? formatDuration(lecture.duration) : 'Full Course Lecture';
  const totalChunks = activeChunks.length > 0 ? activeChunks.length : lecture.chunk_count || 300;
  const metaText = `Duration: ${durationText}   •   Subtitles: ${totalChunks} Segments   •   Complete Video Replacement Edition`;
  doc.text(metaText, margin + 6, y + 33);

  y += 48;

  // ─── 2. Executive Overview & Learning Objectives ───────────
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(74, 124, 111);
  doc.text('1. Executive Overview & Course Objectives', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(40, 40, 40);
  const overviewLines = doc.splitTextToSize(curriculum.overview, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 4.6 + 6;

  // Learning Objectives Checklist
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.6);
  doc.setTextColor(30, 30, 30);
  doc.text('Target Learning Competencies:', margin, y);
  y += 5.5;

  const objectives = [
    `Master the fundamental architecture and operational mechanics of ${curriculum.title}.`,
    'Understand client-server data flow, DOM parsing, and browser rendering lifecycles.',
    'Write clean, modular, semantic, and standards-compliant production markup.',
    'Diagnose, inspect, and debug layout anomalies using modern browser Developer Tools.',
    'Implement industry-grade best practices for accessibility, responsiveness, and maintainability.',
  ];

  for (const obj of objectives) {
    const oLines = doc.splitTextToSize(obj, contentWidth - 8);
    checkPageBreak(oLines.length * 4.4 + 3);
    doc.setFillColor(74, 124, 111);
    doc.circle(margin + 2.5, y - 1, 1.1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 45, 45);
    doc.text(oLines, margin + 7, y);
    y += oLines.length * 4.4 + 2.5;
  }
  y += 5;

  // ─── 3. In-Depth Theory & Conceptual Deep-Dive ───────────────
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(74, 124, 111);
  doc.text('2. Comprehensive First-Principles Theory Breakdown', margin, y);
  y += 6.5;

  for (let i = 0; i < curriculum.theory.length; i++) {
    const item = curriculum.theory[i];
    const subLines = doc.splitTextToSize(item.subheading, contentWidth);
    const contentLines = doc.splitTextToSize(item.content, contentWidth - 4);
    const needed = subLines.length * 5 + contentLines.length * 4.6 + 8;

    checkPageBreak(needed);

    // Subheading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 30, 40);
    doc.text(subLines, margin, y);
    y += subLines.length * 5 + 1.5;

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.1);
    doc.setTextColor(50, 50, 50);
    doc.text(contentLines, margin + 2, y);
    y += contentLines.length * 4.6 + 6;
  }

  // ─── 4. Code Architecture & Production Laboratory ───────────
  if (curriculum.code_samples && curriculum.code_samples.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('3. Code Architecture & Practical Production Laboratory', margin, y);
    y += 6;

    for (const sample of curriculum.code_samples) {
      const codeLines = sample.code.split('\n');
      const boxHeight = codeLines.length * 4.2 + 12;

      checkPageBreak(boxHeight + 25);

      // Caption
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(60, 60, 60);
      doc.text(`▸ Implementation: ${sample.caption}`, margin, y);
      y += 4.5;

      // Code Card Background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

      // Monospace Code Lines
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(30, 41, 59);

      let codeY = y + 5;
      for (const line of codeLines) {
        doc.text(line, margin + 4, codeY);
        codeY += 4.2;
      }

      y += boxHeight + 6;

      // Architectural Code Analysis
      checkPageBreak(25);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(65, 65, 65);
      const codeExplLines = doc.splitTextToSize(
        `Architectural Analysis: The code example above implements standards-compliant syntax. Each tag is mapped into the Document Object Model (DOM) tree by the browser rendering engine. Inline and block scopes are preserved, ensuring clean accessibility tree generation and predictable CSS layout calculation.`,
        contentWidth - 4
      );
      doc.text(codeExplLines, margin + 2, y);
      y += codeExplLines.length * 4.3 + 6;
    }
  }

  // ─── 5. Technical Reference Matrix ──────────────────────────
  if (curriculum.reference_table && curriculum.reference_table.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('4. Technical Reference Matrix & Specifications', margin, y);
    y += 6.5;

    // Table Header
    doc.setFillColor(235, 243, 240);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(40, 70, 60);
    doc.text('Concept / Tag / Attribute', margin + 3, y + 4.8);
    doc.text('Category', margin + 50, y + 4.8);
    doc.text('Technical Role & Production Specification', margin + 92, y + 4.8);
    y += 8.5;

    // Rows
    for (let r = 0; r < curriculum.reference_table.length; r++) {
      const row = curriculum.reference_table[r];
      const descLines = doc.splitTextToSize(row.description, contentWidth - 96);
      const rowHeight = Math.max(6.8, descLines.length * 4.2 + 3.5);

      checkPageBreak(rowHeight + 3);

      if (r % 2 === 1) {
        doc.setFillColor(250, 252, 251);
        doc.rect(margin, y - 1.5, contentWidth, rowHeight, 'F');
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(30, 30, 30);
      doc.text(row.item, margin + 3, y + 3.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(row.type, margin + 50, y + 3.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(50, 50, 50);
      doc.text(descLines, margin + 92, y + 3.2);

      y += rowHeight;
    }
    y += 6;
  }

  // ─── 6. Chronological Storyboard & Transcript Walkthrough ──
  const timelineSegments = buildChronologicalStory(activeChunks, curriculum);
  if (timelineSegments.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('5. Video Lecture Storyboard & Spoken Transcript Chronicle', margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text(
      'Follow along minute-by-minute with what the instructor explains and demonstrates throughout the lecture:',
      margin,
      y + 2
    );
    y += 7.5;

    for (const seg of timelineSegments) {
      const sLines = doc.splitTextToSize(seg.summary, contentWidth - 32);
      const boxHeight = Math.max(12, sLines.length * 4.2 + 6);

      checkPageBreak(boxHeight + 4);

      // Timestamp badge
      doc.setFillColor(237, 244, 241);
      doc.roundedRect(margin, y, 26, 6, 1.5, 1.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(74, 124, 111);
      doc.text(seg.timeRange, margin + 13, y + 4.3, { align: 'center' });

      // Note content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(45, 45, 45);
      doc.text(sLines, margin + 30, y + 4.3);

      y += boxHeight + 3.5;
    }
    y += 5;
  }

  // ─── 7. Core Takeaways & Developer Best Practices ────────────
  if (curriculum.key_takeaways && curriculum.key_takeaways.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('6. Core Takeaways & Architectural Best Practices', margin, y);
    y += 6.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.1);

    for (const takeaway of curriculum.key_takeaways) {
      const lines = doc.splitTextToSize(takeaway, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 3);

      doc.setFillColor(74, 124, 111);
      doc.circle(margin + 2.5, y - 1, 1.2, 'F');
      doc.setTextColor(35, 35, 35);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.5 + 2.5;
    }
    y += 5;
  }

  // ─── 8. Common Beginner Pitfalls & Traps ──────────────────────
  if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(180, 40, 40);
    doc.text('7. Common Beginner Pitfalls & How to Avoid Them', margin, y);
    y += 6;

    for (const pitfall of curriculum.pitfalls) {
      const lines = doc.splitTextToSize(pitfall, contentWidth - 26);
      const boxHeight = lines.length * 4.3 + 8;

      checkPageBreak(boxHeight + 4);

      // Warning Card
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(185, 28, 28);
      doc.text('⚠️ PITFALL:', margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(127, 29, 29);
      doc.text(lines, margin + 24, y + 5);

      y += boxHeight + 4;
    }
    y += 5;
  }

  // ─── 9. Practical Coding Exercise & Lab ───────────────────────
  if (curriculum.exercise) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('8. Hands-On Coding Lab Challenge', margin, y);
    y += 6;

    const exLines = doc.splitTextToSize(curriculum.exercise, contentWidth - 10);
    const boxHeight = exLines.length * 4.4 + 11;

    checkPageBreak(boxHeight + 4);

    doc.setFillColor(243, 248, 246);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(200, 224, 218);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 90, 75);
    doc.text('💻 PRACTICAL LAB TASK:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(40, 50, 45);
    doc.text(exLines, margin + 4, y + 10);

    y += boxHeight + 7;
  }

  // ─── 10. Active Recall Examination & Solutions ───────────────
  if (curriculum.quiz && curriculum.quiz.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(74, 124, 111);
    doc.text('9. Technical Interview & Examination Preparation', margin, y);
    y += 6.5;

    curriculum.quiz.forEach((q, idx) => {
      const qLines = doc.splitTextToSize(`Question ${idx + 1}: ${q.question}`, contentWidth - 4);
      const aLines = doc.splitTextToSize(`Model Answer: ${q.answer}`, contentWidth - 8);
      const needed = qLines.length * 4.6 + aLines.length * 4.3 + 9;

      checkPageBreak(needed);

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(30, 41, 59);
      doc.text(qLines, margin, y);
      y += qLines.length * 4.6 + 1.8;

      // Answer explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(60, 60, 60);
      doc.text(aLines, margin + 4, y);
      y += aLines.length * 4.3 + 6;
    });
  }

  // ─── 11. Next Steps & Mastery Roadmap ────────────────────────
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(74, 124, 111);
  doc.text('10. Next Steps in Your Learning Journey', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(60, 60, 60);
  const nextNum = parseInt(cleanNum, 10) + 1;
  const nextNote = `You have completed the comprehensive study guide for Video ${cleanNum}: ${curriculum.title}. Make sure to write out the code samples locally and experiment with the developer tools before continuing to Video ${nextNum}. Mastery comes from building!`;
  const nextLines = doc.splitTextToSize(nextNote, contentWidth);
  doc.text(nextLines, margin, y);
  y += nextLines.length * 4.4 + 4;

  // ─── Two-Pass Page Numbering ("Page X of Y") ─────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(
      `LectureAI Master Study Guide · Video ${lecture.number}: ${curriculum.title}`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Save the PDF
  const filename = `Lecture_${lecture.number}_${curriculum.title.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Study_Guide.pdf`;
  doc.save(filename);
}
