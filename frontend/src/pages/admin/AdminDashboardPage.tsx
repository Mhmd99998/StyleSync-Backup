import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/shared/AdminNavbar";
import { Box } from "@mui/material";

const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <AdminNavbar />
      <Box sx={{mt: 5}}>
        <Outlet />
      </Box>
    </>
  );
}

export default AdminDashboardPage;
