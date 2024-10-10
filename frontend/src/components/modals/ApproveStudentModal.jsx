import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import {
  fetchClassData,
  getAllClassroom,
  useAcceptStudentJoin,
  useGetClass,
} from "@/api/useApi";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function ApproveStudentModal({ open, onOpenChange, studentDetail }) {
  const queryClient = useQueryClient();
  const onError = (err) => {
    toast.error(err.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["room"] });
  };

  const { mutateAsync, isLoading, isPending } = useAcceptStudentJoin({
    onError,
    onSuccess,
  });

  const { roomId } = useParams();

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Approve Student"}
      alertDialogDescription={
        <>
          Do you want to approve student
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
              "Approve"
            )}
          </Button>
        </>
      }
    />
  );
}

export default ApproveStudentModal;
