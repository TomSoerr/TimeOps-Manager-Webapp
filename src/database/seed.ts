import { db, Tag, Entry } from './db';

export async function isDatabaseEmpty(): Promise<boolean> {
  const tagCount = await db.tags.count();
  const entryCount = await db.entries.count();
  return tagCount === 0 && entryCount === 0;
}

export async function seedDatabase(): Promise<void> {
  // Initial tags
  const initialTags: Tag[] = [
    // "No Project" is needed as default value, don't remove
    { name: 'No Project', color: 'slate' },
    { name: 'TimeOps Manager', color: 'amber' },
    { name: 'SICP JS', color: 'lime' },
  ];

  const tagIds = await db.tags.bulkAdd(initialTags, { allKeys: true });

  // Seeding data created my ChatGPT

  // Note:
  // We’re seeding ~3 weeks of data. We assume day 0 (d = 0) is a Monday.
  // For each weekday (Mon–Fri) we create 3 entries and for weekends we add 1 entry each.
  // Each day’s “working period” is between 8:00 and 21:00 UTC.
  // The base (lower bound) timestamp is d.
  // We add 28,800 seconds (8 hours) to simulate an 8:00 start,
  // and each subsequent day is offset by 86,400 seconds.
  // Durations and breaks (600 sec ≈10 min) are chosen to vary the tracked times.

  const d = 1738540800;

  const initalEntries: Entry[] = [
    // Week 1, Day 0 (Monday)
    {
      name: 'TimeOps Standup Meeting',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 0 * 86400 + 28800, // 8:00
      endTimeUtc: d + 0 * 86400 + 28800 + 9200, // ~2h33m
    },
    {
      name: 'Feature Development Sprint',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 0 * 86400 + 28800 + 9200 + 600,
      endTimeUtc: d + 0 * 86400 + 28800 + 9200 + 600 + 10500, // ~2h55m
    },
    {
      name: 'Bug Fixing and Code Review',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 0 * 86400 + 28800 + 9200 + 600 + 10500 + 600,
      endTimeUtc: d + 0 * 86400 + 28800 + 9200 + 600 + 10500 + 600 + 8600, // ~2h23m
    },

    // Week 1, Day 1 (Tuesday)
    {
      name: 'SICP JS Study: Recursion Concepts',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 1 * 86400 + 28800,
      endTimeUtc: d + 1 * 86400 + 28800 + 9400,
    },
    {
      name: 'Implement TimeOps API Integration',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 1 * 86400 + 28800 + 9400 + 600,
      endTimeUtc: d + 1 * 86400 + 28800 + 9400 + 600 + 10200,
    },
    {
      name: 'Debugging Session: Unexpected Behavior',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 1 * 86400 + 28800 + 9400 + 600 + 10200 + 600,
      endTimeUtc: d + 1 * 86400 + 28800 + 9400 + 600 + 10200 + 600 + 8800,
    },

    // Week 1, Day 2 (Wednesday)
    {
      name: 'Morning Sync: TimeOps Updates',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 2 * 86400 + 28800,
      endTimeUtc: d + 2 * 86400 + 28800 + 8600,
    },
    {
      name: 'SICP JS: Lambda Calculus Deep Dive',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 2 * 86400 + 28800 + 8600 + 600,
      endTimeUtc: d + 2 * 86400 + 28800 + 8600 + 600 + 11000,
    },
    {
      name: 'Evening Code Wrap-up',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 2 * 86400 + 28800 + 8600 + 600 + 11000 + 600,
      endTimeUtc: d + 2 * 86400 + 28800 + 8600 + 600 + 11000 + 600 + 9200,
    },

    // Week 1, Day 3 (Thursday)
    {
      name: 'TimeOps: Sprint Planning',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 3 * 86400 + 28800,
      endTimeUtc: d + 3 * 86400 + 28800 + 10000,
    },
    {
      name: 'SICP JS: Scheme Syntax Exploration',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 3 * 86400 + 28800 + 10000 + 600,
      endTimeUtc: d + 3 * 86400 + 28800 + 10000 + 600 + 9500,
    },
    {
      name: 'Refactoring Legacy Modules',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 3 * 86400 + 28800 + 10000 + 600 + 9500 + 600,
      endTimeUtc: d + 3 * 86400 + 28800 + 10000 + 600 + 9500 + 600 + 7800,
    },

    // Week 1, Day 4 (Friday)
    {
      name: 'Code Review and Merge',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 4 * 86400 + 28800,
      endTimeUtc: d + 4 * 86400 + 28800 + 9000,
    },
    {
      name: 'TimeOps: Database Optimization',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 4 * 86400 + 28800 + 9000 + 600,
      endTimeUtc: d + 4 * 86400 + 28800 + 9000 + 600 + 10800,
    },
    {
      name: 'SICP JS: Functional Paradigms',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 4 * 86400 + 28800 + 9000 + 600 + 10800 + 600,
      endTimeUtc: d + 4 * 86400 + 28800 + 9000 + 600 + 10800 + 600 + 8400,
    },

    // Week 1, Day 5 (Saturday)
    {
      name: 'Saturday: Quick SICP Review',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 5 * 86400 + 28800 + 7200, // start ~10:00
      endTimeUtc: d + 5 * 86400 + 28800 + 7200 + 7200, // 2h session
    },

    // Week 1, Day 6 (Sunday)
    {
      name: 'Sunday: Casual Code Exploration',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 6 * 86400 + 28800 + 3600, // ~9:00
      endTimeUtc: d + 6 * 86400 + 28800 + 3600 + 5400, // 1.5h session
    },

    // Week 2, Day 7 (Monday)
    {
      name: 'TimeOps: Deployment Review',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 7 * 86400 + 28800,
      endTimeUtc: d + 7 * 86400 + 28800 + 8800,
    },
    {
      name: 'SICP JS: Evaluating Continuations',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 7 * 86400 + 28800 + 8800 + 600,
      endTimeUtc: d + 7 * 86400 + 28800 + 8800 + 600 + 9700,
    },
    {
      name: 'Refactor Authentication Module',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 7 * 86400 + 28800 + 8800 + 600 + 9700 + 600,
      endTimeUtc: d + 7 * 86400 + 28800 + 8800 + 600 + 9700 + 600 + 7600,
    },

    // Week 2, Day 8 (Tuesday)
    {
      name: 'Morning Standup: Task Updates',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 8 * 86400 + 28800,
      endTimeUtc: d + 8 * 86400 + 28800 + 9500,
    },
    {
      name: 'SICP JS: Exploring Recursion',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 8 * 86400 + 28800 + 9500 + 600,
      endTimeUtc: d + 8 * 86400 + 28800 + 9500 + 600 + 10200,
    },
    {
      name: 'Backend Service Optimization',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 8 * 86400 + 28800 + 9500 + 600 + 10200 + 600,
      endTimeUtc: d + 8 * 86400 + 28800 + 9500 + 600 + 10200 + 600 + 8400,
    },

    // Week 2, Day 9 (Wednesday)
    {
      name: 'TimeOps: Security Patch Deployment',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 9 * 86400 + 28800,
      endTimeUtc: d + 9 * 86400 + 28800 + 9200,
    },
    {
      name: 'SICP JS: Closure Concepts',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 9 * 86400 + 28800 + 9200 + 600,
      endTimeUtc: d + 9 * 86400 + 28800 + 9200 + 600 + 10800,
    },
    {
      name: 'Performance Tuning Session',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 9 * 86400 + 28800 + 9200 + 600 + 10800 + 600,
      endTimeUtc: d + 9 * 86400 + 28800 + 9200 + 600 + 10800 + 600 + 8000,
    },

    // Week 2, Day 10 (Thursday)
    {
      name: 'Team Sync: TimeOps Strategies',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 10 * 86400 + 28800,
      endTimeUtc: d + 10 * 86400 + 28800 + 9300,
    },
    {
      name: 'SICP JS: Evaluating Recurrence',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 10 * 86400 + 28800 + 9300 + 600,
      endTimeUtc: d + 10 * 86400 + 28800 + 9300 + 600 + 9900,
    },
    {
      name: 'Integrate New Modules',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 10 * 86400 + 28800 + 9300 + 600 + 9900 + 600,
      endTimeUtc: d + 10 * 86400 + 28800 + 9300 + 600 + 9900 + 600 + 8700,
    },

    // Week 2, Day 11 (Friday)
    {
      name: 'Deploy Feature Update',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 11 * 86400 + 28800,
      endTimeUtc: d + 11 * 86400 + 28800 + 9100,
    },
    {
      name: 'SICP JS: Exploring Macros',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 11 * 86400 + 28800 + 9100 + 600,
      endTimeUtc: d + 11 * 86400 + 28800 + 9100 + 600 + 10700,
    },
    {
      name: 'Finalize Bug Reports',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 11 * 86400 + 28800 + 9100 + 600 + 10700 + 600,
      endTimeUtc: d + 11 * 86400 + 28800 + 9100 + 600 + 10700 + 600 + 8200,
    },

    // Week 2, Day 12 (Saturday)
    {
      name: 'Saturday: Code Cleanup Session',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 12 * 86400 + 28800 + 5400,
      endTimeUtc: d + 12 * 86400 + 28800 + 5400 + 7200,
    },

    // Week 2, Day 13 (Sunday)
    {
      name: 'Sunday: Relaxed Debugging',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 13 * 86400 + 28800 + 3600,
      endTimeUtc: d + 13 * 86400 + 28800 + 3600 + 5400,
    },

    // Week 3, Day 14 (Monday)
    {
      name: 'Morning Brief: Project Goals',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 14 * 86400 + 28800,
      endTimeUtc: d + 14 * 86400 + 28800 + 9200,
    },
    {
      name: 'SICP JS: Immutable Data Structures',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 14 * 86400 + 28800 + 9200 + 600,
      endTimeUtc: d + 14 * 86400 + 28800 + 9200 + 600 + 9800,
    },
    {
      name: 'Integration Testing for New Features',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 14 * 86400 + 28800 + 9200 + 600 + 9800 + 600,
      endTimeUtc: d + 14 * 86400 + 28800 + 9200 + 600 + 9800 + 600 + 8500,
    },

    // Week 3, Day 15 (Tuesday)
    {
      name: 'TimeOps: Sprint Retrospective',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 15 * 86400 + 28800,
      endTimeUtc: d + 15 * 86400 + 28800 + 9400,
    },
    {
      name: 'SICP JS: Exploring Tail Recursion',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 15 * 86400 + 28800 + 9400 + 600,
      endTimeUtc: d + 15 * 86400 + 28800 + 9400 + 600 + 10300,
    },
    {
      name: 'Finalize Code Documentation',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 15 * 86400 + 28800 + 9400 + 600 + 10300 + 600,
      endTimeUtc: d + 15 * 86400 + 28800 + 9400 + 600 + 10300 + 600 + 7800,
    },

    // Week 3, Day 16 (Wednesday)
    {
      name: 'Morning Sync: Sprint Updates',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 16 * 86400 + 28800,
      endTimeUtc: d + 16 * 86400 + 28800 + 9100,
    },
    {
      name: 'SICP JS: Advanced Functional Patterns',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 16 * 86400 + 28800 + 9100 + 600,
      endTimeUtc: d + 16 * 86400 + 28800 + 9100 + 600 + 10700,
    },
    {
      name: 'Implement Feature Flag System',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 16 * 86400 + 28800 + 9100 + 600 + 10700 + 600,
      endTimeUtc: d + 16 * 86400 + 28800 + 9100 + 600 + 10700 + 600 + 8000,
    },

    // Week 3, Day 17 (Thursday)
    {
      name: 'TimeOps: Client Demo Preparation',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 17 * 86400 + 28800,
      endTimeUtc: d + 17 * 86400 + 28800 + 9300,
    },
    {
      name: 'SICP JS: Understanding Recursion Trees',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 17 * 86400 + 28800 + 9300 + 600,
      endTimeUtc: d + 17 * 86400 + 28800 + 9300 + 600 + 9900,
    },
    {
      name: 'Refine Deployment Scripts',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 17 * 86400 + 28800 + 9300 + 600 + 9900 + 600,
      endTimeUtc: d + 17 * 86400 + 28800 + 9300 + 600 + 9900 + 600 + 8500,
    },

    // Week 3, Day 18 (Friday)
    {
      name: 'End of Week: Wrap-up Meeting',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 18 * 86400 + 28800,
      endTimeUtc: d + 18 * 86400 + 28800 + 9000,
    },
    {
      name: 'SICP JS: Integrating Concepts',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 18 * 86400 + 28800 + 9000 + 600,
      endTimeUtc: d + 18 * 86400 + 28800 + 9000 + 600 + 10800,
    },
    {
      name: 'Finalize Weekly Reports',
      tagId: tagIds[0],
      synced: false,
      startTimeUtc: d + 18 * 86400 + 28800 + 9000 + 600 + 10800 + 600,
      endTimeUtc: d + 18 * 86400 + 28800 + 9000 + 600 + 10800 + 600 + 8400,
    },

    // Week 3, Day 19 (Saturday)
    {
      name: 'Saturday: Casual Bug Triage',
      tagId: tagIds[1],
      synced: false,
      startTimeUtc: d + 19 * 86400 + 28800 + 7200,
      endTimeUtc: d + 19 * 86400 + 28800 + 7200 + 7200,
    },

    // Week 3, Day 20 (Sunday)
    {
      name: 'Sunday: Light Code Review',
      tagId: tagIds[2],
      synced: false,
      startTimeUtc: d + 20 * 86400 + 28800 + 3600,
      endTimeUtc: d + 20 * 86400 + 28800 + 3600 + 5400,
    },
  ];

  await db.entries.bulkAdd(initalEntries);
}
