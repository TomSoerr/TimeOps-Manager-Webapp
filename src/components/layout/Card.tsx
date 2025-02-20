import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  return (
    <section className=" relative bg-white p-4 rounded-lg shadow-md">
      {children}
    </section>
  );
};
