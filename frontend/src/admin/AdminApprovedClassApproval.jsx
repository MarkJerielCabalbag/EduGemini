import React from "react";
import { useGetAllClassAdmin } from "@/api/useApi";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/utils/LoadingState";
import { Badge } from "@/components/ui/badge";

function AdminApprovedClassApproval() {
  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");
  const { data, isFetching, isLoading, isPending } = useGetAllClassAdmin({
    onError,
    onSuccess,
  });

  return (
    <div>
      {isFetching || isLoading || isPending ? (
        <LoadingState
          className={"w-screen flex flex-col justify-center items-center"}
        />
      ) : (
        <div className="container sm:container md:container lg:container">
          {data?.length === 0 ? (
            <>no data</>
          ) : (
            <div className="grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
              {data?.map((classess) => (
                <div key={classess._id}>
                  {classess.approvalStatus === "approved" ? (
                    <Card
                      key={classess._id}
                      className="shadow-lg rounded opacity-100"
                    >
                      <CardHeader>
                        <CardTitle>
                          <h1>{classess.subject}</h1>
                        </CardTitle>
                        <CardDescription>
                          <h1>{classess.owner_name}</h1>
                          <p>{classess.owner_email}</p>
                          <Badge className="bg-green-600 my-3">
                            {classess.approvalStatus}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminApprovedClassApproval;
