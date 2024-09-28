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
    <div className="my-5 flex flex-col items-start gap-3 md:flex-row">
      <Button
        variant={"link"}
        disabled={isLoading || isFetching | isPending}
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
        variant={"link"}
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
        variant={"link"}
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
        variant={"link"}
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
