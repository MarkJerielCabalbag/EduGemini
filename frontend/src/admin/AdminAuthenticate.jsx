import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useLoginAdmin } from "@/api/useApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Info, Loader2Icon } from "lucide-react";
function AdminAuthenticate() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    admin_username: "",
    admin_password: "",
  });
  const { admin_username, admin_password } = admin;
  const handleChange = (e) =>
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });

  const onError = (error) => {
    toast.error(error.message);
    setAdmin({
      admin_username: "",
      admin_password: "",
    });
  };

  const onSuccess = (data) => {
    toast.success(data.message);
    setAdmin({
      admin_username: "",
      admin_password: "",
    });
  };

  const { mutateAsync, isError, isPending, isLoading } = useLoginAdmin({
    onError,
    onSuccess,
  });

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-10 relative z-50 ">
      <div className=" text-center z-50">
        <h1 className="text-2xl flex gap-2 items-center justify-center italic font-bold">
          eduGemini
        </h1>
        <p className="text-2xl font-bold my-3">
          “Empowering Educators: Unleashing Student Potential with eduGemini!”
        </p>
        <p className="opacity-75 ">
          Discover how eduGemini’s AI-driven insights revolutionize student work
          analysis, personalized feedback, and time-saving efficiency.
        </p>
        <h1 className=" font-extrabold my-3">Admin</h1>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="z-50 bg-white w-4/12 shadow-2xl p-5 rounded"
      >
        <div className="my-5">
          <Label className="font-bold italic flex items-center gap-2 mb-2">
            Admin Username
          </Label>
          <Input
            type="text"
            name="admin_username"
            value={admin_username}
            onChange={handleChange}
            placeholder="Your Email Address"
            className={`${isError ? "border-red-500" : ""}`}
          />
          <p
            className={`${
              isError ? "show" : " "
            }hidden text-red-500 text-xs italic mt-2`}
          >
            {isError ? (
              <div className="flex items-center gap-1">
                <Info size={13} />
                Fill out all fields
              </div>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="my-5">
          <Label
            htmlFor="user_password"
            className="font-bold italic flex items-center gap-2 mb-2"
          >
            Password
          </Label>
          <Input
            type="password"
            name="admin_password"
            value={admin_password}
            onChange={handleChange}
            placeholder="Your Password"
            className={`${isError ? "border-red-500" : ""}`}
          />
          <p
            className={`${
              isError ? "show" : " "
            }hidden text-red-500 text-xs italic mt-2`}
          >
            {isError ? (
              <div className="flex items-center gap-1">
                <Info size={13} />
                Fill out all fields
              </div>
            ) : (
              ""
            )}
          </p>
        </div>
        <Button
          className="bg-primary w-full"
          onClick={async () => {
            try {
              const formData = {
                admin_password,
                admin_username,
              };
              setAdmin({
                admin_username: "",
                admin_password: "",
              });
              navigate("/admin/dashboard");
              await mutateAsync(formData);
            } catch (error) {
              console.log("Error", error);
              setAdmin({
                admin_username: "",
                admin_password: "",
              });
            }
          }}
        >
          {isLoading || isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}

export default AdminAuthenticate;
