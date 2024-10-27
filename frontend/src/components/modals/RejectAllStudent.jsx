import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import {
  rejectMultipleStudents,
  useRejectMultipleStudents,
} from "@/api/useApi";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
const RejectAllStudent = ({
  open,
  onOpenChange,
  checkedList,
  roomId,
  setCheckList,
}) => {
  const queryClient = useQueryClient();
  const onError = (error) => {
    toast.error(error.message);
    setCheckList([]);
  };

  const onSuccess = (data) => {
    toast.success(data.message);
    setCheckList([]);
    queryClient.invalidateQueries({ queryKey: ["room"] });
  };
  const { mutateAsync, isLoading, isPending } = useRejectMultipleStudents({
    mutationFn: () => rejectMultipleStudents(checkedList, roomId),
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={`Decline ${checkedList.length} Students`}
      alertDialogDescription={
        <>
          Are you sure to decline <b>{checkedList.length} students</b>?
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
                onOpenChange(false);
                const formData = {
                  checkedList,
                  roomId,
                };
                await mutateAsync(formData);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Decline"}
          </Button>
        </>
      }
    />
  );
};

export default RejectAllStudent;
