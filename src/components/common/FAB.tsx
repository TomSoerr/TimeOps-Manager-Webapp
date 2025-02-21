import React from 'react';

interface Props {
  name: string;

  onClick: () => void;
}

export const FAB: React.FC<Props> = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer p-4 shadow-xl  rounded-2xl grid w-18 h-18 place-items-center select-none duration-200 transition ease-in-out hover:shadow-lg"
    >
      <div className="material-symbols-rounded text-slate-800 !text-4xl">
        {name}
      </div>
    </button>
  );
};
