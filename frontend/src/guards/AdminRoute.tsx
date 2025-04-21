import { Navigate, Outlet } from "react-router-dom";
import useIsAdmin from "../hooks/useIsAdmin";
import useIsAuthenticated from "../hooks/useIsAuthenticated"

const AdminRoute: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  return (isAuthenticated && isAdmin) ? <Outlet /> : <Navigate to="/auth" replace />
}

export default AdminRoute;
