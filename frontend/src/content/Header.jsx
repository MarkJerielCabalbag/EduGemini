import { BrainCircuit } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="bg-slate-900 text-white py-5">
      <div className="container sm:container md:container lg:container">
        <div className="flex justify-between items-center">
          <h1 className="flex gap-2 items-center">
            <BrainCircuit />
            EduGemini
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
