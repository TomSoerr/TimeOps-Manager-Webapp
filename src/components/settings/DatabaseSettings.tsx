import React, { useState, useEffect } from 'react';
import { isDatabaseEmpty, seedDatabase } from '../../database/seed';
import { deleteDatabase } from '../../database/db';
import { Button } from '../common/Button';
import { SettingsSection } from '../layout/SettingsSection';

const DatabaseSettings: React.FC = () => {
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>(true);

  useEffect(() => {
    checkDatabase();
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
    <SettingsSection headline="Database">
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
    </SettingsSection>
  );
};
export default DatabaseSettings;
