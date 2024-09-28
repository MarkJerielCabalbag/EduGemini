import {
  Loader2Icon,
  LockIcon,
  LockKeyholeOpen,
  MailCheck,
  UserCheck,
  UserCircle2Icon,
  Info,
  Paperclip,
  PenIcon,
  PenBoxIcon,
  Pen,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useGetUser, useUpdateUser } from "@/api/useApi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { baseUrl } from "@/baseUrl";
function UpdateUser() {
  const queryClient = useQueryClient();
  const [updateInfo, setUpdateInfo] = useState({
    user_email: "",
    user_username: "",
    user_password: "",
    confirm_password: "",
  });

  const userId = localStorage.getItem("userId");

  const [user_profile, setUserProfile] = useState([]);
  const { user_email, user_username, user_password, confirm_password } =
    updateInfo;

  async function handleUpload() {
    try {
      const formData = new FormData();
      formData.append("user_email", user_email);
      formData.append("user_username", user_username);
      formData.append("user_password", user_password);
      formData.append("user_profile", user_profile);

      const response = await fetch(
        `${baseUrl}/api/eduGemini/profile/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["classworkInfo"] });
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    }
  }

  const handleReset = () =>
    setUpdateInfo({
      user_email: "",
      user_username: "",
      user_password: "",
      confirm_password: "",
    });

  const handleChange = (e) =>
    setUpdateInfo({ ...updateInfo, [e.target.name]: e.target.value });
  const onSuccess = (data) => {
    handleReset();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
  const onError = (error) => {
    handleReset();
  };

  const { data } = useGetUser({ onError, onSuccess });

  const profile = data?.map((user) => `${user.profile.downloadUrl}`);

  const handleImgSrc = () => {
    try {
      return user_profile ? URL.createObjectURL(user_profile) : profile;
    } catch (error) {
      return profile;
    }
  };

  const { mutateAsync, isError, isPending, isLoading, isSuccess, error } =
    useUpdateUser({
      mutationFn: () => handleUpload(),
      onSuccess,
      onError,
    });
  return (
    <div className="border-l-4 border-slate-500  p-5 shadow-md rounded mt-5">
      <h1 className="text-lg font-bold italic flex flex-col gap-2 mb-5 md:flex-row">
        <UserCircle2Icon />
        Update Account Information
      </h1>
      <p className="pb-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia placeat
        soluta debitis aut totam tenetur assumenda optio est. Odio, tempora?
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <Avatar className="h-20 w-20 object-contain border-2 border-slate-900 relative">
            <AvatarImage src={handleImgSrc()} />
            <AvatarFallback></AvatarFallback>
            <label
              htmlFor="file-upload"
              className="custom-file-upload absolute bottom-1 right-1 z-50"
            >
              <Pen className="rotate-1" />

              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setUserProfile(e.target.files[0])}
              />
            </label>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2 my-3 md:flex-row">
          <div className="w-full md:w-2/4">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              <MailCheck />
              New Email
            </Label>
            <Input
              type="text"
              name="user_email"
              value={user_email}
              onChange={handleChange}
              placeholder="Enter new email"
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
          <div className="w-full md:w-2/4">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              <UserCheck />
              New Username
            </Label>
            <Input
              type="text"
              name="user_username"
              value={user_username}
              onChange={handleChange}
              placeholder="Enter new username"
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
        </div>
        <div className="flex gap-2 my-3 flex-col md:flex-row">
          <div className="w-full md:w-2/4">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              <LockIcon />
              New Password
            </Label>
            <Input
              type="password"
              name="user_password"
              value={user_password}
              onChange={handleChange}
              placeholder="Enter new password"
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
          <div className="w-full md:w-2/4">
            <Label className="font-bold italic flex items-center gap-2 mb-2">
              <LockKeyholeOpen />
              Confirm Password
            </Label>
            <Input
              type="password"
              name="confirm_password"
              value={confirm_password}
              onChange={handleChange}
              placeholder="Enter password to confirm"
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
        </div>
        <Button
          type="submit"
          className="w-full my-3"
          onClick={async () => {
            if (confirm_password !== user_password) {
              toast.error("The password did not match, try again");
              handleReset();
            }
            const formData = {
              user_email,
              user_username,
              user_password,
              user_profile,
            };

            await mutateAsync(formData);
            handleReset();
            setUpdateInfo({
              user_email: "",
              user_username: "",
              user_password: "",
              confirm_password: "",
            });
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

export default UpdateUser;
