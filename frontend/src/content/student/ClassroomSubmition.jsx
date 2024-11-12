import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileSizeValidator } from "use-file-picker/validators";
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
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleX,
  File,
  Info,
  Loader2Icon,
  NotebookPen,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useFilePicker } from "use-file-picker";

import { baseUrl } from "@/baseUrl";
import CancelSubmitionModal from "@/components/modals/CancelSubmitionModal";
import moment from "moment";
import Feedback from "./Feedback";
import PrivateComment from "./PrivateComment";
import { Separator } from "@/components/ui/separator";
import LoadingState from "@/utils/LoadingState";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

function ClassroomSubmition() {
  const [files, setFiles] = useState([]);
  const [showTurnInBtn, setShowTurnInBtn] = useState(false);
  const [openCancelModal, setCancelModal] = useState(false);
  const [time, setTime] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [disableTurnIn, setDisableTurnIn] = useState(false);
  const userId = localStorage.getItem("userId");
  const { workId, roomId } = useParams();
  const [filename, setFilename] = useState("");

  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [progressMessage, setProgressMessage] = useState("");
  const { data } = useQuery({
    queryKey: ["classwork"],
    queryFn: () => classwork(workId),
  });

  const navigate = useNavigate();

  const queryCleint = useQueryClient();
  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);

  const onError = (error) => {
    toast.error(error.message);
  };
  const onSuccess = (data) => {
    queryCleint.invalidateQueries({ queryKey: ["attachments"] });
    queryCleint.invalidateQueries({ queryKey: ["classwork"] });

    toast.success(data.message);
  };

  const { data: attachments, isFetching } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, userId),
    onError,
    onSuccess,
  });

  const { mutateAsync, isLoading } = useDeleteAttachment({
    mutationFn: () =>
      deleteAttachment(filename, date, timeAction, roomId, workId, userId),
    onError,
    onSuccess,
  });

  const { mutateAsync: submit, isPending } = useSubmitAttachment({
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
    accept: [
      ".docx",
      ".pdf",
      ".xlsx",
      ".pptx",
      ".html",
      ".css",
      ".js",
      ".php",
      ".dart",
      ".py",
      ".c",
      ".cpp",
      ".cs",
      ".swift",
      ".rs",
      ".go",
      ".ru",
      ".r",
      ".sql",
      ".java",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "video/mp4",
      "video/mpeg",
      "video/mov",
      "audio/wav",
      "audio/mp3",
    ],
    multiple: true,
    readAs: "BinaryString",
    validators: [
      new FileSizeValidator({ maxFileSize: 100 * 1024 * 1024 /* 100 MB */ }),
    ],
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
        setProgressMessage("Uploading...");
        setProgress((prevState) => {
          return { ...prevState, started: true };
        });
        await axios
          .post(
            `${baseUrl}/api/eduGemini/classwork/addFiles/${workId}`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                setProgress((prevState) => {
                  return { ...prevState, pc: progressEvent.progress * 100 };
                });
              },
            }
          )
          .then((res) => {
            setProgressMessage("Uploaded Successfully");
            queryCleint.invalidateQueries({
              queryKey: ["attachments"],
            });
            console.log(res.data);
            toast.success(res.data.message);
          })
          .catch(() => {
            setProgressMessage("Duplicated file'(s)");
          });
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const workBadge = attachments?.map((output) => {
    if (output.workStatus.name === "Turned in") {
      return "text-green-500";
    } else if (output.workStatus.name === "Shelved") {
      return "text-sky-500";
    } else if (output.workStatus.name === "Cancelled") {
      return "text-red-500";
    } else if (output.workStatus.name === "Late") {
      return "text-yellow-500";
    }
  });

  if (isLoading || isPending) {
    return (
      <LoadingState
        className={"h-screen w-full flex flex-col justify-center items-center"}
      />
    );
  }

  const workStatus = attachments
    ?.map((output) => output.workStatus.name)
    .toString();

  return (
    <>
      <div className=" text-slate-900 sm:container md:container lg:container">
        <div className="mx-5 h-full">
          <ArrowLeft
            className="my-5"
            onClick={() => {
              navigate(`/class/classroom/getCreatedClass/${roomId}/classwork`);
            }}
          />
          <div className="text-slate-900">
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
                        <div className="h-full">
                          {info._id === workId ? (
                            <div>
                              <h1 className="flex flex-col gap-2 md:flex-row justify-between">
                                <div className="flex gap-2 items-center">
                                  <NotebookPen size={20} />
                                  <h1 className="font-bold text-xs md:text-md">
                                    {info.classwork_title}
                                  </h1>
                                </div>
                                <div className="flex flex-col-reverse gap-2 md:flex-row">
                                  <h1 className={`${workBadge} text-xs`}>
                                    {workStatus}
                                  </h1>

                                  <h1 className="text-xs">
                                    {info.classwork_type}
                                  </h1>
                                </div>
                              </h1>

                              <Separator className="my-5" />

                              <div className="flex gap-2 items-center font-semibold italic text-sm">
                                <Calendar />
                                <span className="font-bold">
                                  Due Date:{" "}
                                </span>{" "}
                                {info.classwork_due_date},{" "}
                                {info.classwork_due_time}
                              </div>

                              <p className="font-light italic my-2 text-xs md:text-md">
                                Description:{" "}
                                <span>
                                  {info.classwork_description === null
                                    ? "No description stated"
                                    : info.classwork_description}
                                </span>
                              </p>

                              <div className="flex items-center justify-between p-5 rounded-md bg-slate-400  text-xs md:text-md">
                                <Link
                                  target="_blank"
                                  onClick={() => {
                                    localStorage.setItem(
                                      "files",
                                      JSON.stringify([
                                        info.classwork_attach_file,
                                      ])
                                    );
                                    localStorage.setItem(
                                      "path",
                                      JSON.stringify(info.classwork_folder_path)
                                    );
                                  }}
                                  to="/class/classroom/viewFile"
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

                              <div className="my-2 text-xs md:text-md">
                                <h1>Your Work</h1>
                                <div className="w-full">
                                  {progress.started && (
                                    <div className="flex gap-2 mt-2">
                                      <Progress value={progress.pc} />
                                      {parseInt(progress.pc)}%
                                    </div>
                                  )}
                                  {progressMessage && (
                                    <p className="flex gap-1 items-center my-2">
                                      {progressMessage ===
                                      "Uploaded Successfully" ? (
                                        <CheckCircle2 />
                                      ) : null}
                                      {progressMessage}
                                    </p>
                                  )}
                                </div>
                                <div className="h-full overflow-x-auto">
                                  {attachments?.length === 0 ? (
                                    <>
                                      <div className="flex justify-center items-center">
                                        No files uploaded yet.
                                      </div>

                                      <Button
                                        className={`w-full my-2 `}
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
                                                    to="/class/classroom/viewFile"
                                                    onClick={() => {
                                                      localStorage.setItem(
                                                        "files",
                                                        JSON.stringify(
                                                          outputs.files
                                                        )
                                                      );
                                                      localStorage.setItem(
                                                        "path",
                                                        JSON.stringify(
                                                          info.classwork_folder_path +
                                                            outputs.path
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <p className="line-clamp-1">
                                                      {file.originalname}
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
                                                  size={
                                                    outputs.workStatus.name ===
                                                    "Late"
                                                      ? 0
                                                      : 30
                                                  }
                                                  className={`max-h-96 hover:cursor-pointer ${
                                                    outputs.workStatus.name ===
                                                    "Turned in"
                                                      ? "hidden"
                                                      : ""
                                                  }`}
                                                  onClick={async () => {
                                                    setFilename(
                                                      file.originalname
                                                    );
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
                                                outputs.workStatus.name ===
                                                "Late"
                                              }
                                              className={`w-full my-2 ${
                                                outputs.workStatus.name ===
                                                "Turned in"
                                                  ? "hidden"
                                                  : ""
                                              } `}
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
                                                    0 ||
                                                  isPending
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
                                                {isPending ? (
                                                  <Loader2Icon className="animate-spin" />
                                                ) : (
                                                  "Turn in"
                                                )}
                                              </Button>
                                            ) : (
                                              <>
                                                <Button
                                                  disabled={
                                                    outputs.workStatus.name ===
                                                    "Late"
                                                  }
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
                                          <p className="mt-5 italic opacity-80 text-pretty text-xs leading-6">
                                            <div className="flex items-center gap-2 font-extrabold text-xs">
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

                              {workStatus === "Shelved" ||
                              workStatus === "Turned in" ||
                              workStatus === "Late" ||
                              workStatus === "Cancelled" ? (
                                <PrivateComment />
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
          <div className="h-screen overflow-auto">
            <Feedback />
          </div>
        </div>
      </div>
    </>
  );
}

export default ClassroomSubmition;
