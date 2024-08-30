import { fetchClassData, useGetClass } from "@/api/useApi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { NotebookPen } from "lucide-react";

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

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ApproveStudentModal from "@/components/modals/ApproveStudentModal";
import DeclineStudentModal from "@/components/modals/DeclineStudentModal";

function Settings() {
  const { roomId } = useParams();
  const [openStudentDeclineModal, setOpenStudentDeclineModal] = useState(false);
  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");
  const { data, isLoading, isPending, isFetching } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });
  return (
    <div className="h-full w-full">
      <Table>
        <TableCaption>A list of student approval</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Lastname</TableCell>
            <TableCell>Firstname</TableCell>
            <TableCell>Middlename</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        {data?.map((roomDetails) => (
          <>
            {roomDetails.students.map((student) => (
              <>
                {student.approvalStatus === "approved" ? (
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex gap-2 items-center">
                        <Avatar>
                          {student.user_profile_path && (
                            <AvatarImage
                              className="h-10 w-10 rounded-full border-2 border-slate-900"
                              src={`https://edugemini.onrender.com/${student.user_profile_path}/${student.user_img}`}
                            />
                          )}
                        </Avatar>

                        <div>
                          {student.user_lastname}, {student.user_firstname}
                          {student.user_middlename.charAt(0)}.
                        </div>
                      </TableCell>
                      <TableCell>{student.user_email}</TableCell>
                      <TableCell>
                        {student.approvalStatus === "pending" ? (
                          <>
                            <Badge className={"bg-yellow-500"}>
                              {student.approvalStatus}
                            </Badge>
                          </>
                        ) : (
                          <>
                            {student.approvalStatus === "approved" ||
                            student.approvalStatus === "declined" ? (
                              <Badge
                                className={`${
                                  student.approvalStatus === "approved"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } `}
                              >
                                {student.approvalStatus}
                              </Badge>
                            ) : null}
                          </>
                        )}
                      </TableCell>
                      <TableCell>{student.user_lastname}</TableCell>
                      <TableCell>{student.user_firstname}</TableCell>
                      <TableCell>{student.user_middlename}</TableCell>
                      <TableCell>{student.user_gender}</TableCell>
                      <TableCell>
                        <Button
                          value="decline"
                          className={`${
                            student.approvalStatus === "pending"
                              ? "hide"
                              : "show "
                          } w-full bg-red-600 hover:bg-red-300 text-slate-900 `}
                          onClick={() => setOpenStudentDeclineModal(true)}
                        >
                          Decline
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : null}

                {openStudentDeclineModal && (
                  <DeclineStudentModal
                    open={openStudentDeclineModal}
                    onOpenChange={setOpenStudentDeclineModal}
                    student={student}
                    roomDetails={roomDetails}
                  />
                )}
              </>
            ))}
          </>
        ))}
      </Table>
    </div>
  );
}

export default Settings;
