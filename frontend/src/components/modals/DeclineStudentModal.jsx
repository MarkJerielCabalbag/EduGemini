import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchClassData,
  useGetClass,
  useRejectStudentJoin,
} from "@/api/useApi";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function DeclineStudentModal({ open, onOpenChange, studentDetail }) {
  const queryClient = useQueryClient();
  const onError = (err) => {
    toast.error(err.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["room"] });
    queryClient.invalidateQueries({ queryKey: ["allClassroom"] });
  };
  const { mutateAsync, isLoading, isPending } = useRejectStudentJoin({
    onError,
    onSuccess,
  });

  const { roomId } = useParams();

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Decline Student"}
      alertDialogDescription={
        <>
          Do you want to reject student
          <b>
            {" "}
            {studentDetail.studentLname}, {studentDetail.studentFname}{" "}
            {studentDetail.studentMname.charAt(0)}.{" "}
          </b>
          to join your class <b>{studentDetail.classname}?</b>
        </>
      }
      alertDialogFooter={
        <>
          <Button disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={async () =>
              await mutateAsync({
                userId: studentDetail.studentId,
                roomId: roomId,
              })
            }
          >
            {isLoading || isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Decline"
            )}
          </Button>
        </>
      }
    />
  );
}

export default DeclineStudentModal;
