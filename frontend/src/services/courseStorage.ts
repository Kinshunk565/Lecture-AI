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
};
