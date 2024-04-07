import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";
import logo from "../assets/data_dazzle_logo.svg";

export default function DragComponent() {
  const [data, setData] = useState([]);
  // console.log("data: ", data);

  function uploadFiles(f) {
    setData([...data, ...f]);
  }

  function deleteFile(indexImg) {
    const updatedList = data.filter((ele, index) => index !== indexImg);
    setData(updatedList);
  }

  return (
    <div className="bg-white shadow-lg rounded-lg w-2/5 px-5 py-5">
      <div className="pb-[8px] border-b border-[#e0e0e0] flex justify-center">
        <img src={logo} alt="logo" className="h-8" />
      </div>
      <CustomDragDrop
        data={data}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={1}
        formats={[
          "xlsx",
          "xls",
          "csv",
          "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "ms-excel",
        ]}
      />
    </div>
  );
}
