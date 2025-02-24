import React from 'react';

interface Props {
  label: string;
  id: string;
  onChange: () => void;
  value: string;
  type: 'time' | 'date' | 'text';
}

export const Select: React.FC<Props> = ({ id, label, value, onChange }) => {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700"
    >
      <span>{label}</span>
    </label>
  );
};
