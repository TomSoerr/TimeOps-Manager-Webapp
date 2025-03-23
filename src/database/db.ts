import Dexie, { Table } from 'dexie';
import Color from '../types/color.types';
import TimeEntry from '../types/database.types';
import { API_BASE_URL } from '../vars';

// Define interfaces for the tables
export interface Tag {
  id?: number;
  name: string;
  color: Color['color'];
}

export interface Entry {
  localId?: number;
  id?: number;
  name: string;
  synced: boolean;
  tagId: number;
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
      entries: '++localId, id, tagId, synced, startTimeUtc, endTimeUtc', // add db id for RESTful api request
    });
  }

  async updateLocal(): Promise<void> {
    const url = this.getUrl();
    const token = this.getToken();

    if (!url || !token) {
      throw new Error('API URL or token is missing');
    }

    try {
      const entriesData = await fetch(`${url}${API_BASE_URL}/entries`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const tagsData = await fetch(`${url}${API_BASE_URL}/entries`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!entriesData.ok) {
        throw new Error(`Failed to fetch entries: ${entriesData.statusText}`); // TODO test statusText
      }

      if (!tagsData.ok) {
        throw new Error(`Failed to fetch tags: ${tagsData.statusText}`); // TODO test statusText
      }

      // after the entries are fetched the dexie db should be updated. It is important to keep entries that are tagged synced false. All entries that are synced can be removed from the dexie db and all entries from the api should be written to the the local db. the tag table can just be overwritten because there is not feature to change the tags in offline mode
    } catch (error) {
      console.error('Error fetching entries from API:', error);
      throw error;
    }
  }

  async getAllTag(isOnline: boolean): Promise<TagList> {
    const tags = await this.tags.toArray();
    return tags.map((tag) => [tag.name, tag.color, tag.id]);
  }

  async setTag(entry: TagList[0]): Promise<void> {
    const [name, color, id] = entry;

    // TODO check if tag with this name exists
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

  async setEntry(entry: TimeEntry): Promise<void> {
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

  async getAllEntriesWithTags(isOnline: boolean): Promise<TimeEntry[]> {
    let entriesData: Entry[];
    let tagsData: Tag[];

    entriesData = await this.entries
      .orderBy('startTimeUtc')
      .reverse()
      .toArray();

    tagsData = await this.tags.toArray();

    /**
     * Update local Tags, Entries and Running table after view update
     */

    /**
     * Join the Tags and Entries Table
     */
    return entriesData.map((entry: Entry) => {
      const tag = tagsData.find((t) => t.id === entry.tagId);

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

  // new functions

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUrl(): string {
    return localStorage.getItem('url') || '';
  }

  updateUrl(url: string): void {
    // Remove trailing "/" if present
    const sanitizedUrl = url.replace(/\/$/, '');
    localStorage.setItem('url', sanitizedUrl);
  }

  async createToken(): Promise<void> {
    const url = this.getUrl();
    if (!url) throw Error('No URL defined');

    try {
      const response = await fetch(`${url}${API_BASE_URL}/user`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(data);

      if (!data.user.apiToken) {
        throw new Error('API token not found in the response');
      }

      // Store the token in localStorage
      this.updateToken(data.user.apiToken);
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  }

  updateToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // fetchData = async () => {
  //   try {
  //     // Different behavior based on online status
  //     if (isOnline) {
  //       const response = await fetch('https://api.example.com/data');
  //       const newData = await response.json();
  //       eventBus.publish(EventTypes.DATA_UPDATED, newData);
  //     } else {
  //       // Get from local storage when offline
  //       const cachedData = localStorage.getItem('cached_data');
  //       if (cachedData) {
  //         eventBus.publish(EventTypes.DATA_UPDATED, JSON.parse(cachedData));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  connect(): void {
    return;
  }
}

export async function deleteDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
}

export const db = new TimeOpsDB();
