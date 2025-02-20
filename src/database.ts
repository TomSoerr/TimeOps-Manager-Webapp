import DatabaseEntry from './types/database.types';

const database: DatabaseEntry[] = [
  {
    'name': 'Task 1',
    'synced': false,
    'tag': 'TimeOps Manager',
    'id': 1,
    'color': 'lime',
    'end-time-utc': 1740059772,
    'start-time-utc': 1740052572,
  },
  {
    'name': 'Task 2',
    'synced': true,
    'tag': 'TimeOps Manager',
    'id': 2,
    'color': 'amber',
    'end-time-utc': 1740051912,
    'start-time-utc': 1740048312,
  },
  {
    'name': 'Task 3',
    'synced': true,
    'tag': 'SICP JS',
    'id': 3,
    'color': 'red',
    'end-time-utc': 1739961912,
    'start-time-utc': 1739952630,
  },
  {
    'name': 'Task 4',
    'synced': true,
    'tag': 'TimeOps Manager',
    'id': 4,
    'color': 'blue',
    'end-time-utc': 1739288730,
    'start-time-utc': 1739261430,
  },
];

export default database;
