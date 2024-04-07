import React from "react";

const DataTable = ({ processedData, dataTypes }) => {
  // Check if processedData is undefined or not an array
  if (!processedData || !Array.isArray(processedData)) {
    return <div>No data available.</div>;
  }

  // Check if processedData is an empty array
  if (processedData.length === 0) {
    return <div>No data available.</div>;
  }

  // Get the column names from the first object in the processedData array
  const columns = Object.keys(processedData[0]);

  // Limit the displayed rows to the first 20
  const limitedRows = processedData.slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
          <tr className="bg-gray-200">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {dataTypes[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {limitedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columns.map((column, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
