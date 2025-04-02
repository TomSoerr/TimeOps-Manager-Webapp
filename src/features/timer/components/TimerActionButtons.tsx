import React from 'react';
import { FabAdd } from '../../../ui/buttons/FabAdd.tsx';
import { FabStart } from '../../../ui/buttons/FabStart.tsx';
import { TimeRunningEntry } from '../../../types/database.types.ts';

/**
 * Props for TimerActionButtons component
 */
interface TimerActionButtonsProps {
  onAddClick: () => void;
  onStartClick: () => void;
  running?: TimeRunningEntry;
}

/**
 * Floating action buttons for the Timer page
 *
 * Provides buttons for adding new time entries and starting/stopping the timer
 */
const TimerActionButtons: React.FC<TimerActionButtonsProps> = ({
  onAddClick,
  onStartClick,
  running,
}) => {
  return (
    <div className="fixed bottom-22 lg:bottom-4 lg:right-[calc((100vw-48rem)/2)] right-4 flex gap-2">
      <FabAdd onClick={onAddClick} />
      <FabStart
        onClick={onStartClick}
        running={running}
      />
    </div>
  );
};

export default TimerActionButtons;
