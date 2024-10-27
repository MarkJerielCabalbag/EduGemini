import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Info, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateClassworkType } from "@/api/useApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function AddClassworkType({ open, onOpenChange }) {
  const [classwork, setClasswork] = useState("");

  const roomId = localStorage.getItem("roomId");
  const queryClient = useQueryClient();

  const onSuccess = (data) => {
    toast.success(data.message);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["classworkType"] });
    queryClient.invalidateQueries({ queryKey: ["classworkField"] });
    setClasswork("");
  };

  const onError = (error) => {
    setClasswork("");
    toast.error(error.message);
  };

  const {
    mutateAsync: createClassworkType,
    isPending,
    isLoading,
    isError,
  } = useCreateClassworkType({ onError, onSuccess });
  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogDescription={
          <>
            <p>
              By adding classwork type, it ensures that the classworks are
              organized and has labels to identify it with ease. Please provide
              a well structured classwork type. (exp: 'Assignment', 'Project',
              'Presentation')
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mt-5">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  New Classwork type
                </Label>
                <Input
                  type="text"
                  name="classwork"
                  className={`${isError ? "border-red-500" : ""}`}
                  value={
                    classwork.charAt(0).toUpperCase() +
                    classwork.slice(1).toLowerCase()
                  }
                  onChange={(e) => setClasswork(e.target.value)}
                  placeholder="What classwork type this might be?"
                />

                <p
                  className={`${
                    isError ? "show" : " "
                  }hidden text-red-500 text-xs italic mt-2`}
                >
                  {isError ? (
                    <div className="flex items-center gap-1">
                      <Info size={13} />
                      Fill out all fields
                    </div>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </form>
          </>
        }
        alertDialogTitle={"Add new classwork type"}
        alertDialogFooter={
          <>
            <Button disabled={isPending} onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              disabled={isPending}
              onClick={async () => {
                try {
                  const formData = { classwork, roomId };
                  await createClassworkType(formData);
                  onOpenChange(false);
                } catch (error) {
                  toast.error(error.message);
                }
              }}
            >
              {isLoading || isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </>
        }
      />
    </>
  );
}

export default AddClassworkType;
