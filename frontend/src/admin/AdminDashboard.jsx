import React, { useState } from "react";
import { useGetAllClassAdmin } from "@/api/useApi";

import { Button } from "@/components/ui/button";
import LoadingState from "@/utils/LoadingState";
import ApprovedClassModal from "./modal/ApprovedClassModal";
import DeclinedClassModal from "./modal/DeclinedClassModal";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { baseUrl } from "@/baseUrl";
import Header from "@/content/Header";
import Footer from "@/content/Footer";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2Icon,
  CircleUserRound,
  MinusCircleIcon,
  XCircleIcon,
} from "lucide-react";

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [openModalApproved, setOpenModalApproved] = useState(false);
  const [openModalDeclined, setOpenModalDeclined] = useState(false);
  const [classId, setClassId] = useState(null);
  const onError = () => console.log("error");
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["allClassAdmin"] });
  };

  const { data, isFetching, isLoading, isPending } = useGetAllClassAdmin({
    onError,
    onSuccess,
  });

  const classroom = data?.map((roomDetails) => roomDetails).flat();

  const totalStudentApproved = classroom?.filter(
    (classDetails) => classDetails.approvalStatus === "approved"
  ).length;

  const totalStudentPending = classroom?.filter(
    (classDetails) => classDetails.approvalStatus === "pending"
  ).length;

  const totalStudentDeclined = classroom?.filter(
    (classDetails) => classDetails.approvalStatus === "declined"
  ).length;

  return (
    <>
      {isFetching || isLoading || isPending ? (
        <LoadingState
          className={
            "w-screen h-screen flex flex-col justify-center items-center"
          }
        />
      ) : (
        <div className="h-screen">
          <Header />
          <div className="h-full container sm:container md:container lg:container">
            <div className="my-5">
              <h1 className="font-bold flex items-center gap-2">
                <CircleUserRound />
                Admin Dashboard
              </h1>
              <Separator className="my-2" />
              <p className="italic opacity-70 text-pretty">
                Welcome to the Admin Dashboard, your central hub for managing
                and overseeing all classroom activities. From here, you can
                monitor student progress, manage class materials, and ensure a
                smooth educational experience. The dashboard provides real-time
                updates and allows for quick decision-making.
              </p>
            </div>
            <div className="my-5">
              <h1 className="font-bold flex items-center gap-2">Overview</h1>
              <Separator className="my-2" />
              <p className="italic opacity-70 text-pretty">
                The Overview section offers a quick summary of the key metrics
                and insights for your classroom. Stay up-to-date with class
                participation, assignment submissions, and student performance,
                enabling you to maintain a well-organized and efficient learning
                environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 ">
                <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-sm w-10 h-10"></div>
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-extrabold">
                      {totalStudentApproved}
                    </h1>
                    <p className="italic opacity-70 flex items-center gap-2">
                      <CheckCircle2Icon className="opacity-70" size={20} />{" "}
                      Approved
                    </p>
                  </div>
                </div>

                <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 rounded-sm w-10 h-10"></div>
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-extrabold">
                      {totalStudentPending}
                    </h1>
                    <p className="italic opacity-70 flex items-center gap-2">
                      <MinusCircleIcon className="opacity-70" size={20} />
                      Pending
                    </p>
                  </div>
                </div>

                <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-sm w-10 h-10"></div>
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-extrabold">
                      {totalStudentDeclined}
                    </h1>
                    <p className="italic opacity-70 flex items-center gap-2">
                      <XCircleIcon className="opacity-70" size={20} /> Declined
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Table className="container sm:container md:container lg:container w-screen">
              <TableHeader>
                <TableRow>
                  <TableHead>Professor/Teacher</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Classroom</TableHead>
                  <TableHead>Classname</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              {data?.length === 0 ? (
                <>
                  <TableHeader className="w-full text-center">
                    <TableRow>
                      <TableHead>No data</TableHead>
                    </TableRow>
                  </TableHeader>
                </>
              ) : (
                <>
                  <TableBody>
                    {data?.map((classes) => (
                      <TableRow>
                        <TableCell className="flex gap-2 items-center">
                          <Avatar>
                            {classes.profile_path && (
                              <AvatarImage
                                className="h-10 w-10 rounded-full border-2 border-slate-900"
                                src={`${baseUrl}/${classes.profile_path}/${classes.user_img}`}
                              />
                            )}
                          </Avatar>

                          <div>{classes.owner_name}</div>
                        </TableCell>
                        <TableCell>{classes.owner_email}</TableCell>
                        <TableCell>
                          {classes.approvalStatus === "pending" ? (
                            <>
                              <Badge className={" bg-yellow-500"}>
                                {classes.approvalStatus}
                              </Badge>
                            </>
                          ) : (
                            <>
                              {classes.approvalStatus === "approved" ||
                              classes.approvalStatus === "declined" ? (
                                <Badge
                                  className={`${
                                    classes.approvalStatus === "approved"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  } `}
                                >
                                  {classes.approvalStatus}
                                </Badge>
                              ) : null}
                            </>
                          )}
                        </TableCell>
                        <TableCell>{classes.subject}</TableCell>
                        <TableCell>{classes.section}</TableCell>
                        <TableCell>{classes.students.length}</TableCell>
                        <TableCell>{classes.room}</TableCell>
                        <TableCell>{classes.classname}</TableCell>
                        <TableCell>
                          {classes.approvalStatus === "pending" ? (
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Action" />
                              </SelectTrigger>
                              <SelectContent>
                                <Button
                                  value="decline"
                                  className={`${
                                    classes.approvalStatus === "pending"
                                      ? "hide"
                                      : "show "
                                  } w-full bg-red-600 hover:bg-red-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenModalDeclined(true);
                                    setClassId(classes._id);
                                  }}
                                >
                                  Decline
                                </Button>
                                <Button
                                  value="approve"
                                  className={`${
                                    classes.approvalStatus === "pending"
                                      ? "hide"
                                      : " show"
                                  } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenModalApproved(true);
                                    setClassId(classes._id);
                                  }}
                                >
                                  Approve
                                </Button>
                              </SelectContent>
                            </Select>
                          ) : (
                            <>
                              {classes.approvalStatus === "approved" ? (
                                <Button
                                  value="decline"
                                  className={`${
                                    classes.approvalStatus === "pending"
                                      ? "hide"
                                      : "show "
                                  } w-full bg-red-600 hover:bg-red-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenModalDeclined(true);
                                    setClassId(classes._id);
                                  }}
                                >
                                  Decline
                                </Button>
                              ) : (
                                <Button
                                  value="approve"
                                  className={`${
                                    classes.approvalStatus === "pending"
                                      ? "hide"
                                      : " show"
                                  } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenModalApproved(true);
                                    setClassId(classes._id);
                                  }}
                                >
                                  Approve
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          </div>
        </div>
      )}

      {openModalApproved && (
        <ApprovedClassModal
          open={openModalApproved}
          onOpenChange={setOpenModalApproved}
          classId={classId}
        />
      )}
      {openModalDeclined && (
        <DeclinedClassModal
          open={openModalDeclined}
          onOpenChange={setOpenModalDeclined}
          classId={classId}
        />
      )}
    </>
  );
}

export default AdminDashboard;
