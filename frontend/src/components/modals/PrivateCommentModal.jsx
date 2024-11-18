import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2Icon, SendIcon } from "lucide-react";
import moment from "moment";
import {
  createPrivateComment,
  getAttachments,
  useCreatePrivateComment,
  useGetAllUser,
  useGetAttachments,
} from "@/api/useApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "@/baseUrl";
import { useQueryClient } from "@tanstack/react-query";

const PrivateCommentModal = ({
  open,
  onOpenChange,
  userId,
  roomId,
  workId,
  teacherId,
  studentId,
}) => {
  const [comment, setComment] = useState("");
  const handleInputChange = (e) => setComment(e.target.value);
  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);

  const user = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const onError = (error) => {
    toast.error(error.message);
    setComment("");
  };

  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["attachments"] });
    setComment("");
  };

  const { mutateAsync, isPending } = useCreatePrivateComment({
    mutationFn: () =>
      createPrivateComment(
        roomId,
        workId,
        userId,
        comment,
        date,
        timeAction,
        teacherId,
        studentId
      ),
    onError,
    onSuccess,
  });

  const { data: attachments } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, studentId),
    onError,
    onSuccess,
  });

  const { data: allUser } = useGetAllUser({
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Private Comment"}
      alertDialogDescription={
        <div className="border-l-4 border-slate-500 p-5 h-[200px] overflow-y-scroll shadow-md rounded mt-5">
          {attachments?.map((output) => (
            <div>
              {output.privateComment.map((comment) => (
                <div
                  className={`my-5 ${
                    user === comment.user
                      ? "flex flex-col items-end"
                      : "flex flex-col items-start"
                  }`}
                >
                  <div
                    className={`w-full overflow-auto ${
                      user === comment.user
                        ? "bg-slate-900 p-5 rounded-md text-white"
                        : "bg-slate-300 p-5 rounded-md text-slate-900"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      {allUser?.map((userInfo) =>
                        userInfo._id === comment.user ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`${baseUrl}/${userInfo.profile_path}/${userInfo.profile.filename}`}
                          />
                        ) : null
                      )}

                      <div>
                        <h1 className="font-bold">{comment.username}</h1>
                        <p className="italic opacity-75 text-sm">
                          {comment.date}, {comment.time}
                        </p>
                      </div>
                    </div>

                    <p className="w-full">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      }
      alertDialogFooter={
        <>
          <div className="w-full">
            <div className="w-full flex items-center gap-3">
              <Input
                onChange={handleInputChange}
                value={comment}
                name="comment"
              />
              <Button
                disabled={isPending}
                onClick={async () => {
                  await mutateAsync({
                    comment,
                    date,
                    timeAction,
                    teacherId,
                    studentId,
                  });
                  queryClient.invalidateQueries({ queryKey: ["announcement"] });
                }}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <SendIcon />
                )}
              </Button>
            </div>

            <Button className="my-2 w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </>
      }
    />
  );
};

export default PrivateCommentModal;
