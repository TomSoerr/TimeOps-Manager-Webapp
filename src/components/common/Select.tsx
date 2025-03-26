import React from 'react';

export interface Option {
  name: string;
  id: number;
}

interface Props {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
  options: Option[];
  disabled?: boolean;
}

export const Select: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
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
        disabled={disabled}
      >
        {options.map((tag: Option) => {
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
