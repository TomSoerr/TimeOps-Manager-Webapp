import Dexie, { Table } from 'dexie';
import Color from '../types/color.types';
import DatabaseEntry from '../types/database.types';

// Define interfaces for the tables
export interface Tag {
  id?: number;
  name: string;
  color: Color['color'];
}

export interface Entry {
  id?: number;
  name: string;
  synced: boolean;
  tagId: number; //  key to Tag table
  startTimeUtc: number;
  endTimeUtc: number;
}

export type TagList = [string, Color['color'], number | undefined][];

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

  async getAllTag(): Promise<TagList> {
    const tags = await this.tags.toArray();
    return tags.map((tag) => [tag.name, tag.color, tag.id]);
  }

  async setTag(entry: TagList[0]): Promise<void> {
    const [name, color, id] = entry;

    if (id === undefined) {
      // Create a new tag with name and color
      await this.tags.add({
        name: name,
        color: color,
      });
    } else {
      // Update the existing tag with the given id
      await this.tags.update(id, {
        name: name,
        color: color,
      });
    }
  }

  async setEntry(entry: DatabaseEntry): Promise<void> {
    // Find the tag id based on the tag name
    const tag = await this.tags.where('name').equals(entry.tagName).first();

    if (!tag) {
      throw new Error(`Tag with name ${entry.tagName} not found`);
    }

    if (!tag?.id) {
      throw new Error(`Tag id with name ${entry.tagName} not found`);
    }

    // create new entry if id is undefined

    if (entry.id === undefined) {
      await this.entries.add({
        name: entry.name,
        startTimeUtc: entry.startTimeUtc,
        endTimeUtc: entry.endTimeUtc,
        tagId: tag.id,
        synced: entry.synced,
      });
    } else {
      // Update the existing entry
      await this.entries.update(entry.id, {
        name: entry.name,
        startTimeUtc: entry.startTimeUtc,
        endTimeUtc: entry.endTimeUtc,
        tagId: tag.id,
        synced: entry.synced,
      });
    }
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
