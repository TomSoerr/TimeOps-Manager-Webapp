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

export async function getAllEntriesWithTags(): Promise<TimeEntry[]> {
  return await db.entries
    .orderBy('startTimeUtc')
    .reverse()
    .toArray(async (entries) => {
      return Promise.all(
        entries.map(async (entry) => {
          const tag = await db.tags.get(entry.tagId);
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
