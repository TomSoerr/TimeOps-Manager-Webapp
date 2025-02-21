import { Entry } from '../components/common/Entry';
import React from 'react';
import DatabaseEntry from '../types/database.types';
import { v4 as uuid } from 'uuid';

function createEntry(entry: DatabaseEntry, open: () => void) {
  const duration = (entry['end-time-utc'] - entry['start-time-utc']) / 3600; // hours
  const formattedTime = `${Math.floor(duration)}:${Math.round(
    (duration % 1) * 60,
  )
    .toString()
    .padStart(2, '0')}`;

  return (
    <li key={uuid()}>
      <Entry
        key={entry.id}
        name={entry.name}
        synced={entry.synced}
        tag={entry.tag}
        id={entry.id}
        time={formattedTime}
        color={entry.color}
        onClick={open}
      />
    </li>
  );
}

export { createEntry };
