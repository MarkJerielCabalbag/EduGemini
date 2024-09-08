import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  classwork,
  deleteAttachment,
  getAttachments,
  useDeleteAttachment,
  useGetAttachments,
} from "@/api/useApi";
import { Calendar, File, NotebookPen, Timer, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useFilePicker } from "use-file-picker";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { baseUrl } from "@/baseUrl";

function ClassroomSubmition() {
  const [files, setFiles] = useState([]);
  const [showTurnInBtn, setShowTurnInBtn] = useState(false);
  const { workId, roomId, userId } = useParams();
  const [filename, setFilename] = useState("");
  const { data } = useQuery({
    queryKey: ["classwork"],
    queryFn: () => classwork(workId),
  });

  const queryCleint = useQueryClient();

  const onError = () => console.log("error");
  const onSuccess = () => {
    queryCleint.invalidateQueries({
      queryKey: ["attachments"],
    });
    queryCleint.invalidateQueries({
      queryKey: ["classwork"],
    });
  };

  const { data: attachments } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, userId),
    onError,
    onSuccess,
  });

  const { mutateAsync } = useDeleteAttachment({
    mutationFn: () => deleteAttachment(filename, roomId, workId, userId),
    onError,
    onSuccess,
  });

  const fileSizeLabel = (size) => {
    if (size >= 8589934592) {
      return size + " GB";
    } else if (size >= 1073741824) {
      return (size / 1073741824).toFixed(2) + " GB";
    } else if (size >= 1048576) {
      return (size / 1048576).toFixed(2) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return size + " bytes";
    }
  };

  const { openFilePicker, filesContent, loading, plainFiles } = useFilePicker({
    accept: [".docx", ".pdf", ".xlsx"],
    multiple: true,
    readAs: "BinaryString",
    onFilesSuccessfullySelected: async ({ plainFiles, filesContent }) => {
      setShowTurnInBtn(true);
      console.log("onFilesSuccessfullySelected", plainFiles, filesContent);

      try {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("userId", userId);
        setFiles(plainFiles);
        for (let i = 0; i < plainFiles.length; i++) {
          formData.append(`files`, plainFiles[i]);
        }

        const response = await fetch(
          `${baseUrl}/api/eduGemini/classwork/addFiles/${workId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "An error occurred");
        }

        toast.success(data.message);
        queryCleint.invalidateQueries({
          queryKey: ["attachments"],
        });
      } catch (error) {
        toast.error(error.message);
      }
    },
  });
  const handleRemoveFile = (index) => {
    filesContent.filter((_, fileIndex) => fileIndex !== index);
  };

  return (
    <div className="sm:container md:container lg:container">
      <Navbar />
      <MenuBar />
      <div className="h-screen w-full mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="px-4 py-4 bg-primary rounded">
          <div className="p-5 text-white">
            {data?.map((classworkInfo) => (
              <div>
                {classworkInfo.classwork.map((info) => (
                  <>
                    {info._id === workId ? (
                      <div>
                        <h1 className="flex gap-2 justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <NotebookPen size={30} />
                            <span className="font-bold text-lg">
                              {info.classwork_title}
                            </span>
                          </div>

                          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            {info.classwork_type}
                          </span>
                        </h1>

                        <div className="flex items-center justify-between my-2">
                          <p className="flex gap-2 items-center">
                            <Calendar />
                            {info.classwork_due_date}
                          </p>
                          <p className="flex gap-2 items-center">
                            <Timer />
                            {info.classwork_due_time}
                          </p>
                        </div>

                        <p className="font-light italic my-2">
                          Description:{" "}
                          {info.classwork_description === null
                            ? "No description stated"
                            : info.classwork_description}
                        </p>

                        <div className="bg-slate-400 shadow-sm shadow-white rounded my-2 p-5">
                          <h1>Your Work</h1>
                          <div className="h-96 overflow-x-auto">
                            {attachments?.length === 0 ? (
                              <>
                                <div className="h-full flex justify-center items-center">
                                  No files uploaded yet.
                                </div>{" "}
                                <Button
                                  className="w-full my-2"
                                  onClick={() => {
                                    openFilePicker();
                                  }}
                                >
                                  Select Files
                                </Button>
                              </>
                            ) : (
                              <>
                                {attachments?.map((outputs) => (
                                  <>
                                    {outputs.files.map((file, index) => (
                                      <div
                                        key={index}
                                        className="flex gap-2 items-center justify-between bg-slate-900 text-white rounded my-2 p-5 "
                                      >
                                        <div className="flex gap-2 items-center">
                                          <File />
                                          <div key={index}>
                                            <Link
                                              to={`/class/classwork/outputs/${roomId}/${userId}/${workId}`}
                                              onClick={() => {
                                                localStorage.setItem(
                                                  "uri",
                                                  `http://localhost:3000/${info.classwork_folder_path}/answers${file.path}/${file.filename}`
                                                );
                                                localStorage.setItem(
                                                  "fileType",
                                                  file.filename.split(".").pop()
                                                );
                                              }}
                                            >
                                              <h1>{file.filename}</h1>
                                            </Link>
                                            <p>{fileSizeLabel(file.size)}</p>
                                          </div>
                                        </div>
                                        <X
                                          className="hover:cursor-pointer"
                                          onClick={async () => {
                                            setFilename(file.filename);
                                            console.log(filename);
                                            await mutateAsync({ filename });
                                          }}
                                        />
                                      </div>
                                    ))}
                                    <>
                                      <Button
                                        className="w-full my-2"
                                        onClick={() => {
                                          openFilePicker();
                                        }}
                                      >
                                        Select Files
                                      </Button>
                                      {outputs.workStatus === "shelved" ? (
                                        <Button className="w-full">
                                          Turn in
                                        </Button>
                                      ) : (
                                        <Button className="w-full">
                                          Cancel
                                        </Button>
                                      )}
                                    </>
                                  </>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-slate-400 shadow-sm shadow-white rounded my-2 p-5">
                          <h1>Private Comment</h1>
                          <input></input>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 md:mt-0 lg:mt-0 px-4 ">
          <div className="px-4"></div>
        </div>
      </div>
    </div>
  );
}

export default ClassroomSubmition;
