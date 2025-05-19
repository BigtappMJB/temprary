import React from 'react';
import { Box, Typography, Paper, Button, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, styled } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';

// Styled components
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  color: "#fff",
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

/**
 * Generates a dynamic CRUD component based on the provided configuration
 * 
 * @param {Object} config - Configuration for the component
 * @param {string} config.tableName - The name of the database table
 * @param {string} config.pageName - The display name of the page
 * @param {string} config.apiEndpoint - The base API endpoint for CRUD operations
 * @returns {React.Component} A dynamically generated CRUD component
 */
const generateDynamicComponent = (config) => {
  const { tableName, pageName, apiEndpoint } = config;
  
  // Default values if not provided
  const displayName = pageName || tableName || 'Dynamic Page';
  const endpoint = apiEndpoint || `api/${tableName || 'dynamic'}`;
  
  // Create the component
  const DynamicComponent = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Mock columns based on the table name
    const columns = [
      { id: 'id', label: 'ID', minWidth: 50 },
      { id: 'name', label: 'Name', minWidth: 170 },
      { id: 'description', label: 'Description', minWidth: 200 },
      { id: 'status', label: 'Status', minWidth: 100 },
      { id: 'createdAt', label: 'Created At', minWidth: 120 },
    ];
    
    // Mock data generation
    const generateMockData = () => {
      const mockData = [];
      for (let i = 1; i <= 10; i++) {
        mockData.push({
          id: i,
          name: `${displayName} Item ${i}`,
          description: `This is a sample description for ${displayName} item ${i}`,
          status: i % 3 === 0 ? 'Inactive' : 'Active',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        });
      }
      return mockData;
    };
    
    // Load data (simulated)
    const loadData = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData(generateMockData());
        setLoading(false);
      }, 800);
    };
    
    // Load data on component mount
    React.useEffect(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Handle dialog open for create/edit
    const handleOpenDialog = (item = null) => {
      setCurrentItem(item);
      setOpenDialog(true);
    };
    
    // Handle dialog close
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setCurrentItem(null);
    };
    
    // Handle form submit (create/update)
    const handleSubmit = () => {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        if (currentItem) {
          // Update existing item
          setData(data.map(item => item.id === currentItem.id ? { ...currentItem } : item));
        } else {
          // Create new item
          const newItem = {
            id: data.length + 1,
            name: 'New Item',
            description: 'New item description',
            status: 'Active',
            createdAt: new Date().toLocaleDateString(),
          };
          setData([...data, newItem]);
        }
        setLoading(false);
        handleCloseDialog();
      }, 600);
    };
    
    // Handle delete
    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this item?')) {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setData(data.filter(item => item.id !== id));
          setLoading(false);
        }, 600);
      }
    };
    
    // Filter data based on search term
    const filteredData = data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <Box>
        <Container>
          <Header>
            <Typography variant="h6">{displayName}</Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
              }}
            >
              Add New
            </Button>
          </Header>
          
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    sx={{ ml: 2 }}
                    startIcon={<RefreshIcon />}
                    onClick={loadData}
                  >
                    Refresh
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {filteredData.length} items found
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Loading data...</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table stickyHeader aria-label={`${displayName} table`}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => (
                          <TableCell key={column.id}>
                            {row[column.id]}
                          </TableCell>
                        ))}
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(row)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Container>
        
        {/* Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentItem ? `Edit ${displayName} Item` : `Add New ${displayName} Item`}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    defaultValue={currentItem?.name || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    defaultValue={currentItem?.description || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Status"
                    fullWidth
                    margin="normal"
                    defaultValue={currentItem?.status || 'Active'}
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {currentItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  return DynamicComponent;
};

export default generateDynamicComponent;