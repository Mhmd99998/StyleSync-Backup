import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../hooks/useIsAuthenticated";
import { toast } from "material-react-toastify";

const CustomerRoute: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) toast.info("You must be logged in to use this feature!");

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default CustomerRoute;
