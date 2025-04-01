import React from 'react';

/**
 * Props interface for the Card component
 */
interface Props {
  /** Child elements to be rendered inside the card */
  children: React.ReactNode;
  /** Click handler function for the card */
  onClick: () => void;
  /** Optional ARIA label for screen readers */
  ariaLabel?: string;
  /** Optional ARIA role for the card */
  role?: string;
}

/**
 * Card component provides a consistent container for content items
 * Features:
 * - Clickable surface that triggers the provided onClick handler
 * - Consistent styling with shadow and rounded corners
 * - White background with padding for content
 * - Accessibility support with configurable ARIA attributes
 *
 * This component is used throughout the application to display time entries
 * and other clickable content blocks.
 */
export const Card: React.FC<Props> = ({
  children,
  onClick,
  ariaLabel,
  role = 'button',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer w-full relative bg-white p-4 rounded-lg shadow-md"
      aria-label={ariaLabel}
      role={role}
      tabIndex={0}
    >
      {children}
    </button>
  );
};
