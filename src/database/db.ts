import Dexie, { Table } from 'dexie';
import Color from '../types/color.types';
import TimeEntry from '../types/database.types';
import { API_BASE_URL } from '../vars';
import { offset } from '../utils/time';

// Define interfaces for the tables
export interface TagEntry {
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

interface UrlToken {
  url: string;
  token: string;
}

// Define the database
export class TimeOpsDB extends Dexie {
  entries!: Table<Entry>;
  tags!: Table<TagEntry>;

  constructor() {
    super('timeOpsDB');
    this.version(1).stores({
      tags: 'id, name, color',
      entries: '++id, remoteId, tagId, synced, startTimeUtc, endTimeUtc',
    });
  }

  async updateLocal(): Promise<void> {
    const { url, token } = this.getUrlToken();

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
          (tag: any): TagEntry => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          }),
        );
        await this.tags.bulkAdd(tagsToAdd);
      });
    } catch (error) {
      console.error('Error updating local database:', error);
      throw error;
    }
  }

  getUrlToken(): UrlToken {
    const url = this.getUrl();
    const token = this.getToken();

    if (!url || !token) {
      throw new Error('API URL or token is missing');
    }
    return { url, token };
  }

  async updateRemote(): Promise<boolean> {
    const { url, token } = this.getUrlToken();
    let unsyncableChange: boolean = false;
    let atLeastOneSync: boolean = false;

    try {
      // Query all entries that are not synced (synced = 0)
      const unsyncedEntries = await this.entries
        .where('synced')
        .equals(0)
        .toArray();

      if (unsyncedEntries.length === 0) return false;

      // TODO optimize and use batch update
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
              msg: errorData.errors?.[0]?.msg || 'Validation failed',
            });
            unsyncableChange = true;
            continue;
          }

          if (!response.ok) {
            throw new Error(`Failed to create entry: ${response.statusText}`);
          }

          // remove current offline entry because it will be fetched with next data update

          if (entry.id !== undefined) {
            await this.entries.delete(entry.id);
            atLeastOneSync = true;
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
              msg: errorData.errors?.[0]?.msg || 'Validation failed',
            });
            unsyncableChange = true;
            continue;
          }

          // Handle other errors
          if (!response.ok) {
            throw new Error(`Failed to update entry: ${response.statusText}`);
          }

          if (entry.id !== undefined) {
            await this.entries.delete(entry.id);
            atLeastOneSync = true;
          } else {
            console.warn('Could not delete local entry - ID is undefined');
          }
        }
      }
    } catch (error) {
      console.error('Error updating remote database:', error);
      throw error;
    }

    // return true if nothing send to server -> no sse event
    return unsyncableChange && !atLeastOneSync;
  }

  async deleteRemote(): Promise<void> {
    const { url, token } = this.getUrlToken();

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

  async importFile(file: File): Promise<void> {
    const { url, token } = this.getUrlToken();

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('import file', file);

      const response = await fetch(`${url}${API_BASE_URL}/db`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-UTC-Offset': `${offset}`,
        },
        body: formData,
      });
      console.info('importFile', response);

      if (!response.ok) {
        throw new Error(`Failed to import file: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      throw error;
    }
  }

  async exportDatabase(): Promise<void> {
    const { url, token } = this.getUrlToken();
    const apiUrl = url;

    try {
      const response = await fetch(`${apiUrl}${API_BASE_URL}/db`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to export database: ${response.statusText}`);
      }

      const data = await response.json();

      const jsonString = JSON.stringify(data, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      link.download = `timeops_export_${formattedDate}.json`;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting database:', error);
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

  async getAllTag(): Promise<TagEntry[]> {
    const tags = await this.tags.toArray();
    return tags.map(
      (tag): TagEntry => ({
        name: tag.name,
        color: tag.color,
        id: tag.id,
      }),
    );
  }

  async setTag(entry: TagEntry): Promise<void> {
    const { url, token } = this.getUrlToken();

    try {
      // Case 1: ID is -1, meaning it's a new tag to be created
      if (entry.id === -1) {
        const response = await fetch(`${url}${API_BASE_URL}/tags`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: entry.name,
            color: entry.color,
          }),
        });

        // Handle validation errors
        if (response.status === 400) {
          const errorData = await response.clone().json();
          const errorMessage =
            errorData.errors?.[0]?.msg || 'Tag validation failed';
          throw new Error(errorMessage);
        }

        // Handle other errors
        if (!response.ok) {
          throw new Error(`Failed to create tag: ${response.statusText}`);
        }

        // Force update of local database to get the new tag with proper ID
        await this.updateLocal();
        return;
      }

      // Case 2: ID is set, meaning it's an existing tag to be updated
      else {
        const response = await fetch(`${url}${API_BASE_URL}/tags/${entry.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: entry.name,
            color: entry.color,
          }),
        });

        // Handle validation errors
        if (response.status === 400) {
          const errorData = await response.clone().json();
          const errorMessage =
            errorData.errors?.[0]?.msg || 'Tag validation failed';
          console.error('Validation error updating tag:', errorMessage);
          throw new Error(errorMessage);
        }

        // Handle other errors
        if (!response.ok) {
          throw new Error(`Failed to update tag: ${response.statusText}`);
        }

        // Force update of local database to get the updated tag
        await this.updateLocal();
        return;
      }
    } catch (error) {
      console.error('Error setting tag:', error);
      throw error;
    }
  }

  async setEntry(entry: Entry): Promise<void> {
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
    const { url } = this.getUrlToken();

    try {
      const response = await fetch(`${url}${API_BASE_URL}/user`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

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
}

export async function deleteDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
}

export const db = new TimeOpsDB();
