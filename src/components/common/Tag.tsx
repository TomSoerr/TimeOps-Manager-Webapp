import React from 'react';
import Color from '../../types/color.types';

interface Props {
  name: string;
  color: Color['color'];
}

interface Pill {
  children: React.ReactNode;
  color: Color['color'];
}

/**
 * This is very wasteful however tailwind v4 does not have a safelist file
 */
const Pill: React.FC<Pill> = ({ color, children }) => {
  switch (color) {
    case 'red':
      return (
        <div className="*:bg-red-50 *:border-red-500 **:text-red-900">
          {children}
        </div>
      );
    case 'amber':
      return (
        <div className="*:bg-amber-50 *:border-amber-500 **:text-amber-900">
          {children}
        </div>
      );
    case 'lime':
      return (
        <div className="*:bg-lime-50 *:border-lime-500 **:text-lime-900">
          {children}
        </div>
      );
    case 'emerald':
      return (
        <div className="*:bg-emerald-50 *:border-emerald-500 **:text-emerald-900">
          {children}
        </div>
      );
    case 'cyan':
      return (
        <div className="*:bg-cyan-50 *:border-cyan-500 **:text-cyan-900">
          {children}
        </div>
      );
    case 'blue':
      return (
        <div className="*:bg-blue-50 *:border-blue-500 **:text-blue-900">
          {children}
        </div>
      );
    case 'violet':
      return (
        <div className="*:bg-violet-50 *:border-violet-500 **:text-violet-900">
          {children}
        </div>
      );
    case 'fuchsia':
      return (
        <div className="*:bg-fuchsia-50 *:border-fuchsia-500 **:text-fuchsia-900">
          {children}
        </div>
      );
    case 'slate':
      return (
        <div className="*:bg-slate-50 *:border-slate-500 **:text-slate-900">
          {children}
        </div>
      );
    default:
      return (
        <div className="*:bg-gray-50 *:border-gray-500 **:text-gray-900">
          {children}
        </div>
      );
  }
};

export const Tag: React.FC<Props> = ({ name, color }) => {
  return (
    <Pill color={color}>
      <div className="py-0.5 px-2 rounded-full border-1 w-fit">
        <p className="text-xs text-nowrap">{name}</p>
      </div>
    </Pill>
  );
};
