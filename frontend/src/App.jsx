import React from "react";

import Auth from "./pages/Auth";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Outlet />
      {
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
          }}
        />
      }
    </>
  );
};

export default App;
