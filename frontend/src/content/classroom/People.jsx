import { fetchClassData, useGetClass } from "@/api/useApi";
import ApproveStudentModal from "@/components/modals/ApproveStudentModal";
import DeclineStudentModal from "@/components/modals/DeclineStudentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";
import LoadingState from "@/utils/LoadingState";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
function People() {
  const { roomId } = useParams();
  const [openStudentApproveModal, setOpenStudentApproveModal] = useState(false);
  const [openStudentDeclineModal, setOpenStudentDeclineModal] = useState(false);
  const queryClient = useQueryClient();
  const onError = () => console.log("error");
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["room"] });
  };
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
                              src={`${baseUrl}/${student.user_profile_path}/${student.user_img}`}
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
