import type { CustomLectureItem } from './customLectureStorage';
import { customLectureStorage } from './customLectureStorage';

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  playlistId?: string;
  playlistUrl?: string;
  totalLectures: number;
  lectures: CustomLectureItem[];
  createdAt: number;
  thumbnailUrl?: string;
}

const COURSES_STORAGE_KEY = 'lectureai_courses';
const COMPLETED_LESSONS_KEY = 'lectureai_completed_lessons';

export const courseStorage = {
  getCourses(): CourseItem[] {
    try {
      const data = localStorage.getItem(COURSES_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as CourseItem[];
    } catch {
      return [];
    }
  },

  getCourse(id: string): CourseItem | null {
    const courses = this.getCourses();
    return courses.find((c) => c.id === id) || null;
  },

  getCourseForLecture(lectureNumber: string): { course: CourseItem; index: number } | null {
    const courses = this.getCourses();
    for (const course of courses) {
      const index = course.lectures.findIndex((l) => l.number === lectureNumber);
      if (index !== -1) {
        return { course, index };
      }
    }
    return null;
  },

  saveCourse(course: CourseItem): void {
    const existing = this.getCourses();
    const filtered = existing.filter((c) => c.id !== course.id);
    const updated = [course, ...filtered];
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));

    // Also register all course lectures into customLectureStorage
    course.lectures.forEach((lec) => {
      customLectureStorage.saveCustomLecture(lec);
    });
  },

  deleteCourse(id: string): void {
    const courses = this.getCourses();
    const courseToDelete = courses.find((c) => c.id === id);
    if (courseToDelete) {
      // Remove all individual lectures belonging to this course
      courseToDelete.lectures.forEach((lec) => {
        customLectureStorage.deleteCustomLecture(lec.number);
      });
    }
    const updated = courses.filter((c) => c.id !== id);
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
  },

  // Completion Progress Tracking
  getCompletedLessons(): string[] {
    try {
      const data = localStorage.getItem(COMPLETED_LESSONS_KEY);
      if (!data) return [];
      return JSON.parse(data) as string[];
    } catch {
      return [];
    }
  },

  isLessonCompleted(lectureNumber: string): boolean {
    const list = this.getCompletedLessons();
    return list.includes(lectureNumber);
  },

  markLessonCompleted(lectureNumber: string, completed: boolean = true): void {
    const list = this.getCompletedLessons();
    const set = new Set(list);
    if (completed) {
      set.add(lectureNumber);
    } else {
      set.delete(lectureNumber);
    }
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(Array.from(set)));
  },

  toggleLessonCompleted(lectureNumber: string): boolean {
    const isComp = this.isLessonCompleted(lectureNumber);
    this.markLessonCompleted(lectureNumber, !isComp);
    return !isComp;
  },

  getCourseProgress(lectureNumbers: string[]): { completed: number; total: number; percentage: number } {
    if (!lectureNumbers || lectureNumbers.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const completedList = this.getCompletedLessons();
    const completed = lectureNumbers.filter((num) => completedList.includes(num)).length;
    const total = lectureNumbers.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  },
};

