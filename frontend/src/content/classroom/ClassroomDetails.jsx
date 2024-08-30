import { ArrowLeft, Book, BookCheck, Copy, Loader2 } from "lucide-react";
import { fetchClassData, useGetClass } from "@/api/useApi";
import LoadingState from "@/utils/LoadingState";
import { useNavigate, useParams } from "react-router-dom";
import CopyFunctionality from "@/utils/CopyFunctionality";
import { Link, Outlet } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import ClassroomNavigation from "./ClassroomNavigation";
import ToolTipComponent from "@/utils/ToolTipComponent";
import ClassroomInfo from "./ClassroomInfo";

function ClassroomDetails() {
  // const onSuccess = () => console.log("success");
  // const onError = () => console.log("error");
  const navigate = useNavigate();
  // const [isCopied, setIsCopied] = useState(false);
  // const { roomId } = useParams();
  // const userId = localStorage.getItem("userId");
  // const { data, isLoading, isPending, isFetched, isFetching } = useGetClass({
  //   queryFn: () => fetchClassData(roomId),
  //   onError,
  //   onSuccess,
  // });

  return (
    <>
      <div className="container sm:container md:container lg:container">
        <div className="my-5">
          <ArrowLeft
            onClick={() => {
              navigate(`/class/:userId`);
              console.log("clicked na uo");
            }}
          />
        </div>
        <ClassroomInfo
          design={
            "bg-slate-900 rounded relative z-50 p-9 sm:col-span-2 md:h-full lg:h-full"
          }
          hide={"hidden"}
        />
        <ClassroomNavigation />
        <Outlet />
      </div>
    </>
  );
}

export default ClassroomDetails;

{
  /* {roomDetails.announcement.map((item) => (
                <p>{item.title}</p>
              ))} */
}
