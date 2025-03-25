import React, { useState, useEffect } from 'react';

import { SettingsSection } from '../layout/SettingsSection';
import { Button } from '../common/Button';
import { db } from '../../database/db';

const DatabaseSettings: React.FC = () => {
  return (
    <SettingsSection headline="Database">
      <Button
        uiType="secondary"
        text="Delete DB"
        type="button"
        onClick={() => db.deleteRemote()}
      />
    </SettingsSection>
  );
};

export default DatabaseSettings;
