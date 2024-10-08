import { getClassworks, useGetClasswork, useGetUser } from "@/api/useApi";
import noData from "../../assets/noData.png";
import LoadingState from "@/utils/LoadingState";
import { FileArchiveIcon } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
function CreateClasswork({ statusBtn, cardStatus }) {
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const onError = (error) => {
    toast.error(error.message);
  };
  const onSuccess = (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["classworks"] });
  };
  const { data, isFetching, isLoading, isPending } = useGetClasswork({
    queryFn: () => getClassworks(roomId),
    onError,
    onSuccess,
  });

  const userId = localStorage.getItem("userId");

  return (
    <>
      {isFetching || isLoading || isPending ? (
        <LoadingState
          className={
            "h-screen w-full flex flex-col items-center justify-center"
          }
        />
      ) : (
        <>
          {data?.length === 0 ? (
            <div className="flex flex-col items-center h-screen">
              <img src={noData} className="w-1/4" />
              <p>No classwork yet </p>
            </div>
          ) : (
            <div className={cardStatus}>
              {data?.map((classwork) => (
                <>
                  <Link
                    key={classwork._id}
                    className="bg-slate-900 text-white p-5 rounded text-right relative hover:bg-slate-800 shadow-lg text-primary"
                    to={`${
                      statusBtn === "hidden"
                        ? `/class/classroom/getCreatedClass/viewClasswork/classwork/${classwork._id}/${roomId}/${userId}`
                        : `/class/classroom/getCreatedClass/viewClasswork/${classwork._id}`
                    }`}
                  >
                    {classwork.classwork_title}
                    <span className="inline-flex items-center absolute top-2 left-2  rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {classwork.classwork_type}
                    </span>

                    <FileArchiveIcon
                      className="absolute top-0 right-20 rotate-12 opacity-25 "
                      size={60}
                    />
                  </Link>
                </>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default CreateClasswork;
