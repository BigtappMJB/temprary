import React from "react";
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
  styled,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

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
  const displayName = pageName || tableName || "Dynamic Page";
  const endpoint = apiEndpoint || `api/${tableName || "dynamic"}`;

  // Create the component
  const DynamicComponent = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Mock columns based on the table name
    const columns = [
      { id: "id", label: "ID", minWidth: 50 },
      { id: "name", label: "Name", minWidth: 170 },
      { id: "description", label: "Description", minWidth: 200 },
      { id: "status", label: "Status", minWidth: 100 },
      { id: "createdAt", label: "Created At", minWidth: 120 },
    ];

    // Mock data generation
    const generateMockData = () => {
      const mockData = [];
      for (let i = 1; i <= 10; i++) {
        mockData.push({
          id: i,
          name: `${displayName} Item ${i}`,
          description: `This is a sample description for ${displayName} item ${i}`,
          status: i % 3 === 0 ? "Inactive" : "Active",
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
          ).toLocaleDateString(),
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
          setData(
            data.map((item) =>
              item.id === currentItem.id ? { ...currentItem } : item
            )
          );
        } else {
          // Create new item
          const newItem = {
            id: data.length + 1,
            name: "New Item",
            description: "New item description",
            status: "Active",
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
      if (window.confirm("Are you sure you want to delete this item?")) {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setData(data.filter((item) => item.id !== id));
          setLoading(false);
        }, 600);
      }
    };

    // Filter data based on search term
    const filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Box>
        <h1>Helllpoo</h1>
      </Box>
    );
  };

  return DynamicComponent;
};

export default generateDynamicComponent;
