import React, { useState, useEffect } from 'react';
import { Section } from '../components/layout/Section';
import { FabAdd } from '../components/common/FabAdd';
import { FabStart } from '../components/common/FabStart';
import { createEntry } from '../utils/entryToCard.tsx';
import DatabaseEntry from '../types/database.types';
import { Modal } from './Modal';
import { db } from '../database/db';
import {
  calculateWeekHours,
  start,
  SECONDS_PER_DAY,
  epochToHHMM,
  epochToYYMMDD,
  formatTime,
  dateToEpoch,
  SECONDS_PER_WEEK,
  Weekday,
} from '../utils/time.ts';
import {
  groupEntriesByInterval,
  GroupedEntries,
} from '../utils/groupEntries.ts';
import { FormData } from './Modal';

const Timer: React.FC = () => {
  const [entries, setEntries] = useState<DatabaseEntry[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  const handleAddClick = () => {
    const now = new Date();
    const twoHoursAgo = new Date(Date.now() - 7200000);
    const emptyForm: FormData = {
      name: '',
      date: twoHoursAgo.toISOString().split('T')[0],
      startTime: formatTime(twoHoursAgo),
      endTime: formatTime(now),
      tag: tags[0],
    };

    setFormData(emptyForm);
  };

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const entriesWithTags = await db.getAllEntriesWithTags();
      setEntries(entriesWithTags);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const tags = await db.getAllTag();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
    loadTags();
  }, []);

  const handleCloseClick = () => {};

  const handleEditClick = (entry: DatabaseEntry) => {
    setFormData({
      id: entry.id,
      name: entry.name,
      tag: entry.tagName,
      startTime: epochToHHMM(entry.startTimeUtc),
      endTime: epochToHHMM(entry.endTimeUtc),
      date: epochToYYMMDD(entry.startTimeUtc),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData === undefined) throw Error('Trying to submit empty form');

    const newEntry: DatabaseEntry = {
      id: formData?.id || undefined,
      name: formData.name,
      tagName: formData.tag,
      tagColor: 'slate', // arbitrary value, not needed
      synced: false,
      startTimeUtc: dateToEpoch(formData.date, formData.startTime),
      endTimeUtc: dateToEpoch(formData.date, formData.endTime), // Fixed: using endTime instead of startTime
    };

    try {
      await db.setEntry(newEntry);
      setFormData(undefined);
      await loadEntries();
    } catch (error) {
      console.error('Failed to submit entry:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  console.error(start);

  const weekGroups = groupEntriesByInterval(
    entries,
    start,
    SECONDS_PER_WEEK,
    SECONDS_PER_DAY,
  );

  type WeekEntry = GroupedEntries[number];
  type DayGroups = WeekEntry[1];
  type DayGroup = DayGroups[number];

  const weekGroupsEntries = Object.entries(weekGroups) as Array<
    [string, WeekEntry]
  >;

  return (
    <>
      {weekGroupsEntries.map(([weekIndex, [weekTimestamp, dayGroups]]) => {
        const dayGroupArray = Object.values(dayGroups);

        const weekEntries = dayGroupArray.flatMap(
          ([_, dayEntries]) => dayEntries,
        );

        return (
          <Section
            key={weekIndex}
            headline={`Week from ${new Date(weekTimestamp * 1000).toISOString().split('T')[0]}`}
            hours={calculateWeekHours(weekEntries)}
          >
            {Object.entries(dayGroups).map(
              ([dayIndex, [dayTimestamp, entries]]) => (
                <Section
                  key={dayIndex}
                  headline={`${Weekday[new Date(dayTimestamp * 1000).getDay()]}, ${new Date(dayTimestamp * 1000).getDate()}.`}
                  hours={calculateWeekHours(entries)}
                >
                  {entries.map((entry) =>
                    createEntry(entry, () => handleEditClick(entry)),
                  )}
                </Section>
              ),
            )}
          </Section>
        );
      })}

      <div className="fixed bottom-24 right-4 flex gap-2">
        <FabAdd onClick={handleAddClick} />
        <FabStart />
      </div>

      <Modal
        onClose={handleCloseClick}
        formData={formData}
        setFormData={setFormData}
        tags={tags}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Timer;
