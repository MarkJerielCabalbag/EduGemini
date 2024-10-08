import ReusableModal from "@/components/modals/ReusableModal";
import { Button } from "@/components/ui/button";
import React from "react";
import { useDeclineClass } from "@/api/useApi";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
function DeclinedClassModal({ open, onOpenChange, classId }) {
  const queryClient = useQueryClient();
  const onError = (error) => {
    toast.error(error.message);
  };

  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["allClassAdmin"] });
  };
  const { mutateAsync, isLoading, isPending } = useDeclineClass({
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Decline Class"}
      alertDialogDescription={"Are you sure to decline this class?"}
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
              "Decline"
            )}
          </Button>
        </>
      }
    />
  );
}

export default DeclinedClassModal;
