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

  // Clean lecture number lookup
  const cleanNum = lecture.number ? String(parseInt(lecture.number, 10)) : "1";
  const curriculum = LECTURE_CURRICULUM[cleanNum] || {
    title: lecture.title,
    category: "Web Development Curriculum",
    overview: `In this lecture, the instructor introduces the key concepts of ${lecture.title}. Students learn foundational principles, structural syntax, best coding practices, and practical debugging techniques.`,
    theory: [
      {
        subheading: "Core Concepts & Architecture",
        content: `This video explores ${lecture.title}. It provides step-by-step explanations of the relevant syntax, browser rendering behavior, and hands-on examples that form the backbone of modern web engineering.`,
      },
    ],
    code_samples: [],
    key_takeaways: [
      `Master the core principles of ${lecture.title}.`,
      "Write clean, semantic, and standards-compliant code.",
      "Test layouts and inspect elements using modern browser Developer Tools.",
    ],
    pitfalls: [
      "Avoid skipping fundamental syntax rules and always validate your markup in the browser.",
    ],
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
    y += 5;
  };

  const addFooter = (currentPage: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text(
      `LectureAI Master Study Notes · Video ${lecture.number}: ${lecture.title}`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${currentPage}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      addFooter(doc.getNumberOfPages());
      doc.addPage();
      y = margin;
      addHeaderStrip();
    }
  };

  // ─── 1. Header Banner ───────────────────────────────────────
  doc.setFillColor(245, 248, 247);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'F');
  doc.setDrawColor(210, 226, 222);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'S');

  // Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 124, 111);
  doc.text(`🎓 LECTUREAI MASTER STUDY GUIDE · ${curriculum.category.toUpperCase()}`, margin + 6, y + 7.5);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(23, 23, 23);
  const titleLines = doc.splitTextToSize(`Video ${lecture.number}: ${curriculum.title}`, contentWidth - 12);
  doc.text(titleLines, margin + 6, y + 16);

  // Meta stats pill
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  const durationText = lecture.duration > 0 ? formatDuration(lecture.duration) : 'Full Video Course';
  const chunkCount = chunks.length > 0 ? chunks.length : lecture.chunk_count || 300;
  const metaText = `Duration: ${durationText}   •   Segments: ${chunkCount}   •   Level: Beginner to Professional   •   Comprehensive Study Edition`;
  doc.text(metaText, margin + 6, y + 30.5);

  y += 43;

  // ─── 2. Executive Overview ──────────────────────────────────
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(74, 124, 111);
  doc.text('1. Executive Overview & Learning Purpose', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  const overviewLines = doc.splitTextToSize(curriculum.overview, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 4.5 + 6;

  // ─── 3. In-Depth Theory & Conceptual Deep-Dive ───────────────
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(74, 124, 111);
  doc.text('2. Comprehensive Concept Breakdown', margin, y);
  y += 6;

  for (const item of curriculum.theory) {
    const subLines = doc.splitTextToSize(item.subheading, contentWidth);
    const contentLines = doc.splitTextToSize(item.content, contentWidth - 4);
    const needed = subLines.length * 5 + contentLines.length * 4.5 + 6;

    checkPageBreak(needed);

    // Subheading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 30, 40);
    doc.text(subLines, margin, y);
    y += subLines.length * 4.8;

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(50, 50, 50);
    doc.text(contentLines, margin + 2, y);
    y += contentLines.length * 4.4 + 4.5;
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
      doc.setTextColor(80, 80, 80);
      doc.text(`▸ ${sample.caption}`, margin, y);
      y += 4;

      // Code Card Background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

      // Monospace Code Lines
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      let codeY = y + 5;
      for (const line of codeLines) {
        doc.text(line, margin + 4, codeY);
        codeY += 4.2;
      }

      y += boxHeight + 6;
    }
  }

  // ─── 5. Key Takeaways Checklist ──────────────────────────────
  if (curriculum.key_takeaways && curriculum.key_takeaways.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('4. Core Takeaways & Developer Best Practices', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);

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

  // ─── 6. Common Pitfalls & Mistakes to Avoid ──────────────────
  if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(180, 40, 40);
    doc.text('5. Common Beginner Pitfalls & How to Avoid Them', margin, y);
    y += 5.5;

    for (const pitfall of curriculum.pitfalls) {
      const lines = doc.splitTextToSize(pitfall, contentWidth - 12);
      const boxHeight = lines.length * 4.4 + 7;

      checkPageBreak(boxHeight + 4);

      // Warning Card
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(185, 28, 28);
      doc.text('⚠️ PITFALL:', margin + 4, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(127, 29, 29);
      doc.text(lines, margin + 22, y + 4.5);

      y += boxHeight + 4;
    }
  }

  // ─── 7. Lecture Timeline Milestones (if chunks available) ────
  if (chunks && chunks.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('6. Lecture Timeline & Segment Milestones', margin, y);
    y += 6;

    const step = Math.max(1, Math.floor(chunks.length / 6));
    const milestones = chunks.filter((_, idx) => idx % step === 0).slice(0, 6);

    for (const m of milestones) {
      const timestampStr = formatTime(m.start);
      const snippet = m.text.trim().replace(/\s+/g, ' ');
      const noteLines = doc.splitTextToSize(snippet, contentWidth - 28);
      const boxHeight = Math.max(10, noteLines.length * 4.2 + 5);

      checkPageBreak(boxHeight + 4);

      // Timestamp badge
      doc.setFillColor(237, 244, 241);
      doc.roundedRect(margin, y, 22, 6, 1.5, 1.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(74, 124, 111);
      doc.text(timestampStr, margin + 11, y + 4.2, { align: 'center' });

      // Note content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(50, 50, 50);
      doc.text(noteLines, margin + 26, y + 4.2);

      y += boxHeight + 2;
    }
    y += 4;
  }

  // ─── 8. Active Recall Quiz & In-Depth Solutions ─────────────
  if (curriculum.quiz && curriculum.quiz.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(74, 124, 111);
    doc.text('7. Knowledge Check & Self-Assessment Quiz', margin, y);
    y += 6;

    curriculum.quiz.forEach((q, idx) => {
      const qLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, contentWidth - 4);
      const aLines = doc.splitTextToSize(`Answer: ${q.answer}`, contentWidth - 8);
      const needed = qLines.length * 4.5 + aLines.length * 4.2 + 8;

      checkPageBreak(needed);

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.3);
      doc.setTextColor(30, 41, 59);
      doc.text(qLines, margin, y);
      y += qLines.length * 4.5 + 1.5;

      // Answer explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(70, 70, 70);
      doc.text(aLines, margin + 4, y);
      y += aLines.length * 4.2 + 5;
    });
  }

  // Add final footer
  addFooter(doc.getNumberOfPages());

  // Save the PDF
  const filename = `Lecture_${lecture.number}_${curriculum.title.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Study_Guide.pdf`;
  doc.save(filename);
}
