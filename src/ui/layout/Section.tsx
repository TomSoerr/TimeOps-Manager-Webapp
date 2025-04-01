import React from 'react';

/**
 * Props for the Section component
 */
interface Props {
  /** Child elements to render within the section */
  children: React.ReactNode;
  /** Title text displayed at the top of the section */
  headline: string;
  /** Time value (formatted as hours) displayed at the right side */
  hours: string;
  /** When true, renders with a smaller, secondary styling */
  subSection?: true;
}

/**
 * Section component for displaying grouped content with header information
 *
 * Features:
 * - Two rendering modes (main section and subsection) with different styling
 * - Consistent header with title and hours display
 * - Content rendering within a list container
 * - Horizontal rule at the bottom of main sections
 *
 * Used primarily in the Timer view to group time entries by week and day.
 */
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
          <p className="ml-auto font-bold text-slate-500 text-lg">{hours}</p>
        </div>
        <ul className="flex flex-col gap-2">{children}</ul>
      </section>
    );
  }
  return (
    <section>
      <div className="flex mb-1 items-end">
        <h2 className="text-2xl font-bold text-slate-800">{headline}</h2>
        <p className="ml-auto font-bold text-slate-700 text-lg">{hours}</p>
      </div>
      <ul className="flex flex-col gap-6">{children}</ul>
      <hr className="text-slate-200 border-1 my-12" />
    </section>
  );
};
