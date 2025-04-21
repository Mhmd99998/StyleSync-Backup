import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d1a3c', // Vibrant blue
      light: '#152a62',
      dark: '#0d1a3c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: "#dbba7c",
      light: "#b59a67",
      dark: "#a78e5f",
      contrastText: "#ffffff",
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White for cards and modals
    },
    text: {
      primary: '#0d0d0d',
      secondary: '#4f4f4f',
    },
    success: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
    },
    error: {
      main: '#d32f2f',
      light: '#ef9a9a',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    button: {
      textTransform: 'none',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#112d4e",
      light: "#2a4f75",
      dark: "#0a1929", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dbba7c",
      light: "#b59a67",
      dark: "#a78e5f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a1929",
      paper: "#1a2332",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#c0c0c0", 
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
    },
    error: {
      main: "#ef5350", 
      light: "#ff6b6b",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ffa726", 
      light: "#ffb74d",
      dark: "#f57c00",
    },
    info: {
      main: "#42a5f5", 
      light: "#64b5f6",
      dark: "#1976d2",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: "bold", 
    },
  },
});
