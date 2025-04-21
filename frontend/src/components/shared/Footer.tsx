import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        padding: '10px 0px',
        textAlign: 'center',
        boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'background.default', // Ensures it blends with theme
        zIndex: 1000, // Keeps it above other content
      }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; 2025 StyleSync. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
