import { API_BASE_URL } from '../../vars';
import { offset } from '../../utils/time';

export interface UrlToken {
  url: string;
  token: string;
}

export function getToken(): string {
  return localStorage.getItem('token') || '';
}

export function getUrl(): string {
  return localStorage.getItem('url') || '';
}

export function updateUrl(url: string): void {
  // Remove trailing "/" if present
  const sanitizedUrl = url.replace(/\/$/, '');
  localStorage.setItem('url', sanitizedUrl);
}

export function updateToken(token: string): void {
  localStorage.setItem('token', token);
}

export function getUrlToken(): UrlToken {
  const url = getUrl();
  const token = getToken();

  if (!url || !token) {
    throw new Error('API URL or token is missing');
  }
  return { url, token };
}

export async function createToken(): Promise<void> {
  const url = getUrl();

  try {
    const response = await fetch(`${url}${API_BASE_URL}/user`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.user.apiToken) {
      throw new Error('API token not found in the response');
    }

    // Store the token in localStorage
    updateToken(data.user.apiToken);
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

export function getApiHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
