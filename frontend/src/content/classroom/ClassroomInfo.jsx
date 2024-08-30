import { fetchClassData, useGetClass } from "@/api/useApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CopyFunctionality from "@/utils/CopyFunctionality";
import ToolTipComponent from "@/utils/ToolTipComponent";
import { Book } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ClassroomInfo({ design, hide }) {
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
        <>
          <div key={roomDetails._id}>
            <div className="gap-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className={design}>
                <h1 className="text-white font-bold text-lg">
                  {roomDetails.classname}
                </h1>
                <p className="text-white">{roomDetails.subject}</p>
                <p className="text-white">{roomDetails.section}</p>
                <div className="flex flex-col p-5 mt-6 rounded bg-slate-500">
                  <h1 className="text-white">Class Code</h1>
                  <p className="text-white font-extrabold flex justify-between items-center">
                    {roomDetails.class_code}
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
                  </p>
                </div>
                <Book
                  size={150}
                  className="text-white absolute z-0 left-0 top-0 rotate-45 opacity-15"
                />
              </div>
            </div>
            <div className={`${hide} flex gap-2 items-center`}>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  className="border-2 border-slate-200 rounded-full"
                  src={`http://localhost:3000/${roomDetails?.profile_path}/${roomDetails?.user_img}`}
                />
              </Avatar>
              <div>
                <h1>{roomDetails.owner_name}</h1>
                <p>{roomDetails.owner_email}</p>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default ClassroomInfo;
