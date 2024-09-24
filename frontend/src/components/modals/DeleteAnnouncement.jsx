import { useQueryClient } from "@tanstack/react-query";
import ReusableModal from "./ReusableModal";
import { deleteAnnouncement, useDeleteAnnouncement } from "@/api/useApi";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";

function DeleteAnnouncement({ open, onOpenChange, announceId }) {
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["announcement"] });
  };

  const onError = (error) => {
    toast.error(error.message);
  };
  const { mutateAsync, isPending, isLoading } = useDeleteAnnouncement({
    mutationFn: () => deleteAnnouncement(announceId, roomId),
    onError,
    onSuccess,
  });
  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogTitle={"Delete Announcement"}
        alertDialogDescription={
          <>
            <p>Are you sure you want to delete this announcement?</p>
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
                  await mutateAsync(announceId);
                  isLoading || isPending
                    ? onOpenChange(true)
                    : onOpenChange(!open);
                } catch (error) {
                  console.error("Error deleting announcement:", error);
                }
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

export default DeleteAnnouncement;
