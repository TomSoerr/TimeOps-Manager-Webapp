import React from 'react';
import { TagList } from '../../database/db';

interface Props {
  label: string;
  id: string;
  onChange: (e: any) => void;
  value: number;
  options: TagList[];
}

export const Select: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <label
      htmlFor="tag"
      className="block relative bg-white border-1 rounded-sm border-slate-200 px-2 pt-4 pb-0.5 focus-within:border-indigo-500"
    >
      <span className="absolute top-0.5 left-2 text-xs text-slate-600">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="text-slate-800 w-full text-base border-0 outline-0"
      >
        {options.map((tag: TagList) => {
          return (
            <option
              key={tag?.id}
              value={tag?.id}
            >
              {tag?.name}
            </option>
          );
        })}
      </select>
    </label>
  );
};
