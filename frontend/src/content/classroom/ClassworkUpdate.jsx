import { Input } from "@/components/ui/input";
import ToolTipComponent from "@/utils/ToolTipComponent";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Loader2, Paperclip } from "lucide-react";
import React, { useState } from "react";
import ClassworkTypeField from "./ClassworkTypeField";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerDemo } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import moment from "moment/moment";
function ClassworkUpdate({ setOpenSettingModal }) {
  const { workId } = useParams();

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

  const roomId = localStorage.getItem("roomId");

  async function handleUpload() {
    try {
      const formData = new FormData();
      formData.append("classworkTitle", classworkTitle);
      formData.append("classworkType", classworkType);
      formData.append("classworkDescription", classworkDescription);
      formData.append("classworkDueDate", classworkDueDate);
      formData.append("classworkDueTime", classworkDueTime);
      formData.append("classworkAttachFile", classworkAttachFile);

      const response = await fetch(
        `https://edugemini.onrender.com/classwork/updateClasswork/${roomId}/${workId}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
    } catch (error) {
      toast.error(error.message);
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
    setOpenSettingModal(false);
    setClassworkAttachFile([]);

    setDate(null);
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
      <Label className="font-bold italic flex items-center gap-2 mb-2">
        <UpdateIcon />
        Update
      </Label>
      <p className="my-2">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem,
        perspiciatis.
      </p>
      <>
        <div className="">
          <Label className="font-bold italic flex items-center gap-2 mb-2">
            Attach new the Instruction/Criteria
          </Label>
          <ToolTipComponent
            content={<p>Attach a new file</p>}
            trigger={
              <>
                <label htmlFor="file-upload" className="custom-file-upload">
                  <Paperclip />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setClassworkAttachFile(e.target.files[0])}
                />
              </>
            }
          />
        </div>

        <div className="my-3">
          <Label className="font-bold italic flex items-center gap-2 mb-2">
            New Title
          </Label>
          <Input
            type="text"
            name="classworkTitle"
            value={classworkTitle}
            onChange={handleChange}
            placeholder="What's the title of this classwork?"
          />
          <p></p>
        </div>

        <ClassworkTypeField
          setClassworkDetails={setClassworkDetails}
          classworkDetails={classworkDetails}
        />

        <div className="my-3">
          <Label className="font-bold italic flex items-center gap-2 mb-2">
            New Instruction (Optional)
          </Label>
          <Textarea
            type="text"
            name="classworkDescription"
            value={classworkDescription}
            onChange={handleChange}
            placeholder="What's the description of this classwork?"
          />
          <p></p>
        </div>

        <div className="flex justify-between gap-2">
          <div className="my-3">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              New Due date
            </Label>
            <DatePickerDemo date={date} setDate={setDate} />
            <p></p>
          </div>

          <div className="my-3 w-full">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              New Due date
            </Label>
            <input
              type="time"
              className="flex flex-row-reverse justify-between"
              min=""
              max=""
              value={classworkDueTime}
              onChange={(e) => {
                setClassworkDetails({
                  ...classworkDetails,
                  classworkDueTime: e.target.value,
                });
              }}
            />
            <p></p>
          </div>
        </div>
        <Button
          className="w-full my-3"
          onClick={async () => {
            try {
              setClassworkDetails({
                ...classworkDetails,
                classworkDueDate: moment(date).format("MMMM Do YYYY"),
              });

              queryClient.invalidateQueries({ queryKey: ["classworks"] });

              await mutateAsync({
                roomId,
                classworkTitle,
                classworkType,
                classworkDescription,
                classworkDueDate: date,
                classworkDueTime,
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
            "Update Classwork"
          )}
        </Button>
      </>
    </>
  );
}

export default ClassworkUpdate;
