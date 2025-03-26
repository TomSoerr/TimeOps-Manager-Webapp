import React from 'react';

interface Props {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: 'time' | 'date' | 'text' | 'url';
  min?: string;
  max?: string;
  disabled?: boolean;
}

export const Input: React.FC<Props> = ({
  id,
  label,
  type,
  value,
  onChange,
  min,
  max,
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className="block relative bg-white border-1 rounded-sm border-slate-200 px-2 pt-4 pb-0.5 focus-within:border-indigo-500"
    >
      <span className="absolute top-0.5 left-2 text-xs text-slate-600">
        {label}
      </span>

      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="text-slate-800 w-full text-base border-0 outline-0"
        min={min}
        max={max}
        disabled={disabled}
        required
      />
      <span className="absolute hidden top-0.5 right-2 text-xs text-red-500">
        invalid
      </span>
    </label>
  );
};
