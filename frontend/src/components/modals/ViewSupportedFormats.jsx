import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import {
  codeSuppoted,
  documentSupported,
  pictureSupported,
} from "@/utils/fileSupported";

const ViewSupportedFormats = ({ open, onOpenChange }) => {
  return (
    <ReusableModal
      open={open}
      alertDialogTitle={"View File Formats"}
      alertDialogDescription={
        <div className="h-[300px] overflow-y-scroll">
          <h1 className="font-bold">Documents</h1>
          {documentSupported.map((file) => (
            <ul key={file._id}>
              <li className="flex my-2 gap-2 items-center">
                <img src={file.img} className="w-[30px] italic font-semibold" />{" "}
                {file.name}
              </li>
            </ul>
          ))}
          <h1 className="font-bold">Programming languages</h1>
          {codeSuppoted.map((file) => (
            <ul key={file._id}>
              <li className="flex my-2 gap-2 items-center">
                <img src={file.img} className="w-[30px] italic font-semibold" />{" "}
                {file.name}
              </li>
            </ul>
          ))}

          <h1 className="font-bold">Visuals</h1>
          {pictureSupported.map((file) => (
            <ul key={file._id}>
              <li className="flex my-2 gap-2 items-center">{file.name}</li>
            </ul>
          ))}
        </div>
      }
      alertDialogFooter={
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      }
    />
  );
};

export default ViewSupportedFormats;
