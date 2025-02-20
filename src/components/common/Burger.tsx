import React from 'react';

export const Burger: React.FC = () => {
  return (
    <button className=" cursor-pointer w-16 h-16 rounded-full grid place-items-center select-none hover:bg-slate-200 duration-200 transition ease-in-out">
      <div className="text-slate-800 material-symbols-rounded !text-4xl">
        menu
      </div>
    </button>
  );
};
