import { jsPDF } from 'jspdf';
import type { Lecture, TranscriptChunk } from '../types';
import { formatTime, formatDuration } from './formatTime';
import { LECTURE_CURRICULUM } from '../data/lectureCurriculum';

export async function generateLecturePdfSummary(
  lecture: Lecture,
  chunks: TranscriptChunk[] = []
): Promise<void> {
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

  const cleanNum = lecture.number ? String(parseInt(lecture.number, 10)) : "1";
  const curriculum = LECTURE_CURRICULUM[cleanNum] || {
    title: lecture.title,
    category: "Web Development Curriculum",
    overview: `In this lecture, the instructor introduces the foundational concepts of ${lecture.title}. The lesson covers conceptual definitions, structural syntax, practical code examples, and best development practices.`,
    theory: [
      {
        subheading: `1. Core Principles of ${lecture.title}`,
        content: `This video explores ${lecture.title}. It provides step-by-step explanations of the relevant syntax, browser rendering behavior, and hands-on examples that form the backbone of modern web engineering.`,
      },
    ],
    code_samples: [],
    reference_table: [],
    milestones: [],
    key_takeaways: [
      `Master the core principles of ${lecture.title}.`,
      "Write clean, semantic, and standards-compliant code.",
      "Test layouts and inspect elements using modern browser Developer Tools.",
    ],
    pitfalls: [
      "Avoid skipping fundamental syntax rules and always validate your markup in the browser.",
    ],
    exercise: "Replicate the code examples in your local code editor and verify the output in the browser.",
    quiz: [
      {
        question: `What is the primary purpose of ${lecture.title}?`,
        answer: `It provides the essential tools and architectural patterns required to build modern, responsive web applications.`,
      },
    ],
  };

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
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(205, 225, 220);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'S');

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
  const durationText = lecture.duration > 0 ? formatDuration(lecture.duration) : 'Full Video Course';
  const totalChunks = chunks.length > 0 ? chunks.length : lecture.chunk_count || 300;
  const metaText = `Duration: ${durationText}   •   Segments: ${totalChunks}   •   Level: Beginner to Pro   •   Complete Video Replacement Edition`;
  doc.text(metaText, margin + 6, y + 32);

  y += 45;

  // ─── 2. Executive Overview ──────────────────────────────────
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(74, 124, 111);
  doc.text('1. Executive Overview & Learning Purpose', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(40, 40, 40);
  const overviewLines = doc.splitTextToSize(curriculum.overview, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 4.5 + 7;

  // ─── 3. In-Depth Theory & Conceptual Deep-Dive ───────────────
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(74, 124, 111);
  doc.text('2. Comprehensive Concept Breakdown (Theory)', margin, y);
  y += 6;

  for (const item of curriculum.theory) {
    const subLines = doc.splitTextToSize(item.subheading, contentWidth);
    const contentLines = doc.splitTextToSize(item.content, contentWidth - 4);
    const needed = subLines.length * 5 + contentLines.length * 4.5 + 6;

    checkPageBreak(needed);

    // Subheading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(24, 30, 40);
    doc.text(subLines, margin, y);
    y += subLines.length * 4.8;

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.1);
    doc.setTextColor(50, 50, 50);
    doc.text(contentLines, margin + 2, y);
    y += contentLines.length * 4.4 + 5;
  }

  // ─── 4. Code Architecture & Production Examples ─────────────
  if (curriculum.code_samples && curriculum.code_samples.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('3. Code Syntax & Practical Implementation', margin, y);
    y += 5.5;

    for (const sample of curriculum.code_samples) {
      const codeLines = sample.code.split('\n');
      const boxHeight = codeLines.length * 4.2 + 12;

      checkPageBreak(boxHeight + 10);

      // Caption
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 70, 70);
      doc.text(`▸ ${sample.caption}`, margin, y);
      y += 4;

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
    }
  }

  // ─── 5. Technical Reference Matrix (Table) ──────────────────
  if (curriculum.reference_table && curriculum.reference_table.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('4. Technical Reference Matrix', margin, y);
    y += 6;

    // Table Header
    doc.setFillColor(235, 243, 240);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(40, 70, 60);
    doc.text('Concept / Tag / Tool', margin + 3, y + 4.8);
    doc.text('Category', margin + 48, y + 4.8);
    doc.text('Technical Role & Specification', margin + 92, y + 4.8);
    y += 8.5;

    // Rows
    for (let r = 0; r < curriculum.reference_table.length; r++) {
      const row = curriculum.reference_table[r];
      const descLines = doc.splitTextToSize(row.description, contentWidth - 96);
      const rowHeight = Math.max(6.5, descLines.length * 4 + 3);

      checkPageBreak(rowHeight + 3);

      if (r % 2 === 1) {
        doc.setFillColor(250, 252, 251);
        doc.rect(margin, y - 1.5, contentWidth, rowHeight, 'F');
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(30, 30, 30);
      doc.text(row.item, margin + 3, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(80, 80, 80);
      doc.text(row.type, margin + 48, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(descLines, margin + 92, y + 3);

      y += rowHeight;
    }
    y += 4;
  }

  // ─── 6. Video Timeline & Storyboard Milestones ──────────────
  const activeMilestones = (curriculum.milestones && curriculum.milestones.length > 0)
    ? curriculum.milestones
    : (chunks && chunks.length > 0)
      ? chunks.filter((_, idx) => idx % Math.max(1, Math.floor(chunks.length / 6)) === 0).slice(0, 6).map(c => ({
          time: formatTime(c.start),
          text: c.text.trim().replace(/\s+/g, ' '),
        }))
      : [];

  if (activeMilestones.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('5. Video Timeline & Segment Milestones', margin, y);
    y += 6;

    for (const m of activeMilestones) {
      const noteLines = doc.splitTextToSize(m.text, contentWidth - 28);
      const boxHeight = Math.max(9.5, noteLines.length * 4.1 + 4.5);

      checkPageBreak(boxHeight + 4);

      // Timestamp badge
      doc.setFillColor(237, 244, 241);
      doc.roundedRect(margin, y, 20, 5.8, 1.5, 1.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(74, 124, 111);
      doc.text(m.time, margin + 10, y + 4.2, { align: 'center' });

      // Note content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(50, 50, 50);
      doc.text(noteLines, margin + 24, y + 4.2);

      y += boxHeight + 2;
    }
    y += 4;
  }

  // ─── 7. Key Takeaways Checklist ──────────────────────────────
  if (curriculum.key_takeaways && curriculum.key_takeaways.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('6. Core Takeaways & Developer Best Practices', margin, y);
    y += 6;

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
    y += 4;
  }

  // ─── 8. Common Pitfalls & Mistakes to Avoid ──────────────────
  if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(180, 40, 40);
    doc.text('7. Common Beginner Pitfalls & How to Avoid Them', margin, y);
    y += 5.5;

    for (const pitfall of curriculum.pitfalls) {
      const lines = doc.splitTextToSize(pitfall, contentWidth - 26);
      const boxHeight = lines.length * 4.3 + 7;

      checkPageBreak(boxHeight + 4);

      // Warning Card
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(185, 28, 28);
      doc.text('⚠️ PITFALL:', margin + 4, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(127, 29, 29);
      doc.text(lines, margin + 22, y + 4.8);

      y += boxHeight + 4;
    }
    y += 4;
  }

  // ─── 9. Practical Coding Exercise ────────────────────────────
  if (curriculum.exercise) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('8. Hands-On Coding Assignment & Challenge', margin, y);
    y += 5.5;

    const exLines = doc.splitTextToSize(curriculum.exercise, contentWidth - 10);
    const boxHeight = exLines.length * 4.4 + 9;

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

    y += boxHeight + 6;
  }

  // ─── 10. Active Recall Examination & Solutions ──────────────
  if (curriculum.quiz && curriculum.quiz.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('9. Examination & Technical Interview Questions', margin, y);
    y += 6;

    curriculum.quiz.forEach((q, idx) => {
      const qLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, contentWidth - 4);
      const aLines = doc.splitTextToSize(`Model Answer: ${q.answer}`, contentWidth - 8);
      const needed = qLines.length * 4.5 + aLines.length * 4.2 + 8;

      checkPageBreak(needed);

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.1);
      doc.setTextColor(30, 41, 59);
      doc.text(qLines, margin, y);
      y += qLines.length * 4.5 + 1.5;

      // Answer explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(60, 60, 60);
      doc.text(aLines, margin + 4, y);
      y += aLines.length * 4.2 + 5;
    });
  }

  // ─── Two-Pass Page Numbering ("Page X of Y") ────────────────
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
