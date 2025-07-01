import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Component displayed when a page is not yet ready or under construction
 * Provides information and navigation options to the user
 */
const PageNotReady = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 100px)',
        textAlign: 'center',
        padding: 3
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '100%',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Page Under Development
        </Typography>
        
        <Typography variant="body1" paragraph>
          This page is currently under construction. The dynamic page component may not be properly 
          configured or might be missing required data.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Please check that:
        </Typography>
        
        <Box sx={{ textAlign: 'left', mb: 3, pl: 2 }}>
          <Typography variant="body2" paragraph>
            • The component file exists in the correct location
          </Typography>
          <Typography variant="body2" paragraph>
            • The route path is correctly configured
          </Typography>
          <Typography variant="body2" paragraph>
            • The component has a proper default export
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => navigate('/dynamicPageCreation')}
          >
            Create New Page
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PageNotReady;
