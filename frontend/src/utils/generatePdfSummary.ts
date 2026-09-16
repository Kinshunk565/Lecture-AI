import { jsPDF } from 'jspdf';
import type { Lecture, TranscriptChunk } from '../types';
import { formatTime, formatDuration } from './formatTime';

export async function generateLecturePdfSummary(
  lecture: Lecture,
  chunks: TranscriptChunk[]
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      addFooter();
      doc.addPage();
      y = margin;
      addHeaderStrip();
    }
  };

  const addHeaderStrip = () => {
    doc.setFillColor(74, 124, 111); // Brand Accent (#4A7C6F)
    doc.rect(margin, y, contentWidth, 1.5, 'F');
    y += 5;
  };

  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `LectureAI · Automated Study Notes · Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  };

  // ─── 1. Header Banner ───────────────────────────────────────
  doc.setFillColor(245, 248, 247); // Light mint background
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(200, 220, 215);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'S');

  // Brand tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(74, 124, 111);
  doc.text('🎓 LECTUREAI STUDY GUIDE · SIGMA WEB DEV COURSE', margin + 6, y + 8);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(23, 23, 23);
  const titleLines = doc.splitTextToSize(`Video ${lecture.number}: ${lecture.title}`, contentWidth - 12);
  doc.text(titleLines, margin + 6, y + 17);

  // Metadata Bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const durationText = lecture.duration > 0 ? formatDuration(lecture.duration) : 'Full Length';
  const metaText = `Duration: ${durationText}   •   Total Transcript Segments: ${chunks.length}   •   Status: AI-Indexed`;
  doc.text(metaText, margin + 6, y + 33);

  y += 46;

  // ─── 2. Executive Summary ───────────────────────────────────
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('1. Executive Overview', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  // Generate overview from first few chunks
  const sampleText = chunks.slice(0, 8).map(c => c.text).join(' ').replace(/\s+/g, ' ');
  const overview = `In this lecture, the instructor introduces core concepts surrounding ${lecture.title}. The lesson covers conceptual definitions, structural syntax, practical code examples, and best development practices. Students learn how these topics fit into real-world web architecture.\n\nIntroductory transcript context: "${sampleText.slice(0, 320)}..."`;
  const overviewLines = doc.splitTextToSize(overview, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 4.5 + 6;

  // ─── 3. Key Concepts & Learning Objectives ──────────────────
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('2. Core Learning Objectives', margin, y);
  y += 6;

  const objectives = [
    `Understand the fundamental principles of ${lecture.title}`,
    'Identify key syntax rules, common properties, and element structures',
    'Follow along with live coding demonstrations and VS Code workflows',
    'Learn common debugging tips and avoid frequent beginner pitfalls',
    'Integrate concepts with previous HTML/CSS lessons in the Sigma curriculum',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  objectives.forEach(obj => {
    checkPageBreak(8);
    doc.setFillColor(74, 124, 111);
    doc.circle(margin + 2, y - 1, 1.2, 'F');
    doc.setTextColor(40, 40, 40);
    doc.text(obj, margin + 6, y);
    y += 5.5;
  });
  y += 4;

  // ─── 4. Chronological Timeline & Milestone Notes ────────────
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('3. Timestamped Milestones & Topic Breakdown', margin, y);
  y += 6;

  // Select evenly spaced significant chunks across the lecture
  const step = Math.max(1, Math.floor(chunks.length / 8));
  const milestones = chunks.filter((_, idx) => idx % step === 0).slice(0, 8);

  milestones.forEach((m) => {
    const timestampStr = formatTime(m.start);
    const snippet = m.text.trim().replace(/\s+/g, ' ');
    const noteLines = doc.splitTextToSize(snippet, contentWidth - 28);
    const boxHeight = Math.max(12, noteLines.length * 4.2 + 6);

    checkPageBreak(boxHeight + 4);

    // Timestamp pill
    doc.setFillColor(237, 244, 241);
    doc.roundedRect(margin, y, 22, 6.5, 1.5, 1.5, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 124, 111);
    doc.text(timestampStr, margin + 11, y + 4.5, { align: 'center' });

    // Note content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(noteLines, margin + 26, y + 4.5);

    y += boxHeight + 2;
  });

  // ─── 5. Practical Cheat Sheet & Quick Quiz ──────────────────
  checkPageBreak(45);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('4. Knowledge Check & Review Questions', margin, y);
  y += 6;

  const questions = [
    `Q1: What is the main purpose of the concepts taught in "${lecture.title}"?`,
    'Q2: How does the instructor demonstrate this feature in the code editor?',
    'Q3: Which elements or properties are combined to achieve the expected output?',
  ];

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  questions.forEach(q => {
    checkPageBreak(7);
    doc.text(q, margin + 3, y);
    y += 5.5;
  });

  // Footer for last page
  addFooter();

  // Save the PDF
  const filename = `Lecture_${lecture.number}_${lecture.title.replace(/[^a-zA-Z0-9]/g, '_')}_Summary.pdf`;
  doc.save(filename);
}
