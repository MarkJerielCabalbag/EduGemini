import {
  fetchClassData,
  getUser,
  useGetAllUser,
  useGetClass,
  useGetUser,
} from "@/api/useApi";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";
import RejectAllStudent from "@/components/modals/RejectAllStudent";
import AcceptAllStudents from "@/components/modals/AcceptAllStudents";

const StudentsApprovalStatus = ({
  pending,
  approved,
  declined,
  approveStudentsBtn,
  declineStudentsBtn,
}) => {
  const { roomId } = useParams();
  const [check, setCheck] = useState(false);
  const [checkedList, setCheckList] = useState([]);
  const [showCheckedList, setShowCheckList] = useState(false);
  const [showAcceptAll, setShowAcceptAll] = useState(false);
  const [showRejectAll, setShowRejectAll] = useState(false);
  const [openStudentApproveModal, setOpenStudentApproveModal] = useState(false);
  const [openStudentDeclineModal, setOpenStudentDeclineModal] = useState(false);
  const [studentDetail, setStudentDetail] = useState({
    studentId: "",
    studentFname: "",
    studentMname: "",
    studentLname: "",
    classname: "",
  });
  const [userId, setUserId] = useState(null);
  const queryClient = useQueryClient();
  const onError = () => console.log("error");
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["room"] });
  };
  const { data: user } = useGetUser({
    queryFn: () => getUser(userId),
    onSuccess,
    onError,
  });
  console.log(user);

  const { data, isLoading, isPending, isFetching } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  // console.log(checkedList);
  // console.log(data);
  // const students = data?.map((roomDetails) =>
  //   roomDetails.students.map((studentInfo) => setUserId(studentInfo._id))
  // );

  // console.log(students);
  const { data: allUser } = useGetAllUser({
    onError,
    onSuccess,
  });

  console.log(allUser);

  return (
    <>
      {data?.map((roomDetails) => (
        <React.Fragment key={roomDetails._id}>
          {showRejectAll && (
            <RejectAllStudent
              open={showRejectAll}
              onOpenChange={setShowRejectAll}
              checkedList={checkedList}
              setCheckList={setCheckList}
              roomId={roomId}
            />
          )}

          {showAcceptAll && (
            <AcceptAllStudents
              open={showAcceptAll}
              onOpenChange={setShowAcceptAll}
              checkedList={checkedList}
              setCheckList={setCheckList}
              roomId={roomId}
            />
          )}

          {showCheckedList && checkedList.length > 1 ? (
            <div className="flex gap-3 justify-end my-3 mx-4">
              <Button
                className={`bg-red-600 ${declineStudentsBtn}`}
                disabled={checkedList.length === 1 || checkedList.length === 0}
                onClick={() => setShowRejectAll(true)}
              >
                Decline {`(${checkedList.length})`}
              </Button>

              <Button
                className={`bg-green-600 ${approveStudentsBtn}`}
                disabled={checkedList.length === 1 || checkedList.length === 0}
                onClick={() => setShowAcceptAll(true)}
              >
                Approve {`(${checkedList.length})`}
              </Button>
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>Firstname</TableHead>
                <TableHead>Middlename</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            {roomDetails.students.map((student) => {
              return (
                <React.Fragment key={student._id}>
                  {student.approvalStatus === pending ? (
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <input
                            type="checkbox"
                            value={check}
                            name="check"
                            onChange={(e) => {
                              const studentId = student._id;
                              if (e.target.checked) {
                                setCheckList((prev) => [
                                  ...prev,
                                  { _id: studentId },
                                ]);
                                setShowCheckList(true);
                              } else {
                                setCheckList((prev) =>
                                  prev.filter(
                                    (student) => student._id !== studentId
                                  )
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="flex gap-2 items-center">
                          <Avatar>
                            {allUser?.map((user) =>
                              user._id === student._id ? (
                                <AvatarImage
                                  className="h-10 w-10 rounded-full border-2 border-slate-900"
                                  src={`${baseUrl}/${user.profile_path}/${user.profile.filename}`}
                                />
                              ) : (
                                <AvatarImage className="h-10 w-10 rounded-full border-2 border-slate-900" />
                              )
                            )}
                          </Avatar>

                          <div>
                            {student.user_lastname}, {student.user_firstname}{" "}
                            {student.user_middlename.charAt(0)}.
                          </div>
                        </TableCell>
                        <TableCell>
                          {allUser?.map((user) =>
                            user._id === student._id ? user.user_email : null
                          )}
                        </TableCell>
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
                                  onClick={() => {
                                    setOpenStudentDeclineModal(true);
                                    setStudentDetail({
                                      studentId: student._id,
                                      studentFname: student.user_firstname,
                                      studentMname: student.user_middlename,
                                      studentLname: student.user_lastname,
                                      classname: roomDetails.classname,
                                    });
                                  }}
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
                                  onClick={() => {
                                    setOpenStudentApproveModal(true);
                                    setStudentDetail({
                                      studentId: student._id,
                                      studentFname: student.user_firstname,
                                      studentMname: student.user_middlename,
                                      studentLname: student.user_lastname,
                                      classname: roomDetails.classname,
                                    });
                                  }}
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
                                  disabled={checkedList.length > 1}
                                  className={`${
                                    student.approvalStatus === pending
                                      ? "hide"
                                      : "show "
                                  } w-full bg-red-600 hover:bg-red-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenStudentDeclineModal(true);
                                    setStudentDetail({
                                      studentId: student._id,
                                      studentFname: student.user_firstname,
                                      studentMname: student.user_middlename,
                                      studentLname: student.user_lastname,
                                      classname: roomDetails.classname,
                                    });
                                  }}
                                >
                                  Re-Decline
                                </Button>
                              ) : (
                                <Button
                                  disabled={checkedList.length > 1}
                                  value="approve"
                                  className={`${
                                    student.approvalStatus === pending
                                      ? "hide"
                                      : " show"
                                  } w-full bg-green-600 hover:bg-green-300 text-slate-900 `}
                                  onClick={() => {
                                    setOpenStudentApproveModal(true);

                                    setStudentDetail({
                                      studentId: student._id,
                                      studentFname: student.user_firstname,
                                      studentMname: student.user_middlename,
                                      studentLname: student.user_lastname,
                                      classname: roomDetails.classname,
                                    });
                                  }}
                                >
                                  Re-Approve
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : null}
                </React.Fragment>
              );
            })}
          </Table>
        </React.Fragment>
      ))}

      {openStudentApproveModal && (
        <ApproveStudentModal
          open={openStudentApproveModal}
          onOpenChange={setOpenStudentApproveModal}
          studentDetail={studentDetail}
        />
      )}

      {openStudentDeclineModal && (
        <DeclineStudentModal
          open={openStudentDeclineModal}
          onOpenChange={setOpenStudentDeclineModal}
          studentDetail={studentDetail}
        />
      )}
    </>
  );
};

export default StudentsApprovalStatus;
