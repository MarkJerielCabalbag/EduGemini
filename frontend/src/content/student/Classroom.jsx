import React from "react";
import Navbar from "../Navbar";
import MenuBar from "../MenuBar";
import ClassroomInfo from "../classroom/ClassroomInfo";
import { useNavigate, Outlet, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Classroom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  return (
    <div className="sm:container md:container lg:container">
      <Navbar />
      <MenuBar />

      <div className="mt-5">
        <div className="mx-5">
          <ClassroomInfo
            design={"bg-slate-900 rounded-sm col-span-2 p-5 md:p-5"}
            hide={"mt-5"}
            link={`/enrolled/${userId}`}
          />
        </div>

        <div className="mx-3">
          <div className="w-full bg-white flex flex-col md:flex-row">
            <Button
              variant={"link"}
              className="w-full flex justify-start md:w-auto"
              onClick={() =>
                navigate(`/class/classroom/getCreatedClass/${roomId}`)
              }
            >
              Announcements
            </Button>
            <Button
              variant={"link"}
              className="w-full flex justify-start md:w-auto"
              onClick={() =>
                navigate(`/class/classroom/getCreatedClass/${roomId}/classwork`)
              }
            >
              Classworks
            </Button>
          </div>
        </div>

        <div className="mx-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Classroom;
