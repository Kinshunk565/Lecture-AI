import { useState, useMemo } from 'react';
import { Network, Play, Sparkles, AlertTriangle, Code, BookOpen, Clock } from 'lucide-react';
import type { LectureCurriculum } from '../data/lectureCurriculum';

interface ConceptGraphProps {
  lectureNumber: string;
  curriculum?: LectureCurriculum | null;
  onSeek: (seconds: number) => void;
}

interface GraphNode {
  id: string;
  title: string;
  description: string;
  category: 'theory' | 'code' | 'gotcha' | 'milestone';
  seconds: number;
  timeFormatted: string;
}

function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export default function ConceptGraph({ curriculum, onSeek }: ConceptGraphProps) {
  const [filter, setFilter] = useState<'all' | 'theory' | 'code' | 'gotcha'>('all');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Generate nodes from curriculum
  const nodes: GraphNode[] = useMemo(() => {
    if (!curriculum) return [];

    const list: GraphNode[] = [];

    // 1. Milestones
    if (curriculum.milestones && curriculum.milestones.length > 0) {
      curriculum.milestones.forEach((m, idx) => {
        const sec = parseTimeToSeconds(m.time);
        list.push({
          id: `m-${idx}`,
          title: m.text,
          description: `Spoken lecture milestone explained at minute ${m.time}`,
          category: 'milestone',
          seconds: sec,
          timeFormatted: m.time,
        });
      });
    }

    // 2. Theory topics
    if (curriculum.theory && curriculum.theory.length > 0) {
      curriculum.theory.forEach((t, idx) => {
        // Approximate time progression across video
        const sec = Math.min(1800, (idx + 1) * 240);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        list.push({
          id: `t-${idx}`,
          title: t.subheading,
          description: t.content,
          category: 'theory',
          seconds: sec,
          timeFormatted,
        });
      });
    }

    // 3. Code Samples
    if (curriculum.code_samples && curriculum.code_samples.length > 0) {
      curriculum.code_samples.forEach((c, idx) => {
        const sec = Math.min(1800, 360 + idx * 300);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        list.push({
          id: `c-${idx}`,
          title: `Code: ${c.caption}`,
          description: c.code.slice(0, 140) + '...',
          category: 'code',
          seconds: sec,
          timeFormatted,
        });
      });
    }

    // 4. Pitfalls
    if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
      curriculum.pitfalls.forEach((p, idx) => {
        const sec = Math.min(1800, 480 + idx * 200);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        list.push({
          id: `p-${idx}`,
          title: `Pitfall Trap #${idx + 1}`,
          description: p,
          category: 'gotcha',
          seconds: sec,
          timeFormatted,
        });
      });
    }

    return list;
  }, [curriculum]);

  const filteredNodes = nodes.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'theory') return n.category === 'theory' || n.category === 'milestone';
    if (filter === 'code') return n.category === 'code';
    if (filter === 'gotcha') return n.category === 'gotcha';
    return true;
  });

  const getCategoryBadge = (cat: GraphNode['category']) => {
    switch (cat) {
      case 'theory':
        return <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><BookOpen size={10} /> Theory</span>;
      case 'code':
        return <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><Code size={10} /> Code Lab</span>;
      case 'gotcha':
        return <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><AlertTriangle size={10} /> Gotcha Trap</span>;
      default:
        return <span className="text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><Clock size={10} /> Timestamp</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] overflow-hidden">
      {/* Top Header & Filter Chips */}
      <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Network size={15} className="text-[var(--color-accent)]" />
          <span className="text-xs font-bold text-[var(--color-primary)]">
            Concept Knowledge Graph
          </span>
          <span className="text-[10px] text-[var(--color-secondary)]">({filteredNodes.length} nodes)</span>
        </div>

        <div className="flex items-center gap-1 text-[10px]">
          {(['all', 'theory', 'code', 'gotcha'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2 py-0.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* Central Root Concept Node */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-accent)]/10 to-transparent border border-[var(--color-accent)]/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold">
              Root Concept Core
            </span>
            <span className="text-xs font-semibold text-[var(--color-accent)] flex items-center gap-1">
              <Sparkles size={12} /> {curriculum?.category || 'Web Engineering'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--color-primary)]">
            {curriculum?.title}
          </h3>
          <p className="text-xs text-[var(--color-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
            {curriculum?.overview}
          </p>
        </div>

        {/* Instructions banner */}
        <div className="text-[11px] text-[var(--color-secondary)] italic px-1 flex items-center justify-between">
          <span>Click any concept node to jump the video directly to that exact moment:</span>
        </div>

        {/* Interactive Mind-Map Nodes List */}
        <div className="space-y-2 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--color-border)]">
          {filteredNodes.map((node) => {
            const isActive = activeNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveNodeId(node.id);
                  onSeek(node.seconds);
                }}
                className={`relative pl-8 transition-all group cursor-pointer ${
                  isActive ? 'scale-[1.01]' : ''
                }`}
              >
                {/* Node dot on connecting timeline */}
                <div
                  className={`absolute left-2.5 top-3.5 w-3 h-3 rounded-full border-2 transition-all ${
                    isActive
                      ? 'bg-[var(--color-accent)] border-white shadow-md'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] group-hover:border-[var(--color-accent)]'
                  }`}
                />

                {/* Node Card */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[var(--color-background)] border-[var(--color-accent)] shadow-md'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-background)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {getCategoryBadge(node.category)}
                      <h4 className="text-xs font-bold text-[var(--color-primary)] truncate">
                        {node.title}
                      </h4>
                    </div>

                    {/* Timestamp Seeking Button */}
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-mono text-[10px] font-semibold flex items-center gap-1 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                      <Play size={9} className="fill-current" /> {node.timeFormatted}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--color-secondary)] leading-relaxed line-clamp-2">
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
