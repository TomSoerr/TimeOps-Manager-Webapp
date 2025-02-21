import React from 'react';
import { NavLink } from 'react-router';

interface Props {
  name: string;
  icon: string;
  to: string;
}

export const NavItem: React.FC<Props> = ({ name, icon, to }) => {
  return (
    <NavLink
      to={to}
      end={to === '/'}
    >
      {({ isActive }) => (
        <>
          <div
            className={`text-indigo-500 rounded-full w-16 material-symbols-rounded !text-2xl text-center ${
              isActive ? 'bg-indigo-100' : ''
            }`}
          >
            {icon}
          </div>
          <div className="text-sm font-semibold text-center">{name}</div>
        </>
      )}
    </NavLink>
  );
};
