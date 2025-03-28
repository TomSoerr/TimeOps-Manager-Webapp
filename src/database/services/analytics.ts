import { getUrlToken } from '../utils/api-helpers';
import { API_BASE_URL } from '../../vars';
import { AnalyticsData } from '../schema';
import { offset } from '../../utils/time';

export async function getAnalytics(): Promise<AnalyticsData> {
  const { url, token } = getUrlToken();

  try {
    const response = await fetch(`${url}${API_BASE_URL}/analytics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-UTC-Offset': `${offset}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AnalyticsData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}
