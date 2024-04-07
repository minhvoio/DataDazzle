import React, { useState } from "react";

const DataTable = ({ processedData, dataTypes }) => {
  // State to store the selected data types
  const [selectedDataTypes, setSelectedDataTypes] = useState(dataTypes);

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
  const limitedRows = processedData.slice(0, 20);

  // Define the available data types
  const availableDataTypes = [
    "Text",
    "Integer",
    "Float",
    "Boolean",
    "Date",
    "Time Delta",
    "Category",
  ];

  // Function to handle data type change
  const handleDataTypeChange = (column, selectedType) => {
    setSelectedDataTypes((prevDataTypes) => ({
      ...prevDataTypes,
      [column]: selectedType,
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-slate-200">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-100">
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left">
                <select
                  value={selectedDataTypes[column]}
                  onChange={(e) => handleDataTypeChange(column, e.target.value)}
                  className="px-2 py-1 text-xs font-medium text-gray-600 uppercase tracking-wider rounded"
                >
                  {availableDataTypes.map((dataType) => (
                    <option key={dataType} value={dataType}>
                      {dataType}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {limitedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-100"}
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
