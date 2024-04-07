import { useRef, useEffect, useState } from "react";
import { FaUpload, FaRegFile } from "react-icons/fa";
import { BsX } from "react-icons/bs";
import Swal from "sweetalert2";
import axios from "axios";

export function CustomDragDrop({ data, onUpload, onDelete, count, formats }) {
  const dropContainer = useRef(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [output, setOutput] = useState(null);

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

          console.log("File uploaded successfully:", response.data);
          setOutput(response.data);

          const base64String = await convertFileBase64(file);
          setUploadProgress(100);
          clearInterval(progressInterval);
          return {
            name: file.name,
            file: base64String,
            type: file.type,
            size: file.size,
          };
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      });

      Promise.all(nFiles).then((newFiles) => {
        onUpload(newFiles);
        TopNotification.fire({
          icon: "success",
          title: "File(s) uploaded",
        });
      });
    }
  }

  async function convertFileBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
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

  const TopNotification = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  function showAlert(icon, title, text) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      width: 500,
      timer: 2000,
    });
  }

  return (
    <>
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
              className="text-primary cursor-pointer"
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <div className="text-[10px] font-normal text-gray-500">
            Only files XLSX, XLS, CSV
          </div>
        </div>
      </div>
      {uploadProgress > 0 && uploadProgress !== 100 && (
        <div className="mt-4">
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Uploading file... {uploadProgress}%
          </p>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 flex-col space-y-3">
          {data.map((file, index) => (
            <div
              key={index}
              className="w-full px-3 py-3.5 rounded-md bg-slate-200 space-y-3"
            >
              <div className="flex justify-between">
                <div className="w-[70%] flex justify-start items-center space-x-2">
                  <div className="text-primary text-[37px]">
                    <FaRegFile />
                  </div>
                  <div className=" space-y-1">
                    <div className="text-xs font-medium text-gray-500">
                      {file.name}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">{`${Math.floor(
                      file.size / 1024
                    )} KB`}</div>
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="space-y-1">
                    <div
                      className="text-gray-500 text-[17px] cursor-pointer"
                      onClick={() => onDelete(index)}
                    >
                      <BsX className="ml-auto" />
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      Done
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {output && (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-start">Column</th>
                  <th className="px-4 py-2 text-start">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(output).map(([key, value], index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-slate-200" : ""}
                  >
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
