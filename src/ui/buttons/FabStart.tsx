import React, { useState, useEffect } from 'react';
import { FAB } from './FAB';
import { TimeRunningEntry } from '../../types/database.types';

/**
 * Props for the FabStart component
 * @interface Props
 * @property {() => void} onClick - Click handler function for the button
 * @property {TimeRunningEntry | undefined} running - Current running time entry, or undefined if none
 */
interface Props {
  onClick: () => void;
  running: TimeRunningEntry | undefined;
}

/**
 * Floating Action Button for starting/stopping time entries
 * Displays a play or stop icon depending on whether there is a running entry
 * Uses the base FAB component with an indigo-500 color scheme
 *
 * @remarks
 * This button changes its icon dynamically based on the state of the running prop:
 * - Shows a "play_arrow" icon when no entry is running
 * - Shows a "stop" icon when an entry is running
 */
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
