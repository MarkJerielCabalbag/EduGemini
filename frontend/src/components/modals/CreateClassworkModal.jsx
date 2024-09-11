import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";
import ReusableModal from "./ReusableModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import moment from "moment/moment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Plus, Paperclip, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import ClassworkTypeField from "@/content/classroom/ClassworkTypeField";
function CreateClassworkModal({
  open,
  onOpenChange,
  alertDialogTitle,
  alertDialogDescription,
  alertDialogFooter,
  alertDialogTrigger,
}) {
  const queryClient = useQueryClient();

  const [classworkDetails, setClassworkDetails] = useState({
    classworkTitle: "",
    classworkType: "",
    classworkField: "",
    classworkDescription: "",
    classworkDueDate: null,
    classworkDueTime: "",
  });
  const [date, setDate] = useState(null);
  const [classworkAttachFile, setClassworkAttachFile] = useState([]);
  const [time, setTime] = useState("");
  const {
    classworkTitle,
    classworkType,
    classworkDueDate,
    classworkDescription,
    classworkDueTime,
  } = classworkDetails;

  const handleChange = (e) =>
    setClassworkDetails({
      ...classworkDetails,
      [e.target.name]: e.target.value,
    });

  console.log(baseUrl);

  const { roomId } = useParams();
  const userId = localStorage.getItem("userId");
  async function handleUpload() {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("classworkTitle", classworkTitle);
      formData.append("classworkType", classworkType);
      formData.append("classworkDescription", classworkDescription);
      formData.append("classworkDueDate", classworkDueDate);
      formData.append("classworkDueTime", time);
      formData.append("classworkAttachFile", classworkAttachFile);

      const response = await fetch(
        `${baseUrl}/api/eduGemini/classwork/createClasswork/${roomId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      toast.success(data.message);
      localStorage.setItem("workId", data.workId);
      queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
    } catch (error) {
      toast.error(error.message) || toast.error("Classwork Title Duplicated");
    }
  }

  const onSuccess = (data) => {
    setClassworkDetails({
      classworkTitle: "",
      classworkType: "",
      classworkField: "",
      classworkDescription: "",
      classworkDueDate: null,
      classworkDueTime: "",
    });
    setClassworkAttachFile([]);
    setDate(null);
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["classworks"] });
    queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
  };
  const onError = (error) => {
    setClassworkDetails({
      classworkTitle: "",
      classworkType: "",
      classworkField: "",
      classworkDescription: "",
      classworkDueDate: null,
      classworkDueTime: "",
    });
    setClassworkAttachFile([]);
    setDate(null);
  };

  const { mutateAsync, isError, isPending, isFetching, isLoading } =
    useMutation({
      mutationFn: handleUpload,
      onSuccess,
      onError,
    });

  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogTitle={"Create Classwork"}
        alertDialogDescription={
          <div className="h-[300px] overflow-y-scroll">
            <div className="border-l-4 border-slate-500  p-5 shadow-md rounded mt-5">
              <p className="pb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                placeat soluta debitis aut totam tenetur assumenda optio est.
                Odio, tempora?
              </p>

              <div className="">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Attach the Instruction/Criteria
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload"
                      >
                        <Paperclip />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={(e) =>
                          setClassworkAttachFile(e.target.files[0])
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="my-3">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Title
                </Label>
                <Input
                  type="text"
                  name="classworkTitle"
                  value={classworkTitle}
                  onChange={handleChange}
                  placeholder="What's the title of this classwork?"
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

              <ClassworkTypeField
                setClassworkDetails={setClassworkDetails}
                classworkDetails={classworkDetails}
              />

              <div className="my-3">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Instruction (Optional)
                </Label>
                <Textarea
                  type="text"
                  name="classworkDescription"
                  value={classworkDescription}
                  onChange={handleChange}
                  placeholder="What's the description of this classwork?"
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

              <div className="flex justify-between gap-2">
                <div className="my-3">
                  <Label className="font-bold italic flex items-center gap-2 mb-2">
                    Due date
                  </Label>

                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <p></p>
                </div>

                <div className="my-3 w-full">
                  <Label className="font-bold italic flex items-center gap-2 mb-2">
                    Due date
                  </Label>
                  <input
                    type="time"
                    className="flex flex-row-reverse justify-between"
                    min=""
                    max=""
                    value={classworkDueTime}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const dueDate = new Date();
                      dueDate.setHours(parseInt(hours));
                      dueDate.setMinutes(parseInt(minutes));

                      const formattedTime = dueDate.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      );

                      setTime(formattedTime);
                      setClassworkDetails({
                        ...classworkDetails,
                        classworkDueTime: e.target.value,
                      });
                    }}
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
            </div>
          </div>
        }
        alertDialogFooter={
          <>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
            <Button
              onClick={async () => {
                try {
                  setClassworkDetails({
                    ...classworkDetails,
                    classworkDueDate: moment(date).format("MMMM Do YYYY"),
                  });

                  console.log(classworkDueTime);
                  console.log(time);
                  await mutateAsync({
                    userId: userId,
                    classworkTitle,
                    classworkType,
                    classworkDescription,
                    classworkDueDate: date,
                    classworkDueTime: time,
                    classworkAttachFile,
                  });
                } catch (err) {
                  toast.error(err.message);
                }
              }}
            >
              {isLoading || isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </>
        }
      />
    </>
  );
}

export default CreateClassworkModal;
