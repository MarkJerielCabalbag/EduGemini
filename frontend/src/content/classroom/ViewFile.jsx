import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { baseUrl } from "@/baseUrl";

const ViewFile = () => {
  const files = JSON.parse(localStorage.getItem("files"));
  const path = JSON.parse(localStorage.getItem("path"));
  console.log(files);
  console.log(path);
  console.log(
    files.map((file) => ({
      uri: `${baseUrl}/${path}/${file.originalname}`,
      fileType: file.originalname.split(".").pop(),
      fileName: file.originalname,
    }))
  );
  const docs = files.map((file) => ({
    uri: `${baseUrl}/${path}/${file.originalname}`,
    fileType: file.originalname.split(".").pop(),
    fileName: file.originalname,
  }));
  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
};

export default ViewFile;
