import React from 'react';
import { useConnection } from '../../context/ConnectionContext';

/**
 * Status component displays the online/offline connection status indicator
 * It renders a small pill with a cloud icon that changes based on connection state
 *
 * The component is positioned absolutely and adapts its position based on viewport size:
 * - On mobile: positioned at the top of the navigation
 * - On desktop: positioned at the right side of the navigation
 */
const Status: React.FC = () => {
  const { isOnline } = useConnection();

  return (
    <div className="absolute h-6 w-6 border-slate-200 grid place-items-center bg-slate-50 -top-6 border-b-1 border-r-1 border-t-1 rounded-tr-md left-0 lg:top-auto lg:left-auto lg:-right-6 lg:bottom-0 lg:border-b-0 lg:border-l-1 ">
      <span className="text-indigo-500 !text-sm material-symbols-rounded">
        {isOnline ? 'cloud' : 'cloud_off'}
      </span>
    </div>
  );
};

export default Status;
