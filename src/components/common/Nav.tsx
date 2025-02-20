import React from 'react';
import { Burger } from './Burger';

export const Nav: React.FC = () => {
  return (
    <nav className="fixed items-center gap-2 top-2 left-2 right-2 flex rounded-full z-1 bg-white ">
      <Burger />
      <span className="text-indigo-500 text-2xl font-bold">
        TimeOps Manager
      </span>
    </nav>
  );
};
