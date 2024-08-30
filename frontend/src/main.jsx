import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Class from "./pages/Class.jsx";
import Enrolled from "./pages/Enrolled.jsx";
import Auth from "./pages/Auth.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import Profile from "./pages/Profile.jsx";
import FileViewer from "./content/classroom/FileViewer.jsx";
import Settings from "./pages/Settings.jsx";
import CreateClass from "./pages/CreateClass.jsx";
import ClassroomDetails from "./content/classroom/ClassroomDetails.jsx";
import Stream from "./content/classroom/Stream.jsx";
import Classwork from "./content/classroom/Classwork.jsx";
import People from "./content/classroom/People.jsx";
import SettingsClassroom from "./content/classroom/Settings.jsx";
import ClassworkView from "./content/classroom/ClassworkView.jsx";
import AdminAuthenticate from "./admin/AdminAuthenticate.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminPendingClassApproval from "./admin/AdminPendingClassApproval.jsx";
import AdminDeclinedClassApproval from "./admin/AdminDeclinedClassApproval.jsx";
import AdminApprovedClassApproval from "./admin/AdminApprovedClassApproval.jsx";
import Classroom from "./content/student/Classroom.jsx";
import ClassroomSubmition from "./content/student/ClassroomSubmition.jsx";
import { useGetUser } from "./api/useApi.jsx";
import Outputs from "./content/student/Outputs.jsx";
const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/admin" element={<AdminAuthenticate />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        <Route
          index={true}
          path="/admin/dashboard/pending"
          element={<AdminPendingClassApproval />}
        />
        <Route
          path="/admin/dashboard/declined"
          element={<AdminDeclinedClassApproval />}
        />
        <Route
          path="/admin/dashboard/approved"
          element={<AdminApprovedClassApproval />}
        />
      </Route>

      <Route index={true} path="/" element={<Auth />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/class/:userId" element={<Class />} />

        <Route
          path="/class/classroom/getCreatedClass/:userId/:roomId"
          element={<ClassroomDetails />}
        >
          <Route
            index={true}
            path="/class/classroom/getCreatedClass/:userId/:roomId"
            element={<Stream statusBtn={"show"} />}
          />

          <Route
            path="/class/classroom/getCreatedClass/:userId/:roomId/classwork"
            element={<Classwork statusBtn={"show"} />}
          ></Route>
          <Route
            path="/class/classroom/getCreatedClass/:userId/:roomId/people"
            element={<People />}
          />
          <Route
            path="/class/classroom/getCreatedClass/:userId/:roomId/settings"
            element={<SettingsClassroom />}
          />
        </Route>

        <Route
          path="/class/classroom/getCreatedClass/viewClasswork/:workId"
          element={<ClassworkView userStatus={"instructor"} />}
        />
        <Route
          path="/class/classroom/announcementFile"
          element={<FileViewer />}
        />

        <Route
          path="/class/classwork/outputs/:roomId/:userId/:workId"
          element={<Outputs />}
        />
        <Route path="/enrolled/:userId" element={<Enrolled />} />
        <Route path="/enrolled/classroom/:wordId" />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/createClass" element={<CreateClass />} />

        <Route
          path="/class/classroom/getCreatedClass/:roomId"
          element={<Classroom />}
        >
          <Route
            index={true}
            path="/class/classroom/getCreatedClass/:roomId"
            element={<Stream statusBtn={"hidden"} />}
          />

          <Route
            path="/class/classroom/getCreatedClass/:roomId/classwork"
            element={<Classwork statusBtn={"hidden"} />}
          ></Route>
          <Route
            path="/class/classroom/getCreatedClass/:roomId/people"
            element={<People />}
          />
          <Route
            path="/class/classroom/getCreatedClass/:roomId/settings"
            element={<SettingsClassroom />}
          />
        </Route>

        <Route
          path="/class/classroom/getCreatedClass/:workId"
          element={<ClassworkView userStatus={"student"} />}
        />

        <Route
          path={`/class/classroom/getCreatedClass/viewClasswork/classwork/:workId/:roomId/:userId`}
          element={<ClassroomSubmition />}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
