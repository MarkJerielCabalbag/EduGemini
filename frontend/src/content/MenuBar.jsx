import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/R.png";
import { LogOut, PlusCircle, Settings, Share, UserCircle } from "lucide-react";
import { useLogout, useGetUser } from "@/api/useApi";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

function MenuBar() {
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
  const { data, isLoading, isError } = useGetUser({ onSuccess, onError });
  const userId = data?.map((user) => user._id);
  console.log(userId);
  const { mutateAsync } = useLogout({ onSuccess, onError });
  return (
    <div className="w-full flex justify-center mt-4">
      <Menubar className="shadow-lg w-2/4 flex justify-center">
        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/home">Home</Link>
          </MenubarTrigger>
          <MenubarTrigger>
            <Link to={`/class/${userId}`}>Class</Link>
          </MenubarTrigger>
          <MenubarTrigger>
            <Link to={`/enrolled/${userId}`}>Enrolled</Link>
          </MenubarTrigger>

          <MenubarTrigger>Profile</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              className="flex justify-between items-center"
              onClick={() => navigate("/createClass")}
            >
              Create Class
              <PlusCircle
                size={25}
                className="bg-black text-white p-1 rounded"
              />
            </MenubarItem>
            <MenubarItem className="flex justify-between items-center">
              Join Class
              <Share size={25} className="bg-black text-white p-1 rounded" />
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              className="flex justify-between items-center"
              onClick={() => navigate("/settings")}
            >
              Settings{" "}
              <Settings size={25} className="bg-black text-white p-1 rounded" />
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
                <>
                  <Avatar>
                    {isLoading ? (
                      <AvatarFallback>Profile</AvatarFallback>
                    ) : (
                      <>
                        {user.profile_path && (
                          <AvatarImage
                            src={`https://edugemini.onrender.com/${user.profile_path}/${user.profile.filename}`}
                          />
                        )}
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
                </>
              ))}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default MenuBar;
