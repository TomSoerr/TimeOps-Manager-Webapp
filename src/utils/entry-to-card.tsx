import { Entry } from '../components/common/Entry';
import React from 'react';
import DatabaseEntry from '../types/database.types';

function createEntry(entry: DatabaseEntry) {
  const duration = (entry['end-time-utc'] - entry['start-time-utc']) / 3600; // hours
  const formattedTime = `${Math.floor(duration)}:${Math.round(
    (duration % 1) * 60,
  )
    .toString()
    .padStart(2, '0')}`;

  return (
    <Entry
      key={entry.id}
      name={entry.name}
      synced={entry.synced}
      tag={entry.tag}
      id={entry.id}
      time={formattedTime}
      color={entry.color}
    />
  );
}

export { createEntry };
