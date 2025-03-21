import React from 'react';
import { useConnection } from '../../context/ConnectionContext';

const Status: React.FC = () => {
  const { isOnline } = useConnection();

  return (
    <div className="absolute h-6 w-6 border-slate-200 grid place-items-center bg-slate-50 -top-6 border-b-1 border-r-1 border-t-1 rounded-tr-md left-0">
      <span className="text-indigo-500 !text-sm material-symbols-rounded">
        {isOnline ? 'cloud' : 'cloud_off'}
      </span>
    </div>
  );
};

export default Status;
