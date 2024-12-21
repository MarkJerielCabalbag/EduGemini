import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./content/Footer";

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
      <Footer />
    </>
  );
};

export default App;
