import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Bookmark } from '../types';
import { generateId } from '../utils/formatTime';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('lectureai-bookmarks', []);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    setBookmarks(prev => {
      // Avoid duplicates by checking lecture + start time
      const exists = prev.some(
        b => b.lectureNumber === bookmark.lectureNumber && b.start === bookmark.start && b.type === bookmark.type
      );
      if (exists) return prev;
      return [{
        ...bookmark,
        id: generateId(),
        createdAt: Date.now(),
      }, ...prev];
    });
  }, [setBookmarks]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, [setBookmarks]);

  const isBookmarked = useCallback((lectureNumber: string, start: number) => {
    return bookmarks.some(b => b.lectureNumber === lectureNumber && b.start === start);
  }, [bookmarks]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, [setBookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks };
}
