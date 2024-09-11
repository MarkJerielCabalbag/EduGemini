import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { baseUrl } from "@/baseUrl";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
function AddAnnouncement({ open, onOpenChange }) {
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });
  const queryClient = useQueryClient();
  const roomId = localStorage.getItem("roomId");
  const userId = localStorage.getItem("userId");
  const [files, setFiles] = useState([]);

  const { title, description } = announcement;

  async function createAnnouncement(userId, title, description, files) {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("description", description);
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
      }

      const response = await fetch(
        `${baseUrl}/api/eduGemini/classroom/createAnnouncement/${roomId}`,
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
      queryClient.invalidateQueries({ queryKey: ["announcement"] });
      setAnnouncement({ title: "", description: "" });
      setFiles([]);
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleChange = (e) =>
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });

  const onError = (error) => console.log(error);
  const onSuccess = (data) => console.log(data);
  const { mutateAsync, isLoading, isPending } = useMutation({
    mutationFn: () => createAnnouncement(userId, title, description, files),
    onError,
    onSuccess,
  });
  return (
    <>
      <ReusableModal
        open={open}
        onOpenChange={onOpenChange}
        alertDialogTitle={<h1>Add Announcement</h1>}
        alertDialogDescription={
          <>
            <p className="my-3">
              Please fill out the details to add a new announcement.
            </p>

            <div className="border-l-4 border-slate-500 p-5 shadow-md rounded mt-5 h-[200px] overflow-y-scroll">
              <div className="my-2">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Title
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleChange}
                  placeholder="Add title announcement"
                />
              </div>
              <div className="my-2">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Description
                </Label>
                <Textarea
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Add description announcement"
                />
              </div>
              <Separator className="my-4" />
              <div>
                <p className="my-2">Attach files (optional):</p>
                <div className="">
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
                          multiple
                          onChange={(e) => setFiles(Array.from(e.target.files))}
                          style={{ display: "none" }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach files</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DocViewer
                    className=""
                    documents={files.map((file) => ({
                      uri: window.URL.createObjectURL(file),
                      fileName: file.name,
                    }))}
                    pluginRenderers={DocViewerRenderers}
                    config={{
                      header: {
                        disableHeader: false,
                        disableFileName: false,
                        retainURLParams: false,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        }
        alertDialogFooter={
          <>
            <Button
              onClick={() => {
                onOpenChange(false);
                setFiles([]);
              }}
            >
              Close
            </Button>
            <Button
              onClick={async () => {
                try {
                  await mutateAsync({ userId, title, description, files });
                } catch (error) {
                  console.log(error);
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

export default AddAnnouncement;
