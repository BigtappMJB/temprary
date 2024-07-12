import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <DashboardCard title="Dashboard Page">
        <Box sx={{ width: '100%' }}>

        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Dashboard;
