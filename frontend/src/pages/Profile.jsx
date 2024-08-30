import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import GetUser from "@/content/GetUser";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  return (
    <div className="container sm:container md:container">
      <div className="my-5">
        <ArrowLeft onClick={() => navigate("/home")} />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription className="py-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit
            fugiat, nihil asperiores repudiandae quia repellat reiciendis,
            similique obcaecati temporibus modi voluptas dolorum dolorem unde
            quam? Blanditiis, voluptate dicta. A, in?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GetUser />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

export default Profile;
