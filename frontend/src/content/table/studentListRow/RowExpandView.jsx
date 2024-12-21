import {
  aiDetector,
  getUser,
  plagiarism,
  similarityIndex,
  useGetAiDetector,
  useGetAllUser,
  useGetPlagiarismChecker,
  useGetSimilarityIndex,
  useGetUser,
} from "@/api/useApi";
import { baseUrl } from "@/baseUrl";
import AcceptLateOutput from "@/components/modals/AcceptLateOutput";
import AddChances from "@/components/modals/AddChances";
import PrivateCommentModal from "@/components/modals/PrivateCommentModal";
import UpdateScoreModal from "@/components/modals/UpdateScoreModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/ui/gauge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookX,
  Bot,
  Clock,
  File,
  Loader,
  Loader2Icon,
  ScanSearch,
  Star,
  TriangleAlert,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const RowExpandView = ({ user, filterLateTurnedIn }) => {
  const [openAddChanceModal, setAddChanceModal] = useState(false);
  const [openAcceptLateOutputModal, setAcceptLateoutputModal] = useState(false);
  const [openPrivateCommentModal, setOpenPrivateModal] = useState(false);
  const [openUpdateScoreModal, setUpdateScoreModal] = useState(false);
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

  const {
    mutateAsync: checkPlagiarism,
    data: dataPlagiarism,
    isPending: isPendingPlagiarsm,
    isLoading: isLoadingPlagiarism,
  } = useGetPlagiarismChecker({
    mutationFn: () => plagiarism(userId, workId, roomId),
    onError,
    onSuccess,
  });

  const { data: allUser } = useGetAllUser({
    onError,
    onSuccess,
  });

  const {
    data: aiDetected,
    mutateAsync: checkAiGenerated,
    isPending: isPendingAiDetection,
    isLoading: isLoadingAiDetection,
  } = useGetAiDetector({
    mutationFn: () => aiDetector(userId, workId, roomId),
    onError,
    onSuccess,
  });

  console.log(dataPlagiarism);

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

      {openUpdateScoreModal && (
        <UpdateScoreModal
          open={openUpdateScoreModal}
          onOpenChange={setUpdateScoreModal}
          roomId={user.roomId}
          workId={workId}
          studentId={user._id}
        />
      )}
      <div>
        <div className="flex gap-3 items-center">
          <Avatar>
            {allUser?.map((users) =>
              user._id === users._id ? (
                <AvatarImage
                  className="h-10 w-10 rounded-full border-2 border-slate-900"
                  src={`${baseUrl}/${users.profile_path}/${users.profile.filename}`}
                />
              ) : (
                <AvatarImage className="h-10 w-10 rounded-full border-2 border-slate-900" />
              )
            )}
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
                    className="bg-yellow-500"
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

          <div className="flex flex-col gap-2 my-5 lg:flex-row">
            {user.workStatus.name === "Turned in" ||
            user.workStatus.name === "Late" ||
            user.workStatus.name === "Cancelled" ? (
              <Button
                variant={"secondary"}
                onClick={() => setOpenPrivateModal(true)}
              >
                See All Comments
              </Button>
            ) : null}

            {user.workStatus.name === "Turned in" ||
            user.workStatus.name === "Late" ? (
              <Button onClick={() => setUpdateScoreModal(true)}>
                Update Score
              </Button>
            ) : null}
          </div>

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

          {user.files.length === 0 ? null : (
            <>
              <h1 className="text-slate-900 text-sm italic font-bold md:text-lg">
                Files
              </h1>
              <p className="italic text-slate-500 my-2 text-xs md:text-lg">
                These are the files of student
              </p>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {user.files?.map((file) => (
                  <div className="bg-slate-900 text-slate-100 flex items-center gap-2 rounded-md p-3">
                    <File />
                    <Link
                      target="_blank"
                      to="/class/classroom/viewFile"
                      onClick={() => {
                        localStorage.setItem(
                          "files",
                          JSON.stringify(user.files)
                        );
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
            </>
          )}

          <div className="my-5">
            <h1 className="text-slate-900 my-5 text-sm italic font-bold md:text-lg">
              Similarity Index
            </h1>
            {filterLateTurnedIn.length === 1 ? (
              <p className="italic text-slate-500 my-2 text-xs md:text-lg">
                The number of turned in and late outputs is currently
                insufficient to calculate a meaningful similarity index.
              </p>
            ) : (
              <>
                {isFetching || isLoading ? (
                  <div className="grid grid-cols-3">
                    <div className="w-60 bg-slate-900 text-white p-5 rounded-md flex flex-col-reverse items-start gap-2">
                      <Skeleton
                        className={"bg-slate-500 rounded-sm p-2 w-36"}
                      />
                      <Skeleton
                        className={"bg-slate-500 p-2 h-16 w-16 rounded-full"}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {user.workStatus.name === "Turned in" ||
                    user.workStatus.name === "Late" ? (
                      <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-2 lg:grid-cols-4">
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
              </>
            )}
          </div>

          <h1 className="text-slate-900 mt-5 text-sm italic font-bold md:text-lg">
            Plagiarism Checker
          </h1>

          <p className="text-lg italic opacity-75 my-2">
            <span className="flex gap-2 items-center font-extrabold">
              <TriangleAlert />
              Attention!
            </span>
            Our plagiarism detection feature uses advanced technology to
            identify similarities in text. However, no system is entirely
            foolproof. Please do not rely solely on this tool to make decisions
            that affect an individual's academic or professional standing.
            Always verify results manually for accuracy.
          </p>

          {user.workStatus.name === "Turned in" ||
          user.workStatus.name === "Late" ? (
            <Button
              disabled={isPendingPlagiarsm}
              className="mb-5"
              onClick={async () => {
                await checkPlagiarism(workId, roomId);
              }}
            >
              {isLoadingPlagiarism || isPendingPlagiarsm ? (
                <div className="flex gap-2 items-center">
                  <Loader2Icon className="animate-spin" />
                  <p>Checking....</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <ScanSearch />
                  CheckPlagiarism
                </div>
              )}
            </Button>
          ) : null}

          <>
            {isLoadingPlagiarism || isPendingPlagiarsm ? (
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
                  <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-2 lg:grid-cols-4">
                    {dataPlagiarism?.map((plagiarism) => (
                      <div className=" bg-slate-900 text-white p-5 rounded-md flex flex-col-reverse items-start gap-2">
                        <h1>{plagiarism.source}</h1>
                        <p>{plagiarism.matchingContent}</p>
                        <Gauge
                          value={plagiarism.similarityPercentage}
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
          </>

          <h1 className="text-slate-900 mt-5 text-sm italic font-bold md:text-lg">
            AI Detector
          </h1>

          <p className="text-lg italic opacity-75 my-2">
            <span className="flex gap-2 items-center font-extrabold">
              <TriangleAlert />
              Attention!
            </span>
            While our AI Detector is advanced, no detector is completely
            reliable, regardless of its accuracy score. Never rely solely on AI
            detection to make decisions that affect an individual's work or
            academic standing.
          </p>

          {user.workStatus.name === "Turned in" ||
          user.workStatus.name === "Late" ? (
            <Button
              disabled={isPendingAiDetection}
              className="mb-5"
              onClick={async () => {
                await checkAiGenerated(workId, roomId);
              }}
            >
              {isLoadingAiDetection || isPendingAiDetection ? (
                <div className="flex gap-2 items-center">
                  <Loader2Icon className="animate-spin" />
                  <p>Detecting....</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Bot />
                  AI Detector
                </div>
              )}
            </Button>
          ) : null}

          <>
            {isPendingAiDetection || isLoadingAiDetection ? (
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
                  <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-2 lg:grid-cols-4">
                    <div className=" bg-slate-900 text-white p-5 rounded-md flex flex-col items-start gap-2">
                      <Gauge
                        value={aiDetected?.similarityScore}
                        size="medium"
                        showValue={true}
                      />
                      <h1 className="italic font-md font-bold">
                        Detected Pattern
                      </h1>
                      <p>"{aiDetected?.detectedPattern}"</p>
                      <h1 className="italic font-md font-bold">Evidence</h1>
                      <p>"{aiDetected?.evidence}"</p>
                    </div>
                  </div>
                ) : (
                  <p className="italic text-slate-500 my-2 text-xs md:text-lg">
                    {error?.message}
                  </p>
                )}
              </>
            )}
          </>

          <div>
            <h1 className="text-slate-900 mt-5 text-sm italic font-bold md:text-lg">
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
        </div>
      </div>
    </div>
  );
};

export default RowExpandView;
