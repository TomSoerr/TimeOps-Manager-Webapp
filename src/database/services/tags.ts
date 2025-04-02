import { db } from '../db-instance';
import { TagEntry } from '../schema';
import { getUrlToken } from '../utils/api-helpers';
import { API_BASE_URL } from '../../constants/global';
import { updateLocal } from './sync';

export async function getAllTags(): Promise<TagEntry[]> {
  const tags = await db.tags.toArray();
  return tags.map(
    (tag): TagEntry => ({
      name: tag.name,
      color: tag.color,
      id: tag.id,
    }),
  );
}

export async function setTag(entry: TagEntry): Promise<void> {
  const { url, token } = getUrlToken();

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
      await updateLocal();
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
      await updateLocal();
      return;
    }
  } catch (error) {
    console.error('Error setting tag:', error);
    throw error;
  }
}
