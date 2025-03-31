import React, { useState, useEffect, useCallback } from 'react';
import {
  getToken,
  getUrl,
  updateToken,
  updateUrl,
  createToken,
} from '../../database/index';
import { SettingsSection, SHeadline } from '../layout/SettingsSection';
import { Input } from '../../ui/inputs/Input';
import { Button } from '../../ui/buttons/Button';

const ApiSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    token: '',
    savedToken: '',
    url: '',
    savedUrl: '',
    isLoading: false,
    error: '',
  });

  const handleTokenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, token: e.target.value }));
    },
    [],
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, url: e.target.value }));
    },
    [],
  );

  const updateTokenInState = useCallback(() => {
    const token = getToken();
    setSettings((prev) => ({
      ...prev,
      token,
      savedToken: token,
    }));
  }, []);

  const updateUrlInState = useCallback(() => {
    const url = getUrl();
    setSettings((prev) => ({
      ...prev,
      url,
      savedUrl: url,
    }));
  }, []);

  const handleUpdateToken = useCallback(() => {
    updateToken(settings.token);
    updateTokenInState();
  }, [settings.token, updateTokenInState]);

  const handleGenerateToken = useCallback(async () => {
    try {
      setSettings((prev) => ({
        ...prev,
        isLoading: true,
        error: 'Loading Token...',
      }));
      await createToken();
      updateTokenInState();
      setSettings((prev) => ({ ...prev, isLoading: false, error: '' }));
    } catch (error) {
      setSettings((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }, [updateTokenInState]);

  const handleUpdateUrl = useCallback(() => {
    updateUrl(settings.url);
    updateUrlInState();
  }, [settings.url, updateUrlInState]);

  // Load initial values
  useEffect(() => {
    updateTokenInState();
    updateUrlInState();
  }, [updateTokenInState, updateUrlInState]);

  const { token, savedToken, url, savedUrl, isLoading, error } = settings;
  const hasTokenChanged = token !== savedToken;
  const hasUrlChanged = url !== savedUrl;
  const missingToken = !token;

  const statusMessage =
    !token && !url ?
      'You need to generate or input a token and define the API endpoint URL'
    : !url ? 'You need to define the API endpoint URL'
    : !token ? 'You need to generate or input a token'
    : '';

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

      {hasUrlChanged ?
        <Button
          uiType="primary"
          text="Update URL"
          type="button"
          onClick={handleUpdateUrl}
          disabled={isLoading}
        />
      : ''}
    </SettingsSection>
  );
};

export default ApiSettings;
