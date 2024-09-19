import { getAttachments, useGetAttachments } from "@/api/useApi";
import LoadingState from "@/utils/LoadingState";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ai from "../../assets/ai.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
const Feedback = () => {
  const { workId, roomId, userId } = useParams();
  const queryCleint = useQueryClient();
  const onError = () => console.log("error");
  const onSuccess = (data) => {
    toast.success(data.message);
    queryCleint.invalidateQueries({ queryKey: ["attachments"] });
    queryCleint.invalidateQueries({ queryKey: ["classwork"] });
  };
  const { data, isLoading, isPending, isFetching } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, userId),
    onError,
    onSuccess,
    refetchInterval: 60000,
  });
  return (
    <div>
      {data?.map((feedbacks) => (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">EduGemini Feedback</h1>
            <p>{!feedbacks.score ? "No Score Available" : feedbacks.score}</p>
          </div>
          <p className="opacity-70 italic mb-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            distinctio reprehenderit id corrupti, vel velit quae libero eligendi
            obcaecati pariatur?
          </p>
          {!feedbacks.feedback ? (
            <>
              <div className="flex flex-col gap-5">
                <img src={ai} className="w-1/2 h-1/2" />
                <div>
                  <div className="flex items-center gap-2">
                    <Info />
                    <p className="font-extrabold">No Data</p>
                  </div>
                  <p className="italic opacity-65">
                    After clicking 'Turn In', please allow about{" "}
                    <span className="font-bold">1 minute</span> for your
                    <span className="font-bold"> feedback and score</span> to be
                    generated. This ensures that your submission is thoroughly{" "}
                    <span className="font-bold">analyzed for accuracy</span>.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-pretty text-justify opacity-80 leading-9">
                {feedbacks.feedback}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feedback;
