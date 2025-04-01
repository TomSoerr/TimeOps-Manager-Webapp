import React, { useState, useEffect } from 'react';
import { useConnection } from '../../context/ConnectionContext';
import { AnalyticsData, getAnalytics } from '../../database/index';
import { Table } from '../../ui/layout/Table';

/**
 * Analytics page component
 * Displays analytical data about time entries in various groupings
 *
 * Features:
 * - Day-based analytics showing hours worked by weekday
 * - Weekly analytics showing hours worked by week
 * - Monthly analytics showing hours worked by month
 * - Tag-based analytics showing hours worked by project/tag
 *
 * This component requires an active online connection to function
 * as it fetches data directly from the API.
 */
const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );

  const { isOnline } = useConnection();

  /**
   * Fetch analytics data when the component mounts
   */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchAnalytics();
  }, []);

  // Show a placeholder message when offline or data is still loading
  if (!isOnline || !analyticsData)
    return <p>Feature only available when online</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      <Table
        headline="Day"
        label="Weekday"
        value="Hours"
        data={analyticsData.day}
      />

      <Table
        headline="Weeks"
        label="Week start"
        value="Hours"
        data={analyticsData.week}
      />
      <Table
        headline="Months"
        label="Month"
        value="Hours"
        data={analyticsData.month}
      />
      <Table
        headline="Tags"
        label="Tags"
        value="Hours"
        data={analyticsData.tags}
      />
    </div>
  );
};

export default Analytics;
