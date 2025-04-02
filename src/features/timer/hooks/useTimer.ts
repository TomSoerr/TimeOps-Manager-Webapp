import { useState, useEffect, useCallback } from 'react';
import { FormData } from '../../entries/types.ts';
import TimeEntry, { TimeRunningEntry } from '../../../types/database.types.ts';
import {
  updateLocal,
  updateRemote,
  setEntry,
  setRunning,
} from '../../../database/index';
import {
  epochToHHMM,
  epochToYYMMDD,
  formatTime,
  dateToEpoch,
} from '../../../utils/time.ts';
import { ANIMATION_LENGTH } from '../../../constants/global.ts';
import useTimerEntries from './useTimerEntries';
import useRunningEntry from './useRunningEntry';

/**
 * Custom hook that manages all timer functionality
 * Combines data loading, entry manipulation, and form handling
 *
 * @param isOnline - Whether the application is connected to the internet
 * @returns All state and handlers needed for the Timer component
 */
const useTimer = (isOnline: boolean) => {
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  // Use the custom hooks for entries and running state
  const { entries, tags, isLoading, setIsLoading, loadEntries, loadTags } =
    useTimerEntries(isOnline);

  const { runningState, loadRunning, handleAddRunningClick } = useRunningEntry(
    isOnline,
    loadEntries,
  );

  /**
   * Combined data loading function
   * Updates local data from remote and loads all required data
   */
  const handleDataUpdate = useCallback(async () => {
    console.info('Data updated, isOnline:', isOnline);
    setIsLoading(true);

    try {
      if (isOnline) {
        await updateLocal();
      }

      // Load data in parallel for better performance
      await Promise.all([loadTags(), loadEntries(), loadRunning()]);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, loadEntries, loadTags, loadRunning, setIsLoading]);

  /**
   * Opens form modal to add a new time entry
   * Pre-fills with default values (current time and 2 hours ago)
   */
  const handleAddClick = useCallback(() => {
    if (tags.length === 0) return;

    const now = new Date();
    const twoHoursAgo = new Date(Date.now() - 7200000);

    setFormData({
      name: '',
      startDate: twoHoursAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      startTime: formatTime(twoHoursAgo),
      endTime: formatTime(now),
      tagId: tags[0]?.id || 0,
    });
  }, [tags]);

  /**
   * Opens form modal to edit an existing time entry
   * Pre-fills with entry's current values
   */
  const handleEditClick = useCallback((entry: TimeEntry) => {
    setFormData({
      id: entry.id,
      tagId: entry.tagId,
      name: entry.name,
      startTime: epochToHHMM(entry.startTimeUtc),
      endTime: epochToHHMM(entry.endTimeUtc),
      startDate: epochToYYMMDD(entry.startTimeUtc),
      endDate: epochToYYMMDD(entry.endTimeUtc),
    });
  }, []);

  /**
   * Opens form modal to edit a running time entry
   * Pre-fills with entry's current values
   */
  const handleEditRunningClick = useCallback((entry: TimeRunningEntry) => {
    setFormData({
      tagId: entry.tagId,
      name: entry.name,
      startTime: epochToHHMM(entry.startTimeUtc),
      startDate: epochToYYMMDD(entry.startTimeUtc),
    });
  }, []);

  /**
   * Closes the form modal without saving changes
   */
  const handleClose = useCallback(() => {
    setFormData(undefined);
  }, []);

  /**
   * Handles form submission for creating/editing entries
   * Creates either a completed entry or a running entry based on form data
   */
  const handleSubmit = useCallback(
    async (updatedData: FormData) => {
      if (!updatedData) {
        console.error('Trying to submit empty form');
        return;
      }

      const formDataCopy = updatedData;
      setFormData(undefined); // Close modal

      console.log('formData:', updatedData);

      try {
        if (formDataCopy.endDate && formDataCopy.endTime) {
          await setEntry({
            id: formDataCopy.id || undefined,
            name: formDataCopy.name,
            tagId: formDataCopy.tagId,
            startTimeUtc: dateToEpoch(
              formDataCopy.startDate,
              formDataCopy.startTime,
            ),
            endTimeUtc: dateToEpoch(formDataCopy.endDate, formDataCopy.endTime),
            synced: 0,
            msg: '',
          });
        } else {
          await setRunning({
            name: formDataCopy.name,
            tagId: formDataCopy.tagId,
            startTimeUtc: dateToEpoch(
              formDataCopy.startDate,
              formDataCopy.startTime,
            ),
            synced: 0,
            msg: '',
          });
        }

        setTimeout(async () => {
          if (isOnline) {
            if (await updateRemote()) {
              loadEntries();
              loadRunning();
            }
          } else {
            loadEntries();
            loadRunning();
          }
        }, ANIMATION_LENGTH);
      } catch (error) {
        console.error('Failed to submit entry:', error);
      }
    },
    [formData, isOnline, loadEntries, loadRunning],
  );

  /**
   * Formats epoch timestamp as a date string
   */
  const createDate = useCallback((date: number): string => {
    const d = new Date(date * 1000);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }, []);

  // Effect for online status changes
  useEffect(() => {
    if (!isOnline) return;

    let isMounted = true; // For cleanup/abort

    const runUpdates = async () => {
      try {
        await handleDataUpdate();
        if (await updateRemote()) loadEntries();
      } catch (error) {
        console.error('Error during updates:', error);
      }
    };

    if (isMounted) runUpdates();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, [isOnline, handleDataUpdate, loadEntries]);

  // Effect for data update event listener
  useEffect(() => {
    window.addEventListener('data-update', handleDataUpdate);

    handleDataUpdate();

    return () => {
      window.removeEventListener('data-update', handleDataUpdate);
    };
  }, [handleDataUpdate]);

  return {
    // State
    formData,
    setFormData,
    entries,
    tags,
    isLoading,
    runningState,

    // Handlers
    handleAddClick,
    handleEditClick,
    handleEditRunningClick,
    handleClose,
    handleSubmit,
    handleAddRunningClick,

    // Utilities
    createDate,
  };
};

export default useTimer;
