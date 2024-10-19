import { BrainCircuit } from "lucide-react";
import React from "react";
import MenuBar from "./MenuBar";
import { Button } from "@/components/ui/button";

const Header = ({ centerContent, endContent }) => {
  return (
    <div className="py-5">
      <div className="flex justify-between items-center">
        <h1 className="flex gap-2 items-center font-bold">
          <BrainCircuit />
          EduGemini
        </h1>

        <>{endContent}</>
      </div>
    </div>
  );
};

export default Header;
