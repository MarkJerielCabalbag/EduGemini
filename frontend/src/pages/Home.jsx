import MenuBar from "@/content/MenuBar";

import { Button } from "@/components/ui/button";
import {
  BookMarked,
  BrainCircuit,
  GraduationCap,
  KeyRound,
  NotebookPen,
  Send,
} from "lucide-react";
import { useState } from "react";
import CreateClass from "@/components/modals/CreateClass";
import JoinClass from "@/components/modals/JoinClass";

function Home() {
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [openJoinClassModal, setOpenJoinClassModal] = useState(false);

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
      <MenuBar />

      <div className="flex flex-col">
        <div className="text-center my-20">
          <div className="flex flex-col items-center justify-center font-semibold italic">
            <BrainCircuit size={100} />

            <h1 className="text-[40px]">EduGemini</h1>
          </div>
          <h1 className="font-extrabold flex flex-col text-2xl my-3 md:text-4xl">
            EduGemini: AI Assisted Classroom Management
            <p className="italic opacity-70 text-sm md:text-2xl text-center px-5">
              Empowering Educators: Unleashing Student Potential with eduGemini!
            </p>
          </h1>

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
          EduGemini is more than just a classroom management tool; it’s a
          partner in education. By integrating advanced AI technology, we aim to
          create a more engaging, efficient, and personalized learning
          experience for everyone involved.
        </p>

        <div className="w-full border-l-4 border-slate-500 p-5 shadow-sm shadow-slate-900 rounded mt-5 flex flex-col gap-5">
          <h1 className="font-extrabold text-sm flex items-center gap-3 md:text-2xl">
            <KeyRound size={20} className=" text-slate-900" />
            Key Feature's
          </h1>
          <ul>
            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">AI-Powered Feedback: </span>
              Our advanced AI analyzes student submissions to provide detailed
              feedback on grammar, structure, and content, helping students
              improve their skills continuously. analysis.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Teacher Feedback: </span>
              Based on student output, teachers receive insights on how their
              teaching methods have impacted student performance, allowing them
              to adjust and improve their instructional strategies.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Export Overall Score: </span>
              Easily export overall classroom scores and individual student
              performance data for record-keeping, reporting, or further
              analysis.
            </li>
          </ul>
        </div>

        <div className="w-full border-l-4 border-slate-500 p-5 shadow-sm shadow-slate-900 rounded mt-5 flex flex-col gap-5">
          <h1 className="font-extrabold text-sm flex items-center gap-3 md:text-2xl">
            <NotebookPen size={25} className=" text-slate-900" />
            How to create a Classwork
          </h1>
          <ul>
            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Title: </span>
              Enter a descriptive title for the classwork.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Classwork Type: </span>
              Select or create a custom classwork type (e.g., assignment,
              programming, project).
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Description (optional): </span>
              Provide a detailed description of the classwork, including
              objectives and expectations. analysis.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Due Date and Time: </span>
              Set the due date and time for the classwork submission.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Instruction File: </span>
              Upload the instruction file. Supported formats include DOCX, PNG,
              PDF, and JPEG
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Create: </span>
              Click the “Create” button to finalize and publish the classwork.
            </li>
          </ul>
        </div>

        <div className="w-full border-l-4 border-slate-500 p-5 shadow-sm shadow-slate-900 rounded mt-5 flex flex-col gap-5">
          <h1 className="font-extrabold text-sm flex items-center gap-3 md:text-2xl">
            <Send size={25} className=" text-slate-900" />
            Submitting Classwork
          </h1>
          <ul>
            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">View Classwork: </span>
              Go to the “Classwork” section to see all assigned tasks.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Select Classwork: </span>
              Click on the specific classwork you need to submit.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Upload Submission: </span>
              <li className="list-disc text-xs indent-1 md:text-md italic">
                <span className="font-extrabold">Documents: </span>
                .docx, .pdf, .xlsx, .pptx
              </li>

              <li className="list-disc text-xs indent-1 md:text-md italic">
                <span className="font-extrabold">Code Files: </span>
                .html, .css, .js, .php, .dart, .py, .c, .cpp, .cs, .swift, .rs,
                .go, .ru, .r, .sql, .java
              </li>

              <li className="list-disc text-xs indent-1 md:text-md italic">
                <span className="font-extrabold">Images: </span>
                image/png, image/jpg
              </li>
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Due Date and Time: </span>
              Set the due date and time for the classwork submission.
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Instruction File: </span>
              Upload the instruction file. Supported formats include DOCX, PNG,
              PDF, and JPEG
            </li>

            <li className="list-disc text-xs md:text-md italic">
              <span className="font-extrabold">Create: </span>
              Click the “Create” button to finalize and publish the classwork.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
