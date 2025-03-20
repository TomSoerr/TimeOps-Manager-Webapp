import React from 'react';

interface Props {
  children: React.ReactNode;
  headline: string;
}

interface HProps {
  children: React.ReactNode;
}

export const SettingsSection: React.FC<Props> = ({ children, headline }) => {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold ">{headline}</h2>
      {children}
    </section>
  );
};

export const SHeadline: React.FC<HProps> = ({ children }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};
