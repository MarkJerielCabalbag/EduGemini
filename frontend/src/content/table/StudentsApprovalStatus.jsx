import { fetchClassData, useGetClass } from "@/api/useApi";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
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
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";

const StudentsApprovalStatus = ({ pending, approved, declined }) => {
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
    <>
      {data?.map((roomDetails) => (
        <React.Fragment key={roomDetails._id}>
          {roomDetails.students.map((student) => (
            <React.Fragment key={roomDetails._id}>
              {student.approvalStatus === pending ? (
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
                        {student.user_lastname}, {student.user_firstname}{" "}
                        {student.user_middlename.charAt(0)}.
                      </div>
                    </TableCell>
                    <TableCell>{student.user_email}</TableCell>
                    <TableCell>
                      {student.approvalStatus === pending ? (
                        <>
                          <Badge
                            className={`${
                              student.approvalStatus === "approved"
                                ? "bg-green-500"
                                : ""
                            } ${
                              student.approvalStatus === "pending"
                                ? "bg-yellow-500"
                                : ""
                            } ${
                              student.approvalStatus === "declined"
                                ? "bg-red-500"
                                : ""
                            }`}
                          >
                            {student.approvalStatus}
                          </Badge>
                        </>
                      ) : (
                        <>
                          {student.approvalStatus === approved ||
                          student.approvalStatus === declined ? (
                            <Badge
                              className={`${
                                student.approvalStatus === approved
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
                                student.approvalStatus === pending
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
                                student.approvalStatus === pending
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
                                student.approvalStatus === pending
                                  ? "hide"
                                  : "show "
                              } w-full bg-red-600 hover:bg-red-300 text-slate-900 `}
                              onClick={() => setOpenStudentDeclineModal(true)}
                            >
                              Re-Decline
                            </Button>
                          ) : (
                            <Button
                              value="approve"
                              className={`${
                                student.approvalStatus === pending
                                  ? "hide"
                                  : " show"
                              } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                              onClick={() => setOpenStudentApproveModal(true)}
                            >
                              Re-Approve
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
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default StudentsApprovalStatus;
