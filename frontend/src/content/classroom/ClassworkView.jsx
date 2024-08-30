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
  BookAIcon,
  File,
  FileCheck2,
  FileText,
  MinusCircle,
  School,
  School2Icon,
  Settings,
  Timer,
  Trash2,
} from "lucide-react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenClassworkSettings from "@/components/modals/OpenClassworkSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import ClassworkDelete from "./ClassworkDelete";
import ClassworkUpdate from "./ClassworkUpdate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function ClassworkView({ userStatus }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { workId } = useParams();
  const roomId = localStorage.getItem("roomId");
  const onError = () => console.log("error");
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
  };
  const [isCopied, setIsCopied] = useState(false);
  const [openDeleteClassworkModal, setOpenDeleteClassworkModal] =
    useState(false);
  const [openClassworkSettingModal, setOpenSettingModal] = useState(false);

  const { data, isFetching, isLoading, isPending } = useGetClassworkInfo({
    queryFn: () => getClassworkInformation(roomId, workId),
    onError,
    onSuccess,
  });

  console.log(data);

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
    <div className="container sm:container md:container lg:container">
      <div className="my-5">
        <ArrowLeft
          onClick={() => {
            userStatus === "instructor"
              ? navigate(
                  "/class/classroom/getCreatedClass/:userId/:roomId/classwork"
                )
              : navigate("/home");
          }}
        />
      </div>
      {data?.map((item) => (
        <div
          key={item._id}
          className="grid gap-2 sm:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-screen rounded"
        >
          <div className="bg-slate-500 rounded-lg lg: row-span-1 relative shadow-lg ">
            <div className="text-primary font-bold absolute top-5 left-5">
              <h1 className="text-2xl font-extrabold text-white drop-shadow-lg ">
                {item.classwork_title}
              </h1>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {item.classwork_type}
              </span>
            </div>
            <File
              size={100}
              className="absolute bottom-2 right-2 text-white opacity-60"
            />
          </div>
          <div className="bg-slate-500 rounded-lg relative lg: row-span-2 col-span-3">
            <div className="absolute top-5 right-5 text-white">
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
          <div className="bg-slate-700 rounded-lg relative">
            <div className="absolute top-5 left-5">
              <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
                {item.classwork_due_date}
              </h1>
              <p className="text-lg font-extrabold text-white drop-shadow-lg">
                {item.classwork_due_time}
              </p>
            </div>
            <Timer
              size={100}
              className="absolute bottom-2 right-2 text-white"
            />
          </div>
          <div className="bg-slate-400 relative rounded-lg p-3 lg: row-span-1">
            {room?.map((roomDetails) => (
              <div key={roomDetails._id} className="text-white drop-shadow-lg">
                <h1 className="font-extrabold">Classroom Details</h1>
                <p className="italic text-sm my-3">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Doloribus, ducimus.
                </p>
                <div className="flex flex-col gap-2">
                  <h1 className="flex gap-2">
                    <School2Icon />
                    {roomDetails.subject}
                  </h1>
                  <p className="flex gap-2">
                    <BookAIcon />
                    {roomDetails.section}
                  </p>
                  <p className="flex gap-2">
                    <School />
                    {roomDetails.room}
                  </p>
                  <p className="flex items-center gap-2">
                    <CopyFunctionality
                      text={roomDetails.class_code}
                      isCopied={isCopied}
                      setIsCopied={setIsCopied}
                    />
                    {roomDetails.class_code}
                  </p>
                </div>
                <FileCheck2 className="absolute right-0" size={100} />
              </div>
            ))}
          </div>
          <div className="bg-slate-950 rounded-lg lg: row-span-2">
            <div>
              <h1 className="text-white">5</h1>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg relative lg: col-span-4">
            <div className="text-white p-3">
              <h1 className="text-2xl font-extrabold drop-shadow-lg">
                Description
              </h1>
              <p className="text-sm italic my-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem
                placeat saepe fugit sit! Facere aliquam sed totam. Laudantium
                ipsum sapiente voluptatem, ratione perspiciatis praesentium cum!
              </p>
              <p>{item.classwork_description}</p>
              <FileText className="absolute bottom-2 right-2" size={100} />
            </div>
          </div>
          {openClassworkSettingModal && (
            <OpenClassworkSettings
              open={openClassworkSettingModal}
              onOpenChange={setOpenSettingModal}
              alertDialogTitle={"Classwork Settings"}
              alertDialogDescription={
                <>
                  <div className="border-l-4 border-slate-500 p-5 shadow-md rounded mt-5 h-[330px] overflow-y-scroll">
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia placeat soluta debitis aut totam tenetur assumenda
                      optio est. Odio, tempora?
                    </p>

                    <ClassworkUpdate
                      setOpenSettingModal={setOpenSettingModal}
                    />

                    <div>
                      <Label className="font-bold italic flex items-center gap-2 mb-2">
                        <Trash2 size={20} />
                        Delete this classwork?
                      </Label>
                      {openDeleteClassworkModal && (
                        <ClassworkDelete
                          open={openDeleteClassworkModal}
                          onOpenChange={setOpenDeleteClassworkModal}
                        />
                      )}
                      <p className="my-2">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Deserunt, officia!
                      </p>
                      <Button
                        className={"w-full hover:bg-red-700"}
                        onClick={() => setOpenDeleteClassworkModal(true)}
                      >
                        Delete {item.classwork_title}
                      </Button>
                    </div>
                  </div>
                </>
              }
              alertDialogFooter={
                <>
                  <Button
                    className="w-full"
                    onClick={() => setOpenSettingModal(false)}
                  >
                    Close
                  </Button>
                </>
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ClassworkView;
