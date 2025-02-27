import Dexie, { Table } from 'dexie';
import Color from '../types/color.types';
import DatabaseEntry from '../types/database.types';

// Define interfaces for the tables
interface Tag {
  id?: number;
  name: string;
  color: Color['color'];
}

interface Entry {
  id?: number;
  name: string;
  synced: boolean;
  tagId: number; //  key to Tag table
  startTimeUtc: number;
  endTimeUtc: number;
}

// Define the database
export class TimeOpsDB extends Dexie {
  entries!: Table<Entry>;
  tags!: Table<Tag>;

  constructor() {
    super('timeOpsDB');
    this.version(1).stores({
      tags: '++id, name',
      entries: '++id, tagId, synced, startTimeUtc, endTimeUtc',
    });
  }

  async getEntryWithTag(id: number): Promise<DatabaseEntry | null> {
    const entry = await this.entries.get(id);
    if (!entry) return null;

    const tag = await this.tags.get(entry.tagId);
    return { ...entry, tag };
  }

  async getAllTag(): Promise<string[] | null> {
    return null;
  }

  async getAllEntriesWithTags(): Promise<DatabaseEntry[]> {
    const entries = await this.entries
      .orderBy('startTimeUtc')
      .reverse()
      .toArray();
    const tags = await this.tags.toArray();

    return entries.map((entry: Entry) => {
      const tag = tags.find((t) => t.id === entry.tagId);

      if (!tag) {
        throw new Error(
          `Tag with id ${entry.tagId} not found for entry ${entry.id}`,
        );
      }

      if (!entry.id) {
        throw new Error('Entry has no ID');
      }

      return {
        id: entry.id,
        name: entry.name,
        synced: entry.synced,
        startTimeUtc: entry.startTimeUtc,
        endTimeUtc: entry.endTimeUtc,
        tagName: tag.name,
        tagColor: tag.color,
      };
    });
  }
}

export async function deleteDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
}

export const db = new TimeOpsDB();
