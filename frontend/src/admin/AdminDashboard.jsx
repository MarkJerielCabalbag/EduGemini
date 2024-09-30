import React from "react";
import { useGetAllClassAdmin } from "@/api/useApi";

import mainBg from "../assets/main-bg.mp4";

import { Link, Outlet } from "react-router-dom";
import AdminPendingClassApproval from "./AdminPendingClassApproval";
function AdminDashboard() {
  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");
  const { data } = useGetAllClassAdmin({ onError, onSuccess });

  return (
    <>
      <div className="opacity-75 w-full">
        <div className=" container sm:container md:container lg:container">
          <h1 className="bg-white shadow-lg opacity-90 p-5 rounded text-primary font-extrabold text-lg">
            EduGemini Admin
          </h1>

          <div className="flex gap-4 my-2">
            <Link to="/admin/dashboard/pending">Pending</Link>
            <Link to="/admin/dashboard/approved">Approved</Link>
            <Link to="/admin/dashboard/declined">Declined</Link>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default AdminDashboard;
