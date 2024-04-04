import "./App.css";
import DragComponent from "./DragDrop/DragComponent";
import { useState } from "react";
import axios from "axios";

function App() {
  return (
    <div className="flex h-screen justify-center items-center px-5 bg-slate-100">
      <DragComponent />
    </div>
  );
}

// const [file, setFile] = useState(null);
// const [isUploading, setIsUploading] = useState(false);
// const [uploadedFile, setUploadedFile] = useState(null);

// const handleFileChange = (event) => {
//   setFile(event.target.files[0]);
// };

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setIsUploading(true);

//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:8000/api/upload/",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     setUploadedFile(response.data);
//     console.log("File uploaded successfully:", response.data);
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   } finally {
//     setIsUploading(false);
//   }
// };

// return (
//   <div>
//     <form onSubmit={handleSubmit}>
//       <input
//         type="file"
//         accept=".csv, .xlsx, .xls"
//         onChange={handleFileChange}
//       />
//       <button type="submit" disabled={isUploading}>
//         {isUploading ? "Uploading..." : "Upload File"}
//       </button>
//     </form>
//     {uploadedFile && (
//       <div>
//         <h3>Uploaded File:</h3>
//         <p>Name: {uploadedFile.name}</p>
//         <p>Size: {uploadedFile.size} bytes</p>
//         {/* Add more details about the uploaded file as needed */}
//       </div>
//     )}
//   </div>
// );
// }

export default App;
