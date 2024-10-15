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
    <div className="h-screen container sm:container md:container lg:container">
      <div className="my-5">
        <ArrowLeft onClick={() => navigate("/home")} />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription className="py-5">
            Your user profile is the key to a personalized experience.
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
