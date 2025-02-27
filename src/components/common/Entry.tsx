import React from 'react';
import { Card } from '../layout/Card';
import { Tag } from './Tag';
import Color from '../../types/color.types';

interface Props {
  name: string;
  synced: boolean;
  id: number;
  tag: string;
  time: string;
  color: Color['color'];
  onClick: () => void;
}

export const Entry: React.FC<Props> = ({
  name,
  synced,
  tag,
  time,
  id,
  color,
  onClick,
}) => {
  return (
    <Card onClick={onClick}>
      <div className="flex">
        <div className="text-left">
          <h3 className="text-lg font-bold text-slate-800">{name}</h3>

          <p className="font-bold font-mono text-slate-700 text-base">{time}</p>
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
