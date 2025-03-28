import Dexie, { Table } from 'dexie';
import { Entry, TagEntry, Running } from './schema';

// Define the database
export class TimeOpsDB extends Dexie {
  entries!: Table<Entry>;
  tags!: Table<TagEntry>;
  running!: Table<Running>;

  constructor() {
    super('timeOpsDB');
    this.version(1).stores({
      tags: 'id, name, color',
      entries: '++id, remoteId, tagId, synced, startTimeUtc, endTimeUtc',
      running: '', // Key-value store for a single running entry
    });
  }
}

// Create and export the database instance
export const db = new TimeOpsDB();

export async function deleteDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
  await db.running.clear();
}
