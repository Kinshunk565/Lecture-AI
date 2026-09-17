import type { Lecture, TranscriptChunk } from '../types';
import type { LectureCurriculum } from '../data/lectureCurriculum';

export interface CustomLectureItem {
  id: string;
  number: string; // e.g. "custom-1726500000000"
  title: string;
  category: string;
  videoType: 'youtube' | 'file' | 'url';
  videoUrl?: string;
  youtubeId?: string;
  duration: number;
  chunk_count: number;
  chunks: TranscriptChunk[];
  curriculum: LectureCurriculum;
  createdAt: number;
}

const STORAGE_KEY = 'lectureai_custom_lectures';

export const customLectureStorage = {
  getCustomLectures(): CustomLectureItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as CustomLectureItem[];
    } catch {
      return [];
    }
  },

  getCustomLecture(numberOrId: string): CustomLectureItem | null {
    const lectures = this.getCustomLectures();
    const clean = String(numberOrId).trim();
    return (
      lectures.find(
        (l) => l.number === clean || l.id === clean || clean.endsWith(l.id)
      ) || null
    );
  },

  saveCustomLecture(item: CustomLectureItem): void {
    const existing = this.getCustomLectures();
    const filtered = existing.filter((l) => l.id !== item.id && l.number !== item.number);
    const updated = [item, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteCustomLecture(numberOrId: string): void {
    const existing = this.getCustomLectures();
    const clean = String(numberOrId).trim();
    const updated = existing.filter(
      (l) => l.number !== clean && l.id !== clean && !clean.endsWith(l.id)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  toLecture(item: CustomLectureItem): Lecture {
    return {
      number: item.number,
      title: item.title,
      chunk_count: item.chunk_count,
      duration: item.duration,
      json_file: `custom_${item.id}.json`,
      video_file: item.videoType === 'file' ? item.videoUrl || null : null,
      indexed: true,
    };
  },
};
