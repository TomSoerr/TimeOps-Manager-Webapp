import React from 'react';
import { useConnection } from '../context/ConnectionContext';

import DatabaseSettings from '../components/settings/DatabaseSettings';
import TagSettings from '../components/settings/TagSettings';
import ApiSettings from '../components/settings/ApiSettings';

const Settings: React.FC = () => {
  const { isOnline } = useConnection();

  return (
    <div className=" space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <ApiSettings />
      {isOnline ?
        <DatabaseSettings />
      : ''}
      {isOnline ?
        <TagSettings />
      : ''}
    </div>
  );
};
export default Settings;
