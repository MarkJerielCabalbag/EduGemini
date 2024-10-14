import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import {
  Bookmark,
  BookmarkMinus,
  BookmarkPlus,
  BookmarkX,
  CheckCircle2Icon,
  MinusCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import StudentsApprovalStatus from "../table/StudentsApprovalStatus";
import { fetchClassData, useGetClass } from "@/api/useApi";
import { useParams } from "react-router-dom";

function People() {
  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");
  const { roomId } = useParams();
  const { data } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  const students = data?.map((roomDetails) => roomDetails.students).flat();

  const totalStudentApproved = students?.filter(
    (student) => student.approvalStatus === "approved"
  ).length;

  const totalStudentPending = students?.filter(
    (student) => student.approvalStatus === "pending"
  ).length;

  const totalStudentDeclined = students?.filter(
    (student) => student.approvalStatus === "declined"
  ).length;

  return (
    <div className="container sm:container md:container lg:container">
      <h1 className="text-slate-900 font-bold text-md flex gap-2 items-center">
        <Bookmark size={30} />
        Student Approval
      </h1>
      <p className="opacity-75 italic my-2 text-pretty">
        This section allows you to manage the approval status of students within
        the class. You can view an overview of students who are approved,
        pending approval, or declined. The interface offers options to approve
        or decline students and track their current status at a glance.
      </p>

      <Separator className="my-10" />

      <h1 className="text-slate-600 font-bold text-md italic flex gap-2 items-center">
        Overview
      </h1>
      <p className="opacity-75 italic my-2 text-balance">
        A summary of the student approval statuses is displayed, including the
        total number of approved, pending, and declined students. This provides
        a quick snapshot of where each student stands in the approval process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 ">
        <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-sm w-10 h-10"></div>
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold">{totalStudentApproved}</h1>
            <p className="italic opacity-70 flex items-center gap-2">
              <CheckCircle2Icon className="opacity-70" size={20} /> Approved
            </p>
          </div>
        </div>

        <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-sm w-10 h-10"></div>
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold">{totalStudentPending}</h1>
            <p className="italic opacity-70 flex items-center gap-2">
              <MinusCircleIcon className="opacity-70" size={20} />
              Pending
            </p>
          </div>
        </div>

        <div className=" text-slate-900 p-5 rounded-sm flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-sm w-10 h-10"></div>
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold">{totalStudentDeclined}</h1>
            <p className="italic opacity-70 flex items-center gap-2">
              <XCircleIcon className="opacity-70" size={20} /> Declined
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <h1 className="text-slate-600 font-bold text-md italic flex gap-2 items-center">
        <BookmarkMinus /> Students Pending Approval
      </h1>
      <p className="opacity-75 italic my-2 text-balance">
        This section lists all students whose approval is still pending. You can
        take action by either approving or declining their participation in the
        class.
      </p>

      <StudentsApprovalStatus
        pending={"pending"}
        approved={"approved"}
        declined={"declined"}
        approveStudentsBtn={"show"}
        declineStudentsBtn={"show"}
      />

      <Separator className="my-10" />
      <h1 className="text-slate-600 font-bold text-md italic flex gap-2 items-center">
        <BookmarkPlus /> Students Approved
      </h1>
      <p className="opacity-75 italic my-2 text-balance">
        Here, you can see the list of students who have already been approved.
        There’s also an option to remove approval if needed.
      </p>

      <StudentsApprovalStatus
        pending={"approved"}
        approved={"declined"}
        declined={"pending"}
        approveStudentsBtn={"hidden"}
        declineStudentsBtn={"show"}
      />

      <Separator className="my-10" />
      <h1 className="text-slate-600 font-bold text-md italic flex gap-2 items-center">
        <BookmarkX /> Students Declines
      </h1>
      <p className="opacity-75 italic my-2 text-balance">
        This final section displays students whose approval has been declined,
        with the option to reverse the decision if necessary.
      </p>

      <StudentsApprovalStatus
        pending={"declined"}
        approved={"pending"}
        declined={"approved"}
        approveStudentsBtn={"show"}
        declineStudentsBtn={"hidden"}
      />
    </div>
  );
}

export default People;
