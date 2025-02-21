import React from 'react';

interface Props {
  name: string;
  className?: string;
  onClick: () => void;
}

export const Icon: React.FC<Props> = ({ name, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
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
