import { Entry } from '../components/common/Entry';
import React, { JSX } from 'react';
import TimeEntry from '../types/database.types';
import { epochToHHMM } from './time';

function createEntry(entry: TimeEntry, onClick: () => void): JSX.Element {
  const duration = (entry['endTimeUtc'] - entry['startTimeUtc']) / 3600; // hours

  const hours = Math.floor(duration);
  const minutes = Math.round((duration % 1) * 60);
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

  const start = epochToHHMM(entry['startTimeUtc']);
  const end = epochToHHMM(entry['endTimeUtc']);

  return (
    <li key={entry.id}>
      <Entry
        name={entry.name}
        synced={entry.synced}
        tag={entry.tagName}
        time={formattedTime}
        color={entry.tagColor}
        msg={entry.msg}
        onClick={onClick}
        timespan={start + ' - ' + end}
      />
    </li>
  );
}

export { createEntry };
