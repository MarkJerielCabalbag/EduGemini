import MenuBar from "@/content/MenuBar";

import { Button } from "@/components/ui/button";
import { BookMarked, GraduationCap } from "lucide-react";
import { useState } from "react";
import CreateClass from "@/components/modals/CreateClass";
import JoinClass from "@/components/modals/JoinClass";

function Home() {
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [openJoinClassModal, setOpenJoinClassModal] = useState(false);

  return (
    <>
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
      <div className="container sm:container md:container lg:container h-screen w-screen">
        <div className="h-full w-full flex flex-col items-center">
          <div className="text-center my-20">
            <p>Basta logo dituy</p>
            <h1 className="font-extrabold text-2xl my-3 md:text-4xl">
              EduGemini: AI Assisted Classroom Management
            </h1>
            <p className="italic opacity-70 text-sm md:text-md text-center px-5">
              “Empowering Educators: Unleashing Student Potential with
              eduGemini!”
            </p>
            <p className="italic opacity-70 text-sm md:text-md text-center px-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
              ratione soluta impedit nostrum eius repellendus eaque temporibus
              quae saepe laboriosam.
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
          <h1 className="text-right italic text-slate-600 font-extrabold text-2xl my-3 md:text-4xl">
            Why use EduGemini?
          </h1>
          <p className="italic opacity-70 text-sm md:text-md text-center p-5">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
            similique assumenda aspernatur beatae quibusdam fugiat repellendus
            architecto. Non obcaecati optio laudantium, aut numquam repudiandae
            odit natus! Sed earum commodi illo.
          </p>
          <div className="grid grid-cols-1 gap-3 my-5 mx-5 md:grid-cols-3">
            <div className="p-5 bg-slate-900 text-white rounded-sm">
              <h1 className="font-bold">
                Lorem ipsum dolor sit amet consectetur.
              </h1>
              <p className="italic opacity-70 text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo
                fugiat, porro illo aspernatur doloribus atque laudantium hic
              </p>
            </div>
            <div className="p-5 bg-slate-900 text-white rounded-sm">
              <h1 className="font-bold">
                Lorem ipsum dolor sit amet consectetur.
              </h1>
              <p className="italic opacity-70 text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo
                fugiat, porro illo aspernatur doloribus atque laudantium hic
              </p>
            </div>
            <div className="p-5 bg-slate-900 text-white rounded-sm">
              <h1 className="font-bold">
                Lorem ipsum dolor sit amet consectetur.
              </h1>
              <p className="italic opacity-70 text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo
                fugiat, porro illo aspernatur doloribus atque laudantium hic
              </p>
            </div>
          </div>
          <div className="w-full border-l-4 border-slate-500  p-5 shadow-md rounded mt-5">
            <h1 className="font-bold text-slate-900">Guides</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
