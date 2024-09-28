import { fetchClassData, useGetClass } from "@/api/useApi";
import { baseUrl } from "@/baseUrl";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CopyFunctionality from "@/utils/CopyFunctionality";
import ToolTipComponent from "@/utils/ToolTipComponent";
import { ArrowLeft, Book } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ClassroomInfo({ design, hide, link }) {
  const onSuccess = () => console.log("success");
  const onError = () => console.log("error");
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const { roomId } = useParams();
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isPending, isFetching } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });
  return (
    <>
      {data?.map((roomDetails) => (
        <React.Fragment key={roomDetails._id}>
          <div key={roomDetails._id} className="sticky top-0 bg-white z-50">
            <div className="my-5">
              <ArrowLeft
                className=""
                onClick={() => {
                  navigate(`${link}`);
                  console.log("hi");
                }}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className={design}>
                <h1 className="text-white font-bold text-lg">
                  {isLoading || isFetching ? (
                    <Skeleton
                      className={"h-[20px] w-[250px] bg-slate-500 rounded-sm"}
                    />
                  ) : (
                    roomDetails.classname
                  )}
                </h1>
                <p className="text-white">
                  {isLoading || isFetching ? (
                    <Skeleton
                      className={
                        "h-[20px] w-[210px] my-2 bg-slate-500 rounded-sm"
                      }
                    />
                  ) : (
                    roomDetails.subject
                  )}
                </p>
                <p className="text-white">
                  {isLoading || isFetching ? (
                    <Skeleton
                      className={"h-[20px] w-[190px] bg-slate-500 rounded-sm"}
                    />
                  ) : (
                    roomDetails.section
                  )}
                </p>
                <div className="flex flex-col p-5 mt-6 rounded bg-slate-500">
                  <h1 className="text-white">Class Code</h1>
                  <p className="text-white font-extrabold flex justify-between items-center">
                    {isLoading || isFetching ? (
                      <Skeleton
                        className={"h-[20px] w-[180px] bg-slate-900 rounded-sm"}
                      />
                    ) : (
                      roomDetails.class_code
                    )}

                    {isLoading || isFetching ? (
                      <Skeleton
                        className={"h-[20px] w-[20px] bg-slate-900 rounded-sm"}
                      />
                    ) : (
                      <ToolTipComponent
                        trigger={
                          <CopyFunctionality
                            text={roomDetails.class_code}
                            isCopied={isCopied}
                            setIsCopied={setIsCopied}
                          />
                        }
                        content={<p>Copy to Clipboard</p>}
                      />
                    )}
                  </p>
                </div>
                <Book
                  size={150}
                  className="text-white absolute z-0 left-0 top-0 rotate-45 opacity-15"
                />
              </div>
            </div>
            <div className={`${hide} mx-3 flex gap-2 items-center`}>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  className="border-2 border-slate-200 rounded-full"
                  src={`${baseUrl}/${roomDetails?.owner_email}/${roomDetails?.user_img}`}
                />
              </Avatar>
              <div>
                <h1 className="font-bold text-sm md:text-lg">
                  {roomDetails.owner_name}
                </h1>
                <p className="italic text-xs md:text-md">
                  {roomDetails.owner_email}
                </p>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

export default ClassroomInfo;
