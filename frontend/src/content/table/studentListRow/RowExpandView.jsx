import { similarityIndex, useGetSimilarityIndex } from "@/api/useApi";
import { baseUrl } from "@/baseUrl";
import AcceptLateOutput from "@/components/modals/AcceptLateOutput";
import AddChances from "@/components/modals/AddChances";
import PrivateCommentModal from "@/components/modals/PrivateCommentModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/ui/gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, File, Loader, Star } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const RowExpandView = ({ user }) => {
  const [openAddChanceModal, setAddChanceModal] = useState(false);
  const [openAcceptLateOutputModal, setAcceptLateoutputModal] = useState(false);
  const [openPrivateCommentModal, setOpenPrivateModal] = useState(false);

  const { workId } = useParams();

  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");

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

  const now = moment();
  const isOverdue = now.isAfter(
    moment(`${user.isOverdue}`, "MMM Do YYYY h:mm A")
  );

  const roomId = user.roomId;
  const userId = user._id;

  const { data, isFetching, isLoading, error } = useGetSimilarityIndex({
    queryFn: () => similarityIndex(roomId, workId, userId),
    onError,
    onSuccess,
  });

  return (
    <div className="p-3">
      {openAddChanceModal && (
        <AddChances
          open={openAddChanceModal}
          onOpenChange={setAddChanceModal}
          studentName={user.studentName}
          userId={user._id}
          roomId={user.roomId}
          workId={workId}
        />
      )}
      {openAcceptLateOutputModal && (
        <AcceptLateOutput
          open={openAcceptLateOutputModal}
          onOpenChange={setAcceptLateoutputModal}
          studentName={user.studentName}
          userId={user._id}
          roomId={user.roomId}
          workId={workId}
        />
      )}

      {openPrivateCommentModal && (
        <PrivateCommentModal
          open={openPrivateCommentModal}
          onOpenChange={setOpenPrivateModal}
          roomId={user.roomId}
          workId={workId}
          userId={user.teacherId}
          teacherId={user.teacherId}
          studentId={user._id}
        />
      )}
      <div>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={`${baseUrl}/${user.user_img}`} />
            <AvatarFallback src={<Loader />} />
          </Avatar>
          <div>
            <h1 className="font-bold text-xs italic text-slate-900 md:text-md">
              {user.studentName}
            </h1>
            <p className="italic text-xs">Student</p>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2 lg:flex-row">
            <h1
              className={`bg-transparent font-bold italic ${
                user.workStatus.name === "Missing" ? "text-red-500" : ""
              } ${user.workStatus.name === "shelved" ? "text-sky-500" : ""} ${
                user.workStatus.name === "cancelled" ? "text-red-900" : ""
              } ${
                user.workStatus.name === "Turned in" ? "text-green-500" : ""
              }`}
            >
              {user.workStatus.name}
            </h1>
            <p className="text-xs flex gap-1 items-center italic text-slate-400 md:text-md">
              <Clock size={15} />
              {user.timeSubmition}
            </p>
            <p className="text-xs flex gap-1 items-center italic text-slate-400 md:text-md">
              <Star size={15} />
              Score:
              <span className="text-xs font-bold text-md text-slate-900 md:text-md">
                {user.score}
              </span>
            </p>

            <p className="text-xs italic text-slate-400">
              {user.chancesResubmition === 0
                ? "No resubmitions left: "
                : "Resubmitions left: "}
              <span>
                {user.chancesResubmition === 0 ? (
                  <Button
                    onClick={() => setAddChanceModal(true)}
                    variant="ghost"
                  >
                    Give a chance?
                  </Button>
                ) : (
                  <span className="font-bold text-md text-slate-900">
                    {user.chancesResubmition}
                  </span>
                )}
              </span>
            </p>
          </div>

          {user.workStatus.name === "Turned in" ||
          user.workStatus.name === "Late" ||
          user.workStatus.name === "Cancelled" ? (
            <Button
              variant={"secondary"}
              className="my-5"
              onClick={() => setOpenPrivateModal(true)}
            >
              See All Comments
            </Button>
          ) : null}

          <div>
            <h1 className="text-slate-900 text-sm italic font-bold md:text-lg">
              Student Feedback
            </h1>

            <pre className="italic my-2 text-slate-500 leading-6 text-xs text-balance md:text-lg">
              {user.studentFeedback}
            </pre>
          </div>

          <div>
            <h1 className="text-slate-900 text-sm italic font-bold md:text-lg">
              Teacher Feedback
            </h1>
            <pre className="italic my-2 text-slate-500 leading-6 text-xs text-balance md:text-lg">
              {user.teacherFeedback}
            </pre>
          </div>

          <div className="my-5">
            <h1 className="text-slate-900 text-sm italic font-bold md:text-lg">
              Files
            </h1>
            <p className="italic text-slate-500 my-2 text-xs md:text-lg">
              These are the files of student
            </p>

            {(isOverdue && user.workStatus.name === "Cancelled") ||
            (isOverdue && user.workStatus.name === "Shelved") ? (
              <Button
                variant="ghost"
                className="bg-yellow-500 my-5"
                onClick={() => setAcceptLateoutputModal(true)}
              >
                Accept late ouput?
              </Button>
            ) : (
              ""
            )}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {user.files?.map((file) => (
                <div className="bg-slate-900 text-slate-100 flex items-center gap-2 rounded-md p-3">
                  <File />
                  <Link
                    target="_blank"
                    to="/class/classroom/viewFile"
                    onClick={() => {
                      localStorage.setItem("files", JSON.stringify(user.files));
                      localStorage.setItem(
                        "path",
                        JSON.stringify(user.classwork_path + user.path)
                      );
                    }}
                  >
                    <div className="flex flex-col">
                      <p className="line-clamp-1">{file.originalname}</p>
                      <p>{fileSizeLabel(file.size)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <h1 className="text-slate-900 my-5 text-sm italic font-bold md:text-lg">
              Similarity Index
            </h1>
            {isFetching || isLoading ? (
              <div className="grid grid-cols-3">
                <div className="w-60 bg-slate-900 text-white p-5 rounded-md flex flex-col-reverse items-start gap-2">
                  <Skeleton className={"bg-slate-500 rounded-sm p-2 w-36"} />
                  <Skeleton
                    className={"bg-slate-500 p-2 h-16 w-16 rounded-full"}
                  />
                </div>
              </div>
            ) : (
              <>
                {user.workStatus.name === "Turned in" ||
                user.workStatus.name === "Late" ? (
                  <div className="grid grid-cols-3 gap-3">
                    {data?.map((similar) => (
                      <div className=" bg-slate-900 text-white p-5 rounded-md flex flex-col-reverse items-start gap-2">
                        <h1>{similar.name}</h1>

                        <Gauge
                          value={similar.similarityIndex}
                          size="medium"
                          showValue={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-slate-500 my-2 text-xs md:text-lg">
                    {error?.message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowExpandView;
