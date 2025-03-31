import React from 'react';

/**
 * Props for the FAB (Floating Action Button) component
 * @interface Props
 * @property {string} name - Material symbol icon name to display inside the button
 * @property {() => void} onClick - Click handler function for the button
 */
interface Props {
  name: string;
  onClick: () => void;
}

/**
 * Floating Action Button component
 * Renders a prominent circular button with a material icon
 * Used for primary actions throughout the application
 */
export const FAB: React.FC<Props> = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer p-4 shadow-xl rounded-2xl grid w-18 h-18 place-items-center select-none duration-200 transition ease-in-out hover:shadow-lg"
    >
      <div className="material-symbols-rounded text-slate-800 !text-4xl">
        {name}
      </div>
    </button>
  );
};
