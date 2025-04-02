import React from 'react';
import TimeEntry from '../../../types/database.types.ts';
import { Section } from '../../../ui/layout/Section.tsx';
import { createEntry } from '../../../utils/entryToCard.tsx';
import { sumUpHours, Weekday } from '../../../utils/time.ts';

/**
 * Props for the WeeklyEntriesSection component
 */
interface WeeklyEntriesSectionProps {
  weekGroupsEntries: Array<
    [string, [number, { [key: number]: [number, TimeEntry[]] }]]
  >;
  onEntryClick: (entry: TimeEntry) => void;
  createDate: (date: number) => string;
}

/**
 * Displays time entries grouped by weeks and days
 * With summaries of time spent in each period
 */
const WeeklyEntriesSection: React.FC<WeeklyEntriesSectionProps> = ({
  weekGroupsEntries,
  onEntryClick,
  createDate,
}) => {
  return (
    <>
      {weekGroupsEntries.map(([weekIndex, [weekTimestamp, dayGroups]]) => {
        const dayGroupArray = Object.values(dayGroups);
        const weekEntries = dayGroupArray.flatMap(
          ([_, dayEntries]) => dayEntries,
        );

        return (
          <Section
            key={`w-${weekIndex}`}
            headline={`Week from ${createDate(weekTimestamp)}`}
            hours={sumUpHours(weekEntries)}
          >
            {Object.entries(dayGroups).map(
              ([dayIndex, [dayTimestamp, entries]]) => (
                <li key={`d-${dayIndex}`}>
                  <Section
                    subSection={true}
                    key={`d-${dayIndex}`}
                    headline={`${Weekday[new Date(dayTimestamp * 1000).getDay()]}, ${new Date(dayTimestamp * 1000).getDate()}th`}
                    hours={sumUpHours(entries)}
                  >
                    {entries.map((entry) => (
                      <React.Fragment
                        key={
                          (entry.remoteId ?
                            `${entry.synced}-${entry.remoteId}`
                          : false) || entry.id
                        }
                      >
                        {createEntry(entry, () => onEntryClick(entry))}
                      </React.Fragment>
                    ))}
                  </Section>
                </li>
              ),
            )}
          </Section>
        );
      })}
    </>
  );
};

export default WeeklyEntriesSection;
