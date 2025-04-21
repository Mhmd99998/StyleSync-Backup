import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const Pagination: React.FC<{
  pageNumber: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}> = ({ pageNumber, totalPages, handlePageChange }) => {
  const theme = useTheme(); // Access the current theme

  // Handlers for page navigation
  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handlePrevPage = () => handlePageChange(pageNumber - 1);
  const handleNextPage = () => handlePageChange(pageNumber + 1);

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'center', mt: 5 }}>
      {/* First Page Button */}
      <Button
        onClick={handleFirstPage}
        disabled={pageNumber === 1}
        sx={{
          borderRadius: '50%',
          minWidth: '30px',
          height: '30px',
          padding: 0,
          fontSize: '14px',
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
          '&:disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled,
          },
        }}
      >
        {'<<'}
      </Button>

      {/* Previous Page Button */}
      <Button
        onClick={handlePrevPage}
        disabled={pageNumber === 1}
        sx={{
          borderRadius: '50%',
          minWidth: '30px',
          height: '30px',
          padding: 0,
          fontSize: '14px',
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
          '&:disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled,
          },
        }}
      >
        {'<'}
      </Button>

      {/* Current Page Text */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: '600',
          color: theme.palette.text.primary,
          fontSize: '14px',
        }}
      >
        {pageNumber} / {totalPages}
      </Typography>

      {/* Next Page Button */}
      <Button
        onClick={handleNextPage}
        disabled={pageNumber === totalPages}
        sx={{
          borderRadius: '50%',
          minWidth: '30px',
          height: '30px',
          padding: 0,
          fontSize: '14px',
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
          '&:disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled,
          },
        }}
      >
        {'>'}
      </Button>

      {/* Last Page Button */}
      <Button
        onClick={handleLastPage}
        disabled={pageNumber === totalPages}
        sx={{
          borderRadius: '50%',
          minWidth: '30px',
          height: '30px',
          padding: 0,
          fontSize: '14px',
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
          '&:disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled,
          },
        }}
      >
        {'>>'}
      </Button>
    </Stack>
  );
};

export default Pagination;
