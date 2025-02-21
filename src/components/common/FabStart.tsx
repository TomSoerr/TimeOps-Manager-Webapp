import React from 'react';
import { FAB } from './FAB';

export const FabStart: React.FC = () => {
  return (
    <div className="*:bg-indigo-500 **:text-indigo-100 *:hover:bg-indigo-600">
      <FAB name="play_arrow" />
    </div>
  );
};
