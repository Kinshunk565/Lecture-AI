import { LECTURE_CURRICULUM } from '../data/lectureCurriculum';
import type { AskResponse, Source } from '../types';

export function answerFromCurriculum(question: string, lectureNumber?: string): AskResponse {
  const cleanNum = lectureNumber ? String(parseInt(lectureNumber, 10)) : '1';
  const curriculum = LECTURE_CURRICULUM[cleanNum] || LECTURE_CURRICULUM['1'];
  const qLower = question.toLowerCase();

  let answerText = '';
  const sources: Source[] = [];

  // Check question intent
  const isTopicSummary =
    qLower.includes('topic') ||
    qLower.includes('cover') ||
    qLower.includes('summar') ||
    qLower.includes('overview') ||
    qLower.includes('what is') ||
    qLower.includes('explain');

  if (isTopicSummary) {
    answerText = `### Key Topics Covered in **Video ${cleanNum}: ${curriculum.title}**\n\n`;
    answerText += `${curriculum.overview}\n\n`;
    answerText += `#### Core Conceptual Breakdown:\n`;

    curriculum.theory.forEach((t, i) => {
      answerText += `**${i + 1}. ${t.subheading}**\n${t.content}\n\n`;
    });

    if (curriculum.code_samples && curriculum.code_samples.length > 0) {
      const sample = curriculum.code_samples[0];
      answerText += `#### Code Example (${sample.caption}):\n\`\`\`html\n${sample.code}\n\`\`\`\n\n`;
    }

    if (curriculum.key_takeaways && curriculum.key_takeaways.length > 0) {
      answerText += `#### Key Takeaways:\n`;
      curriculum.key_takeaways.forEach((k) => {
        answerText += `• ${k}\n`;
      });
    }
  } else {
    // Search specific theory match
    const matchingTheory = curriculum.theory.find(
      (t) =>
        t.subheading.toLowerCase().includes(qLower) ||
        t.content.toLowerCase().includes(qLower)
    );

    const matchingQuiz = curriculum.quiz.find(
      (qz) =>
        qz.question.toLowerCase().includes(qLower) ||
        qz.answer.toLowerCase().includes(qLower)
    );

    if (matchingQuiz) {
      answerText = `**${matchingQuiz.question}**\n\n${matchingQuiz.answer}\n\n`;
      answerText += `*From Lecture ${cleanNum}: ${curriculum.title}*`;
    } else if (matchingTheory) {
      answerText = `### ${matchingTheory.subheading}\n\n${matchingTheory.content}\n\n`;
      if (curriculum.code_samples && curriculum.code_samples.length > 0) {
        answerText += `\`\`\`html\n${curriculum.code_samples[0].code}\n\`\`\`\n`;
      }
    } else {
      answerText = `In **Lecture ${cleanNum}: ${curriculum.title}**, the instructor explains:\n\n`;
      answerText += `${curriculum.overview}\n\n`;
      answerText += `#### Main Highlights:\n`;
      curriculum.theory.forEach((t) => {
        answerText += `• **${t.subheading}**: ${t.content.slice(0, 160)}...\n`;
      });
    }
  }

  // Create timestamped citations from milestones
  if (curriculum.milestones && curriculum.milestones.length > 0) {
    curriculum.milestones.slice(0, 3).forEach((m, idx) => {
      const parts = m.time.split(':');
      const startSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      sources.push({
        title: curriculum.title,
        number: cleanNum,
        start: startSeconds,
        end: startSeconds + 90,
        text: m.text,
        similarity: 0.95 - idx * 0.03,
      });
    });
  } else {
    sources.push({
      title: curriculum.title,
      number: cleanNum,
      start: 0,
      end: 120,
      text: curriculum.overview.slice(0, 200),
      similarity: 0.95,
    });
  }

  return {
    answer: answerText,
    sources,
    question,
  };
}
