import React, { useState, useEffect } from 'react';
import { isDatabaseEmpty, seedDatabase } from '../database/seed';
import { deleteDatabase } from '../database/db';

const Settings: React.FC = () => {
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    const empty = await isDatabaseEmpty();
    setIsDbEmpty(empty);
  };

  const handleSeedClick = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      await checkDatabase();
    } catch (error) {
      console.error('Failed to seed database:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all database entries? This cannot be undone.',
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteDatabase();
        await checkDatabase();
      } catch (error) {
        console.error('Failed to delete database:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Database</h2>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleSeedClick}
            disabled={!isDbEmpty || isSeeding}
            className={`px-4 py-2 rounded-lg ${
              isDbEmpty && !isSeeding ?
                'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </button>

          <button
            onClick={handleDeleteClick}
            disabled={isDbEmpty || isDeleting || isSeeding}
            className={`px-4 py-2 rounded-lg ${
              !isDbEmpty && !isDeleting ?
                'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Database'}
          </button>

          <span className="text-sm text-gray-600">
            {isDbEmpty ?
              'Database is empty. Click to seed with initial data.'
            : 'Database contains data.'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Settings;
