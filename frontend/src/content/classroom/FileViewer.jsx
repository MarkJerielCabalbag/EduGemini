import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

function FileViewer() {
  const files = JSON.parse(localStorage.getItem("files"));
  if (!files || files.length === 0) {
    return <div>No files to display</div>;
  }
  const docs = files.map((file) => ({
    uri: `http://localhost:3000/announcements/${file.filename}`,
  }));

  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
}

export default FileViewer;
