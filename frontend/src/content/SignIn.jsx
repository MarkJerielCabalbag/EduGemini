import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, LoaderCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/api/useApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

function SignIn() {
  const [user, setUser] = useState({
    user_email: "",
    user_password: "",
  });
  const userInfo = localStorage.getItem("userInfo");

  const navigate = useNavigate();

  const { user_password, user_email } = user;

  const handleInputChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSuccess = (data) => {
    toast.success(data.message);
    navigate("/home");
    localStorage.setItem("userId", data._id);
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser({
      user_email: "",
      user_password: "",
    });

    console.log("Success");
  };

  const onError = (error) => {
    toast.error(error.message);
    console.log("Error");
    setUser({
      user_email: "",
      user_password: "",
    });
  };

  const { mutateAsync, isError, isPending, isSuccess, isLoading, data, error } =
    useLogin({
      onSuccess,
      onError,
    });

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <>
      <h1 className="mt-5 mb-2 text-xl font-bold text-center">Welcome Back!</h1>
      <Separator className="my-5" />
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="my-5">
          <Label
            htmlFor="user_email"
            className="font-bold italic flex items-center gap-2 mb-2"
          >
            <Mail /> Email
          </Label>
          <Input
            type="text"
            name="user_email"
            value={user_email}
            onChange={handleInputChange}
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
            <Lock /> Password
          </Label>
          <Input
            type="password"
            name="user_password"
            value={user_password}
            onChange={handleInputChange}
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
                user_email,
                user_password,
              };

              await mutateAsync(formData);
            } catch (error) {
              console.log("Error", error);
            }
          }}
        >
          {isLoading || isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </>
  );
}

export default SignIn;
