/**
 * This template is used to generate CRUD components for dynamic pages.
 * It provides a standardized structure for creating, reading, updating, and deleting data.
 * 
 * @param {Object} config - Configuration object for the template
 * @param {string} config.entityName - Name of the entity (e.g., "Employee")
 * @param {string} config.tableName - Name of the database table (e.g., "employees")
 * @param {Array} config.fields - Array of field definitions
 * @returns {string} Generated component code
 */
export const generateCrudTemplate = (config) => {
  const { 
    entityName, 
    tableName, 
    fields = [],
    apiEndpoint = `/api/${tableName.toLowerCase()}`
  } = config;
  
  // Generate validation schema based on fields
  const validationRules = fields.map(field => {
    let rule = `${field.name}: yup`;
    
    // Add type validation
    switch (field.type) {
      case 'number':
        rule += '.number()';
        break;
      case 'date':
        rule += '.date()';
        break;
      case 'boolean':
        rule += '.boolean()';
        break;
      case 'email':
        rule += '.string().email("Invalid email format")';
        break;
      default:
        rule += '.string()';
    }
    
    // Add required validation if needed
    if (field.required) {
      rule += `.required("${field.label} is required")`;
    }
    
    // Add min/max validation if provided
    if (field.min !== undefined) {
      rule += `.min(${field.min}, "${field.label} must be at least ${field.min}")`;
    }
    if (field.max !== undefined) {
      rule += `.max(${field.max}, "${field.label} must be at most ${field.max}")`;
    }
    
    return rule;
  }).join(',\n  ');
  
  // Generate form fields based on field definitions
  const formFields = fields.map(field => {
    let fieldComponent = '';
    
    switch (field.type) {
      case 'date':
        fieldComponent = `
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="${field.label}"
                  type="date"
                  {...register('${field.name}')}
                  error={!!errors.${field.name}}
                  helperText={errors.${field.name}?.message || ''}
                  disabled={isLoading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiFormHelperText-root.Mui-error': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }
                  }}
                />
              </Mui.Grid>`;
        break;
      case 'select':
        fieldComponent = `
              <Mui.Grid item xs={12} sm={6}>
                <Mui.FormControl 
                  fullWidth 
                  error={!!errors.${field.name}}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiFormHelperText-root.Mui-error': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }
                  }}
                >
                  <Mui.InputLabel id="${field.name}-label">${field.label}</Mui.InputLabel>
                  <Mui.Select
                    labelId="${field.name}-label"
                    label="${field.label}"
                    {...register('${field.name}')}
                    disabled={isLoading}
                  >
                    ${(field.options || []).map(option => 
                      `<Mui.MenuItem value="${option.value}">${option.label}</Mui.MenuItem>`
                    ).join('\n                    ')}
                  </Mui.Select>
                  {errors.${field.name} && (
                    <Mui.FormHelperText>{errors.${field.name}?.message}</Mui.FormHelperText>
                  )}
                </Mui.FormControl>
              </Mui.Grid>`;
        break;
      case 'textarea':
        fieldComponent = `
              <Mui.Grid item xs={12}>
                <Mui.TextField
                  fullWidth
                  label="${field.label}"
                  multiline
                  rows={4}
                  {...register('${field.name}')}
                  error={!!errors.${field.name}}
                  helperText={errors.${field.name}?.message || ''}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiFormHelperText-root.Mui-error': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }
                  }}
                />
              </Mui.Grid>`;
        break;
      default:
        fieldComponent = `
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="${field.label}"
                  type="${field.type === 'number' ? 'number' : 'text'}"
                  {...register('${field.name}')}
                  error={!!errors.${field.name}}
                  helperText={errors.${field.name}?.message || ''}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiFormHelperText-root.Mui-error': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }
                  }}
                />
              </Mui.Grid>`;
    }
    
    return fieldComponent;
  }).join('\n');
  
  // Generate table columns based on field definitions
  const tableColumns = fields.map(field => {
    return `    { field: '${field.name}', title: '${field.label}' }`;
  }).join(',\n');
  
  // Generate the component code
  return `import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DataTable from '../components/DataTable';
import * as Mui from '@mui/material';
import { 
  Add, 
  Refresh, 
  FilterList, 
  Search, 
  Edit, 
  Delete, 
  Visibility 
} from '@mui/icons-material';

// Base styles
const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(1),
  },
}));

const Header = Mui.styled(Mui.Box)(({ theme }) => ({
  backgroundColor: '#1e88e5',
  backgroundImage: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  borderTopLeftRadius: theme.spacing(1.5),
  borderTopRightRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

const FormButton = Mui.styled(Mui.Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px 0 rgba(0,0,0,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

// Validation schema using Yup
const validationSchema = yup.object().shape({
  ${validationRules}
});

/**
 * ${entityName} management component with CRUD operations
 * 
 * @returns {JSX.Element} The rendered component
 */
const ${entityName} = () => {
  // Initialize React Hook Form with Yup resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  // State management
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formAction, setFormAction] = useState({
    display: false,
    action: 'add',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define table columns
  const columns = [
${tableColumns}
  ];

  // Define permission levels
  const [permissionLevels, setPermissionLevels] = useState({
    create: true,
    edit: true,
    delete: true,
    view: true
  });

  /**
   * Fetch data from the API
   */
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('${apiEndpoint}');
      console.log('${entityName} data:', response.data);
      
      // Transform the data if needed
      const formattedData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
        
      setTableData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching ${entityName.toLowerCase()} data:', error);
      setError('Failed to load ${entityName.toLowerCase()}s. Please try again later.');
      
      // For development, use sample data
      setTableData([
        { id: 1, ${fields[0]?.name}: 'Sample ${entityName} 1' },
        { id: 2, ${fields[0]?.name}: 'Sample ${entityName} 2' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  /**
   * Filter data based on search term
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(tableData);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = tableData.filter(item => {
      // Search through all properties of the item
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercasedSearch);
      });
    });
    
    setFilteredData(filtered);
  }, [searchTerm, tableData]);
  
  /**
   * Handle search input change
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      if (formAction.action === 'add') {
        // Create new record
        const response = await axios.post('${apiEndpoint}', formData);
        console.log('${entityName} created:', response.data);
        
        // Show success message
        alert('${entityName} added successfully!');
      } else if (formAction.action === 'update') {
        // Update existing record
        const response = await axios.put(\`${apiEndpoint}/\${formData.id}\`, formData);
        console.log('${entityName} updated:', response.data);
        
        // Show success message
        alert('${entityName} updated successfully!');
      }
      
      // Refresh the data
      fetchData();
      
      // Reset the form and hide it
      reset();
      setFormAction({
        display: false,
        action: 'add'
      });
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert(\`Error: \${error.message || 'Failed to save ${entityName.toLowerCase()} data'}\`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show the form for adding a new record
   */
  const handleAdd = () => {
    reset(); // Clear the form
    setFormAction({
      display: true,
      action: 'add',
    });
  };
  
  /**
   * Show the form for updating an existing record
   */
  const handleUpdate = (rowData) => {
    // Set form values with the selected row data
    reset(rowData);
    
    // Show the form in update mode
    setFormAction({
      display: true,
      action: 'update',
    });
  };
  
  /**
   * Handle record deletion
   */
  const handleDelete = async (rowData) => {
    if (window.confirm(\`Are you sure you want to delete this ${entityName.toLowerCase()}?\`)) {
      try {
        setIsLoading(true);
        
        // Delete the record
        await axios.delete(\`${apiEndpoint}/\${rowData.id}\`);
        
        // Show success message
        alert('${entityName} deleted successfully!');
        
        // Refresh the data
        fetchData();
      } catch (error) {
        console.error('Error deleting ${entityName.toLowerCase()}:', error);
        alert(\`Error: \${error.message || 'Failed to delete ${entityName.toLowerCase()}'}\`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Cancel form editing and hide the form
   */
  const handleCancel = () => {
    reset();
    setFormAction({
      display: false,
      action: 'add',
    });
  };

  return (
    <>
      {/* Form Container */}
      {formAction.display && (
        <Container>
          <Header>
            <Mui.Typography variant="h6">
              {formAction.action === 'add' ? 'Add New ${entityName}' : 'Edit ${entityName}'}
            </Mui.Typography>
          </Header>

          <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            {/* Hidden ID field for updates */}
            {formAction.action === 'update' && (
              <input type="hidden" {...register('id')} />
            )}
            
            <Mui.Grid container spacing={2}>
${formFields}
              
              <Mui.Grid item xs={12}>
                <Mui.Box 
                  display="flex" 
                  justifyContent="flex-end" 
                  gap={2}
                  sx={{
                    mt: 2,
                    [theme.breakpoints.down('sm')]: {
                      flexDirection: 'column',
                      gap: 1
                    }
                  }}
                >
                  <Mui.Button 
                    type="button" 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{
                      borderRadius: '10px',
                      padding: '10px 24px',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderWidth: '2px',
                      '&:hover': {
                        borderWidth: '2px',
                      }
                    }}
                  >
                    Cancel
                  </Mui.Button>
                  <Mui.Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isLoading}
                    sx={{
                      borderRadius: '10px',
                      padding: '10px 24px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px 0 rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    {isLoading ? (
                      <Mui.Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Mui.CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        <span>Processing...</span>
                      </Mui.Box>
                    ) : formAction.action === 'add' ? 'Add ' + entityName : 'Update ' + entityName}
                  </Mui.Button>
                </Mui.Box>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Box>
        </Container>
      )}

      {/* Table Container */}
      <Container>
        <Header>
          <Mui.Typography variant="h6">
            <b>{entityName + ' List'}</b>
          </Mui.Typography>
          <Mui.Box 
            display="flex" 
            justifyContent="space-between" 
            flexWrap="wrap"
            gap={2}
          >
            <FormButton 
              type="button" 
              onClick={handleAdd} 
              variant="contained" 
              color="primary"
              disabled={isLoading || !permissionLevels.create}
              startIcon={<Mui.Add />}
            >
              {'Add ' + entityName}
            </FormButton>
            
            <Mui.Box sx={{ display: 'flex', gap: 1 }}>
              <Mui.Tooltip title="Refresh data">
                <Mui.IconButton 
                  onClick={fetchData} 
                  disabled={isLoading}
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Mui.Refresh />
                </Mui.IconButton>
              </Mui.Tooltip>
              
              <Mui.Tooltip title="Filter data">
                <Mui.IconButton 
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Mui.FilterList />
                </Mui.IconButton>
              </Mui.Tooltip>
            </Mui.Box>
          </Mui.Box>
        </Header>
        
        {/* Search box */}
        <Mui.Box sx={{ mb: 3, mt: 2, px: 3 }}>
          <Mui.TextField
            fullWidth
            placeholder={'Search ' + entityName.toLowerCase() + 's...'}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Mui.InputAdornment position="start">
                  <Search color="action" />
                </Mui.InputAdornment>
              ),
              endAdornment: searchTerm && (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton onClick={() => setSearchTerm('')} size="small">
                    <Mui.Close fontSize="small" />
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                backgroundColor: 'rgba(0,0,0,0.02)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '1px'
                }
              }
            }}
          />
        </Mui.Box>
        
        {/* Error message */}
        {error && (
          <Mui.Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              mx: 3,
              borderRadius: '10px'
            }}
          >
            {error}
          </Mui.Alert>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <Mui.Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Mui.CircularProgress />
          </Mui.Box>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredData.length === 0 && (
          <Mui.Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 5,
              px: 3,
              textAlign: 'center'
            }}
          >
            <Mui.Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: 'rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Mui.Search sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
            </Mui.Box>
            
            <Mui.Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No results found' : 'No ' + entityName.toLowerCase() + 's yet'}
            </Mui.Typography>
            
            <Mui.Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
              {searchTerm 
                ? 'We couldn\'t find any ' + entityName.toLowerCase() + 's matching "' + searchTerm + '". Try a different search term.'
                : 'There are no ' + entityName.toLowerCase() + 's in the system yet. Click the "Add ' + entityName + '" button to create one.'
              }
            </Mui.Typography>
            
            {searchTerm && (
              <Mui.Button 
                variant="outlined" 
                onClick={() => setSearchTerm('')}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none'
                }}
              >
                Clear search
              </Mui.Button>
            )}
          </Mui.Box>
        )}
        
        {/* Table component - only show if we have data and not loading */}
        {!isLoading && filteredData.length > 0 && (
          <Mui.Box sx={{ px: 3, pb: 3 }}>
            <DataTable 
              tableData={filteredData} 
              columns={columns}
              handleUpdateLogic={handleUpdate}
              handleDelete={handleDelete}
              permissionLevels={permissionLevels}
              sx={{
                '& .MuiPaper-root': {
                  boxShadow: 'none',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.08)'
                }
              }}
            />
            
            <Mui.Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              <Mui.Typography variant="body2" color="text.secondary">
                {'Showing ' + filteredData.length + ' of ' + tableData.length + ' ' + entityName.toLowerCase() + 's' + 
                (searchTerm ? ' matching "' + searchTerm + '"' : '')}
              </Mui.Typography>
              
              <Mui.Button 
                size="small" 
                onClick={fetchData}
                startIcon={<Refresh fontSize="small" />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'normal'
                }}
              >
                Refresh
              </Mui.Button>
            </Mui.Box>
          </Mui.Box>
        )}
      </Container>
    </>
  );
};

export default ${entityName};
`;
};