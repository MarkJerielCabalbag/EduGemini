import { baseUrl } from "@/baseUrl";
import AcceptLateOutput from "@/components/modals/AcceptLateOutput";
import AddChances from "@/components/modals/AddChances";
import PrivateCommentModal from "@/components/modals/PrivateCommentModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, File, Loader, Star } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const RowExpandView = ({ user }) => {
  const [openAddChanceModal, setAddChanceModal] = useState(false);
  const [openAcceptLateOutputModal, setAcceptLateoutputModal] = useState(false);
  const [openPrivateCommentModal, setOpenPrivateModal] = useState(false);

  const { workId } = useParams();
  const workStatus = (user) => {
    if (user.workStatus === "Turned in") {
      return "bg-green-500";
    } else if (user.workStatus === "shelved") {
      return "bg-sky-500";
    } else if (user.workStatus === "cancelled") {
      return "bg-red-500";
    }
  };
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
  return (
    <div className="p-5 w-full">
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
            <h1 className="font-bold text-lg italic text-slate-900">
              {user.studentName}
            </h1>
            <p className="italic">Student</p>
          </div>
        </div>
        <div>
          <div className="my-5 flex gap-5 items-center">
            <Badge
              className={` ${
                user.workStatus.name === "Missing" ? "bg-red-500" : ""
              } ${user.workStatus.name === "shelved" ? "bg-sky-500" : ""} ${
                user.workStatus.name === "cancelled" ? "bg-red-900" : ""
              } ${user.workStatus.name === "Turned in" ? "bg-green-500" : ""}`}
            >
              {user.workStatus.name}
            </Badge>
            <p className="flex gap-1 items-center italic text-slate-400">
              <Clock size={15} />
              {user.timeSubmition}
            </p>
            <p className="flex gap-1 items-center italic text-slate-400 ">
              <Star size={15} />
              Score:
              <span className="font-bold text-md text-slate-900">
                {user.score}
              </span>
            </p>

            <p className="italic text-slate-400">
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

          <div>
            {user.files.length === 0 ? (
              ""
            ) : (
              <>
                <Button onClick={() => setOpenPrivateModal(true)}>
                  See All Comments
                </Button>
              </>
            )}
          </div>

          <div>
            <h1 className="text-slate-900 text-lg italic font-bold">
              Student Feedback
            </h1>
            <p className="italic text-slate-500">{user.studentFeedback}</p>
          </div>

          <div>
            <h1 className="text-slate-900 text-lg italic font-bold">
              Teacher Feedback
            </h1>
            <p className="italic text-slate-500">{user.teacherFeedback}</p>
          </div>

          <div className="my-5">
            <h1 className="text-slate-900 text-lg italic font-bold">Files</h1>
            <p className="italic text-slate-500">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia,
              ipsum!
            </p>

            {(isOverdue &&
              user.files.length !== 0 &&
              user.workStatus.name !== "Late" &&
              user.workStatus.name === "Cancelled") ||
            user.workStatus.name === "Shelved" ? (
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
            <div className="grid grid-cols-3 gap-3 sm:grid-flow-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {user.files?.map((file) => (
                <div className="bg-slate-900 text-slate-100 flex items-center gap-2 rounded-md p-3">
                  <File />
                  <div className="flex flex-col">
                    <p className="line-clamp-1">{file.filename}</p>
                    <p>{fileSizeLabel(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowExpandView;
