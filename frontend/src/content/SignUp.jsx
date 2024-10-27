import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/api/useApi";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

function SignUp() {
  const [user, setUser] = useState({
    user_email: "",
    user_username: "",
    user_password: "",
  });

  const onSuccess = (data) => {
    setUser({
      user_email: "",
      user_username: "",
      user_password: "",
    });
    toast.success(data.message);
  };
  const onError = (error) => {
    setUser({
      user_email: "",
      user_username: "",
      user_password: "",
    });
    toast.error(error.message);
  };

  const { user_email, user_username, user_password } = user;

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });
  const { mutateAsync, isLoading, isError, isPending, error } = useRegister({
    onSuccess,
    onError,
  });

  return (
    <>
      <h1 className="mt-5 mb-2 text-xl font-bold text-center">Join Us!</h1>
      <Separator className="my-5" />
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-2 w-full my-5">
          <div className=" w-2/4">
            <Label
              htmlFor="user_email"
              className="font-bold italic flex items-center gap-2 mb-2"
            >
              <Mail /> Email
            </Label>
            <Input
              type="email"
              name="user_email"
              value={user_email}
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
          <div className=" w-2/4">
            <Label
              htmlFor="user_name"
              className="font-bold italic flex items-center gap-2 mb-2"
            >
              <User /> Username
            </Label>
            <Input
              type="text"
              name="user_username"
              value={user_username}
              onChange={handleChange}
              placeholder="Your Username"
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
        <div className="my-5">
          <Label
            htmlFor="user_password"
            className="font-bold italic flex items-center gap-2 mb-2"
          >
            <Lock /> Password
          </Label>
          <Input
            type="password"
            name="user_password"
            value={user_password}
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
          type="submit"
          onClick={async () => {
            try {
              const formData = {
                user_email,
                user_password,
                user_username,
              };
              await mutateAsync(formData);

              console.log("success");
            } catch (error) {
              console.log("Error", error);
            }
          }}
          className="bg-primary w-full"
        >
          {isLoading || isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </>
  );
}

export default SignUp;
