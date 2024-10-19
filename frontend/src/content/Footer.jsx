import React from "react";
import { BrainCircuit } from "lucide-react";

import ispsc from "../assets/ispsc.png";
import css from "../assets/css (2).png";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@radix-ui/react-menubar";

const Footer = () => {
  return (
    <>
      <div className=" bg-slate-800 text-white py-20">
        <div className="container sm:container md:container lg:container">
          <div className="container">
            <h1 className="flex gap-2 items-center justify-center font-bold">
              <BrainCircuit />
              EduGemini
            </h1>
            <p className="my-5" />
            <p className="text-sm opacity-70 italic text-center">
              EduGemini is a cutting-edge classroom management tool designed to
              enhance the educational experience for both students and teachers.
              Leveraging the power of Gemini AI, EduGemini provides real-time,
              personalized feedback on student assignments and teacher
              evaluations, making the learning process more efficient and
            </p>
          </div>
          <Separator className="my-10" />
          <div className="flex flex-col items-center justify-evenly md:flex-row">
            <div className="flex justify-start lg:justify-center">
              <HoverCard>
                <HoverCardTrigger>
                  <img src={css} className="h-28 w-28" />
                </HoverCardTrigger>
                <HoverCardContent className="flex gap-2 items-center w-full">
                  <img src={css} className="h-20 w-20" />
                  <div className="font-semibold">
                    <h1>College of Computing Studies</h1>
                    <p>ISPSC Sta. Maria Campus</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex justify-start lg:justify-center">
              <HoverCard>
                <HoverCardTrigger>
                  <BrainCircuit className="h-32 w-32" />
                </HoverCardTrigger>
                <HoverCardContent className="flex gap-2 items-center w-full">
                  <BrainCircuit className="h-20 w-20" />
                  <div className="font-semibold">
                    <h1>EduGemini</h1>
                    <p className="italic opacity-5">mjc</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex justify-start lg:justify-center border-none lg:border-r-2 border-l-2 border-slate-600">
              <HoverCard>
                <HoverCardTrigger>
                  <img src={ispsc} className="h-36 w-36" />
                </HoverCardTrigger>
                <HoverCardContent className="flex gap-2 items-center w-full">
                  <img src={ispsc} className="h-36 w-36" />
                  <div className="font-semibold">
                    <h1>Ilocos Sur Polytechnic State College</h1>
                    <p>Sta. Maria Campus</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 italic text-white py-3">
        <div className=" flex justify-between container sm:container md:container lg:container">
          <p>&copy; {new Date().getFullYear()} EduGemini All Rights Reserved</p>
          <p className="italic opacity-15">mjc</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
