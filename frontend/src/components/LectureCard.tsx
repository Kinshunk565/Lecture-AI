import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, MessageSquare, FileText, Clock, Sparkles, Download, Loader2 } from 'lucide-react';
import type { Lecture } from '../types';
import { formatDuration } from '../utils/formatTime';
import { api } from '../services/api';
import { generateLecturePdfSummary } from '../utils/generatePdfSummary';

interface LectureCardProps {
  lecture: Lecture;
}

const YOUTUBE_LECTURES: Record<string, string> = {
  "1": "tVzUXW6siu0",
  "2": "kJEsTjH5mVg",
  "3": "BGeDBfCIqas",
  "4": "nXba2-mgn1k",
  "5": "1BsVhumGlNc",
  "6": "CyGodpqfid4",
  "7": "kUMe1FH4CHE",
  "8": "vnnlU_PtGLU",
  "9": "g_rVclTjxxo",
  "10": "c_hpkJ0p4HQ",
  "11": "pnakOQv1b3M",
  "12": "FhPflb_548Y",
  "13": "bWPMssw54pY",
  "14": "Edsxf_NBFrw",
  "15": "1Pfsmw8gB7g",
  "16": "yebld_T_cOA",
  "17": "5bId3mykW_4",
  "18": "hGz_15h7v1Q",
};

export default function LectureCard({ lecture }: LectureCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const transcriptData = await api.getTranscript(lecture.number);
      await generateLecturePdfSummary(lecture, transcriptData.chunks || []);
    } catch (err) {
      console.error('Failed to download PDF summary:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const cleanNum = lecture.number ? String(parseInt(lecture.number, 10)) : "1";
  const ytId = YOUTUBE_LECTURES[cleanNum] || "Edsxf_NBFrw";
  const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

  return (
    <div className="card overflow-hidden group border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between bg-[var(--color-surface)]">
      {/* Dynamic Video Thumbnail Header */}
      <Link
        to={`/lectures/${lecture.number}`}
        className="block relative aspect-video w-full overflow-hidden bg-zinc-900 cursor-pointer no-underline"
      >
        {!imgError ? (
          <img
            src={thumbnailUrl}
            alt={lecture.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
            <span className="text-zinc-600 font-mono text-xs">Video {lecture.number}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Play Icon in center on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/90 text-white flex items-center justify-center shadow-lg transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
            <Play size={18} className="ml-0.5 fill-white" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm">
            Video {lecture.number}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/90 text-white shadow-sm flex items-center gap-1 backdrop-blur-md">
            <Sparkles size={10} /> AI Ready
          </span>
        </div>

        {/* Bottom Duration Badge */}
        {lecture.duration > 0 && (
          <div className="absolute bottom-2 right-2.5 pointer-events-none">
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white/90 border border-white/10 shadow-sm flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(lecture.duration)}
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/lectures/${lecture.number}`}
            className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors mb-1.5 leading-snug line-clamp-2 block no-underline"
          >
            {lecture.title}
          </Link>

          <div className="flex items-center gap-3 text-xs text-[var(--color-secondary)] mb-4">
            <span className="flex items-center gap-1">
              <FileText size={12} className="text-[var(--color-accent)]" />
              {lecture.chunk_count} transcript chunks
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]/60">
          <Link
            to={`/lectures/${lecture.number}`}
            className="btn-primary text-xs flex-1 justify-center py-2 no-underline"
          >
            <Play size={13} /> Open
          </Link>
          <Link
            to={`/lectures/${lecture.number}?ask=true`}
            className="btn-secondary text-xs flex-1 justify-center py-2 no-underline"
          >
            <MessageSquare size={13} /> Ask AI
          </Link>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            title="Download AI Summary PDF"
            className="btn-secondary text-xs px-2.5 py-2 justify-center hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 size={13} className="animate-spin text-[var(--color-accent)]" />
            ) : (
              <Download size={13} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
