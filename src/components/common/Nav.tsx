import { NavItem } from './NavItem';
import React from 'react';
import Status from './Status';

import { v4 as uuid } from 'uuid';

interface NavLinkProps {
  name: string;
  icon: string;
  to: string;
  exact?: boolean;
}

interface NavUlProps {
  links: NavLinkProps[];
}

const NavUl: React.FC<NavUlProps> = ({ links }) => {
  return (
    <ul className="flex justify-around items-center">
      {links.map((link) => (
        <li key={uuid()}>
          <NavItem
            name={link.name}
            icon={link.icon}
            to={link.to}
          />
        </li>
      ))}
    </ul>
  );
};

export const Nav: React.FC = () => {
  return (
    <nav className="fixed flex flex-col justify-center border-t-1 border-slate-200 h-20 gap-0 bottom-0 left-0 right-0  z-1 bg-slate-50 ">
      <NavUl
        links={[
          { to: '/', name: 'Timer', icon: 'timer' },
          { to: '/analytics', name: 'Analytics', icon: 'analytics' },
          { to: '/settings', name: 'Settings', icon: 'settings' },
        ]}
      />
      <Status />
    </nav>
  );
};
