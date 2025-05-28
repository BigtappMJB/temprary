import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

const SmartDataPage = () => {
  // State for smartdata data
  const [data, setData] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState({
    fetch: false,
    save: false,
    delete: false
  });
  
  // State for CRUD operations
  const [formMode, setFormMode] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  
  // State for dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for sorting
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for filtered data
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Reset form errors when form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      // Clear errors for fields that now have values
      const newErrors = { ...formErrors };
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          delete newErrors[key];
        }
      });
      setFormErrors(newErrors);
    }
  }, [formData]);
  
  // Initialize form data when currentItem changes or when switching to create mode
  useEffect(() => {
    if (formMode === 'edit' && currentItem) {
      setFormData({ ...currentItem });
    } else if (formMode === 'create') {
      // Initialize with empty values
      const initialData = {};
      initialData.id = null;
      initialData.name = '';
      initialData.description = '';
      initialData.price = null;
      initialData.created_at = null;
      initialData.updated_at = null;
      initialData.created_by = '';
      initialData.updated_by = '';
      initialData.is_delete = false;
      setFormData(initialData);
    }
  }, [currentItem, formMode]);
  
  // Apply filtering and sorting when data or filters change
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(item => {
        return String(item.id).toLowerCase().includes(lowercasedQuery) || 
               String(item.name).toLowerCase().includes(lowercasedQuery) || 
               String(item.description).toLowerCase().includes(lowercasedQuery) || 
               String(item.price).toLowerCase().includes(lowercasedQuery) || 
               String(item.created_by).toLowerCase().includes(lowercasedQuery) || 
               String(item.updated_by).toLowerCase().includes(lowercasedQuery);
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[camelCase(sortBy)];
      const bValue = b[camelCase(sortBy)];
      
      if (aValue === bValue) return 0;
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
    
    setFilteredData(result);
  }, [data, searchQuery, sortBy, sortDirection]);

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      const response = await axios.get(`${API_BASE_URL}/smartdata`);
      setData(Array.isArray(response.data) ? response.data : []);
      setTotalCount(response.headers['x-total-count'] || response.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({
        open: true,
        message: `Error fetching data: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
      // For demo purposes, set some mock data if API fails
      const mockData = Array(15).fill(null).map((_, index) => {
        const item = {};
        item.id = index + 1;
        item.name = `Sample name ${index + 1}`;
        item.description = `Sample description ${index + 1}`;
        item.price = (index + 1) * 10;
        item.created_at = new Date(Date.now() - (index * 86400000)).toISOString();
        item.updated_at = new Date(Date.now() - (index * 43200000)).toISOString();
        item.created_by = `user${index % 3 + 1}`;
        item.updated_by = `user${index % 3 + 1}`;
        item.is_delete = index % 2 === 0;
        return item;
      });
      setData(mockData);
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  // Function to create a new item
  const createItem = async () => {
    try {
      // Validate form data
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setLoading(prev => ({ ...prev, save: true }));
      const response = await axios.post(`${API_BASE_URL}/smartdata`, formData);
      
      // Update the data list with the new item
      setData(prev => [...prev, response.data]);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Item created successfully',
        severity: 'success'
      });
      
      // Return to list view
      setFormMode('list');
    } catch (error) {
      console.error('Error creating item:', error);
      setNotification({
        open: true,
        message: `Error creating item: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // Function to update an existing item
  const updateItem = async () => {
    try {
      // Validate form data
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setLoading(prev => ({ ...prev, save: true }));
      const response = await axios.put(`${API_BASE_URL}/smartdata/${currentItem.id}`, formData);
      
      // Update the data list with the updated item
      setData(prev => prev.map(item => item.id === currentItem.id ? response.data : item));
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Item updated successfully',
        severity: 'success'
      });
      
      // Return to list view
      setFormMode('list');
    } catch (error) {
      console.error('Error updating item:', error);
      setNotification({
        open: true,
        message: `Error updating item: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // Function to delete an item
  const deleteItem = async () => {
    try {
      if (!itemToDelete) return;
      
      setLoading(prev => ({ ...prev, delete: true }));
      await axios.delete(`${API_BASE_URL}/smartdata/${itemToDelete.id}`);
      
      // Remove the item from the data list
      setData(prev => prev.filter(item => item.id !== itemToDelete.id));
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Item deleted successfully',
        severity: 'success'
      });
      
      // Close the delete dialog
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({
        open: true,
        message: `Error deleting item: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Function to validate form data
  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (formData.id === undefined || formData.id === null || formData.id === '') {
      errors.id = 'This field is required';
    }
    
    return errors;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'create') {
      createItem();
    } else if (formMode === 'edit') {
      updateItem();
    }
  };
  
  // Handle create button click
  const handleCreateClick = () => {
    setCurrentItem(null);
    setFormMode('create');
    setFormErrors({});
  };
  
  // Handle edit button click
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormMode('edit');
    setFormErrors({});
  };
  
  // Handle view button click
  const handleViewClick = (item) => {
    setCurrentItem(item);
    setFormMode('view');
  };
  
  // Handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  // Handle cancel button click
  const handleCancelClick = () => {
    setFormMode('list');
    setCurrentItem(null);
    setFormErrors({});
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle sort request
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };

  // Helper function to format date values
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Helper function to convert snake_case to camelCase
  const camelCase = (str) => {
    if (!str) return '';
    // First convert to lowercase and handle special characters
    const cleaned = str.toLowerCase().replace(/[^a-z0-9_]/g, '');
    // Then convert to camelCase
    return cleaned.replace(/^([A-Z])|_([a-z])/g, (match, p1, p2) => {
      return p2 ? p2.toUpperCase() : match.toLowerCase();
    });
  };
  
  // Helper function to format values based on their type
  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'BOOLEAN':
        return value ? 'Yes' : 'No';
      case 'DATE':
      case 'DATETIME':
      case 'TIMESTAMP':
        return formatDate(value);
      default:
        return String(value);
    }
  };

  // Get paginated data
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Render form for create/edit/view modes
  const renderForm = () => {
    const isViewMode = formMode === 'view';
    const isEditMode = formMode === 'edit';
    const isCreateMode = formMode === 'create';
    
    return (
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isCreateMode && 'Create New Item'}
          {isEditMode && 'Edit Item'}
          {isViewMode && 'View Item Details'}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID *"
              name="id"
              value={formData.id || ''}
              onChange={handleInputChange}
              error={!!formErrors.id}
              helperText={formErrors.id || ''}
              disabled={isViewMode || (isEditMode)}
              type="number"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name || ''}
              disabled={isViewMode}
              type="text"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description || ''}
              disabled={isViewMode}
              type="text"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              error={!!formErrors.price}
              helperText={formErrors.price || ''}
              disabled={isViewMode}
              type="number"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Created At"
              name="created_at"
              value={formData.created_at || ''}
              onChange={handleInputChange}
              error={!!formErrors.created_at}
              helperText={formErrors.created_at || ''}
              disabled={isViewMode || true} // Always disabled as it's a system field
              type="datetime-local"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Updated At"
              name="updated_at"
              value={formData.updated_at || ''}
              onChange={handleInputChange}
              error={!!formErrors.updated_at}
              helperText={formErrors.updated_at || ''}
              disabled={isViewMode || true} // Always disabled as it's a system field
              type="datetime-local"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Created By"
              name="created_by"
              value={formData.created_by || ''}
              onChange={handleInputChange}
              error={!!formErrors.created_by}
              helperText={formErrors.created_by || ''}
              disabled={isViewMode || true} // Always disabled as it's a system field
              type="text"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Updated By"
              name="updated_by"
              value={formData.updated_by || ''}
              onChange={handleInputChange}
              error={!!formErrors.updated_by}
              helperText={formErrors.updated_by || ''}
              disabled={isViewMode || true} // Always disabled as it's a system field
              type="text"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="is_delete"
                  checked={!!formData.is_delete}
                  onChange={handleInputChange}
                  disabled={isViewMode || true} // Always disabled as it's a system field
                />
              }
              label="Is Delete"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancelClick}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          
          {!isViewMode && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading.save}
            >
              {loading.save ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          )}
        </Box>
      </Box>
    );
  };
  
  // Render delete confirmation dialog
  const renderDeleteDialog = () => {
    return (
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteItem} color="error" disabled={loading.delete}>
            {loading.delete ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Render table list view
  const renderTableView = () => {
    return (
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Smart Data Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Add New
            </Button>
          </Box>
        </Box>
        
        <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      '&:hover': { color: '#1976d2' }
                    }}
                    onClick={() => handleSort('id')}
                  >
                    id
                    {sortBy === 'id' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      '&:hover': { color: '#1976d2' }
                    }}
                    onClick={() => handleSort('name')}
                  >
                    name
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      '&:hover': { color: '#1976d2' }
                    }}
                    onClick={() => handleSort('description')}
                  >
                    description
                    {sortBy === 'description' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      '&:hover': { color: '#1976d2' }
                    }}
                    onClick={() => handleSort('price')}
                  >
                    price
                    {sortBy === 'price' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{formatValue(row.id)}</TableCell>
                    <TableCell>{formatValue(row.name)}</TableCell>
                    <TableCell>{formatValue(row.description)}</TableCell>
                    <TableCell>{formatValue(row.price)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleViewClick(row)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(row)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    {loading.fetch ? (
                      <CircularProgress size={24} />
                    ) : (
                      'No data found'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {formMode === 'list' ? renderTableView() : renderForm()}
      
      {/* Delete confirmation dialog */}
      {renderDeleteDialog()}
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SmartDataPage;