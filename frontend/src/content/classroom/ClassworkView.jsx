import {
  getClassworkInformation,
  useGetClassworkInfo,
  useGetClass,
  fetchClassData,
} from "@/api/useApi";
import CopyFunctionality from "@/utils/CopyFunctionality";
import LoadingState from "@/utils/LoadingState";
import ToolTipComponent from "@/utils/ToolTipComponent";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookAIcon,
  Clock,
  File,
  FileCheck2,
  Files,
  FileText,
  School,
  School2Icon,
  SchoolIcon,
  Settings,
  Timer,
  Trash2,
} from "lucide-react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenClassworkSettings from "@/components/modals/OpenClassworkSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { baseUrl } from "@/baseUrl";
import { Badge } from "@/components/ui/badge";

function ClassworkView({ userStatus }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { workId } = useParams();
  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");
  const onError = () => console.log("error");
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
  };
  const [isCopied, setIsCopied] = useState(false);

  const [openClassworkSettingModal, setOpenSettingModal] = useState(false);

  const { data, isFetching, isLoading, isPending } = useGetClassworkInfo({
    queryFn: () => getClassworkInformation(roomId, workId),
    onError,
    onSuccess,
  });

  const { data: room } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  if (isFetching || isLoading || isPending) {
    return (
      <LoadingState className={"h-screen w-full flex flex-col items-center"} />
    );
  }

  return (
    <>
      {data.map((classroomInfo) => (
        <div className="container sm:container md:container lg:container">
          {room?.map((roomInfo) => (
            <div className="my-5">
              <ArrowLeft
                onClick={() => {
                  userStatus === "instructor"
                    ? navigate(
                        `/class/classroom/getCreatedClass/${userId}/${roomId}/classwork`
                      )
                    : navigate(`/class/classroom/getCreatedClass/${roomId}`);
                }}
              />

              <div className="bg-slate-900 p-5 rounded-md mt-5">
                <Badge className="bg-slate-400 flex gap-2 items-center w-max py-2 px-5 mb-3">
                  <Bell className=" text-white font-extrabold" />
                  Classwork: {classroomInfo.classwork_title}
                </Badge>

                <div className="w-full h-full">
                  <div className="grid grid-cols-4 gap-3 ">
                    <div className="flex gap-2 items-center">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-slate-100"
                        src={`http://localhost:3000/${roomInfo.profile_path}/${roomInfo.user_img}`}
                      />

                      <div>
                        <p className="font-extrabold text-slate-200">
                          {roomInfo.owner_name}
                        </p>
                        <p className="italic text-slate-100 opacity-80">
                          {roomInfo.owner_email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">Subject</p>
                      <p className="italic text-slate-100 opacity-80 flex items-center gap-2">
                        <School2Icon size={18} />
                        {roomInfo.subject}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">Due date</p>
                      <p className="italic text-slate-100 opacity-80 flex items-center gap-2">
                        <Clock size={18} />
                        {classroomInfo.classwork_due_date}
                        {", "}
                        {classroomInfo.classwork_due_time}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-200">Classname</p>
                      <p className="italic text-slate-100 opacity-80 flex items-center gap-2">
                        <SchoolIcon size={18} /> {roomInfo.classname}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 grid grid-cols-7 gap-2 "
                key={classroomInfo._id}
              >
                <div className="bg-slate-700 rounded-sm p-4 text-slate-50 flex gap-2 items-center sm: md: lg:col-span-4">
                  <File size={50} />{" "}
                  <p>{classroomInfo.classwork_attach_file.filename}</p>
                </div>

                <>
                  <div className="bg-slate-700 rounded-sm p-4 text-slate-50 flex flex-col justify-center items-end">
                    <p className="text-6xl font-extrabold text-slate-50">
                      {roomInfo.students.length}
                    </p>
                    <p className="italic opacity-80">Students</p>
                  </div>
                  <div className="bg-slate-700 rounded-sm p-4 text-slate-50 flex flex-col justify-center items-end">
                    <p className="text-6xl font-extrabold text-slate-50">
                      {roomInfo.announcement.length}
                    </p>
                    <p className="italic opacity-80">Announcement</p>
                  </div>
                  <div className="bg-slate-700 rounded-sm p-4 text-slate-50 flex flex-col justify-center items-end">
                    <CopyFunctionality
                      text={roomInfo.class_code}
                      setIsCopied={setIsCopied}
                      isCopied={isCopied}
                    />
                    <p className="text-1xl font-extrabold text-slate-50">
                      {roomInfo.class_code}
                    </p>
                    <p className="italic opacity-80">Classcode</p>
                  </div>
                </>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Description
                  </h1>
                  <p className="italic opacity-80">
                    {classroomInfo.classwork_description}
                  </p>
                </div>
                <ToolTipComponent
                  trigger={
                    <Settings
                      size={30}
                      onClick={() => setOpenSettingModal(true)}
                    />
                  }
                  content={<p>Open Settings</p>}
                />
              </div>
            </div>
          ))}
          {openClassworkSettingModal && (
            <OpenClassworkSettings
              open={openClassworkSettingModal}
              onOpenChange={setOpenSettingModal}
              classwork_title={classroomInfo.classwork_title}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default ClassworkView;

// {data?.map((item) => (
//   <div
//     key={item._id}
//     className="grid gap-2 sm:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-screen rounded"
//   >
//     <div className="bg-slate-500 rounded-lg lg: row-span-1 relative shadow-lg ">
//       <div className="text-primary font-bold absolute top-5 left-5">
//         <h1 className="text-2xl font-extrabold text-white drop-shadow-lg ">
//           {item.classwork_title}
//         </h1>
//         <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
//           {item.classwork_type}
//         </span>
//       </div>
//       <File
//         size={100}
//         className="absolute bottom-2 right-2 text-white opacity-60"
//       />
//     </div>
//     <div className="bg-slate-500 rounded-lg relative lg: row-span-2 col-span-3">
//       <div className="absolute top-5 right-5 text-white">
//         <ToolTipComponent
//           trigger={
//             <Settings
//               size={30}
//               onClick={() => setOpenSettingModal(true)}
//             />
//           }
//           content={<p>Open Settings</p>}
//         />
//       </div>
//     </div>
//     <div className="bg-slate-700 rounded-lg relative">
//       <div className="absolute top-5 left-5">
//         <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
//           {item.classwork_due_date}
//         </h1>
//         <p className="text-lg font-extrabold text-white drop-shadow-lg">
//           {item.classwork_due_time}
//         </p>
//       </div>
//       <Timer
//         size={100}
//         className="absolute bottom-2 right-2 text-white"
//       />
//     </div>
//     <div className="bg-slate-400 relative rounded-lg p-3 lg: row-span-1">
//       {room?.map((roomDetails) => (
//         <div key={roomDetails._id} className="text-white drop-shadow-lg">
//           <h1 className="font-extrabold">Classroom Details</h1>
//           <p className="italic text-sm my-3">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//             Doloribus, ducimus.
//           </p>
//           <div className="flex flex-col gap-2">
//             <h1 className="flex gap-2">
//               <School2Icon />
//               {roomDetails.subject}
//             </h1>
//             <p className="flex gap-2">
//               <BookAIcon />
//               {roomDetails.section}
//             </p>
//             <p className="flex gap-2">
//               <School />
//               {roomDetails.room}
//             </p>
//             <p className="flex items-center gap-2">
//               <CopyFunctionality
//                 text={roomDetails.class_code}
//                 isCopied={isCopied}
//                 setIsCopied={setIsCopied}
//               />
//               {roomDetails.class_code}
//             </p>
//           </div>
//           <FileCheck2 className="absolute right-0" size={100} />
//         </div>
//       ))}
//     </div>
//     <div className="bg-slate-950 rounded-lg lg: row-span-2">
//       <div>
//         <h1 className="text-white">5</h1>
//       </div>
//     </div>
//     <div className="bg-slate-900 rounded-lg relative lg: col-span-4">
//       <div className="text-white p-3">
//         <h1 className="text-2xl font-extrabold drop-shadow-lg">
//           Description
//         </h1>
//         <p className="text-sm italic my-3">
//           Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem
//           placeat saepe fugit sit! Facere aliquam sed totam. Laudantium
//           ipsum sapiente voluptatem, ratione perspiciatis praesentium cum!
//         </p>
//         <p>{item.classwork_description}</p>
//         <FileText className="absolute bottom-2 right-2" size={100} />
//       </div>
//     </div>
//
//   </div>
// ))}
