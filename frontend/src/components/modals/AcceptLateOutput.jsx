import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import { acceptLate, useAcceptLate } from "@/api/useApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
const AcceptLateOutput = ({
  open,
  onOpenChange,
  studentName,
  userId,
  roomId,
  workId,
}) => {
  const queryClient = useQueryClient();
  const onError = (error) => {
    toast.error(error.message);
  };
  const onSuccess = (data) => {
    toast.success(data.messeage);
    queryClient.invalidateQueries({ queryKey: ["listedStudents"] });
    queryClient.invalidateQueries({ queryKey: ["room"] });
    onOpenChange(false);
  };
  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);
  const { mutateAsync, isPending } = useAcceptLate({
    mutationFn: () => acceptLate(roomId, workId, userId, date, timeAction),
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Accept Late Output"}
      alertDialogDescription={
        <>
          <p>
            Are you sure to accept the late output of student:{" "}
            <span className="font-bold italic">{studentName}</span>
          </p>
        </>
      }
      alertDialogFooter={
        <>
          <Button disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={async () => {
              try {
                await mutateAsync({ date, timeAction });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Accept"}
          </Button>
        </>
      }
    />
  );
};

export default AcceptLateOutput;
