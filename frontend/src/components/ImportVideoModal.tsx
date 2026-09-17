import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Link as LinkIcon,
  Upload,
  Sparkles,
  CheckCircle2,
  FileVideo,
  Video,
  AlertCircle,
} from 'lucide-react';
import { processCustomVideo, extractYouTubeId } from '../services/videoProcessor';

interface ImportVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportVideoModal({ isOpen, onClose }: ImportVideoModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPhase, setProgressPhase] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      if (!customTitle) {
        setCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
        setSelectedFile(file);
        setError(null);
        if (!customTitle) {
          setCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
        }
      } else {
        setError('Please drop a valid video file (.mp4, .webm, .mov, or .mkv)');
      }
    }
  };

  const handleProcess = useCallback(async () => {
    setError(null);

    if (activeTab === 'url' && !videoUrl.trim()) {
      setError('Please enter a YouTube video URL or online video link.');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      setError('Please select or drag & drop a video file.');
      return;
    }

    try {
      setIsProcessing(true);
      setProgressPhase('Initializing video analysis pipeline...');
      setProgressPercent(10);

      const customLecture = await processCustomVideo({
        url: activeTab === 'url' ? videoUrl.trim() : undefined,
        file: activeTab === 'file' && selectedFile ? selectedFile : undefined,
        customTitle: customTitle.trim() || undefined,
        customTopic: customTopic.trim() || undefined,
        onProgress: (phase, percent) => {
          setProgressPhase(phase);
          setProgressPercent(percent);
        },
      });

      // Brief pause to show 100% completion before navigating
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        navigate(`/lectures/${customLecture.number}`);
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Failed to process video. Please verify the URL or file.');
    }
  }, [activeTab, videoUrl, selectedFile, customTitle, customTopic, navigate, onClose]);

  if (!isOpen) return null;

  const detectedYtId = activeTab === 'url' ? extractYouTubeId(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-[var(--color-accent)]/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary)]">
                Import & Process Custom Video
              </h2>
              <p className="text-xs text-[var(--color-secondary)]">
                Paste any YouTube link or upload a video for instant AI study guides
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Processing Screen */}
          {isProcessing ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                  {progressPercent}%
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-base font-semibold text-[var(--color-primary)]">
                  {progressPhase}
                </h3>
                <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                  LectureAI is analyzing the video stream, synthesizing timestamped transcripts, generating code examples, and formatting your master study guide.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--color-background)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
                <div
                  className="bg-gradient-to-r from-[var(--color-accent)] to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
                <CheckCircle2 size={14} /> Synced with interactive player, AI chat & study guide
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex p-1 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'url'
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  <Video size={16} />
                  YouTube / Online Link
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'file'
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  <Upload size={16} />
                  Upload Local Video
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* URL Input */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[var(--color-primary)]">
                    Video URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value);
                        setError(null);
                      }}
                      className="w-full px-4 py-3 pl-10 text-xs rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-primary)] placeholder-[var(--color-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                    <LinkIcon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
                    />
                  </div>

                  {detectedYtId && (
                    <div className="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] flex items-center gap-3">
                      <img
                        src={`https://img.youtube.com/vi/${detectedYtId}/default.jpg`}
                        alt="Preview"
                        className="w-14 h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          ✓ Valid YouTube Video Detected
                        </span>
                        <span className="text-[11px] font-mono text-[var(--color-secondary)] truncate block">
                          Video ID: {detectedYtId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload Input */}
              {activeTab === 'file' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[var(--color-primary)]">
                    Choose Video File
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[var(--color-background)]/50 hover:bg-[var(--color-background)]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                        <FileVideo size={24} />
                      </div>
                      <p className="text-xs font-medium text-[var(--color-primary)]">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-[11px] text-[var(--color-secondary)]">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                          : 'MP4, WebM, MOV, or MKV up to 500MB'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Custom Title & Topic */}
              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary)] mb-1">
                    Custom Lecture Title <span className="text-[var(--color-secondary)] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master CSS Grid & Modern Responsive Layouts"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-primary)] placeholder-[var(--color-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary)] mb-1">
                    Subject / Primary Focus <span className="text-[var(--color-secondary)] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, React, Node.js, Python"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-primary)] placeholder-[var(--color-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isProcessing && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3 bg-[var(--color-surface)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcess}
              className="btn-accent px-5 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles size={15} />
              Start AI Processing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
