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

function DeclineStudentModal({ open, onOpenChange, studentID }) {
  const queryClient = useQueryClient();
  const onError = (err) => {
    toast.error(err.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["room"] });
  };
  const { mutateAsync, isLoading, isPending } = useRejectStudentJoin({
    onError,
    onSuccess,
  });

  const { roomId } = useParams();
  const { data, isFetching } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });
  return (
    <>
      {data?.map((roomDetails) => (
        <>
          {roomDetails.students.map((student) =>
            student._id === studentID ? (
              <>
                <ReusableModal
                  open={open}
                  onOpenChange={onOpenChange}
                  alertDialogTitle={"Decline Student"}
                  alertDialogDescription={
                    <>
                      Do you want to reject student
                      <b>
                        {" "}
                        {student.user_lastname}, {student.user_firstname}{" "}
                        {student.user_middlename.charAt(0)}.{" "}
                      </b>
                      to join your class <b>{roomDetails.classname}?</b>
                    </>
                  }
                  alertDialogFooter={
                    <>
                      <Button onClick={() => onOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={async () =>
                          await mutateAsync({
                            userId: student._id,
                            roomId: roomDetails._id,
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
              </>
            ) : null
          )}
        </>
      ))}
    </>
  );
}

export default DeclineStudentModal;