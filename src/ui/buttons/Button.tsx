import React from 'react';

/**
 * Props for the Button component
 * @interface Props
 * @property {('primary'|'secondary')} uiType - Visual style of the button
 * @property {string} text - Button label text
 * @property {('submit'|'button')} type - HTML button type
 * @property {() => void} [onClick] - Optional click handler function
 * @property {boolean} [disabled=false] - Whether the button is disabled
 */
interface Props {
  uiType: 'primary' | 'secondary';
  text: string;
  type: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Button component that provides consistent styling with primary/secondary variants.
 * Primary buttons use indigo-500 background with light text.
 * Secondary buttons use indigo-200 background with dark text.
 *
 * @param {Props} props - Component props
 * @returns {JSX.Element} - Rendered button with appropriate styling
 */
export const Button: React.FC<Props> = ({
  type,
  onClick,
  uiType,
  text,
  disabled = false,
}) => {
  const button = (
    <button
      type={type}
      className="px-4 text-nowrap py-1.5 text-sm font-medium rounded-sm "
      onClick={onClick}
      disabled={disabled}
    >
      <span>{text}</span>
    </button>
  );

  if (uiType === 'secondary')
    return (
      <div className="*:hover:bg-indigo-100 *:bg-indigo-200 *:text-indigo-700 w-fit">
        {button}
      </div>
    );

  return (
    <div className="*:hover:bg-indigo-600 *:bg-indigo-500 *:text-indigo-100 w-fit">
      {button}
    </div>
  );
};
