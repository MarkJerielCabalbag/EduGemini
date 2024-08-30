import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
