import { db } from '../db-instance';
import { Entry, TagEntry } from '../schema';
import { getUrlToken } from '../utils/api-helpers';
import { API_BASE_URL } from '../../vars';
import { offset } from '../../utils/time';

export async function updateLocal(): Promise<void> {
  const { url, token } = getUrlToken();

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
      throw new Error(`Failed to fetch entries: ${entriesResponse.statusText}`);
    }

    if (!tagsResponse.ok) {
      throw new Error(`Failed to fetch tags: ${tagsResponse.statusText}`);
    }

    const entriesFromApi = (await entriesResponse.json()).entries;
    const tagsFromApi = (await tagsResponse.json()).tags;

    // Update the Dexie database
    await db.transaction('rw', db.entries, db.tags, async () => {
      // Keep unsynced entries (synced === false)
      const unsyncedEntries = await db.entries
        .where('synced')
        .equals(0)
        .toArray();

      await db.entries.clear();

      await db.entries.bulkAdd(unsyncedEntries);

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
      await db.entries.bulkAdd(entriesToAdd);

      await db.tags.clear();
      const tagsToAdd = tagsFromApi.map(
        (tag: any): TagEntry => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }),
      );
      await db.tags.bulkAdd(tagsToAdd);
    });
  } catch (error) {
    console.error('Error updating local database:', error);
    throw error;
  }
}

export async function updateRemote(): Promise<boolean> {
  const { url, token } = getUrlToken();
  let unsyncableChange: boolean = false;
  let atLeastOneSync: boolean = false;

  try {
    // Query all entries that are not synced (synced = 0)
    const unsyncedEntries = await db.entries
      .where('synced')
      .equals(0)
      .toArray();

    if (unsyncedEntries.length === 0) return false;

    // Process each unsynced entry
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

        // Handle validation error
        if (response.status === 400) {
          const errorData = await response.clone().json();
          await db.entries.update(entry.id, {
            msg: errorData.errors?.[0]?.msg || 'Validation failed',
          });
          unsyncableChange = true;
          continue;
        }

        if (!response.ok) {
          throw new Error(`Failed to create entry: ${response.statusText}`);
        }

        // Remove local entry since it will be fetched with next data update
        if (entry.id !== undefined) {
          await db.entries.delete(entry.id);
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
          await db.entries.update(entry.id, {
            msg: errorData.errors?.[0]?.msg || 'Validation failed',
          });
          unsyncableChange = true;
          continue;
        }

        // Handle other errors
        if (!response.ok) {
          throw new Error(`Failed to update entry: ${response.statusText}`);
        }

        // Remove local entry since the updated version will be fetched
        if (entry.id !== undefined) {
          await db.entries.delete(entry.id);
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

  // Return true if nothing was sent to server (only unsyncable changes)
  return unsyncableChange && !atLeastOneSync;
}

export async function deleteRemote(): Promise<void> {
  const { url, token } = getUrlToken();

  try {
    await db.entries.clear();

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

export async function importFile(file: File): Promise<void> {
  const { url, token } = getUrlToken();

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

export async function exportDatabase(): Promise<void> {
  const { url, token } = getUrlToken();
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
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    link.download = `timeops_export_${formattedDate}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  } catch (error) {
    console.error('Error exporting database:', error);
    throw error;
  }
}
