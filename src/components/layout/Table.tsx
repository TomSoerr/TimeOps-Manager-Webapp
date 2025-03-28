import React from 'react';
import { analyticsItem } from '../../database/db';

interface Props {
  data: analyticsItem[];
  label: string;
  value: string;
  headline: string;
}

export const Table: React.FC<Props> = ({
  label: key,
  value,
  data,
  headline,
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4 mb-2">{headline}</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">{key}</th>
            <th className="border border-gray-300 px-4 py-2">{value}</th>
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
