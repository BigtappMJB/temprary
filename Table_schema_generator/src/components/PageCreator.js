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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Tooltip,
  Chip
} from '@mui/material';
import {
  TableChart as TableChartIcon,
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  DragIndicator as DragIndicatorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
// Removed react-beautiful-dnd import

// API endpoints
const ALL_TABLES_API = 'http://localhost:8080/codegen/allTables';
const TABLE_METADATA_API = 'http://localhost:8080/codegen/tableMetadata';
const SAVE_COMPONENT_API = 'http://localhost:8080/codegen/saveComponent';
const PYTHON_GENERATE_API = 'http://localhost:5000/generate';

// API endpoints for CRUD operations (to be used in generated components)
const API_BASE_URL = 'http://localhost:8080/api';

const PageCreator = () => {
  // State for available tables
  const [availableTables, setAvailableTables] = useState([]);
  
  // State for selected table
  const [selectedTable, setSelectedTable] = useState('');
  
  // State for table metadata
  const [tableMetadata, setTableMetadata] = useState(null);
  
  // State for selected fields
  const [selectedFields, setSelectedFields] = useState([]);
  
  // State for component options
  const [componentOptions, setComponentOptions] = useState({
    pagination: true,
    sorting: true,
    filtering: true,
    search: true,
    refresh: true,
    crud: true,  // Enable CRUD operations by default
    componentName: '',
    pageTitle: ''
  });
  
  // State for generated code
  const [generatedCode, setGeneratedCode] = useState('');
  
  // State for loading
  const [loading, setLoading] = useState({
    tables: false,
    metadata: false,
    generation: false,
    saving: false
  });
  
  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch available tables on component mount
  useEffect(() => {
    fetchAvailableTables();
  }, []);

  // Update component name and page title when table is selected
  useEffect(() => {
    if (selectedTable) {
      const formattedName = selectedTable
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      
      setComponentOptions({
        ...componentOptions,
        componentName: `${formattedName}Table`,
        pageTitle: `${formattedName} Management`
      });
    }
  }, [selectedTable]);

  // Update selected fields when metadata changes
  useEffect(() => {
    if (tableMetadata && tableMetadata.fields && tableMetadata.fields.length > 0) {
      console.log('Initializing selected fields from metadata:', tableMetadata.fields);
      
      // Initialize selected fields with all fields from metadata
      const initialSelectedFields = tableMetadata.fields.map((field, index) => {
        // Ensure all required properties exist
        const processedField = {
          ...field,
          // Convert field type to uppercase for consistency
          type: (field.type || 'VARCHAR').toUpperCase(),
          // Ensure primaryKey is a boolean
          primaryKey: !!field.primaryKey,
          // Ensure nullable is a boolean (default to true if not specified)
          nullable: field.nullable !== undefined ? !!field.nullable : true,
          // Add UI-specific properties
          selected: true,
          order: index,
          sortable: true,
          // Don't allow filtering on large text fields
          filterable: !['TEXT', 'BLOB', 'CLOB', 'LONGTEXT'].includes((field.type || '').toUpperCase())
        };
        
        return processedField;
      });
      
      setSelectedFields(initialSelectedFields);
    } else if (tableMetadata) {
      console.warn('Table metadata has no fields or invalid format:', tableMetadata);
    }
  }, [tableMetadata]);

  // Function to fetch available tables
  const fetchAvailableTables = async () => {
    try {
      setLoading({ ...loading, tables: true });
      const response = await axios.get(ALL_TABLES_API);
      setAvailableTables(response.data || []);
      
      setNotification({
        open: true,
        message: 'Tables loaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error fetching tables:', error);
      setNotification({
        open: true,
        message: 'Failed to load tables: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
      
      // For demo purposes, set some mock tables if API fails
      setAvailableTables(['users', 'products', 'orders', 'categories']);
    } finally {
      setLoading({ ...loading, tables: false });
    }
  };

  // Function to fetch table metadata
  const fetchTableMetadata = async (tableName) => {
    try {
      // Clear previous metadata and set loading state
      setTableMetadata(null);
      setSelectedFields([]);
      setLoading(prevLoading => ({ ...prevLoading, metadata: true }));
      
      // Try to fetch from API
      const response = await axios.get(`${TABLE_METADATA_API}/${tableName}`);
      
      // Check if response.data is an array (direct fields array)
      if (Array.isArray(response.data)) {
        // Create a properly formatted metadata object
        const formattedMetadata = {
          tableName: tableName,
          fields: response.data
        };
        
        setTableMetadata(formattedMetadata);
        
        setNotification({
          open: true,
          message: `Metadata for table '${tableName}' loaded successfully`,
          severity: 'success'
        });
      } 
      // Check if response has fields property (already formatted)
      else if (response.data && response.data.fields) {
        setTableMetadata(response.data);
        
        setNotification({
          open: true,
          message: `Metadata for table '${tableName}' loaded successfully`,
          severity: 'success'
        });
      } else {
        throw new Error('Invalid metadata format received from API');
      }
    } catch (error) {
      console.error('Error fetching table metadata:', error);
      setNotification({
        open: true,
        message: 'Failed to load table metadata: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
      
      // For demo purposes, set some mock metadata if API fails
      const mockMetadata = {
        tableName: tableName,
        fields: [
          { name: 'id', type: 'BIGINT', primaryKey: true },
          { name: 'name', type: 'VARCHAR(255)', primaryKey: false },
          { name: 'description', type: 'TEXT', primaryKey: false },
          { name: 'created_at', type: 'TIMESTAMP', primaryKey: false },
          { name: 'active', type: 'BOOLEAN', primaryKey: false }
        ]
      };
      
      // Short delay to simulate API call
      setTimeout(() => {
        setTableMetadata(mockMetadata);
      }, 500);
    } finally {
      // Set loading state to false after a short delay
      setTimeout(() => {
        setLoading(prevLoading => ({ ...prevLoading, metadata: false }));
      }, 800);
    }
  };

  // Function to handle table selection
  const handleTableSelect = (event) => {
    const tableName = event.target.value;
    setSelectedTable(tableName);
    
    if (tableName) {
      fetchTableMetadata(tableName);
    } else {
      setTableMetadata(null);
      setSelectedFields([]);
    }
  };

  // Function to handle field selection
  const handleFieldToggle = (fieldName) => {
    setSelectedFields(prevFields => 
      prevFields.map(field => 
        field.name === fieldName 
          ? { ...field, selected: !field.selected } 
          : field
      )
    );
  };

  // Function to handle field property change
  const handleFieldPropertyChange = (fieldName, property, value) => {
    setSelectedFields(prevFields => 
      prevFields.map(field => 
        field.name === fieldName 
          ? { ...field, [property]: value } 
          : field
      )
    );
  };

  // Function to handle component option change
  const handleOptionChange = (option, value) => {
    setComponentOptions({
      ...componentOptions,
      [option]: value
    });
  };

  // Function to move field up in order
  const moveFieldUp = (index) => {
    if (index === 0) return; // Already at the top
    
    const items = Array.from(selectedFields);
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    
    // Update order property
    const updatedItems = items.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setSelectedFields(updatedItems);
  };
  
  // Function to move field down in order
  const moveFieldDown = (index) => {
    if (index === selectedFields.length - 1) return; // Already at the bottom
    
    const items = Array.from(selectedFields);
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    
    // Update order property
    const updatedItems = items.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setSelectedFields(updatedItems);
  };

  // Helper function to convert snake_case to camelCase (for debugging)
  const camelCase = (str) => {
    if (!str) return '';
    // First convert to lowercase and handle special characters
    const cleaned = str.toLowerCase().replace(/[^a-z0-9_]/g, '');
    // Then convert to camelCase
    return cleaned.replace(/^([A-Z])|_([a-z])/g, (match, p1, p2) => {
      return p2 ? p2.toUpperCase() : match.toLowerCase();
    });
  };

  // Function to save the generated component to a file and update App.js
  const saveComponentToFile = async () => {
    try {
      setLoading(prevLoading => ({ ...prevLoading, saving: true }));
      
      // Get the component name from options
      const componentName = componentOptions.componentName || `${selectedTable}Table`;
      
      // Validate component name (must start with a letter, followed by letters, numbers, or underscores)
      if (!componentName.match(/^[A-Za-z][A-Za-z0-9_]*$/)) {
        setNotification({
          open: true,
          message: 'Component name must start with a letter and contain only letters, numbers, and underscores',
          severity: 'error'
        });
        setLoading(prevLoading => ({ ...prevLoading, saving: false }));
        return;
      }
      
      // Generate a route ID for the component (lowercase, with hyphens)
      const routeId = selectedTable.toLowerCase().replace(/_/g, '-');
      
      // Get fields that are selected for display
      const displayFields = selectedFields
        .filter(field => field.selected)
        .sort((a, b) => a.order - b.order);
      
      if (displayFields.length === 0) {
        setNotification({
          open: true,
          message: 'Please select at least one field to display',
          severity: 'error'
        });
        setLoading(prevLoading => ({ ...prevLoading, saving: false }));
        return;
      }
      
      // Prepare data for the Python service
      const pythonData = {
        tableName: selectedTable,
        componentName: componentName,
        pageTitle: componentOptions.pageTitle || `${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} Management`,
        selectedFields: selectedFields,
        componentOptions: componentOptions
      };
      
      // Generate the component using the Python service
      const response = await axios.post(PYTHON_GENERATE_API, pythonData);
      
      if (response.data && response.data.success) {
        // Set the generated code
        setGeneratedCode(response.data.componentCode);
        
        // Show success notification
        setNotification({
          open: true,
          message: `Component "${componentName}.jsx" generated successfully in src/components/generated/`,
          severity: 'success'
        });
        
        // The Python service already saved the component file
        // We don't need to call the Java service to save it again
        setNotification({
          open: true,
          message: `Component "${componentName}.jsx" generated successfully. The page will refresh in 3 seconds to update the menu.`,
          severity: 'success'
        });
        
        // Reload the page after 3 seconds to update the menu
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error generating component:', error);
      
      // If the Python service fails, show error notification
      setNotification({
        open: true,
        message: 'Failed to generate component: ' + (error.response?.data?.message || error.message || 'Unknown error'),
        severity: 'error'
      });
      
      // If we have generated code, offer to download it
      if (generatedCode) {
        try {
          // Create a download link for the file
          const blob = new Blob([generatedCode], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${componentName}.jsx`;
          
          // Add a specific instruction to save to the components directory
          const saveLocation = '\\code_generation\\table-schema-generator\\src\\components\\generated';
          
          // Show notification before download
          setNotification({
            open: true,
            message: `Server save failed. When the save dialog appears, navigate to and save directly to: ${saveLocation}. You'll need to manually update App.js to include this component.`,
            severity: 'warning'
          });
          
          // Short delay to ensure notification is seen before download starts
          setTimeout(() => {
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1500);
        } catch (downloadError) {
          console.error('Error downloading component:', downloadError);
        }
      }
    } finally {
      setLoading(prevLoading => ({ ...prevLoading, saving: false }));
    }
  };

  // Helper function to get default value based on field type
  const getDefaultValueForType = (field) => {
    const type = (field.type || '').toUpperCase();
    
    // Return appropriate default values based on field type
    if (field.primaryKey) {
      return 'null'; // Primary keys are typically auto-generated
    } else if (['INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE'].includes(type)) {
      return 'null';
    } else if (['BOOLEAN', 'BIT'].includes(type)) {
      return 'false';
    } else if (['DATE', 'DATETIME', 'TIMESTAMP'].includes(type)) {
      return 'null';
    } else {
      return "''"; // Default for strings and other types
    }
  };

  // Function to generate React component code
  const generateComponentCode = () => {
    setLoading({ ...loading, generation: true });
    
    try {
      // Get fields that are selected for display
      const displayFields = selectedFields
        .filter(field => field.selected)
        .sort((a, b) => a.order - b.order);
      
      if (displayFields.length === 0) {
        setNotification({
          open: true,
          message: 'Please select at least one field to display',
          severity: 'error'
        });
        setLoading({ ...loading, generation: false });
        return;
      }
      
      // Generate imports
      const imports = [
        "import React, { useState, useEffect } from 'react';",
        "import axios from 'axios';",
        "import {",
        "  Box,",
        "  Button,",
        "  Paper,",
        "  Table,",
        "  TableBody,",
        "  TableCell,",
        "  TableContainer,",
        "  TableHead,",
        "  TableRow,",
        "  TablePagination,",
        "  Typography,",
        "  TextField,",
        "  InputAdornment,",
        "  IconButton,",
        "  Tooltip,",
        "  CircularProgress,",
        "  Chip,",
        "  Dialog,",
        "  DialogActions,",
        "  DialogContent,",
        "  DialogContentText,",
        "  DialogTitle,",
        "  Grid,",
        "  Snackbar,",
        "  Alert,",
        "  FormControl,",
        "  InputLabel,",
        "  Select,",
        "  MenuItem,",
        "  FormHelperText,",
        "  Stack,",
        "  Divider,",
        "  Switch,",
        "  FormControlLabel,",
        "} from '@mui/material';",
        "import {",
        "  Search as SearchIcon,",
        "  Refresh as RefreshIcon,",
        "  ArrowUpward as ArrowUpwardIcon,",
        "  ArrowDownward as ArrowDownwardIcon,",
        "  FilterList as FilterIcon,",
        "  Edit as EditIcon,",
        "  Delete as DeleteIcon,",
        "  Add as AddIcon,",
        "  Save as SaveIcon,",
        "  Cancel as CancelIcon,",
        "  Visibility as VisibilityIcon,",
        "  VisibilityOff as VisibilityOffIcon,",
        "} from '@mui/icons-material';"
      ].join('\n');
      
      // Generate component structure
      const componentName = componentOptions.componentName || `${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}Table`;
      const pageTitle = componentOptions.pageTitle || `${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} Management`;
      
      // Generate state variables
      const stateVariables = [
        `  // State for ${selectedTable} data`,
        `  const [data, setData] = useState([]);`,
        `  `,
        componentOptions.crud ? 
        `  // State for loading
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
  ` : 
        `  // State for loading
  const [loading, setLoading] = useState(false);
  `,
        componentOptions.pagination ? 
        `  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  ` : '',
        componentOptions.sorting ? 
        `  // State for sorting
  const [sortBy, setSortBy] = useState('${displayFields[0]?.name || 'id'}');
  const [sortDirection, setSortDirection] = useState('asc');
  ` : '',
        componentOptions.search ? 
        `  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  ` : '',
        `  // State for filtered data`,
        `  const [filteredData, setFilteredData] = useState([]);`
      ].filter(Boolean).join('\n');
      
      // Generate useEffect hooks
      const useEffectHooks = [
        `  // Fetch data on component mount`,
        `  useEffect(() => {`,
        `    fetchData();`,
        `  }, []);`,
        `  `,
        `  // Reset form errors when form data changes`,
        `  useEffect(() => {`,
        `    if (Object.keys(formData).length > 0) {`,
        `      // Clear errors for fields that now have values`,
        `      const newErrors = { ...formErrors };`,
        `      Object.keys(formData).forEach(key => {`,
        `        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {`,
        `          delete newErrors[key];`,
        `        }`,
        `      });`,
        `      setFormErrors(newErrors);`,
        `    }`,
        `  }, [formData]);`,
        `  `,
        `  // Initialize form data when currentItem changes or when switching to create mode`,
        `  useEffect(() => {`,
        `    if (formMode === 'edit' && currentItem) {`,
        `      setFormData({ ...currentItem });`,
        `    } else if (formMode === 'create') {`,
        `      // Initialize with empty values`,
        `      const initialData = {};`,
        `      ${displayFields.map(field => `      initialData.${camelCase(field.name)} = ${getDefaultValueForType(field)};`).join('\n')}`,
        `      setFormData(initialData);`,
        `    }`,
        `  }, [currentItem, formMode]);`,
        `  `
      ];
      
      // Add filtering and sorting effect if needed
      if (componentOptions.search || componentOptions.sorting) {
        const filteringCode = [
          `  // Apply filtering and sorting when data or filters change`,
          `  useEffect(() => {`,
          `    let result = [...data];`,
          `    `
        ];
        
        // Add search filter code if needed
        if (componentOptions.search) {
          filteringCode.push(
            `    // Apply search filter`,
            `    if (searchQuery) {`,
            `      const lowercasedQuery = searchQuery.toLowerCase();`,
            `      result = result.filter(item => {`,
            `        return ${displayFields.map(field => 
              `String(item.${camelCase(field.name)}).toLowerCase().includes(lowercasedQuery)`
            ).join(' || ')};`,
            `      });`,
            `    }`,
            `    `
          );
        }
        
        // Add sorting code if needed
        if (componentOptions.sorting) {
          filteringCode.push(
            `    // Apply sorting`,
            `    result.sort((a, b) => {`,
            `      const aValue = a[camelCase(sortBy)];`,
            `      const bValue = b[camelCase(sortBy)];`,
            `      `,
            `      if (aValue === bValue) return 0;`,
            `      `,
            `      if (sortDirection === 'asc') {`,
            `        return aValue < bValue ? -1 : 1;`,
            `      } else {`,
            `        return aValue > bValue ? -1 : 1;`,
            `      }`,
            `    });`,
            `    `
          );
        }
        
        // Add final part of the effect
        filteringCode.push(
          `    setFilteredData(result);`,
          `  }, [data${componentOptions.search ? ', searchQuery' : ''}${componentOptions.sorting ? ', sortBy, sortDirection' : ''}]);`
        );
        
        // Add the filtering code to the useEffectHooks
        useEffectHooks.push(filteringCode.join('\n'));
      }
      
      const useEffectHooksCode = useEffectHooks.filter(Boolean).join('\n');
      
      // Generate fetch data function and CRUD operations
      const fetchDataFunction = [
        `  // Function to fetch data from API`,
        `  const fetchData = async () => {`,
        `    try {`,
        componentOptions.crud ? 
        `      setLoading(prev => ({ ...prev, fetch: true }));` : 
        `      setLoading(true);`,
        `      const response = await axios.get(\`${API_BASE_URL}/${selectedTable}\`);`,
        `      setData(Array.isArray(response.data) ? response.data : []);`,
        `      if (componentOptions.pagination) {`,
        `        setTotalCount(response.headers['x-total-count'] || response.data.length);`,
        `      }`,
        `    } catch (error) {`,
        `      console.error('Error fetching data:', error);`,
        componentOptions.crud ? 
        `      setNotification({
        open: true,
        message: \`Error fetching data: \${error.message || 'Unknown error'}\`,
        severity: 'error'
      });` : '',
        `      // For demo purposes, set some mock data if API fails`,
        `      const mockData = Array(15).fill(null).map((_, index) => {`,
        `        const item = {};`,
        `        ${displayFields.map(field => {
          const fieldName = camelCase(field.name);
          if (field.primaryKey) {
            return `item.${fieldName} = index + 1;`;
          } else if (field.type.includes('VARCHAR') || field.type.includes('TEXT')) {
            return `item.${fieldName} = \`Sample ${field.name} \${index + 1}\`;`;
          } else if (field.type.includes('INT') || field.type.includes('DOUBLE') || field.type.includes('FLOAT')) {
            return `item.${fieldName} = (index + 1) * 10;`;
          } else if (field.type.includes('TIMESTAMP') || field.type.includes('DATE')) {
            return `item.${fieldName} = new Date(Date.now() - (index * 86400000)).toISOString();`;
          } else if (field.type.includes('BIT') || field.type.includes('BOOLEAN')) {
            return `item.${fieldName} = index % 2 === 0;`;
          } else {
            return `item.${fieldName} = \`Value \${index + 1}\`;`;
          }
        }).join('\n        ')}`,
        `        return item;`,
        `      });`,
        `      setData(mockData);`,
        `    } finally {`,
        componentOptions.crud ? 
        `      setLoading(prev => ({ ...prev, fetch: false }));` : 
        `      setLoading(false);`,
        `    }`,
        `  };`,
        
        componentOptions.crud ? 
        `
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
      const response = await axios.post(\`${API_BASE_URL}/${selectedTable}\`, formData);
      
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
        message: \`Error creating item: \${error.message || 'Unknown error'}\`,
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
      const response = await axios.put(\`${API_BASE_URL}/${selectedTable}/\${currentItem.id}\`, formData);
      
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
        message: \`Error updating item: \${error.message || 'Unknown error'}\`,
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
      await axios.delete(\`${API_BASE_URL}/${selectedTable}/\${itemToDelete.id}\`);
      
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
        message: \`Error deleting item: \${error.message || 'Unknown error'}\`,
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
    ${displayFields.filter(field => !field.nullable).map(field => 
      `if (formData.${camelCase(field.name)} === undefined || formData.${camelCase(field.name)} === null || formData.${camelCase(field.name)} === '') {
      errors.${camelCase(field.name)} = 'This field is required';
    }`
    ).join('\n    ')}
    
    return errors;
  };` : '',
        ``,
        `  // Function to update an existing item`,
        `  const updateItem = async () => {`,
        `    try {`,
        `      // Validate form data`,
        `      const errors = validateForm();`,
        `      if (Object.keys(errors).length > 0) {`,
        `        setFormErrors(errors);`,
        `        return;`,
        `      }`,
        ``,
        `      setLoading(prev => ({ ...prev, save: true }));`,
        `      const response = await axios.put(\`${API_BASE_URL}/${selectedTable}/\${currentItem.id}\`, formData);`,
        `      `,
        `      // Update the data list with the updated item`,
        `      setData(prev => prev.map(item => item.id === currentItem.id ? response.data : item));`,
        `      `,
        `      // Show success notification`,
        `      setNotification({`,
        `        open: true,`,
        `        message: 'Item updated successfully',`,
        `        severity: 'success'`,
        `      });`,
        `      `,
        `      // Return to list view`,
        `      setFormMode('list');`,
        `    } catch (error) {`,
        `      console.error('Error updating item:', error);`,
        `      setNotification({`,
        `        open: true,`,
        `        message: \`Error updating item: \${error.message || 'Unknown error'}\`,`,
        `        severity: 'error'`,
        `      });`,
        `    } finally {`,
        `      setLoading(prev => ({ ...prev, save: false }));`,
        `    }`,
        `  };`,
        ``,
        `  // Function to delete an item`,
        `  const deleteItem = async () => {`,
        `    try {`,
        `      if (!itemToDelete) return;`,
        `      `,
        `      setLoading(prev => ({ ...prev, delete: true }));`,
        `      await axios.delete(\`${API_BASE_URL}/${selectedTable}/\${itemToDelete.id}\`);`,
        `      `,
        `      // Remove the item from the data list`,
        `      setData(prev => prev.filter(item => item.id !== itemToDelete.id));`,
        `      `,
        `      // Show success notification`,
        `      setNotification({`,
        `        open: true,`,
        `        message: 'Item deleted successfully',`,
        `        severity: 'success'`,
        `      });`,
        `      `,
        `      // Close the delete dialog`,
        `      setDeleteDialogOpen(false);`,
        `      setItemToDelete(null);`,
        `    } catch (error) {`,
        `      console.error('Error deleting item:', error);`,
        `      setNotification({`,
        `        open: true,`,
        `        message: \`Error deleting item: \${error.message || 'Unknown error'}\`,`,
        `        severity: 'error'`,
        `      });`,
        `    } finally {`,
        `      setLoading(prev => ({ ...prev, delete: false }));`,
        `    }`,
        `  };`,
        ``,
        `  // Function to validate form data`,
        `  const validateForm = () => {`,
        `    const errors = {};`,
        `    `,
        `    // Validate required fields`,
        `    ${displayFields.filter(field => !field.nullable).map(field => 
          `if (formData.${camelCase(field.name)} === undefined || formData.${camelCase(field.name)} === null || formData.${camelCase(field.name)} === '') {
      errors.${camelCase(field.name)} = 'This field is required';
    }`
        ).join('\n    ')}`,
        `    `,
        `    return errors;`,
        `  };`
      ].join('\n');
      
      // Generate event handlers
      const eventHandlers = [
        // CRUD operation handlers
        componentOptions.crud ? 
        `  // Handle form input change
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
  ` : '',
        
        componentOptions.pagination ? 
        `  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  ` : '',
        
        componentOptions.sorting ? 
        `  // Handle sort request
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };
  ` : '',
        
        componentOptions.search ? 
        `  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  ` : '',
        
        componentOptions.refresh ? 
        `  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };
  ` : ''
      ].filter(Boolean).join('\n');
      
      // Generate helper functions
      const helperFunctions = [
        `  // Helper function to format date values`,
        `  const formatDate = (dateString) => {`,
        `    if (!dateString) return '';`,
        `    const date = new Date(dateString);`,
        `    return date.toLocaleDateString();`,
        `  };`,
        `  `,
        `  // Helper function to convert snake_case to camelCase`,
        `  const camelCase = (str) => {`,
        `    if (!str) return '';`,
        `    // First convert to lowercase and handle special characters`,
        `    const cleaned = str.toLowerCase().replace(/[^a-z0-9_]/g, '');`,
        `    // Then convert to camelCase`,
        `    return cleaned.replace(/^([A-Z])|_([a-z])/g, (match, p1, p2) => {`,
        `      return p2 ? p2.toUpperCase() : match.toLowerCase();`,
        `    });`,
        `  };`,
        `  `,
        `  // Helper function to format field values based on type`,
        `  const formatFieldValue = (value, type) => {`,
        `    if (value === null || value === undefined) return '-';`,
        `    `,
        `    switch (type) {`,
        `      case 'BOOLEAN':`,
        `        return value ? 'Yes' : 'No';`,
        `      case 'DATE':`,
        `      case 'DATETIME':`,
        `      case 'TIMESTAMP':`,
        `        return formatDate(value);`,
        `      default:`,
        `        return String(value);`,
        `    }`,
        `  };`
      ].join('\n');
      
      // Generate render section
      const renderSection = [
        `  // Get paginated data`,
        `  const paginatedData = ${componentOptions.pagination ? 
          `filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)` : 
          'filteredData'};`,
        `  `,
        `  return (`,
        `    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>`,
        `      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>`,
        `        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>`,
        `          ${pageTitle}`,
        `        </Typography>`,
        `        `,
        `        <Box sx={{ display: 'flex', gap: 2 }}>`,
        componentOptions.search ? 
        `          <TextField
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
          />` : '',
        componentOptions.refresh ? 
        `          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>` : '',
        `          <Button`,
        `            variant="contained"`,
        `            startIcon={<AddIcon />}`,
        `            onClick={() => ${componentOptions.crud ? 'handleCreateClick()' : "console.log('Add new item')"}}`,
        `          >`,
        `            Add New`,
        `          </Button>`,
        `        </Box>`,
        `      </Box>`,
        `      `,
        `      {loading ? (`,
        `        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>`,
        `          <CircularProgress />`,
        `        </Box>`,
        `      ) : (`,
        `        <>`,
        `          <TableContainer>`,
        `            <Table>`,
        `              <TableHead>`,
        `                <TableRow>`,
        displayFields.map(field => 
          `                  <TableCell${componentOptions.sorting && field.sortable ? 
            `\n                    onClick={() => handleSort('${field.name}')}\n                    sx={{ cursor: 'pointer' }}` : 
            ''}>` +
          `\n                    <Box sx={{ display: 'flex', alignItems: 'center' }}>` +
          `\n                      ${field.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` +
          (componentOptions.sorting && field.sortable ? 
            `\n                      {sortBy === '${field.name}' && (` +
            `\n                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />` +
            `\n                      )}` : '') +
          `\n                    </Box>` +
          `\n                  </TableCell>`
        ).join('\n'),
        `                  <TableCell>Actions</TableCell>`,
        `                </TableRow>`,
        `              </TableHead>`,
        `              <TableBody>`,
        `                {paginatedData.length > 0 ? (`,
        `                  paginatedData.map((row) => (`,
        `                    <TableRow key={row.id}>`,
        displayFields.map(field => 
          `                      <TableCell>${
            field.type === 'BOOLEAN' ? 
              `{row.${camelCase(field.name)} ? 'Yes' : 'No'}` : 
            (field.type === 'DATE' || field.type === 'DATETIME' || field.type === 'TIMESTAMP') ? 
              `{formatDate(row.${camelCase(field.name)})}` : 
              `{formatFieldValue(row.${camelCase(field.name)}, '${field.type}')}`
          }</TableCell>`
        ).join('\n'),
        `                      <TableCell>`,
        `                        <Box sx={{ display: 'flex', gap: 1 }}>`,
        componentOptions.crud ? 
        `                          <Tooltip title="View">
                            <IconButton size="small" color="info" onClick={() => handleViewClick(row)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => handleEditClick(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>` :
        `                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => console.log('Edit', row.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => console.log('Delete', row.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>`,
        `                        </Box>`,
        `                      </TableCell>`,
        `                    </TableRow>`,
        `                  ))`,
        `                ) : (`,
        `                  <TableRow>`,
        `                    <TableCell colSpan={${displayFields.length + 1}} align="center">`,
        `                      No data available`,
        `                    </TableCell>`,
        `                  </TableRow>`,
        `                )}`,
        `              </TableBody>`,
        `            </Table>`,
        `          </TableContainer>`,
        componentOptions.pagination ? 
        `          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />` : '',
        `        </>`,
        `      )}`,
        `    </Paper>`,
        `  );`
      ].filter(Boolean).join('\n');
      
      // Combine all sections
      const componentCode = [
        imports,
        '',
        `// ${componentName} Component`,
        `const ${componentName} = () => {`,
        stateVariables,
        '',
        useEffectHooksCode,
        '',
        fetchDataFunction,
        '',
        eventHandlers,
        '',
        helperFunctions,
        '',
        renderSection,
        '};',
        '',
        `export default ${componentName};`
      ].join('\n');
      
      setGeneratedCode(componentCode);
      
      setNotification({
        open: true,
        message: 'Component code generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating component code:', error);
      setNotification({
        open: true,
        message: 'Failed to generate component code: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setLoading({ ...loading, generation: false });
    }
  };

  // Function to copy code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setNotification({
      open: true,
      message: 'Code copied to clipboard',
      severity: 'success'
    });
  };

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // camelCase function is already defined in the generated code

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: '100%', 
        overflow: 'hidden',
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
      }}
    >
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
            Page Creator
          </Typography>
          <Typography paragraph>
            Select a table, customize fields, and generate a React component for displaying and managing the data.
          </Typography>
        </Grid>
        
        {/* Table Selection */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            bgcolor: '#f8f9fa', 
            p: 3, 
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            height: '100%'
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
              <TableChartIcon sx={{ mr: 1 }} /> Table Selection
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="table-select-label">Select Table</InputLabel>
              <Select
                labelId="table-select-label"
                id="table-select"
                value={selectedTable}
                label="Select Table"
                onChange={handleTableSelect}
                disabled={loading.tables}
              >
                <MenuItem value="">
                  <em>Select a table</em>
                </MenuItem>
                {availableTables.map((table) => (
                  <MenuItem key={table} value={table}>
                    {table}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAvailableTables}
              disabled={loading.tables}
              sx={{ 
                mt: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {loading.tables ? <CircularProgress size={24} /> : 'Refresh Tables'}
            </Button>
          </Box>
        </Grid>
        
        {/* Component Options */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            bgcolor: '#f8f9fa', 
            p: 3, 
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            height: '100%'
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
              <CodeIcon sx={{ mr: 1 }} /> Component Options
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Component Name"
                  variant="outlined"
                  value={componentOptions.componentName}
                  onChange={(e) => handleOptionChange('componentName', e.target.value)}
                  disabled={!selectedTable}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Page Title"
                  variant="outlined"
                  value={componentOptions.pageTitle}
                  onChange={(e) => handleOptionChange('pageTitle', e.target.value)}
                  disabled={!selectedTable}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Features:
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.pagination}
                      onChange={(e) => handleOptionChange('pagination', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="Pagination"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.sorting}
                      onChange={(e) => handleOptionChange('sorting', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="Sorting"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.filtering}
                      onChange={(e) => handleOptionChange('filtering', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="Filtering"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.search}
                      onChange={(e) => handleOptionChange('search', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="Search"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.refresh}
                      onChange={(e) => handleOptionChange('refresh', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="Refresh"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={componentOptions.crud}
                      onChange={(e) => handleOptionChange('crud', e.target.checked)}
                      disabled={!selectedTable}
                    />
                  }
                  label="CRUD Operations"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* Field Selection */}
        {loading.metadata ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Loading table metadata...
              </Typography>
            </Box>
          </Grid>
        ) : tableMetadata && (
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: '#f0f4f8', 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #d0d9e1'
            }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#2c3e50'
                }}
              >
                <VisibilityIcon sx={{ mr: 1 }} /> Field Selection & Ordering
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#546e7a' }}>
                Select fields to display in the component and drag to reorder them.
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {selectedFields.length === 0 ? (
                <Box sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0',
                  p: 3,
                  textAlign: 'center',
                  mb: 2
                }}>
                  <Typography variant="body1" color="text.secondary">
                    No fields available for this table.
                  </Typography>
                </Box>
              ) : (
                <List
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0',
                    mb: 2
                  }}
                >
                  {selectedFields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                    <ListItem
                      key={field.name}
                      divider
                      sx={{ 
                        bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => moveFieldUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => moveFieldDown(index)}
                            disabled={index === selectedFields.length - 1}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemIcon>
                                <ListItemText 
                                  primary={field.name} 
                                  secondary={
                                    <>
                                      {`Type: ${field.type}`}
                                      {field.primaryKey ? ' (Primary Key)' : ''}
                                      {field.nullable === false ? ' (Required)' : ' (Optional)'}
                                      {field.size ? ` (Size: ${field.size})` : ''}
                                    </>
                                  }
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  {componentOptions.sorting && (
                                    <Tooltip title={field.sortable ? "Sortable" : "Not sortable"}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={field.sortable}
                                            onChange={(e) => handleFieldPropertyChange(field.name, 'sortable', e.target.checked)}
                                            size="small"
                                            icon={<SortIcon color="disabled" />}
                                            checkedIcon={<SortIcon color="primary" />}
                                          />
                                        }
                                        label=""
                                      />
                                    </Tooltip>
                                  )}
                                  {componentOptions.filtering && (
                                    <Tooltip title={field.filterable ? "Filterable" : "Not filterable"}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={field.filterable}
                                            onChange={(e) => handleFieldPropertyChange(field.name, 'filterable', e.target.checked)}
                                            size="small"
                                            icon={<FilterIcon color="disabled" />}
                                            checkedIcon={<FilterIcon color="primary" />}
                                          />
                                        }
                                        label=""
                                      />
                                    </Tooltip>
                                  )}
                                  <Tooltip title={field.selected ? "Visible" : "Hidden"}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={field.selected}
                                          onChange={() => handleFieldToggle(field.name)}
                                          size="small"
                                          icon={<VisibilityOffIcon color="disabled" />}
                                          checkedIcon={<VisibilityIcon color="primary" />}
                                        />
                                      }
                                      label=""
                                    />
                                  </Tooltip>
                                </Box>
                              </ListItem>
                    ))}
                </List>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedFields.filter(f => f.selected).length} of {selectedFields.length} fields selected
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon fontSize="small" />}
                    onClick={() => setSelectedFields(prevFields => 
                      prevFields.map(field => ({ ...field, selected: true }))
                    )}
                    disabled={selectedFields.length > 0 && selectedFields.every(field => field.selected)}
                    sx={{ mr: 1 }}
                    color="primary"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityOffIcon fontSize="small" />}
                    onClick={() => setSelectedFields(prevFields => 
                      prevFields.map(field => ({ ...field, selected: false }))
                    )}
                    disabled={selectedFields.length === 0 || selectedFields.every(field => !field.selected)}
                    color="secondary"
                  >
                    Deselect All
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
        
        {/* Generate and Save Buttons */}
        {tableMetadata && (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Generate Button */}
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={loading.generation ? null : <CodeIcon />}
                  onClick={generateComponentCode}
                  disabled={loading.generation || selectedFields.filter(f => f.selected).length === 0}
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
                  {loading.generation ? <CircularProgress size={24} /> : 'Generate Component'}
                </Button>
              </Grid>
              
              {/* Save Button */}
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={loading.saving ? null : <ContentCopyIcon />}
                  onClick={saveComponentToFile}
                  disabled={loading.saving || !generatedCode}
                  fullWidth
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(156, 39, 176, 0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 10px rgba(156, 39, 176, 0.3)',
                    }
                  }}
                >
                  {loading.saving ? <CircularProgress size={24} /> : 'Save Component'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        
        {/* Generated Code */}
        {generatedCode && (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ 
              bgcolor: '#f0f4f8', 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #d0d9e1'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#2c3e50'
                  }}
                >
                  <CodeIcon sx={{ mr: 1 }} /> Generated Component
                </Typography>
                <Tooltip title="Copy code to clipboard">
                  <IconButton 
                    onClick={copyCodeToClipboard} 
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
                  p: 2, 
                  bgcolor: '#1e293b', 
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  borderRadius: 1,
                  fontSize: '0.9rem',
                  maxHeight: '500px',
                  overflow: 'auto',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                }}
              >
                {generatedCode}
              </Paper>
            </Box>
          </Grid>
        )}
      </Grid>
      
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

export default PageCreator;