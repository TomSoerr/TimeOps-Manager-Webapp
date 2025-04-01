import React from 'react';
import { analyticsItem } from '../../database/index';

/**
 * Props interface for the Table component
 */
interface Props {
  /** Array of analytics items to display in the table */
  data: analyticsItem[];
  /** Label text for the first column header */
  label: string;
  /** Label text for the second column header */
  value: string;
  /** Title text to display above the table */
  headline: string;
}

/**
 * Table component displays analytical data in a formatted table
 *
 * Features:
 * - Consistent styling with borders and padding
 * - Displays a section headline above the table
 * - Two-column layout with customizable header labels
 * - Renders array data in rows with automatic key generation
 *
 * Used primarily in the Analytics view to display various metrics
 * like daily, weekly, monthly stats and tag-based analytics.
 */
export const Table: React.FC<Props> = ({ label, value, data, headline }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4 mb-2">{headline}</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
        <thead>
          <tr>
            <th
              scope="col"
              className="border border-gray-300 px-4 py-2"
            >
              {label}
            </th>
            <th
              scope="col"
              className="border border-gray-300 px-4 py-2"
            >
              {value}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{item.label}</td>
              <td className="border border-gray-300 px-4 py-2">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
