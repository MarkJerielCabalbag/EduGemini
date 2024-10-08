import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "@/components/ui/button";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { baseUrl } from "@/baseUrl";

const ViewFile = ({ open, onOpenChange, files, path }) => {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"View file"}
      alertDialogDescription={
        <>
          <DocViewer
            documents={files.map((file) => ({
              uri: `${baseUrl}/${path}/${file.filename}`,
              fileName: file.filename,
              fileType: file.filename.split(".").pop(),
            }))}
            pluginRenderers={DocViewerRenderers}
          />
        </>
      }
      alertDialogFooter={
        <>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </>
      }
    />
  );
};

export default ViewFile;
