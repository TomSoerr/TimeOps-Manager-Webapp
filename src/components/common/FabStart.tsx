import React from 'react';
import { FAB } from './FAB';

export const FabStart: React.FC = () => {
  return (
    <div className="*:bg-indigo-200 **:text-indigo-500 *:hover:bg-indigo-100">
      <FAB name="add" />
    </div>
  );
};
