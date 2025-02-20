import React from 'react';

interface Props {
  children: React.ReactNode;
  headline: string;
  hours: string;
}

export const Section: React.FC<Props> = ({ children, headline, hours }) => {
  return (
    <section className="mt-6 flex flex-col gap-2">
      <div className="flex mb-1">
        <h2 className="text-xl font-bold text-slate-800">{headline}</h2>
        <p className="ml-auto font-bold font-mono text-slate-700 text-lg">
          {hours}
        </p>
      </div>
      {children}
      <hr className="text-slate-200 border-2 my-2" />
    </section>
  );
};
