import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { Section } from '../components/layout/Section';
import { FabAdd } from '../components/common/FabAdd';
import { FabStart } from '../components/common/FabStart';
import { createEntry } from '../utils/entryToCard.tsx';
import TimeEntry from '../types/database.types';
import { Modal } from './Modal';
import { db, Entry, TagEntry } from '../database/db';
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
  const { isOnline } = useConnection();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tags, setTags] = useState<TagEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  // Memoize functions to prevent unnecessary re-renders
  const loadEntries = useCallback(async () => {
    try {
      const entriesWithTags = await db.getAllEntriesWithTags();
      setEntries(entriesWithTags);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const tags = await db.getAllTag();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  // Combined data loading function
  const handleDataUpdate = useCallback(async () => {
    console.info('Data updated, isOnline:', isOnline);
    setIsLoading(true);

    try {
      if (isOnline) {
        await db.updateLocal();
      }

      // Load data in parallel for better performance
      await Promise.all([loadTags(), loadEntries()]);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, loadEntries, loadTags]);

  // Handle form actions
  const handleAddClick = useCallback(() => {
    if (tags.length === 0) return;
    if (!formData) return;

    const now = new Date();
    const twoHoursAgo = new Date(Date.now() - 7200000);

    setFormData({
      name: '',
      date: twoHoursAgo.toISOString().split('T')[0],
      startTime: formatTime(twoHoursAgo),
      endTime: formatTime(now),
      tagId: tags[0]?.id || 0,
    });
  }, [formData, tags]);

  const handleEditClick = useCallback((entry: TimeEntry) => {
    setFormData({
      id: entry.id,
      tagId: entry.tagId,
      name: entry.name,
      startTime: epochToHHMM(entry.startTimeUtc),
      endTime: epochToHHMM(entry.endTimeUtc),
      date: epochToYYMMDD(entry.startTimeUtc),
    });
  }, []);

  const handleClose = useCallback(() => {
    setFormData(undefined);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData) {
        console.error('Trying to submit empty form');
        return;
      }

      const formDataCopy = { ...formData };
      setFormData(undefined); // Close modal

      const newEntry: Entry = {
        id: formDataCopy.id || undefined,
        name: formDataCopy.name,
        tagId: formDataCopy.tagId,
        synced: 0, // because new
        startTimeUtc: dateToEpoch(formDataCopy.date, formDataCopy.startTime),
        endTimeUtc: dateToEpoch(formDataCopy.date, formDataCopy.endTime),
        msg: '',
      };

      try {
        await db.setEntry(newEntry);

        setTimeout(() => {
          if (isOnline) {
            db.updateRemote();
          } else {
            loadEntries();
          }
        }, ANIMATION_LENGTH);
      } catch (error) {
        console.error('Failed to submit entry:', error);
      }
    },
    [formData, isOnline, loadEntries],
  );

  // Effect for online status changes
  useEffect(() => {
    if (!isOnline) return;

    let isMounted = true; // For cleanup/abort

    const runUpdates = async () => {
      try {
        await handleDataUpdate();
        await db.updateRemote();
      } catch (error) {
        console.error('Error during updates:', error);
      }
    };

    if (isMounted) runUpdates();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, [isOnline, handleDataUpdate]);

  // Effect for data update event listener
  useEffect(() => {
    window.addEventListener('data-update', handleDataUpdate);

    handleDataUpdate();

    return () => {
      window.removeEventListener('data-update', handleDataUpdate);
    };
  }, [handleDataUpdate]);

  // Memoize expensive calculations
  const weekGroups = useMemo(
    () =>
      groupEntriesByInterval(entries, start, SECONDS_PER_WEEK, SECONDS_PER_DAY),
    [entries],
  );

  const weekGroupsEntries = useMemo(
    () => Object.entries(weekGroups) as Array<[string, GroupedEntries[number]]>,
    [weekGroups],
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

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
                  {entries.map((entry) => (
                    <React.Fragment
                      key={entry.id || entry.remoteId || Date.now()}
                    >
                      {createEntry(entry, () => handleEditClick(entry))}
                    </React.Fragment>
                  ))}
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
