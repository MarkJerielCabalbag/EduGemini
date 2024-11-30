import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateScore, useUpdateStudentScore } from "@/api/useApi";
import toast from "react-hot-toast";
import { Edit2Icon, Info, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function UpdateScoreModal({ open, onOpenChange, roomId, studentId, workId }) {
  const [score, setScore] = useState(null);
  const queryClient = useQueryClient();
  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["listedStudents"] });
  };
  const onError = (error) => {
    toast.error(error.message);
  };
  const { mutateAsync, isPending, isError, error } = useUpdateStudentScore({
    mutationFn: () => updateScore(roomId, workId, studentId, score),
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Update Score"}
      alertDialogDescription={
        <>
          <p>Please provide the updated score below.</p>
          <Input
            className={`my-3 ${isError ? "border-red-500" : ""}`}
            type="number"
            onChange={(e) => setScore(e.target.value)}
            name="score"
            value={score}
            placeholder="Please input a number for score"
          />
          <p
            className={`${
              isError ? "show" : " "
            }hidden text-red-500 text-xs italic mt-2`}
          >
            {isError ? (
              <div className="flex items-center gap-1">
                <Info size={13} />
                {error.message}
              </div>
            ) : (
              ""
            )}
          </p>
        </>
      }
      alertDialogFooter={
        <>
          <Button disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const formData = {
                roomId,
                workId,
                studentId,
                score,
              };
              await mutateAsync(formData);
            }}
          >
            {isPending ? <Loader2 className="animate-spin" /> : `Update Score`}
          </Button>
        </>
      }
    />
  );
}

export default UpdateScoreModal;
