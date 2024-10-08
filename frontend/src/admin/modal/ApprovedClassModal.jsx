import ReusableModal from "@/components/modals/ReusableModal";
import { Button } from "@/components/ui/button";
import React from "react";
import { useApproveClass } from "@/api/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

function ApprovedClassModal({ open, onOpenChange, classId }) {
  const queryClient = useQueryClient();
  const onError = (error) => toast.error(error.message);
  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["allClassAdmin"] });
  };

  const { mutateAsync, isLoading, isPending } = useApproveClass({
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Approve Class"}
      alertDialogDescription={"Are you sure to approve this class?"}
      alertDialogFooter={
        <>
          <Button disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={async () => {
              await mutateAsync({ classId });
            }}
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

export default ApprovedClassModal;
