import React, { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if we need to redirect to a newly created page
  useEffect(() => {
    // First check for returnTo parameter in URL (from DynamicPageFallback)
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    
    if (returnTo) {
      console.log('Redirecting back to:', returnTo);
      // Use a small delay to ensure the app is fully loaded
      setTimeout(() => {
        navigate(returnTo);
      }, 800);
      return;
    }
    
    // Then check for redirect from localStorage
    const shouldRedirect = localStorage.getItem('redirectToNewPage');
    const newPagePath = localStorage.getItem('newPagePath');
    
    if (shouldRedirect === 'true' && newPagePath) {
      // Clear the flags
      localStorage.removeItem('redirectToNewPage');
      localStorage.removeItem('newPagePath');
      
      console.log('Redirecting to newly created page:', newPagePath);
      
      // Use a small delay to ensure the app is fully loaded
      setTimeout(() => {
        navigate(newPagePath);
      }, 800);
    }
  }, [navigate]);
  // State to track if we're about to redirect
  const [redirecting, setRedirecting] = React.useState(false);
  const [newPageName, setNewPageName] = React.useState('');
  
  // Check for redirect on component mount
  useEffect(() => {
    const shouldRedirect = localStorage.getItem('redirectToNewPage');
    const pageName = localStorage.getItem('newPageName');
    
    if (shouldRedirect === 'true' && pageName) {
      setRedirecting(true);
      setNewPageName(pageName);
    }
  }, []);
  
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {redirecting && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          Redirecting to your newly created page "{newPageName}"...
        </Alert>
      )}
      <DashboardCard title="Dashboard Page">
        <Box sx={{ width: '100%' }}>
          {/* Dashboard content */}
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Dashboard;
