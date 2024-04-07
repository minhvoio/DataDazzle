import React, { useState } from "react";
import moment from "moment";
import { topNotification } from "../utils/topNotification";
import { FaCopy, FaDownload } from "react-icons/fa";

const DataTable = ({ processedData, dataTypes, fileName }) => {
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

  const handleCopyToClipboard = () => {
    const headerRow = columns.join("\t");
    const dataTypeRow = columns
      .map((column) => selectedDataTypes[column])
      .join("\t");
    const clipboardContent = `${dataTypeRow}\n${headerRow}`;

    navigator.clipboard
      .writeText(clipboardContent)
      .then(() => {
        topNotification.fire({
          icon: "success",
          title: "Copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error);
        topNotification.fire({
          icon: "error",
          title: "Failed to copy to clipboard",
        });
      });
  };

  const handleDownloadCSV = () => {
    const dataTypeRow = Object.values(selectedDataTypes).join(",");
    const headerRow = columns.join(",");
    const dataRows = processedData.map((row) =>
      columns
        .map((column) => {
          const cellValue = row[column];
          if (
            selectedDataTypes[column] === "datetime64" ||
            selectedDataTypes[column] === "Date"
          ) {
            return moment(cellValue).isValid()
              ? moment(cellValue).format("YYYY-MM-DD")
              : cellValue;
          }
          return cellValue;
        })
        .join(",")
    );

    const csvContent = `${dataTypeRow}\n${headerRow}\n${dataRows.join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName + "(cleaned_by_DataDazzle).csv");

    topNotification.fire({
      icon: "success",
      title: "CSV file downloaded",
    });

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-center mt-4">
        <button
          className="flex items-center px-4 py-2 mb-4 font-bold text-white bg-primary rounded hover:bg-primary_dark"
          onClick={handleCopyToClipboard}
        >
          <FaCopy className="mr-2" />
          Copy Header and Types
        </button>
        <button
          className="flex items-center px-4 py-2 ml-4 mb-4 font-bold text-white bg-secondary rounded hover:bg-secondary_dark"
          onClick={handleDownloadCSV}
        >
          <FaDownload className="mr-2" />
          Download CSV
        </button>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-slate-300">
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
        </thead>
        <tbody>
          {limitedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-100"}
            >
              {columns.map((column, cellIndex) => {
                const cellValue = row[column];
                let formattedValue = cellValue;

                // Check if the column is date-related based on the data type
                if (selectedDataTypes[column] === "Date") {
                  formattedValue = moment(cellValue).isValid()
                    ? moment(cellValue).format("YYYY-MM-DD")
                    : cellValue;
                }

                return (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
