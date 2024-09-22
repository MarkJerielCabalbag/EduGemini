import { getAnnouncement, useGetannouncement } from "@/api/useApi";
import noData from "../../assets/noData.png";
import LoadingState from "@/utils/LoadingState";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Bell, ExternalLink, Trash } from "lucide-react";
import { useState } from "react";
import DeleteAnnouncement from "@/components/modals/DeleteAnnouncement";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
function GetAnnouncement({ statusBtn, cardStatus, userStatus }) {
  const [openDeleteAnnouncementModal, setOpenDeleteAnnouncementModal] =
    useState(false);
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const [announceId, setAnnounceId] = useState(null);
  const navigate = useNavigate();
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["announcement"] });
  };

  const onError = (error) => {
    toast.error(error.message);
  };

  const { data, isFetching, isLoading, isPending } = useGetannouncement({
    queryFn: () => getAnnouncement(roomId),
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
                    <div
                      key={item._id}
                      className="h-full w-full relative z-50 bg-slate-900 text-white p-5 rounded-md"
                    >
                      <div className="flex justify-between pb-1 relative">
                        <Bell
                          className="absolute right-6 -rotate-12 opacity-60"
                          size={66}
                        />
                        <p className="font-extrabold">Announcement</p>
                        <Trash
                          onClick={() => {
                            setOpenDeleteAnnouncementModal(true);
                            setAnnounceId(item._id);
                            console.log(item.profile_path);
                            console.log(item.user_img);
                          }}
                          className={`${
                            statusBtn === "hidden" ? "hidden" : ""
                          }`}
                        />
                      </div>

                      <Button
                        className="font-bold italic opacity-90 flex gap-2 underline underline-offset-8"
                        onClick={() =>
                          userStatus === "instructor"
                            ? navigate(
                                `/class/classroom/getCreatedClass/viewAnnouncement/${roomId}/${item._id}`
                              )
                            : navigate(
                                `/class/classroom/getCreatedClass/student/${roomId}/${item._id}`
                              )
                        }
                      >
                        <ExternalLink />

                        {item.title}
                      </Button>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
          {openDeleteAnnouncementModal && (
            <DeleteAnnouncement
              onOpenChange={setOpenDeleteAnnouncementModal}
              open={openDeleteAnnouncementModal}
              announceId={announceId}
            />
          )}
        </>
      )}
    </>
  );
}

export default GetAnnouncement;
