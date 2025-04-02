import { useState, useCallback, useEffect } from 'react';
import {
  getToken,
  getUrl,
  updateToken,
  updateUrl,
  createToken,
} from '../../../database/index';

/**
 * Custom hook for managing API settings state and operations
 *
 * Provides functionality for:
 * - Reading and writing API token and endpoint URL
 * - Tracking changes between current and saved values
 * - Generating new API tokens
 * - Managing loading and error states
 *
 * @returns API settings state and handler functions
 */
export function useApiSettings() {
  // Combined state for all API settings
  const [settings, setSettings] = useState({
    token: '',
    savedToken: '',
    url: '',
    savedUrl: '',
    isLoading: false,
    error: '',
  });

  /**
   * Updates the token input field
   */
  const handleTokenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, token: e.target.value }));
    },
    [],
  );

  /**
   * Updates the URL input field
   */
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, url: e.target.value }));
    },
    [],
  );

  /**
   * Refreshes the token state from storage
   */
  const updateTokenInState = useCallback(() => {
    const token = getToken();
    setSettings((prev) => ({
      ...prev,
      token,
      savedToken: token,
    }));
  }, []);

  /**
   * Refreshes the URL state from storage
   */
  const updateUrlInState = useCallback(() => {
    const url = getUrl();
    setSettings((prev) => ({
      ...prev,
      url,
      savedUrl: url,
    }));
  }, []);

  /**
   * Persists the current token value to storage
   */
  const handleUpdateToken = useCallback(() => {
    updateToken(settings.token);
    updateTokenInState();
  }, [settings.token, updateTokenInState]);

  /**
   * Requests a new API token from the server
   */
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

  /**
   * Persists the current URL value to storage
   */
  const handleUpdateUrl = useCallback(() => {
    updateUrl(settings.url);
    updateUrlInState();
  }, [settings.url, updateUrlInState]);

  // Load initial values on component mount
  useEffect(() => {
    updateTokenInState();
    updateUrlInState();
  }, [updateTokenInState, updateUrlInState]);

  // Derive UI state values from settings
  const { token, savedToken, url, savedUrl, isLoading, error } = settings;
  const hasTokenChanged = token !== savedToken;
  const hasUrlChanged = url !== savedUrl;
  const missingToken = !token;

  /**
   * Generates appropriate status message based on configuration state
   */
  const statusMessage =
    !token && !url ?
      'You need to generate or input a token and define the API endpoint URL'
    : !url ? 'You need to define the API endpoint URL'
    : !token ? 'You need to generate or input a token'
    : '';

  return {
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
  };
}
