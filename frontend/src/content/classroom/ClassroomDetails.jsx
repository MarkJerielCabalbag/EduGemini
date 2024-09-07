import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ClassroomNavigation from "./ClassroomNavigation";
import ClassroomInfo from "./ClassroomInfo";

function ClassroomDetails() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  return (
    <>
      <div className="container sm:container md:container lg:container">
        <div className="my-5">
          <ArrowLeft
            onClick={() => {
              navigate(`/class/${userId}`);
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
