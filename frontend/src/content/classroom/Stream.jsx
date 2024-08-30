import { Button } from "@/components/ui/button";
import { Paperclip, Plus } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import AddAnnouncement from "@/components/modals/AddAnnouncement";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import toast from "react-hot-toast";
import GetAnnouncement from "./GetAnnouncement";
import { useQueryClient } from "@tanstack/react-query";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
function Stream({ statusBtn }) {
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });
  const queryClient = useQueryClient();
  const roomId = localStorage.getItem("roomId");
  const [files, setFiles] = useState([]);
  const [openAddModalAnnouncement, setAddModalAnnouncement] = useState(false);
  const { title, description } = announcement;

  const handleChange = (e) =>
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });

  async function handleUpload() {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
      }

      const response = await fetch(
        `http://localhost:3000/api/eduGemini/classroom/createAnnouncement/${roomId}`,
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
      queryClient.invalidateQueries({ queryKey: ["announcement"] });
      setAnnouncement({ title: "", description: "" });
      setFiles([]);
      setAddModalAnnouncement(false);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <Button
        className={statusBtn}
        onClick={() => setAddModalAnnouncement(true)}
      >
        <Plus /> Add Announcement
      </Button>

      <GetAnnouncement
        statusBtn={statusBtn}
        cardStatus={`${
          statusBtn === "hidden"
            ? "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 h-3/4"
            : "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-3/4"
        }`}
      />

      <AddAnnouncement
        open={openAddModalAnnouncement}
        onOpenChange={setAddModalAnnouncement}
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
                setAddModalAnnouncement(false);

                setFiles([]);
              }}
            >
              Close
            </Button>
            <Button onClick={handleUpload}>Add</Button>
          </>
        }
      />
    </div>
  );
}

export default Stream;
