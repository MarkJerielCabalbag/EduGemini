import { fetchClassData, useGetClass } from "@/api/useApi";
import ApproveStudentModal from "@/components/modals/ApproveStudentModal";
import DeclineStudentModal from "@/components/modals/DeclineStudentModal";

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

function People() {
  const { roomId } = useParams();
  const [openStudentApproveModal, setOpenStudentApproveModal] = useState(false);
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
                {student.approvalStatus === "pending" ? (
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex gap-2 items-center">
                        <Avatar>
                          {student.user_profile_path && (
                            <AvatarImage
                              className="h-10 w-10 rounded-full border-2 border-slate-900"
                              src={`http://localhost:3000/${student.user_profile_path}/${student.user_img}`}
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
                            <Badge className={" bg-yellow-500"}>
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
                        {student.approvalStatus === "pending" ? (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Action" />
                            </SelectTrigger>
                            <SelectContent>
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
                              <Button
                                value="approve"
                                className={`${
                                  student.approvalStatus === "pending"
                                    ? "hide"
                                    : " show"
                                } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                                onClick={() => setOpenStudentApproveModal(true)}
                              >
                                Approve
                              </Button>
                            </SelectContent>
                          </Select>
                        ) : (
                          <>
                            {student.approvalStatus === "approved" ? (
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
                            ) : (
                              <Button
                                value="approve"
                                className={`${
                                  student.approvalStatus === "pending"
                                    ? "hide"
                                    : " show"
                                } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                                onClick={() => setOpenStudentApproveModal(true)}
                              >
                                Approve
                              </Button>
                            )}
                          </>
                        )}

                        {openStudentApproveModal && (
                          <ApproveStudentModal
                            open={openStudentApproveModal}
                            onOpenChange={setOpenStudentApproveModal}
                            studentID={student._id}
                          />
                        )}

                        {openStudentDeclineModal && (
                          <DeclineStudentModal
                            open={openStudentDeclineModal}
                            onOpenChange={setOpenStudentDeclineModal}
                            studentID={student._id}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : null}
              </>
            ))}
          </>
        ))}
      </Table>
    </div>
  );
}

export default People;

{
  /* <div className="grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
{roomDetails.students.map((student) => (
  <>
    {student.approvalStatus === "pending" ? (
      <Card className="relative z-50">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <img
              className="h-12 w-12 rounded-full border-2 border-slate-900"
              src={`http://localhost:3000/${student.user_profile_path}/${student.user_img}`}
            />
            {student.user_lastname}, {student.user_firstname}{" "}
            {student.user_middlename.charAt(0)}.
          </CardTitle>
          <CardDescription>{student.user_email}</CardDescription>
          <div className="mt-2">
            {openStudentApproveModal && (
              <ApproveStudentModal
                open={openStudentApproveModal}
                onOpenChange={setOpenStudentApproveModal}
                student={student}
                roomDetails={roomDetails}
              />
            )}

            {openStudentDeclineModal && (
              <DeclineStudentModal
                open={openStudentDeclineModal}
                onOpenChange={setOpenStudentDeclineModal}
                student={student}
                roomDetails={roomDetails}
              />
            )}

            <p>
              <b className="italic text-slate-500">
                {student.user_lastname}, {student.user_firstname}{" "}
                {student.user_middlename}
              </b>{" "}
              requested to join your class
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                className="w-1/2 bg-red-500"
                onClick={() => setOpenStudentDeclineModal(true)}
              >
                Decline
              </Button>
              <Button
                className="w-1/2 bg-green-500"
                onClick={() => setOpenStudentApproveModal(true)}
              >
                Approve
              </Button>
            </div>
          </div>
        </CardHeader>
        <Badge
          className={
            "absolute top-2 right-2 bg-yellow-500 text-slate-900"
          }
        >
          {student.approvalStatus}
        </Badge>
      </Card>
    ) : null}
  </>
))}
</div> */
}
