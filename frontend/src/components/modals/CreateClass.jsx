import React from "react";
import ReusableModal from "./ReusableModal";
import { useCreateClassroom } from "@/api/useApi";
import { useState } from "react";
import { Info, Loader2Icon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
function CreateClass({ open, onOpenChange }) {
  const [classroom, setClassroom] = useState({
    classname: "",
    section: "",
    subject: "",
    room: "",
  });

  const queryClient = useQueryClient();

  const { classname, section, subject, room } = classroom;

  const handleChange = (e) =>
    setClassroom({ ...classroom, [e.target.name]: e.target.value });

  const onSuccess = (data) => {
    toast.success(data.message);
    console.log(data.mesage);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["classroom"] });
  };
  const onError = (error) => {
    console.log(error);
  };

  const userId = localStorage.getItem("userId");

  const { mutateAsync, isError, isLoading, isPending } = useCreateClassroom({
    onSuccess,
    onError,
  });
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Create Class"}
      alertDialogDescription={
        <div className="h-[300px] overflow-y-scroll">
          <div className="border-l-4 border-slate-500  p-5 shadow-md rounded mt-5">
            <p className="pb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
              placeat soluta debitis aut totam tenetur assumenda optio est.
              Odio, tempora?
            </p>

            <Label className="font-bold italic flex items-center gap-2 my-2">
              Classname
            </Label>
            <Input
              value={classname}
              name="classname"
              onChange={handleChange}
              placeholder="Enter Classname"
              className={`${isError ? "border-red-500" : ""}`}
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

            <Label className="font-bold italic flex items-center gap-2 my-2">
              Section
            </Label>
            <Input
              value={section}
              name="section"
              onChange={handleChange}
              placeholder="Enter Section"
              className={`${isError ? "border-red-500" : ""}`}
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

            <Label className="font-bold italic flex items-center gap-2 my-2">
              Subject
            </Label>
            <Input
              value={subject}
              name="subject"
              onChange={handleChange}
              placeholder="Enter Subject"
              className={`${isError ? "border-red-500" : ""}`}
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

            <Label className="font-bold italic flex items-center gap-2 my-2">
              Room
            </Label>
            <Input
              value={room}
              name="room"
              onChange={handleChange}
              placeholder="Enter Room"
              className={`${isError ? "border-red-500" : ""}`}
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
        </div>
      }
      alertDialogFooter={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                const formData = {
                  userId,
                  classname,
                  section,
                  subject,
                  room,
                };

                await mutateAsync(formData);
              } catch (err) {
                console.log("Error", err);
                toast.error(err.message);
              }
            }}
          >
            {isLoading || isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Create Class"
            )}
          </Button>
        </>
      }
    />
  );
}

export default CreateClass;
