import React, { useState } from 'react';
import { Section } from '../components/layout/Section';
import { FabAdd } from '../components/common/FabAdd';
import { FabStart } from '../components/common/FabStart';
import { createEntry } from '../utils/entry-to-card';
import DatabaseEntry from '../types/database.types';
import database from '../database';
import { Modal } from './Modal';

const Timer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseClick = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Section
        headline="Week 9, 2025"
        hours="42:21"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj, handleAddClick))}
      </Section>
      <Section
        headline="Week 8, 2025"
        hours="38:21"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj, handleAddClick))}
      </Section>
      <Section
        headline="Week 7, 2025"
        hours="37:11"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj, handleAddClick))}
      </Section>
      <div className="fixed bottom-24 right-4  flex gap-2">
        <FabAdd onClick={handleAddClick} />
        <FabStart />
      </div>

      <Modal
        onClose={handleCloseClick}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default Timer;
