import { db } from '../db-instance';
import { Entry } from '../schema';
import TimeEntry from '../../types/database.types';

export async function setEntry(entry: Entry): Promise<void> {
  console.log(entry);
  if (entry.id === undefined) {
    await db.entries.add({
      name: entry.name,
      startTimeUtc: entry.startTimeUtc,
      endTimeUtc: entry.endTimeUtc,
      tagId: entry.tagId,
      synced: 0, // local change so not synced yet
      msg: '',
    });
  } else {
    // Update the existing entry
    await db.entries.update(entry.id, {
      name: entry.name,
      startTimeUtc: entry.startTimeUtc,
      endTimeUtc: entry.endTimeUtc,
      tagId: entry.tagId,
      synced: 0, // local change so not synced yet
    });
  }
}

export async function initializeDefaultEntry(): Promise<void> {
  const entryCount = await db.entries.count();

  if (entryCount === 0) {
    // First check if we have any tags
    const tagCount = await db.tags.count();
    let defaultTagId = 1;

    // If no tags exist, create a default one
    if (tagCount === 0) {
      const newTagId = await db.tags.add({
        id: 1,
        name: 'Default',
        color: 'slate', // some default color
      });
      defaultTagId = newTagId;
    } else {
      // Or get the first available tag
      const firstTag = await db.tags.toCollection().first();
      if (firstTag && firstTag?.id) {
        defaultTagId = firstTag.id;
      }
    }

    // Add a default entry with valid tag
    await setEntry({
      name: 'Welcome Entry',
      startTimeUtc: Math.floor(Date.now() / 1000) - 3600,
      endTimeUtc: Math.floor(Date.now() / 1000),
      tagId: defaultTagId,
      synced: 0,
      msg: '',
      remoteId: undefined,
    });
  }
}

export async function getAllEntriesWithTags(): Promise<TimeEntry[]> {
  return await db.entries
    .orderBy('startTimeUtc')
    .reverse()
    .toArray(async (entries) => {
      return Promise.all(
        entries.map(async (entry) => {
          let tag = await db.tags.get(entry.tagId);

          if (!tag) {
            console.warn(
              `Tag with id ${entry.tagId} not found for entry ${entry.id}, attempting to recover...`,
            );

            // Find the first available tag
            const firstTag = await db.tags.toCollection().first();

            if (!firstTag) {
              throw new Error('No Tag');
            } else {
              tag = firstTag;
            }

            // Update the entry with the new tag
            if (entry.id) {
              await db.entries.update(entry.id, {
                tagId: tag.id,
                synced: 0, // Mark as not synced
              });

              // Update entry object for this function's return value
              entry.tagId = tag.id;

              // Here you would call your remote update function if needed
              // await updateRemote(entry.id);
            }
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
