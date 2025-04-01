import { NavItem } from './NavItem';
import React from 'react';
import Status from '../feedback/Status';

/**
 * Props interface for navigation links
 * Defines the structure of each navigation menu item
 */
interface NavLinkProps {
  name: string; // Display text of the navigation item
  icon: string; // Material icon name for the navigation item
  to: string; // Route path the link should navigate to
}

/**
 * Props interface for the NavUl component
 */
interface NavUlProps {
  links: NavLinkProps[]; // Array of navigation links to render
}

/**
 * NavUl component renders an unordered list of navigation items
 * Adapts layout based on viewport size (horizontal on mobile, vertical on desktop)
 */
const NavUl: React.FC<NavUlProps> = ({ links }) => {
  return (
    <ul className="flex flex-row justify-around items-center lg:flex-col lg:gap-4 lg:pt-16">
      {links.map((link) => (
        <li key={link.to}>
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

/**
 * Nav component serves as the main navigation for the application
 * Renders as a bottom bar on mobile devices and a left sidebar on desktop
 * Includes connection status indicator
 */
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
