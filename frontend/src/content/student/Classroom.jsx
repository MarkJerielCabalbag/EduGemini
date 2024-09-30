import React from "react";
import MenuBar from "../MenuBar";
import ClassroomInfo from "../classroom/ClassroomInfo";
import { useNavigate, Outlet, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Classroom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  return (
    <div className="sm:container md:container lg:container">
      <div className="h-screen w-full mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="py-4 bg-primary rounded mx-8 md:mx-0">
          <div className="text-white">
            <ClassroomInfo
              design={
                "bg-slate-900 rounded relative sm:col-span-2 md:h-full lg:h-full"
              }
              hide={"mt-5"}
              link={`/enrolled/${userId}`}
            />
          </div>
        </div>
        <div className="mt-5 md:mt-0 lg:mt-0">
          <div className="px-4 flex flex-col gap-2 md:flex-row">
            <Button
              variant={"link"}
              className="w-full flex justify-start md:w-auto"
              onClick={() =>
                navigate(`/class/classroom/getCreatedClass/${roomId}`)
              }
            >
              Announcements
            </Button>
            <Button
              variant={"link"}
              className="w-full flex justify-start md:w-auto"
              onClick={() =>
                navigate(`/class/classroom/getCreatedClass/${roomId}/classwork`)
              }
            >
              Classworks
            </Button>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Classroom;

// import React from "react";
// import Navbar from "../Navbar";
// import MenuBar from "../MenuBar";
// import ClassroomInfo from "../classroom/ClassroomInfo";
// import { useNavigate, Outlet, useParams } from "react-router-dom";

// import { Button } from "@/components/ui/button";

// function Classroom() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");
//   return (
//     <div className="sm:container md:container lg:container">
//       <Navbar />
//       <MenuBar />

//       <div className="grid grid-cols-2">
//         <div className="">
//           <ClassroomInfo
//             design={"bg-slate-900 rounded-sm col-span-2 p-5 md:p-5"}
//             hide={"mt-5"}
//             link={`/enrolled/${userId}`}
//           />
//         </div>

//         <div className="mx-3">
//           <div className="w-full bg-white flex flex-col md:flex-row">
//             <Button
//               variant={"link"}
//               className="w-full flex justify-start md:w-auto"
//               onClick={() =>
//                 navigate(`/class/classroom/getCreatedClass/${roomId}`)
//               }
//             >
//               Announcements
//             </Button>
//             <Button
//               variant={"link"}
//               className="w-full flex justify-start md:w-auto"
//               onClick={() =>
//                 navigate(`/class/classroom/getCreatedClass/${roomId}/classwork`)
//               }
//             >
//               Classworks
//             </Button>
//           </div>
//         </div>

//         <div className="">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Classroom;
