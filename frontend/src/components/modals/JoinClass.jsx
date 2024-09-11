import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";
import { useGetAllClass, useGetUser, useJoinClass } from "@/api/useApi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Info, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

function JoinClass({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [student, setStudent] = useState({
    user_email: "",
    user_username: "",
    user_lastname: "",
    user_firstname: "",
    user_middlename: "",

    class_code: "",
    _id: "",
  });
  const [user_gender, setSelectGender] = useState(null);
  const {
    user_email,
    user_username,
    user_firstname,
    user_middlename,
    user_lastname,

    class_code,
    _id,
  } = student;
  const handleChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });
  const onError = (error) => {
    console.log(error.message);
  };
  const onSuccess = (data) => {
    toast.success(data.success);
    setStudent({
      user_email: "",
      user_username: "",
      user_lastname: "",
      user_firstname: "",
      user_middlename: "",
      class_code: "",
      _id: "",
    });

    queryClient.invalidateQueries({ queryKey: ["allClassroom"] });
  };
  const { data } = useGetUser({
    onError,
    onSuccess,
  });
  const { mutateAsync, isError, isLoading, isPending } = useJoinClass({
    onError,
    onSuccess,
  });

  return (
    <>
      {data?.map((user) => (
        <ReusableModal
          open={open}
          onOpenChange={onOpenChange}
          alertDialogTitle={"Join Class"}
          alertDialogDescription={
            <div className="h-[300px] overflow-y-scroll">
              <div className="bg-primary  p-5 shadow-md rounded mt-5">
                <div className="flex items-center gap-3">
                  {user.profile_path && (
                    <img
                      className="h-14 w-14 rounded-full border-2 border-white"
                      src={`http://localhost:3000/${user.profile_path}/${user.profile.filename}`}
                    />
                  )}
                  <div>
                    <h1 className="font-extrabold text-white">
                      {user.user_username}
                    </h1>
                    <p className="italic text-slate-400">{user.user_email}</p>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-slate-500  p-5 shadow-md rounded mt-5">
                <p className="pb-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                  placeat soluta debitis aut totam tenetur assumenda optio est.
                  Odio, tempora?
                </p>

                <div className="flex gap-2">
                  <div className="w-2/4">
                    <Label>Last Name</Label>
                    <Input
                      name="user_lastname"
                      value={user_lastname}
                      onChange={handleChange}
                      placeholder="Enter Lastname"
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

                  <div className="w-2/4">
                    <Label>First Name</Label>
                    <Input
                      name="user_firstname"
                      value={user_firstname}
                      onChange={handleChange}
                      placeholder="Enter Firstname"
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

                <div className="my-2">
                  <Label>Middle Name</Label>
                  <Input
                    name="user_middlename"
                    value={user_middlename}
                    onChange={handleChange}
                    placeholder="Enter Middlename"
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

                <Label>Gender</Label>
                <Select
                  className="my-2"
                  onValueChange={(value) => setSelectGender(value)}
                >
                  <SelectTrigger
                    className={`${isError ? "border-red-500" : ""} my-2`}
                  >
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
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
                </Select>

                <div>
                  <Label>Class Code</Label>
                  <Input
                    name="class_code"
                    value={class_code}
                    onChange={handleChange}
                    placeholder="Enter Classcode"
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
            </div>
          }
          alertDialogFooter={
            <>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
              <Button
                onClick={async () => {
                  try {
                    await mutateAsync({
                      _id: user._id,
                      user_username: user.user_username,
                      user_email: user.user_email,
                      user_profile_path: user.profile_path,
                      user_img: user.profile.filename,
                      user_firstname: user_firstname,
                      user_middlename: user_middlename,
                      user_lastname: user_lastname,
                      user_gender: user_gender,
                      class_code: class_code,
                    });
                    onOpenChange(false);
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              >
                {isLoading || isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Join"
                )}
              </Button>
            </>
          }
        />
      ))}
    </>
  );
}

export default JoinClass;
