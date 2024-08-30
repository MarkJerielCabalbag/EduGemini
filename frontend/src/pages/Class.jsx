import Navbar from "../content/Navbar";
import MenuBar from "@/content/MenuBar";
import classImage from "../assets/class.png";
import { fetchAllClassData, useGetAllClass, useGetUser } from "@/api/useApi";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

import LoadingState from "@/utils/LoadingState";
import noData from "../assets/noData.png";
import { Button } from "@/components/ui/button";
function Class() {
  const onSuccess = () => console.log("success");
  const onError = () => console.log("error");

  const userId = localStorage.getItem("userId");
  const {
    data: classData,
    isLoading,
    isError,
    isPending,
    isLoadingError,
    isFetching,
  } = useGetAllClass({
    queryFn: () => fetchAllClassData(userId),
    onError,
    onSuccess,
  });
  console.log(classData);

  return (
    <>
      {isFetching ? (
        <LoadingState
          className={"h-screen w-screen flex flex-col items-center"}
        />
      ) : (
        <div className="container sm:container md:container lg:container">
          <MenuBar />
          {classData?.length === 0 ? (
            <div className="h-screen flex flex-col justify-center items-center">
              <img src={noData} style={{ width: "300px" }} />
              <p className="my-2">You currently have no class</p>
              <Link
                className="bg-slate-900 text-white p-3 rounded flex items-center gap-2"
                to={"/createClass"}
              >
                <Plus />
                Create your own class now
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
              {classData?.map((classroom) => (
                <>
                  {classroom.approvalStatus === "pending" ||
                  classroom.approvalStatus === "declined" ? (
                    <>
                      <Card key={classroom._id} className="shadow-lg rounded">
                        <CardHeader className="relative">
                          <CardTitle>
                            <h1>{classroom.classname}</h1>
                          </CardTitle>
                          <CardDescription>
                            <p>{classroom.subject}</p>
                            {classroom.approvalStatus === "pending" ||
                            classroom.approvalStatus === "declined" ? (
                              <span
                                className={`inline-flex items-center absolute top-2 right-2  rounded-md ${
                                  classroom.approvalStatus === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                } px-2 py-1 text-xs font-medium text-slate-950 ring-1 ring-inset ring-gray-500/10`}
                              >
                                {classroom.approvalStatus}
                              </span>
                            ) : null}
                          </CardDescription>
                          <img
                            src={classImage}
                            className="absolute top-0 right-0 z-0 w-1/2 h-1/2 object-cover"
                          />
                        </CardHeader>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/class/classroom/getCreatedClass/${classroom.owner}/${classroom._id}`}
                        onClick={() => {
                          const room = classroom._id;
                          const userId = classroom.owner;

                          localStorage.setItem("roomId", room);
                        }}
                      >
                        <Card key={classroom._id} className="shadow-lg rounded">
                          <CardHeader className="relative">
                            <CardTitle>
                              <h1>{classroom.classname}</h1>
                            </CardTitle>
                            <CardDescription>
                              <p>{classroom.subject}</p>
                              <span className="inline-flex items-center absolute top-2 right-2  rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-gray-500/10">
                                {classroom.approvalStatus}
                              </span>
                            </CardDescription>
                            <img
                              src={classImage}
                              className="absolute top-0 right-0 z-0 w-1/2 h-1/2 object-cover"
                            />
                          </CardHeader>
                        </Card>
                      </Link>
                    </>
                  )}
                </>
              ))}
            </div>
          )}

          <Navbar />
        </div>
      )}
    </>
  );
}

export default Class;
