import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit } from "lucide-react";

import SignIn from "../content/SignIn";
import SignUp from "../content/SignUp";

function Auth() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center my-28 p-5 md:my-0">
      <div className="text-center">
        <h1 className="flex gap-2 items-center justify-center italic font-bold sm:text-md md:text-2xl lg:text-2xl">
          <BrainCircuit />
          eduGemini
        </h1>
        <p className="font-bold my-3 sm:text-md md:text-2xl lg:text-2xl">
          Empowering Educators: Unleashing Student Potential with eduGemini!
        </p>
        <p className="opacity-75 mb-3 sm:text-xs md:text-sm lg:text-md">
          Discover how eduGemini’s AI-driven insights revolutionize student work
          analysis, personalized feedback, and time-saving efficiency.
        </p>
      </div>

      <Tabs
        defaultValue="signin"
        className="bg-white shadow-2xl p-5 rounded-sm sm:w-full md:w-1/2 lg:w-4/12"
      >
        <TabsList className="w-full">
          <TabsTrigger value="signin" className="w-2/4">
            Sign in
          </TabsTrigger>
          <TabsTrigger value="signup" className="w-2/4">
            Sign up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignIn />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
