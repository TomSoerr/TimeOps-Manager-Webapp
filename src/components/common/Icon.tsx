import React from 'react';

interface Props {
  name: string;
  className?: string;
}

export const Icon: React.FC<Props> = ({ name, className = '' }) => {
  return (
    <button className=" cursor-pointer w-8 h-8 rounded-full grid place-items-center select-none hover:bg-slate-200 duration-200 transition ease-in-out">
      <div className={`text-slate-800 material-symbols-rounded ${className}`}>
        {name}
      </div>
    </button>
  );
};
