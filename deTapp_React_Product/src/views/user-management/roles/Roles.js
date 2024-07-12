import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Stack, Typography } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';

const roles = [
  { id: 1, roleName: 'Admin', description: 'Full access to the system' },
  { id: 2, roleName: 'User', description: 'Can view and edit own data' },
  { id: 3, roleName: 'Guest', description: 'Limited access for viewing' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'roleName', headerName: 'Role Name', width: 150 },
  { field: 'description', headerName: 'Description', width: 400 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 350,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Delete
        </Button>
      </strong>
    ),
  },
];

const Roles = () => {
  return (
    <PageContainer title="List of Roles" description="List of Roles">
        <DashboardCard title="List of Roles Page">
            {/* <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="small">
                    Remove a row
                </Button>
                <Button size="small">
                    Add a row
                </Button>
            </Stack> */}
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={roles} columns={columns} pageSize={5} checkboxSelection />
            </div>
        </DashboardCard>
    </PageContainer>
  );
};

export default Roles;
