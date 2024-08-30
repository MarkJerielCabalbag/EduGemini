import { useGetUser } from "@/api/useApi";
import { UserCircle2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function GetUser() {
  const onSuccess = () => console.log("success");
  const onError = () => console.log("error");
  const { data, isLoading, isPending } = useGetUser({ onSuccess, onError });

  return (
    <div className="border-l-4 border-slate-500  p-5 shadow-md rounded">
      {data?.map((user) => (
        <>
          <h1 className="text-lg font-bold italic flex items-center gap-2 mb-5">
            {user.profile_path && (
              <img
                className="h-20 w-20 rounded-full border-2 border-slate-900"
                src={`http://localhost:3000/${user.profile_path}/${user.profile.filename}`}
              />
            )}
            Account Information
          </h1>
          <div>
            <p className="flex justify-between">
              <span className="font-bold">Account ID: </span>
              <span className="font-bold italic">{user._id}</span>
            </p>

            <p className="flex justify-between">
              <span className="font-bold">Username: </span>
              <span className="font-bold italic">{user.user_username}</span>
            </p>

            <p className="flex justify-between">
              <span className="font-bold">Email: </span>
              <span className="font-bold italic">{user.user_email}</span>
            </p>
          </div>
        </>
      ))}
    </div>
  );
}

export default GetUser;
