import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetClass, fetchClassData } from "@/api/useApi";
function ClassroomNavigation() {
  const { roomId } = useParams();

  const navigate = useNavigate();
  const {
    data: classworks,
    isLoading,
    isFetching,
    isPending,
  } = useGetClass({
    queryFn: () => fetchClassData(roomId),
  });

  return (
    <div className="my-5 flex gap-3 z-50">
      <Button
        disabled={isLoading || isFetching | isPending}
        className="bg-slate-500"
        onClick={() =>
          navigate(
            `/class/classroom/getCreatedClass/${classworks?.map(
              (details) => details.owner
            )}/${classworks?.map((details) => details._id)}`
          )
        }
      >
        Stream
      </Button>
      <Button
        disabled={isLoading || isFetching | isPending}
        className="bg-slate-500"
        onClick={() =>
          navigate(
            `/class/classroom/getCreatedClass/${classworks?.map(
              (details) => details.owner
            )}/${classworks?.map((details) => details._id)}/classwork`
          )
        }
      >
        Classwork
      </Button>
      <Button
        disabled={isLoading || isFetching | isPending}
        className="bg-slate-500"
        onClick={() =>
          navigate(
            `/class/classroom/getCreatedClass/${classworks?.map(
              (details) => details.owner
            )}/${classworks?.map((details) => details._id)}/people`
          )
        }
      >
        People
      </Button>
      <Button
        disabled={isLoading || isFetching | isPending}
        className="bg-slate-500"
        onClick={() =>
          navigate(
            `/class/classroom/getCreatedClass/${classworks?.map(
              (details) => details.owner
            )}/${classworks?.map((details) => details._id)}/settings`
          )
        }
      >
        Settings
      </Button>
    </div>
  );
}

export default ClassroomNavigation;
