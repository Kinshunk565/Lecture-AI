import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

interface VideoPlayerProps {
  src: string | null;
  onTimeUpdate?: (currentTime: number) => void;
  seekTo?: number | null;
  lectureTitle?: string;
}

export default function VideoPlayer({ src, onTimeUpdate, seekTo, lectureTitle }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Seek to timestamp when seekTo changes
  useEffect(() => {
    if (seekTo !== null && seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [seekTo]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);
    onTimeUpdate?.(t);
  }, [onTimeUpdate]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = t;
    }
    setCurrentTime(t);
  }, []);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  }, []);

  const changeSpeed = useCallback(() => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackRate);
    const next = speeds[(idx + 1) % speeds.length];
    setPlaybackRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }, [playbackRate]);

  if (!src) {
    return (
      <div className="w-full aspect-video bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center">
        <Play size={32} className="text-[var(--color-secondary)] opacity-40 mb-3" />
        <p className="text-sm font-medium text-[var(--color-secondary)]">No video available</p>
        <p className="text-xs text-[var(--color-secondary)] opacity-60 mt-1">
          Place video files in the videos/ directory
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black relative group">
      {lectureTitle && (
        <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-gradient-to-b from-black/80 to-transparent text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
          {lectureTitle}
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 mb-2 cursor-pointer accent-[var(--color-accent)]"
          aria-label="Video progress"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => skip(-10)} className="text-white/80 hover:text-white p-1" aria-label="Skip back 10s">
              <SkipBack size={16} />
            </button>
            <button onClick={togglePlay} className="text-white hover:text-white p-1" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => skip(10)} className="text-white/80 hover:text-white p-1" aria-label="Skip forward 10s">
              <SkipForward size={16} />
            </button>
            <button onClick={() => setMuted(!muted)} className="text-white/80 hover:text-white p-1 ml-1" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <span className="text-white/70 text-xs font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={changeSpeed}
              className="text-white/70 hover:text-white text-xs font-medium px-2 py-0.5 rounded border border-white/20"
            >
              {playbackRate}×
            </button>
            <button onClick={toggleFullscreen} className="text-white/80 hover:text-white p-1" aria-label="Fullscreen">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mute state */}
      {muted && videoRef.current && (videoRef.current.muted = true)}
      {!muted && videoRef.current && (videoRef.current.muted = false)}
    </div>
  );
}
