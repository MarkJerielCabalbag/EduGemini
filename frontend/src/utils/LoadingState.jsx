import { Loader2Icon } from "lucide-react";
import loading from "../assets/loading.png";
function LoadingState({ className }) {
  return (
    <div className={className}>
      <img src={loading} style={{ width: "200px" }} />

      <h1 className="flex flex-col items-center">
        Loading please wait patiently....
        <Loader2Icon className="animate-spin" />
      </h1>
    </div>
  );
}

export default LoadingState;
