import React from 'react';
import { Card } from '../layout/Card';
import { Tag } from '../../ui/Tag';
import Color from '../../types/color.types';

/**
 * Props for the Entry component
 * Represents a time entry in the time-tracking application
 */
interface Props {
  /** Name/title of the time entry */
  name: string;
  /** Whether the entry has been synchronized with the server */
  synced: boolean;
  /** Name of the associated tag/project */
  tag: string;
  /** Formatted time string (start time or duration) */
  time: string;
  /** Time span representation (e.g., "2h 30m" or time range) */
  timespan: string;
  /** Color code associated with the tag */
  color: Color['color'];
  /** Click handler for when the entry is selected */
  onClick: () => void;
  /** Error message if synchronization failed */
  errorMessage: string;
}

/**
 * Entry component displays a time tracking entry card.
 * Shows the entry name, time information, associated tag, and sync status.
 * Displays error messages if synchronization failed.
 *
 * @returns A clickable card containing the time entry details
 */
export const Entry: React.FC<Props> = ({
  name,
  synced,
  tag,
  time,
  color,
  onClick,
  timespan,
  errorMessage: msg,
}) => {
  return (
    <Card onClick={onClick}>
      <div className="flex">
        <div className="text-left flex-1 min-w-0">
          <h4 className="text-base leading-5 font-bold text-slate-800 mb-1 truncate">
            {name}
          </h4>

          <p className="font-bold  text-slate-700 text-sm">
            {time}{' '}
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
