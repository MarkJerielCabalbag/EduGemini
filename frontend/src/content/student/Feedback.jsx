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
    <div className="h-full">
      {data?.map((feedbacks) => (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-sm md:text-md">EduGemini Feedback</h1>
            <p className="font-bold text-sm md:text-md">
              Score: {!feedbacks.score ? 0 : feedbacks.score}
            </p>
          </div>

          {!feedbacks.studentFeedback ? (
            <div className="flex flex-col items-center gap-5 text-xs leading-6 my-5 md:text-md">
              <img src={ai} className="w-48 h-20" />
              <div>
                <div className="flex items-center justify-center gap-2">
                  <Info />
                  <p className="font-extrabold">No Data</p>
                </div>
                <p className="italic opacity-65 text-center">
                  After clicking 'Turn In', please allow about{" "}
                  <span className="font-bold">1 minute</span> for your
                  <span className="font-bold"> feedback and score</span> to be
                  generated. This ensures that your submission is thoroughly{" "}
                  <span className="font-bold">analyzed for accuracy</span>.
                </p>
              </div>
            </div>
          ) : (
            <>
              <pre className="w-full h-full  text-pretty text-justify opacity-80 leading-9">
                {feedbacks.studentFeedback}
              </pre>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feedback;
