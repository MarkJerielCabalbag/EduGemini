import { getUser, useGetUser, useLogout } from "@/api/useApi";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  BrainCircuit,
  Building,
  GraduationCap,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { baseUrl } from "@/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function SheetNavbar({ trigger, visibility }) {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const onSuccess = (data) => {
    toast.success("Success Logout!");
    console.log(data.message);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    localStorage.removeItem("roomId");
    localStorage.removeItem("files");
    navigate("/");
  };

  const onError = (error) => {
    toast.error("There seems to be an error, Try again");
    console.log(error.message);
  };
  const { data, isLoading, isError, isPending, isFetching } = useGetUser({
    queryFn: () => getUser(userId),
    onSuccess,
    onError,
  });

  const { mutateAsync } = useLogout({ onSuccess, onError });
  return (
    <Sheet>
      <SheetTrigger asChild className={visibility}>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-start flex items-center gap-2">
            <BrainCircuit />
            EduGemini
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-5 " />
        <div className="flex flex-col gap-3">
          <Link
            className="flex items-center gap-2 text-opacity-75 text-sm font-semibold"
            to={"/home"}
          >
            <Home className="bg-slate-900 text-white rounded-full p-1" />
            Home
          </Link>
          <Link
            to={`/class/${userId}`}
            className="flex items-center gap-2 text-opacity-75 text-sm font-semibold"
          >
            <Building className="bg-slate-900 text-white rounded-full p-1" />
            Class
          </Link>
          <Link
            to={`/enrolled/${userId}`}
            className="flex items-center gap-2 text-opacity-75 text-sm font-semibold"
          >
            <GraduationCap className="bg-slate-900 text-white rounded-full p-1" />
            Enrolled
          </Link>

          <Link
            to={"/profile"}
            className="flex items-center gap-2 text-opacity-75 text-sm font-semibold"
          >
            <User className="bg-slate-900 text-white rounded-full p-1" />
            Profile
          </Link>

          <Separator className="my-5 " />

          <div className="flex gap-2 items-center">
            {data?.map((user) => (
              <React.Fragment key={user._id}>
                <Avatar className="border border-slate-900">
                  {isLoading || isFetching || isPending ? (
                    <AvatarFallback>Profile</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage
                        src={`${baseUrl}/${user.user_email}/${user.profile.filename}`}
                      />
                    </>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  {isLoading ? (
                    <Skeleton className="w-[100px] h-[20px] rounded bg-slate-500" />
                  ) : (
                    <p className="text-sm">
                      {isLoading || isPending || isFetching ? (
                        <Skeleton className="h-[20px] w-[100px]" />
                      ) : (
                        user.user_username
                      )}
                    </p>
                  )}

                  {isLoading ? (
                    <Skeleton className="w-[100px] h-[20px] rounded bg-slate-500" />
                  ) : (
                    <p className="text-sm italic opacity-75">
                      {isLoading || isPending || isFetching ? (
                        <Skeleton className="h-[20px] w-[100px]" />
                      ) : (
                        user.user_email
                      )}
                    </p>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>

          <Button
            onClick={async () => await mutateAsync()}
            className="flex gap-2 items-center"
          >
            Log-out
            <LogOut size={20} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
