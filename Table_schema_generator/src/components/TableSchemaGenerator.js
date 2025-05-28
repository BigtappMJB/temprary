import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableChart from '@mui/icons-material/TableChart';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Code from '@mui/icons-material/Code';

// SQL data types
const SQL_TYPES = [
  'BIGINT',
  'INT',
  'SMALLINT',
  'TINYINT',
  'BIT',
  'DECIMAL',
  'NUMERIC',
  'FLOAT',
  'REAL',
  'DOUBLE',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'TIME',
  'CHAR',
  'VARCHAR(255)',
  'VARCHAR(100)',
  'VARCHAR(50)',
  'TEXT',
  'NCHAR',
  'NVARCHAR(255)',
  'NVARCHAR(100)',
  'NVARCHAR(50)',
  'NTEXT',
  'BINARY',
  'VARBINARY',
  'BLOB',
  'BOOLEAN'
];

// Default empty field
const DEFAULT_FIELD = {
  name: '',
  type: 'VARCHAR(255)',
  primaryKey: false
};

// API endpoint
const API_ENDPOINT = 'http://localhost:8080/codegen/tableCreateAPI';

const TableSchemaGenerator = () => {
  
  // State for table name
  const [tableName, setTableName] = useState('');
  
  // State for fields
  const [fields, setFields] = useState([
    { ...DEFAULT_FIELD, name: 'id', type: 'BIGINT', primaryKey: true }
  ]);
  
  // State for JSON preview
  const [jsonPreview, setJsonPreview] = useState('');
  
  // State for API response
  const [apiResponse, setApiResponse] = useState(null);
  
  // State for loading
  const [loading, setLoading] = useState(false);
  
  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Update JSON preview whenever table name or fields change
  useEffect(() => {
    updateJsonPreview();
  }, [tableName, fields]);

  // Function to update JSON preview
  const updateJsonPreview = () => {
    const payload = {
      tableName,
      fields: fields.map(field => ({
        name: field.name,
        type: field.type,
        primaryKey: field.primaryKey
      }))
    };
    
    setJsonPreview(JSON.stringify(payload, null, 2));
  };

  // Function to add a new field
  const addField = () => {
    setFields([...fields, { ...DEFAULT_FIELD }]);
  };

  // Function to remove a field
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  // Function to update a field
  const updateField = (index, field) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  // Function to copy JSON to clipboard
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(jsonPreview);
    setNotification({
      open: true,
      message: 'JSON copied to clipboard',
      severity: 'success'
    });
  };

  // Sample data for loading
  const sampleTableData = {
    tableName: "smartdata",
    fields: [
      {
        name: "id",
        type: "BIGINT",
        primaryKey: true
      },
      {
        name: "name",
        type: "VARCHAR(100)",
        primaryKey: false
      },
      {
        name: "description",
        type: "TEXT",
        primaryKey: false
      },
      {
        name: "price",
        type: "DOUBLE",
        primaryKey: false
      }
    ]
  };

  // Function to load sample data
  const loadSampleData = () => {
    setTableName(sampleTableData.tableName);
    setFields(sampleTableData.fields);
    setNotification({
      open: true,
      message: 'Sample data loaded',
      severity: 'info'
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!tableName.trim()) {
      setNotification({
        open: true,
        message: 'Table name is required',
        severity: 'error'
      });
      return;
    }
    
    if (fields.length === 0) {
      setNotification({
        open: true,
        message: 'At least one field is required',
        severity: 'error'
      });
      return;
    }
    
    for (const field of fields) {
      if (!field.name.trim()) {
        setNotification({
          open: true,
          message: 'All fields must have a name',
          severity: 'error'
        });
        return;
      }
    }
    
    // Check if at least one primary key is selected
    if (!fields.some(field => field.primaryKey)) {
      setNotification({
        open: true,
        message: 'At least one field must be a primary key',
        severity: 'error'
      });
      return;
    }
    
    // Prepare payload
    const payload = {
      tableName,
      fields: fields.map(field => ({
        name: field.name,
        type: field.type,
        primaryKey: field.primaryKey
      }))
    };
    
    // Send API request
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINT, payload);
      setApiResponse(response.data);
      setNotification({
        open: true,
        message: 'Table schema generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating table schema:', error);
      setApiResponse(error.response ? error.response.data : { error: 'Failed to connect to the server' });
      setNotification({
        open: true,
        message: 'Failed to generate table schema: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        maxWidth: '100%', 
        overflow: 'hidden',
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#1976d2',
                borderBottom: '2px solid #1976d2',
                pb: 1,
                mb: 2
              }}
            >
              Create New Table Schema
            </Typography>
            
            {/* Table Name */}
            <TextField
              fullWidth
              label="Table Name"
              variant="outlined"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
              helperText="Enter the name of your database table"
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          </Grid>
          
          {/* Fields Section */}
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: '#f8f9fa', 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#424242'
                }}
              >
                <TableChart sx={{ mr: 1 }} /> Table Fields
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Field Headers */}
              <Grid container spacing={2} sx={{ mb: 2, display: { xs: 'none', sm: 'flex' } }}>
                <Grid item sm={4} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#616161' }}>Field Name</Typography>
                </Grid>
                <Grid item sm={4} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#616161' }}>Data Type</Typography>
                </Grid>
                <Grid item sm={2} md={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#616161' }}>Primary Key</Typography>
                </Grid>
                <Grid item sm={2} md={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#616161' }}>Actions</Typography>
                </Grid>
              </Grid>
              
              {/* Field List */}
              <Box sx={{ maxHeight: { xs: '400px', sm: '300px' }, overflowY: 'auto', mb: 2 }}>
                {fields.map((field, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: 2,
                      p: { xs: 2, sm: 1 },
                      borderRadius: 1,
                      bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                      },
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {/* Mobile view - stacked layout */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#616161', mb: 0.5, display: 'block' }}>
                          Field Name
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={field.name}
                          onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                          required
                          placeholder="Field name"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#616161', mb: 0.5, display: 'block' }}>
                          Data Type
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={field.type}
                            onChange={(e) => updateField(index, { ...field, type: e.target.value })}
                          >
                            {SQL_TYPES.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.primaryKey}
                              onChange={(e) => updateField(index, { ...field, primaryKey: e.target.checked })}
                              color="primary"
                              size="small"
                            />
                          }
                          label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>Primary Key</Typography>}
                        />
                        
                        <IconButton 
                          color="error" 
                          onClick={() => removeField(index)}
                          disabled={fields.length === 1} // Prevent removing the last field
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Desktop view - grid layout */}
                    <Grid 
                      container 
                      spacing={2}
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                      <Grid item sm={4} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          value={field.name}
                          onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                          required
                          placeholder="Field name"
                        />
                      </Grid>
                      <Grid item sm={4} md={4}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={field.type}
                            onChange={(e) => updateField(index, { ...field, type: e.target.value })}
                          >
                            {SQL_TYPES.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item sm={2} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Checkbox
                          checked={field.primaryKey}
                          onChange={(e) => updateField(index, { ...field, primaryKey: e.target.checked })}
                          color="primary"
                        />
                      </Grid>
                      <Grid item sm={2} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeField(index)}
                          disabled={fields.length === 1} // Prevent removing the last field
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
              
              {/* Add Field Button */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addField}
                sx={{ 
                  mt: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Add New Field
              </Button>
            </Box>
          </Grid>
          
          {/* JSON Preview */}
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: '#f0f4f8', 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              border: '1px solid #d0d9e1'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 2,
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#2c3e50',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  <Code sx={{ mr: 1 }} /> JSON Payload
                </Typography>
                <Tooltip title="Copy JSON to clipboard">
                  <IconButton 
                    onClick={copyJsonToClipboard} 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.2)'
                      }
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  bgcolor: '#1e293b', 
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  borderRadius: 1,
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                  maxHeight: { xs: '200px', sm: '300px' },
                  overflowY: 'auto'
                }}
              >
                {jsonPreview}
              </Paper>
            </Box>
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={loading ? null : <CodeIcon />}
              disabled={loading}
              fullWidth
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                '&:hover': {
                  boxShadow: '0 6px 10px rgba(25, 118, 210, 0.3)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Table'}
            </Button>
          </Grid>
          
          {/* API Response */}
          {apiResponse && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ 
                bgcolor: '#f1f8e9', 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2,
                border: '1px solid #c5e1a5'
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#33691e',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  <CheckCircle sx={{ mr: 1 }} /> API Response
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    bgcolor: '#f9fbe7', 
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    borderRadius: 1,
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                    border: '1px solid #dce775',
                    maxHeight: { xs: '200px', sm: '300px' },
                    overflowY: 'auto'
                  }}
                >
                  {JSON.stringify(apiResponse, null, 2)}
                </Paper>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TableSchemaGenerator;