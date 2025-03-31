import React from 'react';

/**
 * Interface for dropdown options
 * Each option requires a display name and unique ID
 */
export interface Option {
  name: string;
  id: number;
}

/**
 * Props for the Select component
 */
interface Props {
  /** Text label displayed above the select element */
  label: string;

  /** HTML ID attribute for the select element */
  id: string;

  /** Event handler for when selection changes */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  /** Currently selected option value */
  value: number;

  /** Array of options to display in the dropdown */
  options: Option[];

  /** Whether the select element is disabled */
  disabled?: boolean;
}

/**
 * Select component creates a styled dropdown selection control
 * Features:
 * - Floating label that sits above the control
 * - Consistent styling with other form controls
 * - Support for disabled state
 * - Dynamic options from provided array
 */
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
      htmlFor={id}
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
