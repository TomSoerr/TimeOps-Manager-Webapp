import React from 'react';
import { Card } from '../layout/Card';
import { Edit } from './Edit';
import { Tag } from './Tag';
import Color from '../../types/color.types';

interface Props {
  name: string;
  synced: boolean;
  id: number;
  tag: string;
  time: string;
  color: Color['color'];
}

export const Entry: React.FC<Props> = ({
  name,
  synced,
  tag,
  time,
  id,
  color,
}) => {
  return (
    <Card>
      <div className="flex">
        <div className="">
          <h3 className="text-lg font-bold text-slate-800">{name}</h3>

          <p className="font-bold font-mono text-slate-700 text-base">{time}</p>

          <div className="mt-4">
            <Tag
              name={tag}
              color={color}
            />
          </div>
        </div>
        <div className="flex flex-col ml-auto justify-between items-end">
          <Edit />
          <p className="text-xs text-slate-400">
            {synced ? 'synced' : 'offline'}
          </p>
        </div>
      </div>
    </Card>
  );
};
