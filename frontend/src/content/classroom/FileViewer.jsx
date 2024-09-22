import {
  fetchClassData,
  getAnnouncement,
  useGetannouncement,
  useGetClass,
} from "@/api/useApi";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Bell, DownloadCloudIcon, File, Files } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { baseUrl } from "@/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function FileViewer({ userStatus }) {
  const { roomId, announceId } = useParams();
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
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

  const { data: room } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  return (
    <div className="sm:container md:container lg:container">
      {data?.map((item) => (
        <>
          {item._id === announceId ? (
            <>
              <div className="my-5">
                <ArrowLeft
                  onClick={() =>
                    userStatus === "instructor"
                      ? navigate(
                          `/class/classroom/getCreatedClass/${userId}/${roomId}`
                        )
                      : navigate(`/class/classroom/getCreatedClass/${roomId}`)
                  }
                />
                <div className="bg-slate-900 p-5 rounded-md mt-5 relative">
                  <Badge className="bg-slate-400 flex gap-2 items-center w-max py-2 px-5">
                    <Bell className=" text-white font-extrabold" />
                    Announcement:{" "}
                    {isLoading || isPending || isFetching ? (
                      <Skeleton className={"h-[20px] w-[100px] bg-slate-700"} />
                    ) : (
                      item.title
                    )}
                  </Badge>
                  <div className="flex gap-2 items-center mt-5 ">
                    <div>
                      {room?.map((roomInfo) =>
                        isLoading || isPending || isFetching ? (
                          <img
                            key={roomInfo._id}
                            className="h-20 w-20 rounded-full bg-slate-500 border-2 border-slate-100"
                          />
                        ) : (
                          <img
                            key={roomInfo._id}
                            className="h-20 w-20 rounded-full border-2 border-slate-100"
                            src={`${baseUrl}/${roomInfo.profile_path}/${roomInfo.user_img}`}
                          />
                        )
                      )}
                    </div>
                    <div>
                      <h1 className="text-lg font-extrabold text-slate-200">
                        {isLoading || isFetching || isPending ? (
                          <Skeleton
                            className={"w-[200px] h-[20px] bg-slate-400 "}
                          />
                        ) : (
                          item.username
                        )}
                      </h1>
                      <p className="italic opacity-80 text-slate-300">
                        {isLoading || isPending || isFetching ? (
                          <Skeleton className={"h-[20px] w-[150px] my-2"} />
                        ) : (
                          item.email
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-5 ">
                    <p className="italic opacity-80 text-slate-300">
                      {item.description}
                    </p>
                  </div>

                  <Files
                    className="absolute top-2 right-5 text-white opacity-70 rotate-12"
                    size={170}
                  />
                </div>
              </div>
              <Table>
                <TableCaption>A list of files announcemnets</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] bg-slate-900 text-white">
                      Downloadable File(s)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.files.map((file) => (
                    <TableRow>
                      {isLoading || isPending || isFetching ? (
                        <TableCell className="font-medium flex gap-3 items-center">
                          <File />
                          <Skeleton
                            className={"h-[20px] w-[400px] bg-slate-700"}
                          />
                        </TableCell>
                      ) : (
                        <TableCell className="font-medium flex gap-3 items-center">
                          <File />
                          <Link
                            to={`/class/classroom/getCreatedClass/viewAnnouncement/${roomId}/${announceId}`}
                            className=""
                            target="_blank"
                          >
                            {file.filename}
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : null}
        </>
      ))}
    </div>
  );
}

export default FileViewer;
