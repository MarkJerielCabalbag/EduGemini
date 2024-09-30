import React, { useState } from "react";
import { getAllClassAdmin, useGetAllClassAdmin } from "@/api/useApi";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/utils/LoadingState";
import ApprovedClassModal from "./modal/ApprovedClassModal";
import DeclinedClassModal from "./modal/DeclinedClassModal";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import CopyFunctionality from "@/utils/CopyFunctionality";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { baseUrl } from "@/baseUrl";

function AdminPendingClassApproval() {
  const queryClient = useQueryClient();
  const [openModalApproved, setOpenModalApproved] = useState(false);
  const [openModalDeclined, setOpenModalDeclined] = useState(false);
  const [classId, setClassId] = useState(null);
  const onError = () => console.log("error");
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["allClassAdmin"] });
  };
  const userId = localStorage.getItem("userId");
  const { data, isFetching, isLoading, isPending } = useGetAllClassAdmin({
    onError,
    onSuccess,
  });

  return (
    <>
      {isFetching || isLoading || isPending ? (
        <LoadingState
          className={"w-screen flex flex-col justify-center items-center"}
        />
      ) : (
        <Table className="container sm:container md:container lg:container w-screen">
          <TableCaption>A list of your classroom approvals</TableCaption>
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

export default AdminPendingClassApproval;
