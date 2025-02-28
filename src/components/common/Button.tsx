import React from 'react';

interface Props {
  uiType: 'primary' | 'secondary';
  text: string;
  type: 'submit' | 'button';
  onClick?: () => void;
}

export const Button: React.FC<Props> = ({ type, onClick, uiType, text }) => {
  const button = (
    <button
      type={type}
      className="px-4 text-nowrap py-1.5 text-sm font-medium    rounded-sm"
    >
      <span>{text}</span>
    </button>
  );

  if (uiType === 'secondary')
    return (
      <div className="*:hover:bg-indigo-100 *:bg-indigo-200 *:text-indigo-700">
        {button}
      </div>
    );

  return (
    <div className="*:hover:bg-indigo-600 *:bg-indigo-500 *:text-indigo-100">
      {button}
    </div>
  );
};
