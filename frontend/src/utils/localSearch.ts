import { LECTURE_CURRICULUM } from '../data/lectureCurriculum';
import type { SearchResult } from '../types';

export function searchCurriculum(query: string, limit: number = 10): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const queryTerms = q.split(/\s+/).filter(t => t.length > 1);
  const results: SearchResult[] = [];

  for (const [numStr, curriculum] of Object.entries(LECTURE_CURRICULUM)) {
    let bestScore = 0;
    let bestSnippet = '';
    let bestStart = 0;

    // Check title
    if (curriculum.title.toLowerCase().includes(q)) {
      bestScore = Math.max(bestScore, 0.98);
      bestSnippet = curriculum.overview.slice(0, 180) + '...';
      bestStart = 0;
    }

    // Check theory topics
    for (const t of curriculum.theory) {
      const subLower = t.subheading.toLowerCase();
      const contentLower = t.content.toLowerCase();
      let matchCount = 0;

      for (const term of queryTerms) {
        if (subLower.includes(term) || contentLower.includes(term)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const score = 0.7 + (matchCount / queryTerms.length) * 0.25;
        if (score > bestScore) {
          bestScore = score;
          bestSnippet = `${t.subheading}: ${t.content.slice(0, 160)}...`;
          bestStart = 60;
        }
      }
    }

    // Check milestones
    if (curriculum.milestones) {
      for (const m of curriculum.milestones) {
        const mText = m.text.toLowerCase();
        let matchCount = 0;
        for (const term of queryTerms) {
          if (mText.includes(term)) {
            matchCount++;
          }
        }
        if (matchCount > 0) {
          const score = 0.75 + (matchCount / queryTerms.length) * 0.2;
          if (score > bestScore) {
            bestScore = score;
            bestSnippet = m.text;
            const parts = m.time.split(':');
            bestStart = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          }
        }
      }
    }

    // Check overview
    const overviewLower = curriculum.overview.toLowerCase();
    for (const term of queryTerms) {
      if (overviewLower.includes(term) && bestScore < 0.7) {
        bestScore = 0.68;
        bestSnippet = curriculum.overview.slice(0, 180) + '...';
        bestStart = 0;
      }
    }

    if (bestScore > 0.6) {
      results.push({
        title: curriculum.title,
        number: numStr,
        start: bestStart,
        end: bestStart + 90,
        text: bestSnippet || curriculum.overview.slice(0, 180),
        similarity: parseFloat(bestScore.toFixed(3)),
      });
    }
  }

  // Sort descending by similarity
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}
