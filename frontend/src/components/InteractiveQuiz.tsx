import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronLeft, ChevronRight, HelpCircle, Sparkles, Layers } from 'lucide-react';
import type { LectureCurriculum, QuizItem } from '../data/lectureCurriculum';

interface InteractiveQuizProps {
  lectureNumber: string;
  curriculum?: LectureCurriculum | null;
  onSeek?: (time: number) => void;
}

interface GeneratedQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function InteractiveQuiz({ curriculum }: InteractiveQuizProps) {
  const [subTab, setSubTab] = useState<'quiz' | 'flashcards'>('quiz');

  // ─────────────────────────────────────────────────────────────
  // QUIZ STATE
  // ─────────────────────────────────────────────────────────────
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Generate quiz questions
  const questions: GeneratedQuestion[] = useMemo(() => {
    if (!curriculum) return [];

    const rawQuizzes: QuizItem[] = curriculum.quiz && curriculum.quiz.length > 0
      ? curriculum.quiz
      : [
          {
            question: `What is the core purpose of ${curriculum.title}?`,
            answer: `It establishes the fundamental syntax and architectural patterns required for production web engineering.`,
          },
        ];

    return rawQuizzes.map((q, idx) => {
      // Create distractors based on reference table or common themes
      const distractors = [
        'It is an outdated browser configuration that is no longer recommended in modern web development.',
        'It acts solely as an operating system kernel driver with no direct impact on frontend rendering.',
        'It is an optional styling utility used exclusively for server-side logging and analytics.',
      ];

      // Insert correct answer and shuffle
      const options = [q.answer, ...distractors].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(q.answer);

      return {
        id: idx,
        question: q.question,
        options,
        correctIndex,
        explanation: q.answer,
      };
    });
  }, [curriculum]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    if (idx === questions[currentQIndex]?.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // ─────────────────────────────────────────────────────────────
  // FLASHCARDS STATE
  // ─────────────────────────────────────────────────────────────
  const flashcards = useMemo(() => {
    if (!curriculum) return [];

    const list: { front: string; back: string; category: string }[] = [];

    // From reference table
    if (curriculum.reference_table && curriculum.reference_table.length > 0) {
      curriculum.reference_table.forEach((item) => {
        list.push({
          front: item.item,
          back: `${item.type}: ${item.description}`,
          category: item.type || 'Concept',
        });
      });
    }

    // From quizzes
    if (curriculum.quiz && curriculum.quiz.length > 0) {
      curriculum.quiz.forEach((q) => {
        list.push({
          front: q.question,
          back: q.answer,
          category: 'Interview Q&A',
        });
      });
    }

    // From pitfalls
    if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
      curriculum.pitfalls.forEach((p, idx) => {
        list.push({
          front: `Common Pitfall #${idx + 1}`,
          back: p,
          category: 'Warning / Gotcha',
        });
      });
    }

    return list.length > 0 ? list : [
      {
        front: curriculum.title,
        back: curriculum.overview,
        category: 'Course Topic',
      }
    ];
  }, [curriculum]);

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  const handleMarkMastered = (mastered: boolean) => {
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (mastered) {
        next.add(cardIndex);
      } else {
        next.delete(cardIndex);
      }
      return next;
    });

