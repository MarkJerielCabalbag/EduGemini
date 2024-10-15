import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import UpdateUser from "@/content/UpdateUser";
import GetUser from "@/content/GetUser";
import { useNavigate } from "react-router-dom";
function Settings() {
  const navigate = useNavigate();
  return (
    <div className="h-full container sm:container md:container lg:container">
      <div className="my-5">
        <ArrowLeft onClick={() => navigate("/home")} />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription className="py-5">
            Manage your account settings here. Update your information, change
            your password, or customize your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GetUser />
          <UpdateUser />
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
