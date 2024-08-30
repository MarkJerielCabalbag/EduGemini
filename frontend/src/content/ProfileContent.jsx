import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import avatar from "../assets/R.png";

function ProfileContent({ user_username, user_email }) {
  return (
    <>
      <div className="flex gap-2 items-center my-5">
        <Avatar>
          <AvatarImage src={avatar} className="w-10 h-10" />
        </Avatar>
        <div>
          <p>{user_username}</p>
          <p>{user_email}</p>
        </div>
      </div>
    </>
  );
}

export default ProfileContent;
