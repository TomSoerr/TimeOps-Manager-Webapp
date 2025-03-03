import React, { useState, useEffect } from 'react';
import { isDatabaseEmpty, seedDatabase } from '../database/seed';
import { deleteDatabase, TagList } from '../database/db';
import { Button } from '../components/common/Button';
import { db } from '../database/db';
import { EditTags } from '../components/common/EditTags';
import { TagForm } from '../components/common/TagForm';

const Settings: React.FC = () => {
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<TagList>([]); // TODO make this dry when backend is working

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const tags = await db.getAllTag();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
    loadTags();
  }, []);

  const checkDatabase = async () => {
    const empty = await isDatabaseEmpty();
    setIsDbEmpty(empty);
  };

  const handleSeedClick = async () => {
    try {
      await seedDatabase();
      await checkDatabase();
    } catch (error) {
      console.error('Failed to seed database:', error);
    }
  };

  const handleDeleteClick = async () => {
    console.warn('delete triggered');
    if (
      window.confirm(
        'Are you sure you want to delete all database entries? This cannot be undone.',
      )
    ) {
      try {
        await deleteDatabase();
        await checkDatabase();
      } catch (error) {
        console.error('Failed to delete database:', error);
      }
    }
  };

  return (
    <div className=" space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Database</h2>

        <div className="flex items-center gap-4">
          {isDbEmpty ?
            <Button
              uiType="primary"
              text="Seed Database"
              type="button"
              onClick={handleSeedClick}
            />
          : <Button
              uiType="secondary"
              text="Delete Database"
              type="button"
              onClick={handleDeleteClick}
            />
          }

          <span className="text-sm text-gray-600">
            {isDbEmpty ?
              'Database is empty. Click to seed with initial data.'
            : 'Database contains data!'}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold ">Edit Tags</h2>
        <EditTags tags={tags} />
        <h2 className="text-xl font-semibold">New Tag</h2>
        <TagForm
          add={true}
          item={['Tagname', 'slate', undefined]}
        />
      </div>
    </div>
  );
};
export default Settings;
