import axios from "axios";

import { useRef, useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { ProgressBar } from "./ProgressBar";
import { FileDisplay } from "./FileDisplay";
import { showAlert } from "../utils/showAlert";
import { topNotification } from "../utils/topNotification";
import DataTable from "./DataTable";
import logo from "../assets/data_dazzle_logo.svg";

export function CustomDragDrop({ data, onUpload, onDelete, count, formats }) {
  const dropContainer = useRef(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataTypes, setDataTypes] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  async function handleDrop(e, type) {
    let files;
    if (type === "inputFile") {
      files = [...e.target.files];
    } else {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      files = [...e.dataTransfer.files];
    }

    const allFilesValid = files.every((file) => {
      return formats.some((format) => file.type.includes(format));
    });

    if (data.length >= count) {
      data.pop();
    }
    if (!allFilesValid) {
      showAlert(
        "warning",
        "Invalid Media",
        "Invalid file format. Please only upload XLSX, XLS, CSV files"
      );
      return;
    }
    if (count && count < files.length) {
      showAlert(
        "error",
        "Error",
        `Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
      );
      return;
    }

    if (files && files.length) {
      // Remove any existing file from the data array

      if (data.length > 0) {
        onDelete(0);
      }

      const nFiles = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        let progressInterval;

        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/upload/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.min(
                  50,
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                );
                setUploadProgress(progress);

                // Start the progress interval when the initial progress reaches 50
                if (progress === 50 && !progressInterval) {
                  progressInterval = setInterval(() => {
                    setUploadProgress((prevProgress) => {
                      const newProgress = prevProgress + 2;
                      if (newProgress >= 98) {
                        return 98;
                      }
                      return newProgress;
                    });
                  }, 1500);
                }
              },
            }
          );

          // console.log("File uploaded successfully:", response.data);
          setDataTypes(response.data.data_types);
          setProcessedData(response.data.processed_data);
          setUploadProgress(100);
          clearInterval(progressInterval);
          return {
            name: file.name,
            size: file.size,
          };
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      });

      Promise.all(nFiles).then((newFiles) => {
        onUpload(newFiles);
        topNotification.fire({
          icon: "success",
          title: "File(s) uploaded",
        });
      });
    }
  }

  useEffect(() => {
    function handleDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    }
    function handleDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    }
    dropContainer.current.addEventListener("dragover", handleDragOver);
    dropContainer.current.addEventListener("drop", handleDrop);
    dropContainer.current.addEventListener("dragleave", handleDragLeave);

    return () => {
      if (dropContainer.current) {
        dropContainer.current.removeEventListener("dragover", handleDragOver);
        dropContainer.current.removeEventListener("drop", handleDrop);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dropContainer.current.removeEventListener("dragleave", handleDragLeave);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <div className="bg-slate-50 h-screen py-16 overflow-auto">
        <div className="flex justify-center items-center px-5">
          <div className="bg-white shadow-lg rounded-lg w-2/3 px-5 py-5">
            <div className="pb-4 border-b border-slate-300 flex justify-center">
              <img src={logo} alt="logo" className="h-10" />
            </div>
            {/* Container Drop */}
            <div
              className={`${
                dragging
                  ? "border border-primary bg-slate-100"
                  : "border-dashed border-slate-300"
              } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 py-5`}
              ref={dropContainer}
            >
              <div className="flex-1 flex flex-col">
                <div className="mx-auto text-gray-400 mb-2">
                  <FaUpload size={18} />
                </div>
                <div className="text-[12px] font-normal text-gray-500">
                  <input
                    className="opacity-0 hidden"
                    type="file"
                    multiple
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                    ref={fileRef}
                    onChange={(e) => handleDrop(e, "inputFile")}
                  />
                  <span
                    className="text-primary cursor-pointer font-bold"
                    onClick={() => {
                      fileRef.current.click();
                    }}
                  >
                    Click to upload
                  </span>{" "}
                  or drag and drop to clean and infer data types
                </div>
                <div className="text-[10px] font-normal text-gray-500">
                  Only files XLSX, XLS, CSV
                </div>
              </div>
            </div>
            {uploadProgress > 0 && uploadProgress !== 100 && (
              <ProgressBar uploadProgress={uploadProgress} />
            )}

            {data.length > 0 && (
              <>
                <div className="mt-4 flex-col space-y-3">
                  {data.map((file, index) => (
                    <>
                      <FileDisplay
                        file={file}
                        index={index}
                        onDelete={onDelete}
                      />
                      <div className="mt-5">
                        {processedData && (
                          <DataTable
                            processedData={processedData}
                            dataTypes={dataTypes}
                            fileName={file.name
                              .split(".")
                              .slice(0, -1)
                              .join(".")}
                          />
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
