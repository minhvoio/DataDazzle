import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

export default function DragComponent() {
  const [data, setData] = useState([]);

  function uploadFiles(f) {
    setData([...data, ...f]);
  }

  function deleteFile(indexFile) {
    const updatedList = data.filter((ele, index) => index !== indexFile);
    setData(updatedList);
  }

  return (
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
  );
}
