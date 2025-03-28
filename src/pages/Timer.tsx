import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { Section } from '../components/layout/Section';
import { FabAdd } from '../components/common/FabAdd';
import { FabStart } from '../components/common/FabStart';
import { createEntry } from '../utils/entryToCard.tsx';
import TimeEntry, { TimeRunningEntry } from '../types/database.types';
import { Modal } from './Modal';
import {
  TagEntry,
  getAllTags as getAllTag,
  updateLocal,
  getRunning,
  getAllEntriesWithTags,
  setEntry,
  clearRunning,
  updateRemote,
  setRunning,
} from '../database/index';
import {
  sumUpHours,
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
import { RunningEntry } from '../components/common/Running.tsx';

const Timer: React.FC = () => {
  const { isOnline } = useConnection();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tags, setTags] = useState<TagEntry[]>([]);
  const [running, setRunningState] = useState<TimeRunningEntry | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  // Memoize functions to prevent unnecessary re-renders
  const loadEntries = useCallback(async () => {
    try {
      const entriesWithTags = await getAllEntriesWithTags();
      setEntries(entriesWithTags);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const tags = await getAllTag();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  const loadRunning = useCallback(async () => {
    try {
      const running = await getRunning();
      console.log('59 retured running', running);
      setRunningState(running);
    } catch (error) {
      console.error('Failed to load running entry:', error);
    }
  }, []);

  // Combined data loading function
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
  }, [isOnline, loadEntries, loadTags, loadRunning]);

  // Handle form actions
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
  }, [formData, tags]);

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

  const handleAddRunningClick = useCallback(async () => {
    if (tags.length === 0) return;

    try {
      if (!running) {
        await setRunning({
          name: 'Running Entry',
          synced: 0,
          tagId: tags[0]?.id || 0,
          startTimeUtc: Math.round(Date.now() / 1000),
          msg: '',
        });
      } else {
        const runningEntry = await getRunning();
        if (runningEntry) {
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
  }, [tags, loadRunning, loadEntries, isOnline]);

  const handleEditRunningClick = useCallback(
    (entry: TimeRunningEntry) => {
      setFormData({
        tagId: entry.tagId,
        name: entry.name,
        startTime: epochToHHMM(entry.startTimeUtc),
        startDate: epochToYYMMDD(entry.startTimeUtc),
      });
    },
    [loadRunning, loadEntries, isOnline],
  );

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

  const createDate = (date: number): string => {
    const d = new Date(date * 1000);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

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
      {running ?
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Running Entry
          </h2>
          <RunningEntry
            name={running.name}
            timespan={`${epochToHHMM(running.startTimeUtc)} - now`}
            startTimeUTC={running.startTimeUtc}
            synced={running.synced ? true : false}
            tag={running.tagName}
            color={running.tagColor}
            onClick={() => handleEditRunningClick(running)}
            msg={running.msg}
          />
        </div>
      : ''}

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
                      {createEntry(entry, () => handleEditClick(entry))}
                    </React.Fragment>
                  ))}
                </Section>
              ),
            )}
          </Section>
        );
      })}

      <div className="fixed bottom-22 lg:bottom-4 lg:right-[calc((100vw-48rem)/2)] right-4 flex gap-2">
        <FabAdd onClick={handleAddClick} />
        <FabStart
          onClick={handleAddRunningClick}
          running={running}
        />
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
