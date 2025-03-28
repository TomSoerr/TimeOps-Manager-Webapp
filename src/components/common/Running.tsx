import React, { useState, useEffect } from 'react';
import { Card } from '../layout/Card';
import { Tag } from './Tag';
import Color from '../../types/color.types';
import { offset } from '../../utils/time';

interface Props {
  name: string;
  synced: boolean;
  tag: string;
  startTimeUTC: number;
  timespan: string;
  color: Color['color'];
  onClick: () => void;
  msg: string;
}

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
    // Function to format time as HH:MM:SS
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

    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - startTimeUTC;
    setElapsedTime(formatTime(elapsed));

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
