import React from 'react';

interface Props {
  name: string;
}

export const FAB: React.FC<Props> = ({ name }) => {
  return (
    <button className="cursor-pointer p-6 shadow-xl  rounded-2xl grid place-items-center select-none duration-200 transition ease-in-out hover:shadow-lg">
      <div className="material-symbols-rounded text-slate-800 !text-4xl">
        {name}
      </div>
    </button>
  );
};
