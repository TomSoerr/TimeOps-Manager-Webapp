import { db, Tag, Entry } from './db';

export async function isDatabaseEmpty(): Promise<boolean> {
  const tagCount = await db.tags.count();
  const entryCount = await db.entries.count();
  return tagCount === 0 && entryCount === 0;
}

export async function seedDatabase(): Promise<void> {
  // Initial tags
  const initialTags: Tag[] = [
    // "No Project" is need as default value, don't remove
    { name: 'No Project', color: 'slate' },
    { name: 'TimeOps Manager', color: 'amber' },
    { name: 'SICP JS', color: 'lime' },
  ];

  const tagIds = await db.tags.bulkAdd(initialTags, { allKeys: true });

  // Initial entries
  const initalEntries: Entry[] = [
    {
      name: 'API Tests',
      tagId: tagIds[1],
      synced: false,
      endTimeUtc: 1740059772,
      startTimeUtc: 1740052572,
    },
    {
      name: 'React Components',
      synced: true,
      tagId: tagIds[1],
      endTimeUtc: 1740051912,
      startTimeUtc: 1740048312,
    },
    {
      name: 'Figma Mockup',
      synced: true,
      tagId: tagIds[1],
      endTimeUtc: 1739961912,
      startTimeUtc: 1739952630,
    },
    {
      name: 'Chapter 3.2',
      synced: true,
      tagId: tagIds[2],
      endTimeUtc: 1739288730,
      startTimeUtc: 1739261430,
    },
  ];

  await db.entries.bulkAdd(initalEntries);
}
