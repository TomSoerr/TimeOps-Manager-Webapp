import React from 'react';
import { SettingsSection, SHeadline } from '../../../ui/layout/SettingsSection';
import { Input } from '../../../ui/inputs/Input';
import { Button } from '../../../ui/buttons/Button';
import { useApiSettings } from '../hooks/useApiSettings';

/**
 * ApiSettings component provides the UI for configuring API connection settings
 *
 * Features:
 * - API endpoint URL configuration
 * - API token management (entry, generation, update)
 * - Validation feedback
 * - Status indicators for changed values
 *
 * This component leverages the useApiSettings hook to separate
 * business logic from UI presentation.
 */
const ApiSettings: React.FC = () => {
  const {
    token,
    url,
    isLoading,
    error,
    hasTokenChanged,
    hasUrlChanged,
    missingToken,
    statusMessage,
    handleTokenChange,
    handleUrlChange,
    handleUpdateToken,
    handleGenerateToken,
    handleUpdateUrl,
  } = useApiSettings();

  return (
    <SettingsSection headline="API">
      <SHeadline>API Endpoint</SHeadline>
      {statusMessage && <p className="text-sm">{statusMessage}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Input
        type="url"
        label="API URL"
        id="url"
        value={url}
        onChange={handleUrlChange}
        disabled={isLoading}
      />

      <Input
        type="text"
        id="token"
        label="API Token"
        value={token}
        onChange={handleTokenChange}
        disabled={isLoading}
      />

      {hasTokenChanged ?
        <Button
          uiType="secondary"
          text="Update Token"
          type="button"
          onClick={handleUpdateToken}
          disabled={isLoading}
        />
      : missingToken && (
          <Button
            uiType="secondary"
            text="Generate Token"
            type="button"
            onClick={handleGenerateToken}
            disabled={isLoading}
          />
        )
      }

      {hasUrlChanged && (
        <Button
          uiType="primary"
          text="Update URL"
          type="button"
          onClick={handleUpdateUrl}
          disabled={isLoading}
        />
      )}
    </SettingsSection>
  );
};

export default ApiSettings;
