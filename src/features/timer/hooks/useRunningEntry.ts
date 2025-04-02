import { useState, useCallback } from 'react';
import { TimeRunningEntry } from '../../../types/database.types.ts';
import {
  getRunning,
  setEntry,
  clearRunning,
  updateRemote,
  setRunning,
} from '../../../database/index';

/**
 * Custom hook for managing the currently running time entry
 *
 * Handles fetching, creating, updating, and stopping the running entry
 *
 * @param isOnline - Whether the app is connected to the internet
 * @param loadEntries - Callback to refresh the list of entries
 * @returns The running entry state and management functions
 */
function useRunningEntry(isOnline: boolean, loadEntries: () => Promise<void>) {
  const [runningState, setRunningState] = useState<
    TimeRunningEntry | undefined
  >();

  const loadRunning = useCallback(async () => {
    try {
      const running = await getRunning();
      setRunningState(running);
    } catch (error) {
      console.error('Failed to load running entry:', error);
    }
  }, []);

  const handleAddRunningClick = useCallback(
    async (tags) => {
      if (tags.length === 0) return;

      try {
        const runningEntry = await getRunning();

        if (!runningEntry) {
          await setRunning({
            name: 'Running Entry',
            synced: 0,
            tagId: tags[0]?.id || 0,
            startTimeUtc: Math.round(Date.now() / 1000) - 1, // -1 fix round err
            msg: '',
          });
          console.warn('set running', runningEntry);
        } else {
          console.warn('stop running');

          await setEntry({
            name: runningEntry.name,
            synced: runningEntry.synced ? 1 : 0,
            tagId: runningEntry.tagId,
            startTimeUtc: runningEntry.startTimeUtc,
            endTimeUtc: Math.round(Date.now() / 1000),
            msg: runningEntry.msg,
          });

          await clearRunning();
        }
      } catch (error) {
        console.error('Failed to submit running entry:', error);
      }

      if (isOnline) {
        if (await updateRemote()) {
          loadEntries();
          loadRunning();
        }
      } else {
        loadEntries();
        loadRunning();
      }
    },
    [loadRunning, loadEntries, isOnline],
  );

  return {
    runningState,
    loadRunning,
    handleAddRunningClick,
  };
}

export default useRunningEntry;
