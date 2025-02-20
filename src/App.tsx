import React from 'react';
import { Section } from './components/layout/Section';
import { Entry } from './components/common/Entry';
import { FabAdd } from './components/common/FabAdd';
import { FabStart } from './components/common/FabStart';
import { createEntry } from './utils/entry-to-card';
import DatabaseEntry from './types/database.types';
import database from './database';

const App: React.FC = () => {
  return (
    <main className="font-sans pt-16 px-2 antialiased min-h-screen bg-slate-50">
      <Section
        headline="Week 9, 2025"
        hours="42:21"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj))}
      </Section>
      <Section
        headline="Week 8, 2025"
        hours="38:21"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj))}
      </Section>
      <Section
        headline="Week 7, 2025"
        hours="37:11"
      >
        {database.map((obj: DatabaseEntry) => createEntry(obj))}
      </Section>
      <div className="fixed bottom-6 right-4 flex gap-2">
        <FabStart />
        <FabAdd />
      </div>
    </main>
  );
};

export default App;
