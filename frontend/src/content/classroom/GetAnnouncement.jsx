import {
  deleteAnnouncement,
  getAnnouncement,
  useDeleteAnnouncement,
  useGetannouncement,
  useGetUser,
} from "@/api/useApi";
import noData from "../../assets/noData.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingState from "@/utils/LoadingState";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FileStack, Loader2Icon, Trash } from "lucide-react";
import { useState } from "react";
import DeleteAnnouncement from "@/components/modals/DeleteAnnouncement";
import { Button } from "@/components/ui/button";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Link, useParams } from "react-router-dom";
import FileViewer from "./FileViewer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
function GetAnnouncement({ statusBtn, cardStatus }) {
  const [openDeleteAnnouncementModal, setOpenDeleteAnnouncementModal] =
    useState(false);
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const [announceId, setAnnounceId] = useState(null);

  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["announcement"] });
  };

  const onError = (error) => {
    toast.error(error.message);
  };

  const { data, isFetching } = useGetannouncement({
    queryFn: () => getAnnouncement(roomId),
    onError,
    onSuccess,
  });

  const { mutateAsync, isPending, isLoading } = useDeleteAnnouncement({
    mutationFn: () => deleteAnnouncement(announceId, roomId),
    onError,
    onSuccess,
  });

  return (
    <>
      {isFetching || isLoading || isPending ? (
        <LoadingState
          className={
            "h-screen w-full flex flex-col items-center justify-center"
          }
        />
      ) : (
        <>
          {data?.length === 0 ? (
            <div className="flex flex-col items-center h-screen">
              <img src={noData} className="w-1/4" />
              <p>No announcement yet :(</p>
            </div>
          ) : (
            <>
              <div className={cardStatus}>
                {data?.map((item) => (
                  <>
                    <Card
                      key={item._id}
                      className="h-full w-full relative z-50"
                    >
                      <Trash
                        onClick={() => {
                          setOpenDeleteAnnouncementModal(true);
                          setAnnounceId(item._id);

                          console.log(item.profile_path);
                          console.log(item.user_img);
                        }}
                        className={`${
                          statusBtn === "hidden" ? "hidden" : ""
                        } absolute z-50 top-2 right-2 text-slate-900 cursor-pointer`}
                      />
                      <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                          <img
                            className="h-10 w-10 rounded-full border-2 border-slate-900"
                            src={`https://edugemini.onrender.com/${item?.profile_path}/${item?.user_img}`}
                          />
                          {item.username}
                        </CardTitle>
                        <CardDescription>{item.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h1 className="italic font-semibold">
                          Announcement: {item.title}
                        </h1>
                        <p>About: {item.description}</p>

                        {item.files.map((file) => (
                          <Link
                            className=" text-slate-900 font-bold italic opacity-90"
                            to={"/class/classroom/announcementFile"}
                            onClick={() => {
                              const files = item.files;
                              localStorage.setItem(
                                "files",
                                JSON.stringify(files)
                              );
                            }}
                          >
                            {file.filename}
                          </Link>
                        ))}
                      </CardContent>
                      <FileStack
                        size={150}
                        className="absolute top-0 right-0 rotate-6 opacity-25"
                      />
                    </Card>
                  </>
                ))}
              </div>
            </>
          )}
          {openDeleteAnnouncementModal && (
            <DeleteAnnouncement
              onOpenChange={setOpenDeleteAnnouncementModal}
              open={openDeleteAnnouncementModal}
              alertDialogTitle={"Delete Announcement"}
              alertDialogDescription={
                <>
                  <p>Are you sure you want to delete this announcement?</p>
                </>
              }
              alertDialogFooter={
                <>
                  <Button onClick={() => setOpenDeleteAnnouncementModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await mutateAsync(announceId);
                        isLoading || isPending
                          ? setOpenDeleteAnnouncementModal(true)
                          : setOpenDeleteAnnouncementModal(
                              !openDeleteAnnouncementModal
                            );
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
          )}
        </>
      )}
    </>
  );
}

export default GetAnnouncement;
