import React from 'react';
import { NavLink } from 'react-router';

/**
 * Props interface for the NavItem component
 * Defines the properties required to render a navigation link
 */
interface Props {
  /** Display text of the navigation item */
  name: string;
  /** Material icon name to display with the navigation item */
  icon: string;
  /** Route path the link should navigate to */
  to: string;
}

/**
 * NavItem component renders a single navigation item with an icon and text
 * Uses NavLink from react-router to handle active state styling
 *
 * The component renders a material icon above the navigation text and
 * applies different styling when the route is active.
 *
 * @returns A styled navigation link with icon and text
 */
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
