import { Entry } from '../components/common/Entry';
import React from 'react';
import DatabaseEntry from '../types/database.types';

function createEntry(entry: DatabaseEntry, onClick: () => void) {
  const duration = (entry['endTimeUtc'] - entry['startTimeUtc']) / 3600; // hours

  // calculate length of entry
  const hours = Math.floor(duration);
  const minutes = Math.floor((duration % 1) * 60);
  const seconds = Math.round((((duration % 1) * 60) % 1) * 60);

  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <li key={entry.id}>
      <Entry
        key={entry.id}
        name={entry.name}
        synced={entry.synced}
        tag={entry.tagName}
        id={entry.id}
        time={formattedTime}
        color={entry.tagColor}
        onClick={onClick}
      />
    </li>
  );
}

export { createEntry };
