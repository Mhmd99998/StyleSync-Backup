import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { setTheme } from "./redux/slices/themeSlice";
import { BrowserRouter, Routes } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./components/shared/Footer";
import { ToastContainer } from "material-react-toastify";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

const App: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setTheme(isDarkMode));
  }, [isDarkMode, dispatch]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {AdminRoutes()}
          {UserRoutes()}
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
