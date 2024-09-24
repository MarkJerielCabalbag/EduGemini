import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import ReusableModal from "./ReusableModal";
import { deleteSpecificClasswork, useDeleteClasswork } from "@/api/useApi";

function DeleteClassworkModal({ open, onOpenChange }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onError = () => console.log("error");
  const roomId = localStorage.getItem("roomId");
  const userId = localStorage.getItem("userId");
  const { workId } = useParams();
  const onSuccess = () => {
    toast.success("Successfully deleted");
    navigate(`/class/classroom/getCreatedClass/${userId}/${roomId}/classwork`);
    queryClient.invalidateQueries({ queryKey: ["room"] });
    onOpenChange(false);
  };
  const { mutateAsync, isLoading, isPending } = useDeleteClasswork({
    mutationFn: () => deleteSpecificClasswork(roomId, workId),
    onError,
    onSuccess,
  });
  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogDescription={<p>Are you sure to delete this classwork?</p>}
        alertDialogTitle={"Delete this classwork?"}
        alertDialogFooter={
          <>
            <Button disabled={isPending} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={async () => {
                await mutateAsync();
              }}
            >
              {isLoading || isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </>
        }
      />
    </>
  );
}

export default DeleteClassworkModal;
