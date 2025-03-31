import { NavItem } from './NavItem';
import React from 'react';
import Status from '../../ui/feedback/Status';

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
    <ul className="flex flex-row justify-around items-center lg:flex-col lg:gap-4 lg:pt-16">
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
    <nav className="fixed flex flex-col justify-center border-t-1 border-slate-200 h-20 gap-0 bottom-0 left-0 right-0 z-1 bg-slate-50 lg:right-auto lg:h-1/1 lg:top-0 lg:border-t-0 lg:border-r-1 lg:justify-start lg:w-23">
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
