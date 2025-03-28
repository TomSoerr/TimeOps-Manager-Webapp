import React, { useState, useEffect } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { db, AnalyticsData } from '../database/db';
import { Table } from '../components/layout/Table';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );

  const { isOnline } = useConnection();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await db.getAnalytics();
        console.info(data);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };
    console.warn('useEffect');
    fetchAnalytics();
  }, []);

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
