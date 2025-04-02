import React from 'react';
import { useConnection } from '../../../context/ConnectionContext';

import DatabaseSettings from '../components/DatabaseSettings';
import TagSettings from '../components/TagSettings';
import ApiSettings from '../components/ApiSettings';

/**
 * Settings page component
 * Serves as the container for all application settings sections
 *
 * Features:
 * - API connection settings (always visible)
 * - Tag management (visible when online)
 * - Database operations (visible when online)
 *
 * The component conditionally renders certain settings sections
 * based on the application's online/offline status since some
 * operations require API connectivity.
 */
const Settings: React.FC = () => {
  const { isOnline } = useConnection();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <ApiSettings />
      {isOnline && (
        <>
          <TagSettings />
          <DatabaseSettings />
        </>
      )}
    </div>
  );
};
export default Settings;
