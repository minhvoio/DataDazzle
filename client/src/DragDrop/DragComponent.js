import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

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
    <div className="bg-white shadow-lg rounded-lg w-2/5 px-5 pt-3 pb-5">
      <div className="pb-[8px] border-b border-[#e0e0e0] flex justify-center">
        <h2 className="text-black text-[17px] font-[600]">
          Drag and Drop Container
        </h2>
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
