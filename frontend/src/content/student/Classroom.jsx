import React from "react";
import Navbar from "../Navbar";
import MenuBar from "../MenuBar";
import ClassroomInfo from "../classroom/ClassroomInfo";
import { Link, Outlet, useParams } from "react-router-dom";

function Classroom() {
  const { roomId } = useParams();
  return (
    <div className="sm:container md:container lg:container">
      <Navbar />
      <MenuBar />
      <div className="h-screen w-full mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="px-4 py-4 bg-primary rounded">
          <div className="p-5 text-white">
            <ClassroomInfo
              design={
                "bg-slate-900 rounded relative z-50 sm:col-span-2 md:h-full lg:h-full"
              }
              hide={"mt-5"}
            />
          </div>
        </div>
        <div className="mt-5 md:mt-0 lg:mt-0 px-4 ">
          <div className="flex gap-2 ">
            <Link
              className="w-1/2 bg-slate-400 p-5 rounded text-center font-bold text-white hover:bg-slate-600"
              to={`/class/classroom/getCreatedClass/${roomId}`}
            >
              Announcements
            </Link>
            <Link
              className="w-1/2 bg-slate-400 p-5 rounded text-center font-bold text-white hover:bg-slate-600"
              to={`/class/classroom/getCreatedClass/${roomId}/classwork`}
            >
              Classworks
            </Link>
          </div>
          <div className="px-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Classroom;
