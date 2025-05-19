/**
 * This script checks if component files exist and creates them if they don't.
 * It's meant to be run manually when needed.
 */

const fs = require('fs');
const path = require('path');

// List of pages that should have component files
const requiredPages = [
  'employee',
  'sample'
];

// Base directory for generated pages
const baseDir = path.join(__dirname, '..', 'views', 'generatedPages');

// Template for component files
const componentTemplate = (pageName) => {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { get, post, put, remove as del } from '../../../views/utilities/apiservices/apiServices';
import { useDialog } from '../../../views/utilities/alerts/DialogContent';

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
 * ${componentName} Component
 * 
 * This component provides a CRUD interface for the ${pageName} table.
 */
const ${componentName} = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { openDialog: showDialog } = useDialog();
  
  // Define columns based on the table structure
  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
  ];
  
  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await get('api/${pageName}', 'python');
      
      if (response && response.data) {
        setData(response.data);
      } else {
        // If no data is returned, use mock data for demonstration
        setData(generateMockData());
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showDialog(
        'error',
        'Error Loading Data',
        \`There was an error loading the data: \${error.message || 'Unknown error'}\`,
        { confirm: { name: 'OK', isNeed: true } }
      );
      
      // Use mock data as fallback
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };
  
  // Generate mock data for demonstration
  const generateMockData = () => {
    const mockData = [];
    for (let i = 1; i <= 10; i++) {
      mockData.push({
        id: i,
        name: \`${componentName} Item \${i}\`,
        description: \`This is a sample description for ${pageName} item \${i}\`,
        status: i % 3 === 0 ? 'Inactive' : 'Active',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      });
    }
    return mockData;
  };
  
  // Load data on component mount
  useEffect(() => {
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
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (currentItem) {
        // Update existing item
        await put(\`api/${pageName}/\${currentItem.id}\`, currentItem, 'python');
        setData(data.map(item => item.id === currentItem.id ? { ...currentItem } : item));
      } else {
        // Create new item
        const newItem = {
          name: document.getElementById('name').value,
          description: document.getElementById('description').value,
          status: document.getElementById('status').value,
        };
        
        const response = await post('api/${pageName}', newItem, 'python');
        
        if (response && response.data) {
          setData([...data, response.data]);
        } else {
          // Fallback for demo
          const mockNewItem = {
            id: data.length + 1,
            ...newItem,
            createdAt: new Date().toLocaleDateString(),
          };
          setData([...data, mockNewItem]);
        }
      }
      
      handleCloseDialog();
      
      showDialog(
        'success',
        currentItem ? 'Item Updated' : 'Item Created',
        currentItem ? 'The item was updated successfully.' : 'A new item was created successfully.',
        { confirm: { name: 'OK', isNeed: true } }
      );
    } catch (error) {
      console.error('Error saving data:', error);
      showDialog(
        'error',
        'Error Saving Data',
        \`There was an error saving the data: \${error.message || 'Unknown error'}\`,
        { confirm: { name: 'OK', isNeed: true } }
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this item?');
      
      if (confirmDelete) {
        setLoading(true);
        
        await del(\`api/${pageName}/\${id}\`, 'python');
        
        setData(data.filter(item => item.id !== id));
        
        showDialog(
          'success',
          'Item Deleted',
          'The item was deleted successfully.',
          { confirm: { name: 'OK', isNeed: true } }
        );
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      showDialog(
        'error',
        'Error Deleting Data',
        \`There was an error deleting the data: \${error.message || 'Unknown error'}\`,
        { confirm: { name: 'OK', isNeed: true } }
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Box>
      <Container>
        <Header>
          <Typography variant="h6">${componentName}</Typography>
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
              <Table stickyHeader aria-label="${pageName} table">
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
          {currentItem ? \`Edit ${componentName} Item\` : \`Add New ${componentName} Item\`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  label="Name"
                  fullWidth
                  margin="normal"
                  defaultValue={currentItem?.name || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
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
                  id="status"
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

export default ${componentName};`;
};

// Template for index.js files
const indexTemplate = (pageName) => {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return `import ${componentName} from './${pageName}';

export default ${componentName};`;
};

// Check and create component files
requiredPages.forEach(pageName => {
  const pageDir = path.join(baseDir, pageName);
  const indexPath = path.join(pageDir, 'index.js');
  const componentPath = path.join(pageDir, `${pageName}.js`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(pageDir)) {
    console.log(`Creating directory: ${pageDir}`);
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  // Create index.js if it doesn't exist
  if (!fs.existsSync(indexPath)) {
    console.log(`Creating index.js for ${pageName}`);
    fs.writeFileSync(indexPath, indexTemplate(pageName));
  }
  
  // Create component file if it doesn't exist
  if (!fs.existsSync(componentPath)) {
    console.log(`Creating ${pageName}.js component`);
    fs.writeFileSync(componentPath, componentTemplate(pageName));
  }
});

console.log('Component files check completed.');