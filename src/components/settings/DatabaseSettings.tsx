import React, { useState } from 'react';
import { InputFile } from '../common/InputFile';
import { SettingsSection, SHeadline } from '../layout/SettingsSection';
import { Button } from '../common/Button';
import { deleteRemote, importFile, exportDatabase } from '../../database/index';

const DatabaseSettings: React.FC = () => {
  const [msg, setMsg] = useState<string>('');

  const handleFileSubmit = async (
    ref: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = ref.current?.files?.[0];
    if (!file) {
      setMsg('No file selected. Please select a file to import.');
      return;
    }

    try {
      await importFile(file);
      setMsg('Database imported successfully!');
    } catch (error) {
      console.error('Error importing database:', error);
      setMsg('Error importing database');
    }
  };

  const handleExport = async () => {
    try {
      await exportDatabase();
    } catch (error) {
      console.error('Error exporting database:', error);
    }
  };

  return (
    <SettingsSection headline="Database">
      <Button
        uiType="secondary"
        text="Delete DB"
        type="button"
        onClick={() => deleteRemote()}
      />
      <SHeadline>Import/Export</SHeadline>

      <Button
        uiType="primary"
        text="Export Database"
        type="button"
        onClick={handleExport}
      />
      <p>
        You can import csv files from Toggl Track or json files from this app
      </p>
      <InputFile
        onSubmit={handleFileSubmit}
        msg={msg}
      />
    </SettingsSection>
  );
};

export default DatabaseSettings;
