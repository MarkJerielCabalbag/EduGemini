import MenuBar from "@/content/MenuBar";

import { Button } from "@/components/ui/button";
import {
  AlignRight,
  AudioLines,
  BookMarked,
  BookType,
  BrainCircuit,
  BrainCog,
  Calendar,
  Captions,
  FileDown,
  FileUp,
  Film,
  GraduationCap,
  Image,
  NotepadText,
  Pencil,
  UserRoundCheck,
} from "lucide-react";
import React, { useState } from "react";
import CreateClass from "@/components/modals/CreateClass";
import JoinClass from "@/components/modals/JoinClass";

import Header from "@/content/Header";
import { getUser, useGetUser } from "@/api/useApi";

import { useNavigate } from "react-router-dom";
import { SheetNavbar } from "@/content/SheetNavbar";
import {
  audioSupported,
  codeSuppoted,
  documentSupported,
  pictureSupported,
  videoSupported,
} from "@/utils/fileSupported";

function Home() {
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [openJoinClassModal, setOpenJoinClassModal] = useState(false);

  const navigate = useNavigate();
  const onSuccess = () => console.log("success");
  const onError = () => console.log("error");
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isError } = useGetUser({
    queryFn: () => getUser(userId),
    onSuccess,
    onError,
  });

  return (
    <div className="container h-full sm:container md:container lg:container">
      {openCreateClassModal && (
        <CreateClass
          open={openCreateClassModal}
          onOpenChange={setOpenCreateClassModal}
        />
      )}
      {openJoinClassModal && (
        <JoinClass
          open={openJoinClassModal}
          onOpenChange={setOpenJoinClassModal}
        />
      )}

      <Header
        endContent={
          <>
            <div className="hidden lg:block">
              <MenuBar />
            </div>
            <SheetNavbar
              visibility={"block lg:hidden"}
              trigger={
                <Button>
                  <AlignRight />
                </Button>
              }
            />
          </>
        }
      />

      <div className="flex flex-col">
        <div className="text-center my-20">
          <div className="flex flex-col items-center justify-center font-semibold italic">
            <BrainCircuit size={100} />
            <h1 className="text-[40px]">EduGemini</h1>
          </div>

          <h1 className="font-extrabold flex flex-col text-2xl my-3 md:text-4xl">
            EduGemini: AI Assisted Classroom Management
          </h1>
          <span>
            <p className="italic opacity-70 text-sm md:text-2xl text-center px-5">
              Empowering Educators: Unleashing Student Potential with eduGemini!
            </p>
          </span>

          <p className="italic opacity-70 text-sm my-2 md:text-lg text-center px-5">
            EduGemini is a cutting-edge classroom management tool designed to
            enhance the educational experience for both students and teachers.
            Leveraging the power of Gemini AI, EduGemini provides real-time,
            personalized feedback on student assignments and teacher
            evaluations, making the learning process more efficient and
            effective.
          </p>
          <div className="flex flex-col w-full gap-3 my-3 md:flex-row justify-center">
            <Button
              variant="link"
              className="flex gap-2"
              onClick={() => setOpenCreateClassModal(true)}
            >
              <GraduationCap /> Be an Educator
            </Button>
            <Button
              variant="link"
              className="flex gap-2"
              onClick={() => setOpenJoinClassModal(true)}
            >
              <BookMarked /> Be a Student
            </Button>
          </div>
        </div>
        <h1 className="text-center italic text-slate-600 font-extrabold text-2xl my-3 md:text-4xl">
          Why use EduGemini?
        </h1>
        <p className="italic opacity-70 text-sm md:text-lg text-center p-5">
          EduGemini is more than just a classroom management tool; it’s{" "}
          <b>a partner in education.</b> By integrating advanced AI technology,
          we aim to create a more
          <b>
            {" "}
            engaging, efficient, and personalized learning experience for
            everyone involved.
          </b>
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">
              AI-Powered Feedback
            </h1>
            <p className="text-md opacity-90 italic">
              Our advanced AI analyzes student submissions to provide detailed
              feedback on their output by providing constructive feedback making
              sure that every students improves their skills continuously. Based
              on student output, teachers receive insights on how their teaching
              methods have impacted student performance, allowing them to adjust
              and improve their instructional strategies.
            </p>
            <BrainCog
              size={100}
              className="absolute bottom-3 right-3 -rotate-45 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">
              Similarity Index
            </h1>
            <p className="text-md opacity-90 italic">
              Our Similarity Index uses advanced AI to analyze student
              submissions, providing a similarity percentage that helps
              educators easily identify matching content. This tool promotes
              academic integrity and assists in pinpointing areas for
              improvement, streamlining classroom management effectively.
            </p>
            <UserRoundCheck
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">
              Export Overall Score
            </h1>
            <p className="text-md opacity-90 italic">
              Easily export overall classroom scores and individual student
              performance data for record-keeping, reporting, or further
              analysis.
            </p>
            <FileDown
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
        </div>

        <h1 className="mt-36 text-center italic text-slate-600 font-extrabold text-2xl my-3 md:text-4xl">
          Streamlining Classwork Creation with EduGemini
        </h1>
        <p className="italic opacity-70 text-sm md:text-lg text-center p-5">
          EduGemini empowers educators by <b>simplifying the process </b>of
          creating and managing classwork, offering an intuitive platform{" "}
          <b> backed by cutting-edge AI technology.</b> Designed to{" "}
          <b>enhance both teaching and learning experiences</b>, this tool
          provides a <b>streamlined workflow</b> for instructors to efficiently
          set up classwork, allowing for greater focus on student engagement and
          personalized education.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">01</h1>
            <h2 className="text-xl md:2xl font-extrabold">
              Create Classwork Title
            </h2>
            <p className="text-md opacity-90 italic">
              Enter a descriptive title for the classwork.
            </p>
            <Captions
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">02</h1>
            <h2 className="text-xl md:2xl font-extrabold">Classwork Type</h2>
            <p className="text-md opacity-90 italic">
              Select or create a custom classwork type (e.g., assignment,
              programming, project).
            </p>
            <BookType
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">03</h1>
            <h2 className="text-xl md:2xl font-extrabold">
              Description (optional)
            </h2>
            <p className="text-md opacity-90 italic">
              Provide a detailed description of the classwork, including
              objectives and expectations. analysis.
            </p>
            <NotepadText
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-lg font-bold mb-3 md:text-2xl">04</h1>
            <h2 className="text-xl md:2xl font-extrabold">
              Set Due Date and Time
            </h2>
            <p className="text-md opacity-90 italic">
              Set the due date and time for the classwork submission.
            </p>
            <Calendar
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">05</h1>
            <h2 className="text-xl md:2xl font-extrabold">
              Import Instruction file
            </h2>
            <p className="text-md opacity-90 italic">
              Upload the instruction file. Supported formats include DOCX, PNG,
              PDF, and JPEG
            </p>
            <FileUp
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">06</h1>
            <h2 className="text-xl md:2xl font-extrabold">Create</h2>
            <p className="text-md opacity-90 italic">
              Click the “Create” button to finalize and publish the classwork.
            </p>
            <Pencil
              size={100}
              className="absolute bottom-3 right-3 -rotate-45 opacity-30"
            />
          </div>
        </div>

        <h1 className="mt-36 text-center italic text-slate-600 font-extrabold text-2xl my-3 md:text-4xl">
          Submitting Classwork: A Simple Guide
        </h1>
        <p className="italic opacity-70 text-sm md:text-lg text-center p-5">
          Submitting classwork in EduGemini is designed to be intuitive and
          straightforward. By following a few easy steps, students can
          seamlessly upload their assignments across various formats.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">01</h1>
            <h2 className="text-xl md:2xl font-extrabold">View Classwork</h2>
            <p className="text-md opacity-90 italic">
              Go to the “Classwork” section to see all assigned tasks.
            </p>
            <Captions
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">02</h1>
            <h2 className="text-xl md:2xl font-extrabold">Select Classwork</h2>
            <p className="text-md opacity-90 italic">
              Click on the specific classwork you need to submit.
            </p>
            <BookType
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
          <div className="bg-slate-900 text-white text-justify p-5 rounded-sm relative">
            <h1 className="text-md font-bold mb-3 md:text-2xl">03</h1>
            <h2 className="text-xl md:2xl font-extrabold">Upload Submission</h2>
            <div className="text-md opacity-90 italic">
              Make sure the the file is included in supported file formats
            </div>
            <NotepadText
              size={100}
              className="absolute bottom-3 right-3 opacity-30"
            />
          </div>
        </div>
        <h1 className="mt-36 text-center italic text-slate-600 font-extrabold text-2xl my-3 md:text-4xl">
          Supported File Formats
        </h1>

        <p className="italic opacity-70 text-sm md:text-lg text-center p-5">
          Our platform accepts a <b>wide range of file formats</b> to ensure
          <b> flexibility and convenience for students</b>. These options are
          designed to{" "}
          <b>accommodate various types of assignments and projects</b>, making
          it easy for students to <b>upload and share their work seamlessly.</b>
        </p>

        <div className="grid grid-cols-1 gap-10 mb-36 md:grid-cols-5">
          {documentSupported.map((file) => (
            <div key={file._id} className="flex items-center gap-2 ">
              <img src={file.img} className="w-10 h-10" />
              {file.name}
            </div>
          ))}
          {codeSuppoted.map((file) => (
            <div key={file._id} className="flex items-center gap-2 ">
              <img src={file.img} className="w-10 h-10 object-contain" />
              {file.name}
            </div>
          ))}
          {pictureSupported.map((file) => (
            <div key={file._id} className="flex items-center gap-2">
              <Image className="h-10 w-10" />
              {file.name}
            </div>
          ))}

          {videoSupported.map((file) => (
            <div key={file._id} className="flex items-center gap-2">
              <Film className="h-12 w-12" />
              {file.name}
            </div>
          ))}

          {audioSupported.map((file) => (
            <div key={file._id} className="flex items-center gap-2">
              <AudioLines className="h-12 w-12" />
              {file.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
