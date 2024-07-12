import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'current_status', headerName: 'Status', width: 130 },
  { field: 'phone', headerName: 'Phone', width: 130 },
  { field: 'age', headerName: 'Age', width: 90 },
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

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  { id: 3, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  { id: 3, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  { id: 3, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  { id: 3, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  { id: 3, name: 'John Doe', email: 'john@example.com', address: '123 Main St', current_status: 'Active', phone: '123-456-7890', age: 30 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', current_status: 'Inactive', phone: '987-654-3210', age: 25 },
  // Add more rows as needed
];

const Users = () => {
  return (
    <PageContainer title="List of Users" description="List of Users">
      <DashboardCard title="List of Users Page">
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default Users;
