import React from 'react';

import DatabaseSettings from '../components/settings/DatabaseSettings';
import TagSettings from '../components/settings/TagSettings';
import ApiSettings from '../components/settings/ApiSettings';

const Settings: React.FC = () => {
  return (
    <div className=" space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <ApiSettings />
      <DatabaseSettings />
      <TagSettings />
    </div>
  );
};
export default Settings;
