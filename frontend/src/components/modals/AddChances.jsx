import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import { addChance, useAddChance } from "@/api/useApi";
import { useParams } from "react-router-dom";
import { Input } from "../ui/input";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const AddChances = ({
  open,
  onOpenChange,
  studentName,
  userId,
  roomId,
  workId,
}) => {
  const [chances, setChances] = useState(0);

  const queryClient = useQueryClient();
  const onError = (error) => {
    console.log(error);
    setChances(0);
    toast.error(error.message);
  };

  const onSuccess = (data) => {
    console.log(data);
    setChances(0);
    onOpenChange(false);
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["room"] });
    queryClient.invalidateQueries({ queryKey: ["listedStudents"] });
  };

  const { mutateAsync, isSuccess, isLoading, isPending } = useAddChance({
    mutationFn: () => addChance(roomId, userId, workId, chances),
    onError,
    onSuccess,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Add chance"}
      alertDialogDescription={
        <>
          <p>
            Do you want to add a chance for student:{" "}
            <span className="font-bold italic">{studentName}</span> ? If so
            please input how many
            <Input
              name="chances"
              value={chances}
              type="number"
              onChange={(e) => setChances(e.target.value)}
            />
          </p>
        </>
      }
      alertDialogFooter={
        <>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Button
            onClick={async () => {
              try {
                await mutateAsync({ chances });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {isPending || isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </>
      }
    />
  );
};

export default AddChances;
