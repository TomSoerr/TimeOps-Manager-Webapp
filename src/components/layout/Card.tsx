import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export const Card: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-1/1 relative bg-white p-4 rounded-lg shadow-md"
    >
      {children}
    </button>
  );
};
