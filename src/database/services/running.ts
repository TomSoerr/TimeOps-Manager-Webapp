import { db } from '../db-instance';
import { Running } from '../schema';
import { TimeRunningEntry } from '../../types/database.types';

export async function setRunning(running: Running): Promise<void> {
  await db.running.put(running, 'current');
}

export async function getRunning(): Promise<TimeRunningEntry | undefined> {
  const running = await db.running.get('current');
  if (!running) {
    return undefined;
  }

  // Fetch the associated tag to get name and color
  const tag = await db.tags.get(running.tagId);
  if (!tag) {
    console.warn(`Tag with id ${running.tagId} not found for running entry`);
    return undefined;
  }

  return {
    name: running.name,
    synced: running.synced === 1,
    tagId: running.tagId,
    tagName: tag.name,
    tagColor: tag.color,
    startTimeUtc: running.startTimeUtc,
    endTimeUtc: 0, // No end time for running entry
    msg: running.msg,
  };
}

export async function clearRunning(): Promise<void> {
  await db.running.delete('current');
}
