import {
  createPublicAnnouncement,
  fetchClassData,
  getAnnouncement,
  useCreatePublicAnnouncement,
  useGetannouncement,
  useGetClass,
  useGetUser,
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
  Info,
  Loader2Icon,
  SendIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { baseUrl } from "@/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Announcements({ userStatus }) {
  const [comment, setComment] = useState("");
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

  const { data, isFetching, isLoading } = useGetannouncement({
    queryFn: () => getAnnouncement(roomId),
    onError,
    onSuccess,
  });

  const { data: room } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  const { mutateAsync, isPending, isError } = useCreatePublicAnnouncement({
    mutationFn: () =>
      createPublicAnnouncement(roomId, announceId, userId, comment),
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

              <Separator className="my-5" />
              <h1 className="text-2xl text-slate-900 font-bold">
                Public Comments
              </h1>

              <p className="italic opacity-75 text-balance">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A ab
                qui repudiandae quas incidunt facere atque! Perspiciatis vero
                minima ipsam.
              </p>

              <div>
                {item.publicComment.length === 0 ? (
                  <div className="my-5">No Comments Available</div>
                ) : (
                  <div>
                    {item.publicComment.map((comment) => {
                      const classroom = room?.map(
                        (roomInfo) => roomInfo.acceptedStudents
                      );

                      const student = room?.map((roomInfo) =>
                        roomInfo.acceptedStudents.filter(
                          (stud) => stud._id === comment.user
                        )
                      );

                      console.info(student);

                      return (
                        <>
                          {student._id === comment.user ? (
                            <div
                              key={comment._id}
                              className="my-5 flex gap-3 items-start"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={`${baseUrl}/${student.user_profile_path}/${student.user_img}`}
                                  alt={`${student.user_username}'s avatar`}
                                />
                                <AvatarFallback>
                                  {student.user_username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h1 className="text-lg font-bold text-slate-700">
                                  {student.user_username}
                                </h1>
                                <p className="italic text-slate-500">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-3 items-center mt-5">
                  <div>
                    <Input
                      placeHolder="Send a comment"
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`${isError ? "border-red-500" : ""} w-full`}
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
                  <Button
                    disabled={isPending}
                    onClick={async () => {
                      try {
                        await mutateAsync({ comment, userId });
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
          ) : null}
        </>
      ))}
    </div>
  );
}

export default Announcements;
