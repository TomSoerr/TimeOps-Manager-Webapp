import React from 'react';
import { FAB } from './FAB';

/**
 * Props for the FabAdd component
 * @interface Props
 * @property {() => void} onClick - Click handler function for the button
 */
interface Props {
  onClick: () => void;
}

/**
 * Floating Action Button for adding new items
 * Provides a consistent "add" button with specific styling (indigo color scheme)
 * This component is a specialized version of the base FAB component styling
 */
export const FabAdd: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="*:bg-indigo-200 **:text-indigo-600 *:hover:bg-indigo-100">
      <FAB
        onClick={onClick}
        name="add"
      />
    </div>
  );
};
