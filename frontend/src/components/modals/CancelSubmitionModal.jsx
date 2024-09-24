import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import { cancelSubmition, useCancelSubmition } from "@/api/useApi";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

function CancelSubmitionModal({ open, onOpenChange }) {
  const queryCleint = useQueryClient();
  const { workId, roomId, userId } = useParams();
  const onError = (err) => {
    toast.error(err.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    queryCleint.invalidateQueries({ queryKey: ["attachments"] });
  };

  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);

  const { mutateAsync, isLoading, isPending } = useCancelSubmition({
    mutationFn: () => cancelSubmition(date, timeAction, roomId, workId, userId),
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Cancel your submition"}
      alertDialogDescription={
        <>
          <p>Are you sure to cancel your submition? </p>
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
                onOpenChange(false);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {isLoading || isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Submit Changes"
            )}
          </Button>
        </>
      }
    />
  );
}

export default CancelSubmitionModal;
