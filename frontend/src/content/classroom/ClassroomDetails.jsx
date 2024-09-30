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
      <div className="h-screen">
        <ClassroomInfo
          design={" bg-slate-900 rounded-sm col-span-2 z-50 p-5 md:p-5"}
          hide={"hidden"}
          link={`/class/${userId}`}
        />
        <ClassroomNavigation />

        <Outlet />
      </div>
    </>
  );
}

export default ClassroomDetails;
