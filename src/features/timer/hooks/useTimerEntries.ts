import { useState, useCallback } from 'react';
import TimeEntry, { TimeRunningEntry } from '../../../types/database.types.ts';
import {
  TagEntry,
  getAllTags,
  getAllEntriesWithTags,
} from '../../../database/index';
import { ANIMATION_LENGTH } from '../../../constants/global.ts';

/**
 * Hook for managing time entries data and operations
 * Handles data loading, synchronization, and CRUD operations
 *
 * @param isOnline - Whether the app is currently connected to the backend
 * @returns Entry data and operation handlers
 */
function useTimerEntries(isOnline: boolean) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tags, setTags] = useState<TagEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Memoize functions to prevent unnecessary re-renders
  const loadEntries = useCallback(async () => {
    try {
      const entriesWithTags = await getAllEntriesWithTags();
      setEntries(entriesWithTags);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const tags = await getAllTags();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  return {
    entries,
    tags,
    isLoading,
    setIsLoading,
    loadEntries,
    loadTags,
  };
}

export default useTimerEntries;
