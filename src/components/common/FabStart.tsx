import React, { useState, useEffect } from 'react';
import { FAB } from './FAB';
import { TimeRunningEntry } from '../../types/database.types';

interface Props {
  onClick: () => void;
  running: TimeRunningEntry | undefined;
}

export const FabStart: React.FC<Props> = ({ onClick, running }) => {
  const [iconName, setIconName] = useState<string>(
    running ? 'stop' : 'play_arrow',
  );

  useEffect(() => {
    setIconName(running ? 'stop' : 'play_arrow');
  }, [running]);

  return (
    <div className="*:bg-indigo-500 **:text-indigo-100 *:hover:bg-indigo-600">
      <FAB
        onClick={onClick}
        name={iconName}
      />
    </div>
  );
};
