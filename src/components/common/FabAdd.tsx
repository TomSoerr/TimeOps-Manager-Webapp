import React from 'react';
import { FAB } from './FAB';

interface Props {
  onClick: () => void;
}

export const FabAdd: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="*:bg-indigo-200 **:text-indigo-500 *:hover:bg-indigo-100">
      <FAB
        onClick={onClick}
        name="add"
      />
    </div>
  );
};
