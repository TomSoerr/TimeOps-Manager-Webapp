import Dexie, { Table } from 'dexie';
import Color from '../types/color.types';
import TimeEntry from '../types/database.types';
import { API_BASE_URL } from '../vars';

// Define interfaces for the tables
export interface Tag {
  id: number;
  name: string;
  color: Color['color'];
}

export interface Entry {
  id?: number | undefined;
  remoteId?: number;
  name: string;
  synced: 0 | 1;
  tagId: number;
  startTimeUtc: number;
  endTimeUtc: number;
  msg: string;
}

export interface TagList {
  name: string;
  color: Color['color'];
  id: number;
}

// Define the database
export class TimeOpsDB extends Dexie {
  entries!: Table<Entry>;
  tags!: Table<Tag>;

  constructor() {
    super('timeOpsDB');
    this.version(1).stores({
      tags: 'id, name, color',
      entries: '++id, remoteId, tagId, synced, startTimeUtc, endTimeUtc',
    });
  }

  async updateLocal(): Promise<void> {
    const url = this.getUrl();
    const token = this.getToken();

    if (!url || !token) {
      throw new Error('API URL or token is missing');
    }

    try {
      // Fetch entries and tags from the API
      const [entriesResponse, tagsResponse] = await Promise.all([
        fetch(`${url}${API_BASE_URL}/entries`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${url}${API_BASE_URL}/tags`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (!entriesResponse.ok) {
        throw new Error(
          `Failed to fetch entries: ${entriesResponse.statusText}`,
        );
      }

      if (!tagsResponse.ok) {
        throw new Error(`Failed to fetch tags: ${tagsResponse.statusText}`);
      }

      const entriesFromApi = (await entriesResponse.json()).entries;
      const tagsFromApi = (await tagsResponse.json()).tags;

      // Update the Dexie database
      await this.transaction('rw', this.entries, this.tags, async () => {
        // Keep unsynced entries (synced === false)
        const unsyncedEntries = await this.entries
          .where('synced')
          .equals(0)
          .toArray();

        await this.entries.clear();

        await this.entries.bulkAdd(unsyncedEntries);

        const entriesToAdd = entriesFromApi.map(
          (entry: any): Entry => ({
            remoteId: entry.id,
            name: entry.name,
            synced: 1, // Mark as synced since they come from the API
            tagId: entry.tagId,
            startTimeUtc: entry.startTimeUtc,
            endTimeUtc: entry.endTimeUtc,
            msg: '',
          }),
        );
        await this.entries.bulkAdd(entriesToAdd);

        await this.tags.clear();
        const tagsToAdd = tagsFromApi.map(
          (tag: any): Tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          }),
        );
        await this.tags.bulkAdd(tagsToAdd);
      });

      console.log('Local database updated successfully');
    } catch (error) {
      console.error('Error updating local database:', error);
      throw error;
    }
  }

  async updateRemote(): Promise<void> {
    const url = this.getUrl();
    const token = this.getToken();

    if (!url || !token) {
      throw new Error('API URL or token is missing');
    }

    try {
      // Query all entries that are not synced (synced = 0)
      const unsyncedEntries = await this.entries
        .where('synced')
        .equals(0)
        .toArray();

      if (unsyncedEntries.length === 0) {
        console.log('No unsynced entries to update');
        return;
      }

      console.log(`Found ${unsyncedEntries.length} unsynced entries to update`);

      for (let i = 0; i < unsyncedEntries.length; i++) {
        const entry = unsyncedEntries[i];
        // Case 1: Entry doesn't have a remoteId - create new entry via POST
        if (!entry.remoteId) {
          const response = await fetch(`${url}${API_BASE_URL}/entries`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: entry.name,
              startTimeUtc: entry.startTimeUtc,
              endTimeUtc: entry.endTimeUtc,
              tagId: entry.tagId,
            }),
          });

          // catch validation error
          if (response.status === 400) {
            const errorData = await response.clone().json();

            await this.entries.update(entry.id, {
              msg: errorData.errors?.errors?.[0]?.msg || 'Validation failed',
            });
            continue;
          }

          if (!response.ok) {
            throw new Error(`Failed to create entry: ${response.statusText}`);
          }

          // remove current offline entry because it will be fetched with next data update

          if (entry.id !== undefined) {
            await this.entries.delete(entry.id);
          } else {
            console.warn('Could not delete local entry - ID is undefined');
          }
        }
        // Case 2: Entry has a remoteId - edit entry via PUT
        else {
          const response = await fetch(
            `${url}${API_BASE_URL}/entries/${entry.remoteId}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: entry.name,
                startTimeUtc: entry.startTimeUtc,
                endTimeUtc: entry.endTimeUtc,
                tagId: entry.tagId,
              }),
            },
          );

          // Handle validation errors
          if (response.status === 400) {
            const errorData = await response.clone().json();

            // Update the local entry with the error message
            await this.entries.update(entry.id, {
              msg: errorData.errors?.errors?.[0]?.msg || 'Validation failed',
            });
            continue;
          }

          // Handle other errors
          if (!response.ok) {
            throw new Error(`Failed to update entry: ${response.statusText}`);
          }

          if (entry.id !== undefined) {
            await this.entries.delete(entry.id);
          } else {
            console.warn('Could not delete local entry - ID is undefined');
          }
        }
      }

      console.log('Remote update completed successfully');
    } catch (error) {
      console.error('Error updating remote database:', error);
      throw error;
    }
  }

  async deleteRemote(): Promise<void> {
    const url = this.getUrl();
    const token = this.getToken();

    if (!url || !token) {
      throw new Error('API URL or token is missing');
    }

    try {
      await this.entries.clear();

      const response = await fetch(`${url}${API_BASE_URL}/entries`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete entries: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting remote entries:', error);
      throw error;
    }
  }

  async getAllEntriesWithTags(): Promise<TimeEntry[]> {
    return await this.entries
      .orderBy('startTimeUtc')
      .reverse()
      .toArray(async (entries) => {
        return Promise.all(
          entries.map(async (entry) => {
            const tag = await this.tags.get(entry.tagId);
            if (!tag) {
              throw new Error(
                `Tag with id ${entry.tagId} not found for entry ${entry.id}`,
              );
            }

            if (!entry.id) {
              throw new Error('No id for react key prop');
            }

            return {
              id: entry.id,
              remoteId: entry.remoteId,
              name: entry.name,
              synced: entry.synced ? true : false,
              startTimeUtc: entry.startTimeUtc,
              endTimeUtc: entry.endTimeUtc,
              tagId: entry.tagId,
              tagName: tag.name,
              tagColor: tag.color,
              msg: entry.msg,
            };
          }),
        );
      });
  }

  async getAllTag(): Promise<TagList[]> {
    const tags = await this.tags.toArray();
    return tags.map(
      (tag): TagList => ({
        name: tag.name,
        color: tag.color,
        id: tag.id,
      }),
    );
  }

  async setTag(entry: TagList, isOnline: boolean): Promise<void> {
    // only possible
  }

  async setEntry(entry: Entry): Promise<void> {
    console.warn(entry);

    if (entry.id === undefined) {
      await this.entries.add({
        name: entry.name,
        startTimeUtc: entry.startTimeUtc,
        endTimeUtc: entry.endTimeUtc,
        tagId: entry.tagId,
        synced: 0, // local change so not synced yet
        msg: '',
      });
    } else {
      // Update the existing entry
      await this.entries.update(entry.id, {
        name: entry.name,
        startTimeUtc: entry.startTimeUtc,
        endTimeUtc: entry.endTimeUtc,
        tagId: entry.tagId,
        synced: 0, // local change so not synced yet
      });
    }
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

  connect(): void {
    return;
  }
}

export async function deleteDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
}

export const db = new TimeOpsDB();
