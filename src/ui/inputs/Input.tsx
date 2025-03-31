import React from 'react';

/**
 * Props interface for the Input component
 * @interface Props
 * @property {string} label - Label text displayed above the input
 * @property {string} id - HTML id attribute for the input element
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Event handler for input changes
 * @property {string} value - Current value of the input
 * @property {'time' | 'date' | 'text' | 'url'} type - The input type attribute
 * @property {string} [min] - Optional minimum value (for date/time inputs)
 * @property {string} [max] - Optional maximum value (for date/time inputs)
 * @property {boolean} [disabled=false] - Whether the input is disabled
 */
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

/**
 * Input component that provides styled form controls with floating labels
 *
 * Features:
 * - Consistent styling with border and focus states
 * - Floating label that sits above the input
 * - Support for various input types
 * - Validation state indicator (currently hidden by default)
 *
 * @param {Props} props - Component props
 * @returns {JSX.Element} Styled input with floating label
 */
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
        step={type === 'time' ? 1 : ''}
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
