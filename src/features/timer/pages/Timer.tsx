import React, { useMemo } from 'react';
import { useConnection } from '../../../context/ConnectionContext.tsx';
import { EntryModal } from '../../entries/EntryModal.tsx';
import RunningEntrySection from '../components/RunningEntrySection';
import WeeklyEntriesSection from '../components/WeeklyEntriesSection';
import TimerActionButtons from '../components/TimerActionButtons';
import useTimer from '../hooks/useTimer';
import {
  start,
  SECONDS_PER_DAY,
  SECONDS_PER_WEEK,
} from '../../../utils/time.ts';
import { groupEntriesByInterval } from '../../../utils/groupEntries.ts';

/**
 * Timer page component
 *
 * Main view for the time tracking functionality that displays:
 * - Currently running time entry (if any)
 * - Time entries grouped by weeks and days
 * - Actions for creating and managing time entries
 *
 * Features:
 * - Create, edit, and stop time entries
 * - Real-time synchronization with backend when online
 * - Offline support with local data persistence
 * - Weekly and daily grouping of time entries with duration summaries
 */
const Timer: React.FC = () => {
  const { isOnline } = useConnection();
  const {
    formData,
    setFormData,
    entries,
    tags,
    isLoading,
    runningState,
    handleAddClick,
    handleEditClick,
    handleEditRunningClick,
    handleClose,
    handleSubmit,
    handleAddRunningClick,
    createDate,
  } = useTimer(isOnline);

  // Memoize expensive calculations
  const weekGroups = useMemo(
    () =>
      groupEntriesByInterval(entries, start, SECONDS_PER_WEEK, SECONDS_PER_DAY),
    [entries],
  );

  const weekGroupsEntries = useMemo(
    () => Object.entries(weekGroups),
    [weekGroups],
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      {/* Running entry section */}
      {runningState && (
        <RunningEntrySection
          runningEntry={runningState}
          onEditClick={handleEditRunningClick}
        />
      )}

      {/* Weekly entries section */}
      <WeeklyEntriesSection
        weekGroupsEntries={weekGroupsEntries}
        onEntryClick={handleEditClick}
        createDate={createDate}
      />

      {/* Action buttons */}
      <TimerActionButtons
        onAddClick={handleAddClick}
        onStartClick={() => handleAddRunningClick(tags)}
        running={runningState}
      />

      {/* Modal for creating/editing entries */}
      <EntryModal
        onClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        tags={tags}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Timer;
