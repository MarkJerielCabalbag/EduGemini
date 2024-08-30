import React, { useState } from "react";

const UploadFiles = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      await axios.post("/upload-multiple", formData);
      console.log("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
  };

  return (
    <div>
      {files && <div>{files}</div>}
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
};

export default UploadFiles;
