import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const DatabaseConfig = () => {
  // State for database configuration
  const [config, setConfig] = useState({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: ''
  });
  
  // State for connection status
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    testing: false,
    error: null
  });
  
  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for saving status
  const [saving, setSaving] = useState(false);
  
  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('databaseConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing saved database configuration:', error);
      }
    }
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save configuration
  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage
      localStorage.setItem('databaseConfig', JSON.stringify(config));
      
      // Send to backend (if needed)
      // await axios.post('/api/config/database', config);
      
      setNotification({
        open: true,
        message: 'Database configuration saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving database configuration:', error);
      
      setNotification({
        open: true,
        message: 'Error saving database configuration: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle test connection
  const handleTestConnection = async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, testing: true, error: null }));
      
      // Send test connection request to backend
      const response = await axios.post('/api/config/testConnection', config);
      
      if (response.data.success) {
        setConnectionStatus({
          connected: true,
          testing: false,
          error: null
        });
        
        setNotification({
          open: true,
          message: 'Connection successful!',
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Connection failed');
      }
    } catch (error) {
      console.error('Error testing database connection:', error);
      
      setConnectionStatus({
        connected: false,
        testing: false,
        error: error.message || 'Connection failed'
      });
      
      setNotification({
        open: true,
        message: 'Connection failed: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Database Configuration
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" noValidate autoComplete="off">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Host"
            name="host"
            value={config.host}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Port"
            name="port"
            value={config.port}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Username"
            name="user"
            value={config.user}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={config.password}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
        </Box>
        
        <TextField
          label="Database"
          name="database"
          value={config.database}
          onChange={handleInputChange}
          fullWidth
          size="small"
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {connectionStatus.connected && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Connected to database
              </Alert>
            )}
            {connectionStatus.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {connectionStatus.error}
              </Alert>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleTestConnection}
              disabled={connectionStatus.testing || saving}
            >
              {connectionStatus.testing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveConfig}
              disabled={connectionStatus.testing || saving}
            >
              {saving ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default DatabaseConfig;