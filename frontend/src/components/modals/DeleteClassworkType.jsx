import React from "react";
import ReusableModal from "./ReusableModal";
import { useDeleteClassworkType } from "@/api/useApi";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function DeleteClassworkType({ open, onOpenChange, classworkId }) {
  const roomId = localStorage.getItem("roomId");
  const queryClient = useQueryClient();

  const onError = (error) => {
    toast.error(error.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["classworkType"] });
    queryClient.invalidateQueries({ queryKey: ["classworkField"] });
  };
  const {
    mutateAsync: deleteClassworkType,
    isLoading,
    isPending,
  } = useDeleteClassworkType({
    onError,
    onSuccess,
  });
  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogTitle={"Delete Classwork"}
        alertDialogDescription={
          <>Are you sure to delete this classwork type?</>
        }
        alertDialogFooter={
          <>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
            <Button
              onClick={async () => {
                const formData = { roomId, classworkId };
                await deleteClassworkType(formData);
                onOpenChange(false);
              }}
            >
              {isLoading || isPending ? (
                <Loader2 className="animate-spin" />
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

export default DeleteClassworkType;
