import React from 'react';

/**
 * Props interface for the Icon component
 * @interface Props
 * @property {string} name - The name of the Material Symbol icon to display
 * @property {string} [className] - Optional additional CSS classes to apply to the icon
 * @property {() => void} onClick - Click handler function for the icon button
 */
interface Props {
  name: string;
  className?: string;
  onClick: () => void;
}

/**
 * Icon component that renders a clickable Material Symbols icon
 * Wraps the icon in a button with hover effects and proper styling
 */
export const Icon: React.FC<Props> = ({ name, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={`icon with the name of ${name}`}
      className="cursor-pointer aspect-square p-1 rounded-full grid place-items-center select-none hover:bg-slate-200 duration-200 transition ease-in-out"
    >
      <div
        className={`text-slate-800 leading-none aspect-square material-symbols-rounded ${className}`}
      >
        {name}
      </div>
    </button>
  );
};
