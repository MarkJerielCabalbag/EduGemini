import React, { useState } from "react";
import MenuBar from "@/content/MenuBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import JoinClass from "@/components/modals/JoinClass";
import {
  getAllClassroom,
  joinedClass,
  useGetAllClass,
  useGetAllClassroom,
} from "@/api/useApi";
import LoadingState from "@/utils/LoadingState";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import noData from "../assets/noData.png";
import { useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "@/baseUrl";
function Enrolled() {
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const [openJoinClassModal, setOpenJoinClassModal] = useState(false);
  const onError = () => console.log("error");
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: "allClassroom" });
  };

  const {
    data: classData,
    isFetching,
    isPending,
  } = useGetAllClassroom({
    queryFn: () => getAllClassroom(userId),
    onError,
    onSuccess,
  });

  return (
    <div className="h-screen">
      {openJoinClassModal && (
        <JoinClass
          open={openJoinClassModal}
          onOpenChange={setOpenJoinClassModal}
        />
      )}

      {isFetching ? (
        <LoadingState
          className={"h-screen flex flex-col items-center justify-center"}
        />
      ) : (
        <div className="container sm:container md:container lg:container">
          <MenuBar />

          {classData?.length === 0 ? (
            <div className="h-screen flex flex-col justify-center items-center">
              <img src={noData} style={{ width: "300px" }} />

              <p className="my-2">You currently have no joined class</p>
              <Button
                onClick={() => setOpenJoinClassModal(true)}
                className="flex gap-2 items-center my-6"
              >
                <Plus />
                Join Class
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={() => setOpenJoinClassModal(true)}
                  className="flex gap-2 items-center my-6 w-full md:w-auto"
                >
                  <Plus />
                  Join Class
                </Button>
                <div className="grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                  {classData?.map((classroom) => (
                    <div key={classroom._id}>
                      {classroom.students.map((student) =>
                        student._id === userId ? (
                          <React.Fragment key={student._id}>
                            {student.approvalStatus === "pending" ||
                            student.approvalStatus === "declined" ? (
                              <>
                                <Card
                                  key={classroom._id}
                                  className="shadow-lg rounded"
                                >
                                  <CardHeader className="relative">
                                    <Avatar className="h-20 w-20 rounded-full border-2 border-slate-900">
                                      <AvatarImage
                                        src={`${baseUrl}/${classroom.owner_email}/${classroom.user_img}`}
                                      ></AvatarImage>
                                    </Avatar>
                                    <CardTitle>
                                      {classroom.owner_name}
                                    </CardTitle>
                                    <CardDescription>
                                      <>
                                        {isPending && { variables }}
                                        <Badge className="my-2">
                                          Instructor
                                        </Badge>
                                        <p>{classroom.subject}</p>
                                        {student.approvalStatus === "pending" ||
                                        student.approvalStatus ===
                                          "declined" ? (
                                          <span
                                            className={`inline-flex items-center absolute top-2 right-2  rounded-md ${
                                              student.approvalStatus ===
                                              "pending"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            } px-2 py-1 text-xs font-medium text-slate-950 ring-1 ring-inset ring-gray-500/10`}
                                          >
                                            {student.approvalStatus}
                                          </span>
                                        ) : null}
                                      </>
                                    </CardDescription>
                                  </CardHeader>
                                </Card>
                              </>
                            ) : (
                              <Link
                                to={`/class/classroom/getCreatedClass/${classroom._id}`}
                              >
                                <Card
                                  key={classroom._id}
                                  className="shadow-lg rounded"
                                >
                                  <CardHeader className="relative">
                                    <Avatar className="h-20 w-20 rounded-full border-2 border-slate-900">
                                      <AvatarImage
                                        src={`${baseUrl}/${classroom.owner_email}/${classroom.user_img}`}
                                      ></AvatarImage>
                                    </Avatar>
                                    <CardTitle>
                                      {classroom.owner_name}
                                    </CardTitle>
                                    <CardDescription>
                                      <>
                                        <Badge className="my-2">
                                          Instructor
                                        </Badge>

                                        <p>{classroom.subject}</p>

                                        <span
                                          className={`inline-flex items-center absolute top-2 right-2  rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-slate-950 ring-1 ring-inset ring-gray-500/10`}
                                        >
                                          {student.approvalStatus}
                                        </span>
                                      </>
                                    </CardDescription>
                                  </CardHeader>
                                </Card>
                              </Link>
                            )}
                          </React.Fragment>
                        ) : null
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Enrolled;
