import React, { useState, useEffect } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { Section } from '../components/layout/Section';
import { FabAdd } from '../components/common/FabAdd';
import { FabStart } from '../components/common/FabStart';
import { createEntry } from '../utils/entryToCard.tsx';
import TimeEntry from '../types/database.types';
import { Modal } from './Modal';
import { db, Entry, TagList } from '../database/db';
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
import { ANIMATION_LENGTH } from '../vars.ts';

const Timer: React.FC = () => {
  const { isOnline } = useConnection(); // Access the online/offline status
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tags, setTags] = useState<TagList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  const handleAddClick = () => {
    const now = new Date();
    const twoHoursAgo = new Date(Date.now() - 7200000);
    const emptyForm: FormData = {
      name: '',
      date: twoHoursAgo.toISOString().split('T')[0],
      startTime: formatTime(twoHoursAgo),
      endTime: formatTime(now),
      tagId: tags[0].id,
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

  const handleDataUpdate = async () => {
    console.log('Data updated');

    // update local db
    await db.updateLocal();

    loadTags();
    loadEntries();
  };

  useEffect(() => {
    // Watch for changes in isOnline and trigger updates
    if (isOnline) {
      handleDataUpdate();
      db.updateRemote();
    }
  }, [isOnline]);

  useEffect(() => {
    window.addEventListener('data-update', handleDataUpdate);

    handleDataUpdate();
    return () => {
      window.removeEventListener('data-update', handleDataUpdate);
    };
  }, []);

  const handleClose = () => {
    setFormData(undefined);
  };

  const handleEditClick = (entry: TimeEntry) => {
    setFormData({
      id: entry.id,
      tagId: entry.tagId,
      name: entry.name,
      startTime: epochToHHMM(entry.startTimeUtc),
      endTime: epochToHHMM(entry.endTimeUtc),
      date: epochToYYMMDD(entry.startTimeUtc),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(undefined); // schedule closing event
    if (formData === undefined) throw Error('Trying to submit empty form');

    const newEntry: Entry = {
      id: formData?.id || undefined,
      name: formData.name,
      tagId: formData.tagId,
      synced: 0, // because new
      startTimeUtc: dateToEpoch(formData.date, formData.startTime),
      endTimeUtc: dateToEpoch(formData.date, formData.endTime),
      msg: '',
    };

    try {
      await db.setEntry(newEntry);
      setTimeout(() => {
        if (isOnline) {
          db.updateRemote();
          return;
        }

        loadEntries();
      }, ANIMATION_LENGTH);
    } catch (error) {
      console.error('Failed to submit entry:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const weekGroups = groupEntriesByInterval(
    entries,
    start,
    SECONDS_PER_WEEK,
    SECONDS_PER_DAY,
  );

  type WeekEntry = GroupedEntries[number];

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
            key={`w-${weekIndex}`}
            headline={`Week from ${new Date(weekTimestamp * 1000).toLocaleDateString()}`}
            hours={calculateWeekHours(weekEntries)}
          >
            {Object.entries(dayGroups).map(
              ([dayIndex, [dayTimestamp, entries]]) => (
                <Section
                  subSection={true}
                  key={`d-${dayIndex}`}
                  headline={`${Weekday[new Date(dayTimestamp * 1000).getDay()]}, ${new Date(dayTimestamp * 1000).getDate()}th`}
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

      <div className="fixed bottom-22 right-4 flex gap-2">
        <FabAdd onClick={handleAddClick} />
        <FabStart />
      </div>

      <Modal
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
