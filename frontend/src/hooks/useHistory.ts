import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { HistoryItem } from '../types';
import { generateId } from '../utils/formatTime';

export function useHistory() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('lectureai-history', []);

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory(prev => [{
      ...item,
      id: generateId(),
      timestamp: Date.now(),
    }, ...prev].slice(0, 100)); // Keep last 100 items
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, [setHistory]);

  return { history, addToHistory, clearHistory, removeFromHistory };
}
