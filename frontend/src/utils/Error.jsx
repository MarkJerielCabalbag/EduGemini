import React from "react";
import noData from "../assets/noData.png";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
const Error = ({ refetch, isRefetching }) => {
  return (
    <div className="w-full h-screen ">
      <div className="h-full flex flex-col items-center justify-center">
        <img src={noData} className="h-20 w-20" />
        <h1>An Error Occured Please Try Again Later</h1>
        <Button onClick={() => refetch()}>
          {isRefetching ? <Loader2Icon className="animate-spin" /> : "Refresh"}
        </Button>
      </div>
    </div>
  );
};

export default Error;
