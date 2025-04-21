import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  errorCode: number;
}

const getErrorMessage = (code: number): string => {
  switch (code) {
    case 404:
      return "Page missing or not found. Check your URL.";
    case 500:
      return "Something went wrong. Try again later.";
    case 403:
      return "You don't have permission to view this page.";
    case 401:
      return "You're not authorized. Please log in.";
    default:
      return "An unexpected error occurred.";
  }
};

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  const navigate = useNavigate();
  const message = getErrorMessage(errorCode);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography variant="h2" color="error" fontWeight={500} mb={1}>
        {errorCode}
      </Typography>
      <Typography variant="h6" mb={3} color="text.secondary">
        {message}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{ textTransform: "none", fontWeight: 400 }}
      >
        GO HOME
      </Button>
    </Box>
  );
};

export default ErrorPage;
