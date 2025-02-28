import React from 'react';
import { Card } from '../layout/Card';
import { Tag } from './Tag';
import Color from '../../types/color.types';

interface Props {
  name: string;
  synced: boolean;
  tag: string;
  time: string;
  timespan: string;
  color: Color['color'];
  onClick: () => void;
}

export const Entry: React.FC<Props> = ({
  name,
  synced,
  tag,
  time,
  color,
  onClick,
  timespan,
}) => {
  return (
    <Card onClick={onClick}>
      <div className="flex">
        <div className="text-left">
          <h4 className="text-base font-bold text-slate-800">{name}</h4>

          <p className="font-bold  text-slate-700 text-sm">
            {time} hrs{' '}
            <span className="font-normal  text-slate-400 text-sm">
              {timespan}
            </span>
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
