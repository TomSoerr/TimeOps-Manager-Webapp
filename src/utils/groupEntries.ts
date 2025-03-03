import DatabaseEntry from "../types/database.types";

export interface GroupedEntries {
  [key: number]: [
    number,
    {
      [key: number]: [number, DatabaseEntry[]]; // [dayTimestamp, entries]
    },
  ]; // [weekTimestamp, dayGroups]
}

export const groupEntriesByInterval = (
  entries: DatabaseEntry[],
  startValue: number, // current monday
  interval: number, // a week
  smallInterval: number, // a day
): GroupedEntries => {
  const groups: GroupedEntries = {};
  let currentEntries = [...entries];
  let currentStart = startValue;
  let groupIndex = 0;

  while (currentEntries.length > 0) {
    // Find entries that belong to current week interval
    const entriesInInterval = currentEntries.filter(
      // start time greater than monday
      (entry) => entry.startTimeUtc >= currentStart,
    );

    if (entriesInInterval.length > 0) {
      // Create day groups within the week
      const dayGroups: { [key: number]: [number, DatabaseEntry[]] } = {};

      // monday + week - day -> begin with sunday
      let currentDay = currentStart + interval - smallInterval;

      // Group by days within the week
      while (currentDay >= currentStart) {
        const entriesInDay = entriesInInterval.filter(
          // start time greater than last sub interval
          (entry) =>
            entry.startTimeUtc >= currentDay &&
            entry.startTimeUtc < currentDay + smallInterval,
        );

        if (entriesInDay.length > 0) {
          dayGroups[Object.keys(dayGroups).length] = [currentDay, entriesInDay];
        }

        currentDay -= smallInterval;
      }

      groups[groupIndex] = [currentStart, dayGroups];

      // Remove processed entries
      currentEntries = currentEntries.filter(
        (entry) => entry.startTimeUtc < currentStart,
      );
    }

    currentStart -= interval;
    groupIndex++;
  }

  return groups;
};
