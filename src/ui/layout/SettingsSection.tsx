import React from 'react';

/**
 * Props for the SettingsSection component
 */
interface Props {
  /** Child elements to render within the section */
  children: React.ReactNode;
  /** Heading text to display at the top of the section */
  headline: string;
}

/**
 * Props for the SHeadline component
 */
interface HProps {
  /** Content to display as a subheading */
  children: React.ReactNode;
}

/**
 * SettingsSection component provides consistent layout for settings areas
 * Used as a container for grouped settings controls with a section title
 *
 * @returns A styled section with heading and content
 */
export const SettingsSection: React.FC<Props> = ({ children, headline }) => {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">{headline}</h2>
      {children}
    </section>
  );
};

/**
 * SHeadline component provides consistent styling for subheadings in settings
 * Used to separate different groups of related controls within a settings section
 *
 * @returns A styled subheading element
 */
export const SHeadline: React.FC<HProps> = ({ children }) => {
  return <h3 className="text-lg font-normal">{children}</h3>;
};
