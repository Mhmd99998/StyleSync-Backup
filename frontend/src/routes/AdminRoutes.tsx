import { Route } from "react-router-dom";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminRoute from "../guards/AdminRoute";
import ProductsGrid from "../components/products/ProductsGrid";
import { Typography } from "@mui/material";
import EditProduct from "../components/products/EditProduct";
import UserGrid from "../components/users/UserGrid";
import EditUser from "../components/users/EditUser";
import ColorPaletteManager from "../components/admin/ColorPaletteManager";
import ErrorPage from "../pages/error/ErrorPage";
import CategoryManager from "../components/admin/CategoryManager";

const AdminRoutes = () => (
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboardPage />}>
      <Route
        index
        element={
          <Typography sx={{ mt: 10, ml: 2 }}>
            Welcome to Admin Dashboard
          </Typography>
        }
      />
      <Route path="products" element={<ProductsGrid />} />
      <Route path="products/edit/:productId" element={<EditProduct />} />
      <Route path="users" element={<UserGrid />} />
      <Route path="users/edit/:userId" element={<EditUser />} />
      <Route path="palette-manager" element={<ColorPaletteManager />} />
      <Route path="category-manager" element={<CategoryManager />} />
      <Route path="*" element={<ErrorPage errorCode={404} />} />
    </Route>
  </Route>
);

export default AdminRoutes;
