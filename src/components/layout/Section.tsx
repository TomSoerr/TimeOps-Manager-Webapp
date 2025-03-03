import React from "react";

interface Props {
  children: React.ReactNode;
  headline: string;
  hours: string;
  subSection?: true;
}

export const Section: React.FC<Props> = ({
  children,
  headline,
  hours,
  subSection,
}) => {
  if (subSection) {
    return (
      <section>
        <div className="flex mb-1">
          <h3 className="text-lg font-bold text-slate-500">{headline}</h3>
          <p className="ml-auto font-bold  text-slate-500 text-lg">{hours}</p>
        </div>
        <ul className="flex flex-col gap-2">{children}</ul>
      </section>
    );
  }
  return (
    <section>
      <div className="flex mb-1 items-end">
        <h2 className="text-2xl font-bold text-slate-800">{headline}</h2>
        <p className="ml-auto font-bold  text-slate-700 text-lg">{hours}</p>
      </div>
      <ul className="flex flex-col gap-6">{children}</ul>
      <hr className="text-slate-200 border-1 my-12" />
    </section>
  );
};
