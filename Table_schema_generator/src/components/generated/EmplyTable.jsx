import React, { useState, useEffect } from 'react';
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
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * EmplyTable - Component for emply
 */
const EmplyTable = () => {
  // State for data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'info', 'warning', 'error'
  });
  
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  
  
  
  
  // State for sorting
  const [sortBy, setSortBy] = useState('emply_id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  
  
  // State for form
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    
    emply_id: null,
    
    emply_name: null,
    
    created_by: null,
    
    created_at: null,
    
    updated_by: null,
    
    updated_at: null
    
  });
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  
  // Fetch data on component mount
  useEffect(() => {
    // Mock data for demonstration
    const mockData = [];
    for (let i = 1; i <= 10; i++) {
      mockData.push({
        
        emply_id: generateMockValue('BIGINT', 'emply_id', i),
        
        emply_name: generateMockValue('VARCHAR', 'emply_name', i),
        
        created_by: generateMockValue('VARCHAR', 'created_by', i),
        
        created_at: generateMockValue('TIMESTAMP', 'created_at', i),
        
        updated_by: generateMockValue('VARCHAR', 'updated_by', i),
        
        updated_at: generateMockValue('TIMESTAMP', 'updated_at', i)
        
      });
    }
    setData(mockData);
    setFilteredData(mockData);
  }, []);
  
  
  // Apply filtering and sorting
  useEffect(() => {
    let result = [...data];
    
    
    
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
    
    
    setFilteredData(result);
  }, [data, sortBy, sortDirection]);
  
  
  // Generate mock value based on field type
  const generateMockValue = (type, name, index) => {
    if (name === 'emply_id') {
      return index;
    } else if (name.includes('name')) {
      return `Sample  `;
    } else if (type.includes('INT')) {
      return index * 10;
    } else if (type.includes('DATE')) {
      return new Date().toISOString();
    } else {
      return `Sample  `;
    }
  };

  
  
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (formMode === 'create') {
      // Add new item to data
      const newItem = {
        ...formData,
        // Ensure primary key is set for new items
        emply_id: data.length > 0 ? Math.max(...data.map(item => item.emply_id)) + 1 : 1
      };
      setData(prev => [...prev, newItem]);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'New record created successfully',
        severity: 'success'
      });
    } else {
      // Update existing item
      setData(prev => prev.map(item => 
        item.emply_id === currentItem.emply_id ? { ...formData } : item
      ));
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Record updated successfully',
        severity: 'success'
      });
    }
    handleClose();
  };
  
  // Handle create dialog open
  const handleCreateOpen = () => {
    setFormMode('create');
    setFormData({
      
      emply_id: null,
      
      emply_name: null,
      
      created_by: null,
      
      created_at: null,
      
      updated_by: null,
      
      updated_at: null
      
    });
    setOpen(true);
  };
  
  // Handle edit dialog open
  const handleEditOpen = (item) => {
    setFormMode('edit');
    setCurrentItem(item);
    setFormData({ ...item });
    setOpen(true);
  };
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
  };
  
  // Handle delete dialog open
  const handleDeleteOpen = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  // Handle delete dialog close
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setData(prev => prev.filter(item => item.emply_id !== itemToDelete.emply_id));
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Record deleted successfully',
        severity: 'success'
      });
    }
    handleDeleteClose();
  };
  
  
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  
  
  
  
  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  
  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({...notification, open: false});
  };
  
  
  // Get paginated data
  const displayData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ width: '100%', mb: 2, p: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
        {/* Header section with responsive layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2 
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              mb: { xs: 1, sm: 0 }
            }}
          >
            Emply Management
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 1,
            width: { xs: '100%', sm: 'auto' }
          }}>
            
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              justifyContent: { xs: 'flex-end', sm: 'flex-start' }
            }}>
              
              
              
              <Button 
                variant="contained" 
                onClick={handleCreateOpen}
                size="small"
                startIcon={<EditIcon />}
                sx={{ 
                  whiteSpace: 'nowrap',
                  display: { xs: 'flex' }
                }}
              >
                Add New
              </Button>
              
            </Box>
          </Box>
        </Box>
        
        {/* Responsive table container */}
        <Box sx={{ overflow: 'auto', maxWidth: '100%' }}>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                
                <TableCell
                  
                  onClick={() => handleSort('emply_id')}
                  sx={{ 
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    padding: { xs: '8px 6px', sm: '16px 8px' }
                  }}
                  
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Emply Id
                    
                    {sortBy === 'emply_id' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                    
                  </Box>
                </TableCell>
                
                <TableCell
                  
                  onClick={() => handleSort('emply_name')}
                  sx={{ 
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    padding: { xs: '8px 6px', sm: '16px 8px' }
                  }}
                  
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Emply Name
                    
                    {sortBy === 'emply_name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                    
                  </Box>
                </TableCell>
                
                <TableCell
                  
                  onClick={() => handleSort('created_by')}
                  sx={{ 
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    padding: { xs: '8px 6px', sm: '16px 8px' }
                  }}
                  
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Created By
                    
                    {sortBy === 'created_by' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                    
                  </Box>
                </TableCell>
                
                
                
                <TableCell 
                  align="right"
                  sx={{ 
                    whiteSpace: 'nowrap',
                    padding: { xs: '8px 6px', sm: '16px 8px' }
                  }}
                >
                  Actions
                </TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((row) => (
                  <TableRow key={row.emply_id} hover>
                    
                    <TableCell 
                      sx={{ 
                        padding: { xs: '8px 6px', sm: '16px 8px' },
                        maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: 'nowrap', md: 'normal' }
                      }}
                    >
                      {String(row.emply_id)}
                    </TableCell>
                    
                    <TableCell 
                      sx={{ 
                        padding: { xs: '8px 6px', sm: '16px 8px' },
                        maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: 'nowrap', md: 'normal' }
                      }}
                    >
                      {String(row.emply_name)}
                    </TableCell>
                    
                    <TableCell 
                      sx={{ 
                        padding: { xs: '8px 6px', sm: '16px 8px' },
                        maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: 'nowrap', md: 'normal' }
                      }}
                    >
                      {String(row.created_by)}
                    </TableCell>
                    
                    
                    
                    <TableCell 
                      align="right"
                      sx={{ 
                        padding: { xs: '4px', sm: '8px' },
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEditOpen(row)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteOpen(row)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3 + 1} align="center">
                    {loading ? 'Loading...' : 'No data found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              margin: { xs: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '.MuiTablePagination-select': {
              paddingLeft: { xs: '4px', sm: '8px' },
              paddingRight: { xs: '4px', sm: '8px' }
            }
          }}
        />
        
      </Paper>
      
      
      {/* Create/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '80%', md: '70%' },
            maxHeight: { xs: '95vh', sm: '80vh' },
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          pb: 1
        }}>
          {formMode === 'create' ? 'Add New' : 'Edit'} Emply
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            
            
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                fullWidth
                id="emply_name"
                label="Emply Name"
                name="emply_name"
                value={formData.emply_name || ''}
                onChange={handleInputChange}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                fullWidth
                id="created_by"
                label="Created By"
                name="created_by"
                value={formData.created_by || ''}
                onChange={handleInputChange}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                fullWidth
                id="created_at"
                label="Created At"
                name="created_at"
                value={formData.created_at || ''}
                onChange={handleInputChange}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                fullWidth
                id="updated_by"
                label="Updated By"
                name="updated_by"
                value={formData.updated_by || ''}
                onChange={handleInputChange}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                fullWidth
                id="updated_at"
                label="Updated At"
                name="updated_at"
                value={formData.updated_at || ''}
                onChange={handleInputChange}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            
            
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleClose}
            size="small"
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            size="small"
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            {formMode === 'create' ? 'Save' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteClose}
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '450px' },
            maxWidth: '95%'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          pb: 1
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleDeleteClose}
            size="small"
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            size="small"
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          bottom: { xs: '24px', sm: '24px' },
          right: { xs: '16px', sm: '24px' }
        }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            alignItems: 'center',
            fontSize: { xs: '0.8125rem', sm: '0.875rem' }
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleNotificationClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmplyTable;