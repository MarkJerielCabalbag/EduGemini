import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Settings, Share } from "lucide-react";
import { useLogout, useGetUser, getUser } from "@/api/useApi";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { baseUrl } from "@/baseUrl";
import { useState } from "react";
import CreateClass from "@/components/modals/CreateClass";
import JoinClass from "@/components/modals/JoinClass";
import { Button } from "@/components/ui/button";
import React from "react";
function MenuBar() {
  const navigate = useNavigate();
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [openJoinClassModal, setJoinClassModal] = useState(false);
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
  const { data, isLoading, isError } = useGetUser({
    queryFn: () => getUser(userId),
    onSuccess,
    onError,
  });

  const userId = localStorage.getItem("userId");

  const { mutateAsync } = useLogout({ onSuccess, onError });
  return (
    <div className="w-full flex justify-center mt-4">
      {openCreateClassModal && (
        <CreateClass
          open={openCreateClassModal}
          onOpenChange={setOpenCreateClassModal}
        />
      )}
      {openJoinClassModal && (
        <JoinClass open={openJoinClassModal} onOpenChange={setJoinClassModal} />
      )}
      <Menubar className="shadow-lg flex justify-center">
        <MenubarMenu>
          <Button variant={"ghost"} onClick={() => navigate("/home")}>
            Home
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => navigate(`/class/${userId}`)}
          >
            Class
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => navigate(`/enrolled/${userId}`)}
          >
            Enrolled
          </Button>

          <MenubarTrigger variant={"ghost"}>
            Profile
            <MenubarContent>
              <MenubarItem
                className="flex justify-between items-center"
                onClick={() => setOpenCreateClassModal(true)}
              >
                Create Class
                <PlusCircle
                  size={25}
                  className="bg-black text-white p-1 rounded"
                />
              </MenubarItem>
              <MenubarItem
                className="flex justify-between items-center"
                onClick={() => setJoinClassModal(true)}
              >
                Join Class
                <Share size={25} className="bg-black text-white p-1 rounded" />
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                className="flex justify-between items-center"
                onClick={() => navigate("/settings")}
              >
                Settings{" "}
                <Settings
                  size={25}
                  className="bg-black text-white p-1 rounded"
                />
              </MenubarItem>
              <MenubarItem
                onClick={async () => await mutateAsync()}
                className="flex justify-between items-center"
              >
                Log Out{" "}
                <LogOut size={25} className="bg-black text-white p-1 rounded" />
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                className="flex flex-row-reverse gap-4"
                onClick={() => navigate("/profile")}
              >
                {data?.map((user) => (
                  <React.Fragment key={user._id}>
                    <Avatar>
                      {isLoading ? (
                        <AvatarFallback>Profile</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage
                            src={`${baseUrl}/${user.user_email}/${user.profile.filename}`}
                          />
                        </>
                      )}
                      <AvatarFallback>Profile</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      {isLoading ? (
                        <Skeleton className="w-[100px] h-[20px] rounded bg-slate-500" />
                      ) : (
                        <p className="text-sm">{user.user_username}</p>
                      )}

                      {isLoading ? (
                        <Skeleton className="w-[100px] h-[20px] rounded bg-slate-500" />
                      ) : (
                        <p className="text-sm italic opacity-75">
                          {user.user_email}
                        </p>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </MenubarItem>
            </MenubarContent>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default MenuBar;
