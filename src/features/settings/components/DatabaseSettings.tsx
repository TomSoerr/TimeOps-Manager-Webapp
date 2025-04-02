import React from 'react';
import { InputFile } from '../../../ui/inputs/InputFile';
import { SettingsSection, SHeadline } from '../../../ui/layout/SettingsSection';
import { Button } from '../../../ui/buttons/Button';

import { useDatabaseOperations } from '../hooks/useDatabaseOperations';

/**
 * DatabaseSettings component provides UI for managing database operations
 *
 * Features:
 * - Database deletion functionality
 * - Data export to JSON file
 * - Data import from CSV (Toggl Track) or JSON files
 * - Import status feedback
 *
 * This component is only displayed when the application is online,
 * as database operations require API connectivity.
 */
const DatabaseSettings: React.FC = () => {
  const { status, handleDelete, handleExport, handleImport, clearStatus } =
    useDatabaseOperations();

  return (
    <SettingsSection headline="Database">
      {status.message && (
        <div
          className={`text-sm ${status.success ? 'text-green-600' : 'text-red-600'}`}
        >
          {status.message}
        </div>
      )}

      <Button
        uiType="secondary"
        text="Delete DB"
        type="button"
        onClick={() => {
          if (
            confirm(
              'Are you sure you want to delete the database? This action cannot be undone.',
            )
          ) {
            handleDelete();
          }
        }}
        disabled={status.isLoading}
      />

      <Button
        uiType="primary"
        text={
          status.isLoading && status.message === 'Exporting database...' ?
            'Exporting...'
          : 'Export Database'
        }
        type="button"
        onClick={handleExport}
        disabled={status.isLoading}
      />

      <InputFile
        onSubmit={handleImport}
        msg={status.message}
      />
    </SettingsSection>
  );
};

export default DatabaseSettings;