    if (cardIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCardIndex((prev) => prev + 1);
    }
  };

  const currentQ = questions[currentQIndex];
  const currentCard = flashcards[cardIndex];

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] select-none">
      {/* Top Switcher: Quiz vs Flashcards */}
      <div className="flex border-b border-[var(--color-border)] p-2.5 gap-2 bg-[var(--color-background)]/50">
        <button
          onClick={() => setSubTab('quiz')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'quiz'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
          }`}
        >
          <HelpCircle size={14} /> Active Recall Quiz
        </button>
        <button
          onClick={() => setSubTab('flashcards')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'flashcards'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
          }`}
        >
          <Layers size={14} /> Anki Flashcards ({flashcards.length})
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. ACTIVE RECALL QUIZ TAB */}
      {/* ───────────────────────────────────────────────────────── */}
      {subTab === 'quiz' && (
        <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between">
          {!quizCompleted ? (
            <div className="space-y-5">
              {/* Progress & Score header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--color-secondary)]">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-mono font-semibold">
                  Score: {score} / {questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-primary)] leading-relaxed">
                  {currentQ?.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQ?.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'bg-[var(--color-background)] border-[var(--color-border)] hover:border-[var(--color-accent)]/60 text-[var(--color-primary)]';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-500/15 border-red-500 text-red-400';
                    } else {
                      btnStyle = 'bg-[var(--color-background)]/50 border-[var(--color-border)] opacity-40 text-[var(--color-secondary)]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isAnswerSubmitted && (
                <div className="p-3.5 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 animate-fade-in text-xs space-y-1">
                  <div className="font-semibold text-[var(--color-accent)] flex items-center gap-1.5">
                    <Sparkles size={13} /> Explanation & Technical Rationale:
                  </div>
                  <p className="text-[var(--color-secondary)] leading-relaxed">
                    {currentQ?.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completion Screen */
            <div className="py-8 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-lg">
                <Award size={32} />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-primary)]">
                Active Recall Quiz Complete!
              </h2>
              <p className="text-xs text-[var(--color-secondary)] max-w-xs mx-auto">
                You scored <span className="font-bold text-[var(--color-accent)] text-sm">{score} out of {questions.length}</span> (
                {Math.round((score / questions.length) * 100)}%).
                {score === questions.length ? ' Flawless mastery!' : ' Review the key concepts and try again.'}
              </p>
              <button
                onClick={handleRestartQuiz}
                className="btn-accent text-xs font-semibold py-2 px-5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
            </div>
          )}

          {/* Next Button Footer */}
          {!quizCompleted && isAnswerSubmitted && (
            <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="btn-accent text-xs font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>{currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. ANKI SMART FLASHCARDS TAB */}
      {/* ───────────────────────────────────────────────────────── */}
      {subTab === 'flashcards' && (
        <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--color-secondary)]">
              Card {cardIndex + 1} of {flashcards.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-[11px]">
              Mastered: {masteredCards.size} / {flashcards.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${(masteredCards.size / flashcards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 min-h-[220px] rounded-2xl p-6 border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-accent)]/50 transition-all cursor-pointer shadow-md flex flex-col justify-between text-center relative overflow-hidden group"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary)] font-medium">
                {currentCard?.category}
              </span>
              <span className="text-[10px] text-[var(--color-secondary)] opacity-60 group-hover:opacity-100 transition-opacity">
                {isFlipped ? 'Click to see front' : 'Click card to flip ↻'}
              </span>
            </div>

            <div className="my-auto py-4">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-bold block">
                    Front / Concept
                  </span>
                  <h4 className="text-base font-bold text-[var(--color-primary)] leading-snug">
                    {currentCard?.front}
                  </h4>
                </div>
              ) : (
                <div className="space-y-2 animate-fade-in">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                    Definition & Technical Solution
                  </span>
                  <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                    {currentCard?.back}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-[var(--color-secondary)] font-medium">
              {masteredCards.has(cardIndex) ? (
                <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> Marked as Mastered
                </span>
              ) : (
                <span>Unmastered</span>
              )}
            </div>
          </div>

          {/* Spaced Repetition Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkMastered(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all cursor-pointer"
              >
                🔴 Review Again
              </button>
              <button
                onClick={() => handleMarkMastered(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold transition-all cursor-pointer"
              >
                🟢 Easy / Mastered
              </button>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                disabled={cardIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => Math.max(0, prev - 1));
                }}
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                disabled={cardIndex === flashcards.length - 1}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
                }}
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 disabled:opacity-30 cursor-pointer"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
