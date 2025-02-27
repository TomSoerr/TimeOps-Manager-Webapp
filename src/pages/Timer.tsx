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
  interval,
  epochToHHMM,
  epochToYYMMDD,
} from '../utils/time.ts';
import { groupEntriesByInterval } from '../utils/groupEntries.ts';
import { FormData } from './Modal';

const Timer: React.FC = () => {
  const [entries, setEntries] = useState<DatabaseEntry[]>([]);
  const [tags, setTags] = useState<DatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  const handleAddClick = () => {
    const emptyForm: FormData = {
      name: '',
      date: new Date().toISOString().split('T')[0],
      startTime: 'string',
      endTime: 'string',
      tag: 'No Project',
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
      const entriesWithTags = await db.getAllEntriesWithTags();
      setEntries(entriesWithTags);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
    loadTags();
  }, []);

  const handleCloseClick = () => {
    setFormData(undefined);
  };

  const handleEditClick = (entry: DatabaseEntry) => {
    setFormData({
      name: entry.name,
      tag: entry.tagName,
      startTime: epochToHHMM(entry.startTimeUtc),
      endTime: epochToHHMM(entry.endTimeUtc),
      date: epochToYYMMDD(entry.startTimeUtc),
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const weekGroups = groupEntriesByInterval(entries, start, interval);

  console.log(weekGroups);

  return (
    <>
      {Object.entries(weekGroups).map(([groupIndex, groupEntries]) => (
        <Section
          key={groupIndex}
          headline={`Week ${-Number(groupIndex) + 1}`}
          hours={calculateWeekHours(groupEntries)}
        >
          {groupEntries.map((entry: DatabaseEntry) =>
            createEntry(entry, () => handleEditClick(entry)),
          )}
        </Section>
      ))}

      <div className="fixed bottom-24 right-4 flex gap-2">
        <FabAdd onClick={handleAddClick} />
        <FabStart />
      </div>

      <Modal
        onClose={handleCloseClick}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default Timer;
