import React from 'react';
import { TimeRunningEntry } from '../../../types/database.types.ts';
import { RunningEntry } from '../../../ui/entries/RunningEntry.tsx';
import { epochToHHMM } from '../../../utils/time.ts';

/**
 * Displays the currently running time entry, if one exists
 *
 * @param runningEntry - The currently running entry data
 * @param onEditClick - Handler for editing the entry
 */
const RunningEntrySection: React.FC<{
  runningEntry?: TimeRunningEntry;
  onEditClick: (entry: TimeRunningEntry) => void;
}> = ({ runningEntry, onEditClick }) => {
  if (!runningEntry) return null;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Running Entry</h2>
      <RunningEntry
        name={runningEntry.name}
        timespan={`${epochToHHMM(runningEntry.startTimeUtc)} - now`}
        startTimeUTC={runningEntry.startTimeUtc}
        synced={runningEntry.synced ? true : false}
        tag={runningEntry.tagName}
        color={runningEntry.tagColor}
        onClick={() => onEditClick(runningEntry)}
        msg={runningEntry.msg}
      />
    </div>
  );
};

export default RunningEntrySection;
