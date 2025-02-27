import DatabaseEntry from '../types/database.types';

interface GroupedEntries {
  [key: number]: DatabaseEntry[];
}

export const groupEntriesByInterval = (
  entries: DatabaseEntry[],
  startValue: number,
  interval: number,
): GroupedEntries => {
  const groups: GroupedEntries = {};
  let currentEntries = [...entries];
  let currentStart = startValue;
  let groupIndex = 0;

  while (currentEntries.length > 0) {
    // Find entries that belong to current interval
    const entriesInInterval = currentEntries.filter(
      (entry) => entry.startTimeUtc >= currentStart - interval,
    );

    if (entriesInInterval.length > 0) {
      groups[groupIndex] = entriesInInterval;
      // Remove processed entries
      currentEntries = currentEntries.filter(
        (entry) => entry.startTimeUtc < currentStart - interval,
      );
    }

    currentStart -= interval;
    groupIndex++;
  }

  return groups;
};
