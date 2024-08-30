import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetClass, fetchClassData } from "@/api/useApi";
function ClassroomNavigation() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { data: classworks } = useGetClass({
    queryFn: () => fetchClassData(roomId),
  });
  console.log(classworks);
  return (
    <div className="my-5 flex gap-3 z-50">
      <Button
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
