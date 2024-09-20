import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  classwork,
  deleteAttachment,
  getAttachments,
  submitAttachment,
  useDeleteAttachment,
  useGetAttachments,
  useSubmitAttachment,
} from "@/api/useApi";
import {
  Calendar,
  File,
  Info,
  Loader2Icon,
  NotebookPen,
  Timer,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useFilePicker } from "use-file-picker";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { baseUrl } from "@/baseUrl";
import CancelSubmitionModal from "@/components/modals/CancelSubmitionModal";
import moment from "moment";
import Feedback from "./Feedback";
function ClassroomSubmition() {
  const [files, setFiles] = useState([]);
  const [showTurnInBtn, setShowTurnInBtn] = useState(false);
  const [openCancelModal, setCancelModal] = useState(false);
  const [time, setTime] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [disableTurnIn, setDisableTurnIn] = useState(false);
  const { workId, roomId, userId } = useParams();
  const [filename, setFilename] = useState("");
  const { data } = useQuery({
    queryKey: ["classwork"],
    queryFn: () => classwork(workId),
  });

  const queryCleint = useQueryClient();
  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);

  const onError = () => console.log("error");
  const onSuccess = (data) => {
    queryCleint.invalidateQueries({ queryKey: ["attachments"] });
    queryCleint.invalidateQueries({ queryKey: ["classwork"] });

    toast.success(data.message);
  };

  const { data: attachments } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, userId),
    onError,
    onSuccess,
  });

  const { mutateAsync, isLoading, isPending } = useDeleteAttachment({
    mutationFn: () =>
      deleteAttachment(filename, date, timeAction, roomId, workId, userId),
    onError,
    onSuccess,
  });

  const { mutateAsync: submit } = useSubmitAttachment({
    mutationFn: () =>
      submitAttachment(date, timeAction, roomId, workId, userId),
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
    accept: [".docx", ".pdf", ".xlsx", ".pptx"],
    multiple: true,
    readAs: "BinaryString",
    onFilesSuccessfullySelected: async ({ plainFiles, filesContent }) => {
      console.log("onFilesSuccessfullySelected", plainFiles, filesContent);

      try {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("userId", userId);
        formData.append("date", date);
        formData.append("timeAction", timeAction);
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

  const workBadge = attachments?.map((output) => {
    if (output.workStatus.name === "Turned in") {
      return "bg-green-500";
    } else if (output.workStatus.name === "Shelved") {
      return "bg-sky-500";
    } else if (output.workStatus.name === "Cancelled") {
      return "bg-red-500";
    }
  });

  return (
    <div className="sm:container md:container lg:container">
      <Navbar />
      <MenuBar />
      <div className="h-screen w-full mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="px-4 py-4 bg-primary rounded">
          <div className="p-5 text-white">
            {data?.map((classworkInfo) => {
              return (
                <>
                  <div>
                    {classworkInfo.classwork.map((info) => {
                      const now = moment();
                      const isOverdue = now.isAfter(
                        moment(
                          `${info.classwork_due_date} ${info.classwork_due_time}`,
                          "MMM Do YYYY h:mm A"
                        )
                      );
                      return (
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
                                <div className="flex gap-2 items-center">
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                    {info.classwork_type}
                                  </span>

                                  <span
                                    className={`${attachments?.map((output) =>
                                      output.files.length === 0
                                        ? "bg-yellow-500"
                                        : workBadge
                                    )} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10`}
                                  >
                                    {attachments?.map((output) =>
                                      output.files.length === 0
                                        ? "No Attachments"
                                        : output.workStatus.name
                                    )}
                                  </span>
                                </div>
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

                              <div className="flex items-center justify-between p-5 rounded-md bg-slate-400 text-slate-50">
                                <Link
                                  target="_blank"
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
                                  <p>
                                    {info.classwork_attach_file.originalname}
                                  </p>
                                  <p>
                                    {fileSizeLabel(
                                      info.classwork_attach_file.size
                                    )}
                                  </p>
                                </Link>
                              </div>

                              <div className="bg-slate-400 shadow-sm shadow-white rounded my-2 p-5">
                                <h1>Your Work</h1>

                                <div className="h-full overflow-x-auto">
                                  {attachments?.length === 0 ? (
                                    <>
                                      <div className="flex justify-center items-center">
                                        No files uploaded yet.
                                      </div>
                                      <Button
                                        disabled={isOverdue}
                                        className={`w-full my-2 ${
                                          isOverdue ? "opacity-50" : "show"
                                        }`}
                                        onClick={() => openFilePicker()}
                                      >
                                        {attachments?.length === 0
                                          ? "Select Files"
                                          : "Add More Files"}
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
                                                <div
                                                  key={index}
                                                  className="w-full"
                                                >
                                                  <Link
                                                    target="_blank"
                                                    to={`/class/classwork/outputs/${roomId}/${userId}/${workId}`}
                                                    onClick={() => {
                                                      localStorage.setItem(
                                                        "uri",
                                                        `http://localhost:3000/${info.classwork_folder_path}/answers${file.path}/${file.filename}`
                                                      );
                                                      localStorage.setItem(
                                                        "fileType",
                                                        file.filename
                                                          .split(".")
                                                          .pop()
                                                      );
                                                    }}
                                                  >
                                                    <p className="line-clamp-1">
                                                      {file.filename}
                                                    </p>
                                                  </Link>
                                                  <p>
                                                    {fileSizeLabel(file.size)}
                                                  </p>
                                                </div>
                                              </div>
                                              {isLoading || isPending ? (
                                                <Loader2Icon className="animate-spin" />
                                              ) : (
                                                <X
                                                  size={isOverdue ? 0 : 30}
                                                  className={`max-h-96 hover:cursor-pointer ${
                                                    outputs.workStatus.name ===
                                                    "Turned in"
                                                      ? "hidden"
                                                      : ""
                                                  }`}
                                                  onClick={async () => {
                                                    setFilename(file.filename);
                                                    console.log(filename);
                                                    await mutateAsync({
                                                      filename,
                                                      date,
                                                      timeAction,
                                                    });
                                                  }}
                                                />
                                              )}
                                            </div>
                                          ))}
                                          <>
                                            <Button
                                              disabled={
                                                isOverdue &&
                                                outputs.chancesResubmition === 0
                                              }
                                              className={`w-full my-2 ${
                                                outputs.workStatus.name ===
                                                "Turned in"
                                                  ? "hidden"
                                                  : ""
                                              } ${
                                                isOverdue
                                                  ? "opacity-50"
                                                  : "show"
                                              }`}
                                              onClick={() => {
                                                openFilePicker();
                                              }}
                                            >
                                              {isOverdue && outputs.length === 0
                                                ? "Missing"
                                                : "Select Files"}
                                            </Button>
                                            {openCancelModal && (
                                              <CancelSubmitionModal
                                                open={openCancelModal}
                                                onOpenChange={setCancelModal}
                                              />
                                            )}
                                            {outputs.workStatus.name ===
                                              "Shelved" ||
                                            outputs.workStatus.name ===
                                              "Cancelled" ? (
                                              <Button
                                                disabled={
                                                  isOverdue ||
                                                  outputs.chancesResubmition ===
                                                    0
                                                }
                                                className={`w-full ${
                                                  outputs.files.length === 0
                                                    ? "hidden"
                                                    : ""
                                                } ${
                                                  isOverdue
                                                    ? "opacity-50"
                                                    : "show"
                                                }`}
                                                onClick={async () =>
                                                  await submit({
                                                    date,
                                                    timeAction,
                                                  })
                                                }
                                              >
                                                {isLoading || isPending ? (
                                                  <Loader2Icon className="animate-spin" />
                                                ) : (
                                                  "Turn in"
                                                )}
                                              </Button>
                                            ) : (
                                              <>
                                                <Button
                                                  onClick={() =>
                                                    setCancelModal(true)
                                                  }
                                                  className={`w-full ${
                                                    outputs.files.length === 0
                                                      ? "hidden"
                                                      : ""
                                                  }`}
                                                >
                                                  Cancel
                                                </Button>
                                              </>
                                            )}
                                          </>
                                          <p className="mt-5 italic opacity-80 text-pretty">
                                            <div className="flex items-center gap-2 font-extrabold">
                                              <Info size={18} /> Note
                                            </div>
                                            Once you submit, you have{" "}
                                            <span className="font-bold">
                                              {outputs.chancesResubmition}
                                            </span>{" "}
                                            chances of{" "}
                                            <span className="font-bold">
                                              resubmitions
                                            </span>{" "}
                                            left to resubmit if you cancel your
                                            submission or need to make changes
                                            after turning it in
                                          </p>
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
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div className="mt-5 md:mt-0 lg:mt-0 px-4 ">
          <div className="px-4 h-full">
            <Feedback />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassroomSubmition;
