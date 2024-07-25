import React from 'react';
import { Box, Typography } from '@mui/material';

const PageNotReady = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Page is not ready
      </Typography>
      <Typography variant="body1">
        This page is currently under construction. Please check back later.
      </Typography>
    </Box>
  );
};

export default PageNotReady;
