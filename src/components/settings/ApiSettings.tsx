import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { SettingsSection, SHeadline } from '../layout/SettingsSection';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const ApiSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>('');

  const [token, setToken] = useState<string>('');
  const [lToken, setLToken] = useState<string>(''); // to detect change between local storage and input field
  const [url, setUrl] = useState<string>('');
  const [lUrl, setLUrl] = useState<string>(''); // to detect change between local storage and input field

  const updateToken = () => {
    const t = db.getToken();
    setToken(t);
    setLToken(t);
  };

  const updateUrl = () => {
    const u = db.getUrl();
    setUrl(u);
    setLUrl(u);
  };

  useEffect(() => {
    console.info(token, url);
    updateToken();
    updateUrl();
  }, []);

  return (
    <SettingsSection headline="API">
      <SHeadline>API Endpoint</SHeadline>
      <p className="text-sm">
        {!token && !url ?
          'You need to generate or input a token and define the API endpoint URL'
        : !url ?
          'You need to define the API endpoint URL'
        : !token ?
          'You need to generate or input  a token'
        : ''}
      </p>
      <p className="text-sm text-red-600">{error}</p>
      <Input
        type="url"
        label="API URL"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        type="text"
        id="token"
        label="API Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      {lToken !== token ?
        <Button
          uiType="secondary"
          text="Update Token"
          type="button"
          onClick={() => {
            db.updateToken(token);
            updateToken();
          }}
        />
      : lToken === token && !lToken ?
        <Button
          uiType="secondary"
          text="Generate Token"
          type="button"
          onClick={async () => {
            try {
              setError('Loading Token...');
              await db.createToken();
              updateToken();
              setError('');
            } catch (error) {
              setError(error);
            }
          }}
        />
      : ''}

      {lUrl !== url ?
        <Button
          uiType="primary"
          text="Update URL"
          type="button"
          onClick={() => {
            db.updateUrl(url);
            updateUrl();
          }}
        />
      : lUrl === url && url && token ?
        <Button
          uiType="primary"
          text="Connect to API"
          type="button"
          onClick={() => {
            try {
              setError('loading');
              db.connect();
              setError('');
            } catch (error) {
              setError(error);
            }
          }}
        />
      : ''}
    </SettingsSection>
  );
};
export default ApiSettings;
