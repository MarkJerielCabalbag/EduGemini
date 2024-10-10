import {
  createPublicAnnouncement,
  fetchClassData,
  getAnnouncement,
  useCreatePublicAnnouncement,
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
import {
  ArrowLeft,
  Bell,
  File,
  Files,
  Loader2Icon,
  SendIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { baseUrl } from "@/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import moment from "moment";

function Announcements({ userStatus }) {
  const [comment, setComment] = useState("");
  const { roomId, announceId } = useParams();

  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const date = moment().format("MMMM Do YYYY");
  let options = { hour: "2-digit", minute: "2-digit", hour12: true };
  let dateAction = new Date();
  let timeAction = dateAction.toLocaleString("en-US", options);

  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["announcement"] });
    setComment("");
  };

  const onError = (error) => {
    toast.error(error.message);
    setComment("");
  };

  const { data, isFetching, isLoading } = useGetannouncement({
    queryFn: () => getAnnouncement(roomId),
    onError,
    onSuccess,
  });

  console.log(data);

  const { data: room } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  const { mutateAsync, isPending, isError } = useCreatePublicAnnouncement({
    mutationFn: () =>
      createPublicAnnouncement(
        roomId,
        announceId,
        userId,
        comment,
        date,
        timeAction
      ),
    onError,
    onSuccess,
  });

  return (
    <div className="h-full container sm:container md:container lg:container">
      {data?.map((item) => (
        <>
          {item._id === announceId ? (
            <>
              {room?.map((roomInfo) => (
                <>
                  <div className="my-5 sticky top-0 z-50 bg-white">
                    <ArrowLeft
                      onClick={() =>
                        userStatus === "instructor"
                          ? navigate(
                              `/class/classroom/getCreatedClass/${userId}/${roomId}`
                            )
                          : navigate(
                              `/class/classroom/getCreatedClass/${roomId}`
                            )
                      }
                    />
                    <div className="bg-slate-900 p-5 rounded-md mt-5 relative">
                      <Badge className="bg-slate-400 flex gap-2 items-center w-max py-2 px-5">
                        <Bell className=" text-white font-extrabold" />
                        Announcement:{" "}
                        {isLoading || isPending || isFetching ? (
                          <Skeleton
                            className={"h-[20px] w-[100px] bg-slate-700"}
                          />
                        ) : (
                          item.title
                        )}
                      </Badge>
                      <div className="flex gap-2 items-center mt-5 ">
                        <div>
                          {isLoading || isPending || isFetching ? (
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
                        className="absolute top-2 right-5 text-white opacity-30 rotate-12"
                        size={170}
                      />
                    </div>
                  </div>
                  <Table>
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
                                target="_blank"
                                onClick={() => {
                                  localStorage.setItem(
                                    "files",
                                    JSON.stringify(item.files)
                                  );
                                  localStorage.setItem(
                                    "path",
                                    JSON.stringify(item.path)
                                  );
                                }}
                                to="/class/classroom/viewFile"
                              >
                                {file.originalname}
                              </Link>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator className="my-5" />

                  <h1 className="text-lg text-slate-900 font-bold md:text-2xl">
                    Public Comments
                  </h1>

                  <p className="italic opacity-75 text-balance text-sm md:text-md">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                    ab qui repudiandae quas incidunt facere atque! Perspiciatis
                    vero minima ipsam.
                  </p>

                  <div>
                    {item.publicComment.length === 0 ? (
                      <div className="my-5">No Comments Available</div>
                    ) : (
                      <>
                        <div className="h-3/4">
                          {item.publicComment.map((comment) => (
                            <div
                              className={`my-5 ${
                                userId === comment.user
                                  ? "flex flex-col items-end"
                                  : "flex flex-col items-start"
                              }`}
                            >
                              <div
                                className={`w-full text-wrap md:w-1/2 ${
                                  userId === comment.user
                                    ? "bg-slate-900 p-5 rounded-md text-white"
                                    : "bg-slate-300 p-5 rounded-md text-slate-900"
                                }`}
                              >
                                <div className="flex gap-3 items-center">
                                  <img
                                    className="h-10 w-10 rounded-full border border-slate-900"
                                    src={`${baseUrl}/${comment.profile}`}
                                  />
                                  <div>
                                    <h1 className="font-bold text-xs md:text-md">
                                      {comment.username}
                                    </h1>
                                    <p className="italic opacity-75 text-xs md:text-md">
                                      {comment.date}, {comment.time}
                                    </p>
                                  </div>
                                </div>

                                <p className="w-full text-xs italic md:text-sm">
                                  <span className="">{comment.comment}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="flex gap-3 items-center my-5 sticky z-50">
                      <Input
                        placeHolder="Send a comment"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={`${isError ? "border border-red-400" : ""}`}
                      />

                      <Button
                        disabled={isPending}
                        onClick={async () => {
                          try {
                            await mutateAsync({
                              comment,
                              userId,
                              date,
                              timeAction,
                            });
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        {isPending ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <SendIcon />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : null}
        </>
      ))}
    </div>
  );
}

export default Announcements;
