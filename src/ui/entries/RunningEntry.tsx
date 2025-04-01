import React, { useState, useEffect } from 'react';
import { Card } from '../layout/Card';
import { Tag } from '../Tag';
import Color from '../../types/color.types';
import { offset } from '../../utils/time';

/**
 * Props interface for the RunningEntry component
 * Defines the properties needed to display a currently running time entry
 */
interface Props {
  /** Name/title of the time entry */
  name: string;
  /** Whether the entry has been synchronized with the server */
  synced: boolean;
  /** Name of the associated tag/project */
  tag: string;
  /** Start time of the entry in UTC seconds (Unix epoch) */
  startTimeUTC: number;
  /** Time span representation (typically start time to "now") */
  timespan: string;
  /** Color code associated with the tag */
  color: Color['color'];
  /** Click handler for when the entry is selected */
  onClick: () => void;
  /** Error message if synchronization failed */
  msg: string;
}

/**
 * RunningEntry component displays a timer card for an active time tracking entry
 * Features:
 * - Real-time elapsed time counter that updates every second
 * - Display of start time information
 * - Tag indication with color coding
 * - Sync status indicator
 * - Error message display when sync fails
 *
 * This component is distinct from the regular Entry component because it
 * actively updates to show the current elapsed time since the entry started.
 */
export const RunningEntry: React.FC<Props> = ({
  name,
  synced,
  tag,
  startTimeUTC,
  color,
  onClick,
  timespan,
  msg,
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  useEffect(() => {
    /**
     * Formats a time duration in seconds to a HH:MM:SS string format
     * @param seconds - The number of seconds to format
     * @returns Formatted time string in HH:MM:SS format with zero padding
     */
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0'),
      ].join(':');
    };

    // Update the timer every second
    const intervalId = setInterval(() => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const elapsed = now - startTimeUTC;
      setElapsedTime(formatTime(elapsed));
    }, 1000);

    // Initial calculation for immediate display
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - startTimeUTC;
    setElapsedTime(formatTime(elapsed));

    // Clean up interval to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [startTimeUTC]);

  return (
    <Card onClick={onClick}>
      <div className="flex">
        <div className="text-left flex-1 min-w-0">
          <h4 className="text-base leading-5 font-bold text-slate-800 mb-1 truncate">
            {name}
          </h4>

          <p className="font-bold  text-slate-700 text-sm">
            {elapsedTime}{' '}
            <span className="font-normal  text-slate-400 text-sm">
              {timespan}
            </span>
          </p>
          <p className="text-red-500 text-xs whitespace-pre-wrap">
            {msg ? `sync error: ${msg}` : ''}
          </p>
        </div>
        <div className="flex flex-col ml-auto justify-between items-end">
          <Tag
            name={tag}
            color={color}
          />
          <p className="text-xs mr-1 text-slate-400">
            {synced ? 'synced' : 'offline'}
          </p>
        </div>
      </div>
    </Card>
  );
};
