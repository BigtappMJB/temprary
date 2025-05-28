import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Collapse,
  ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TableChart as TableChartIcon,
  Code as CodeIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Help as HelpIcon,
  ViewList as ViewListIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Drawer width
const drawerWidth = 240;

const Sidebar = ({ onMenuItemClick, currentView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [generatedComponents, setGeneratedComponents] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const { currentUser, hasRole } = useAuth();

  // Function to check if a component exists
  const checkComponentExists = async (componentName) => {
    try {
      // Try to dynamically import the component
      await import(`../components/generated/${componentName}`);
      return true;
    } catch (error) {
      console.log(`Component ${componentName} not found`);
      return false;
    }
  };

  // Load generated components on mount
  useEffect(() => {
    const loadGeneratedComponents = async () => {
      // List of components to check - hardcoded for fallback
      const componentsToCheck = ['SmartdataTable', 'SampleTableTable'];
      const foundComponents = [];

      try {
        // First try to dynamically discover all components in the generated directory
        const context = require.context('../components/generated', false, /\.(js|jsx)$/);
        const componentFiles = context.keys();
        
        // Extract component names from file paths
        for (const file of componentFiles) {
          // Extract the filename without extension (e.g., './SampleTableTable.jsx' -> 'SampleTableTable')
          const componentName = file.replace(/^\.\//, '').replace(/\.(js|jsx)$/, '');
          
          // Format the display name (e.g., SampleTableTable -> Sample Table Table)
          const displayName = componentName
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
            .replace(/Table$/, ' Table'); // Add space before "Table" at the end
          
          foundComponents.push({
            id: `generated-${componentName}`,
            text: displayName,
            icon: <ViewListIcon />
          });
        }
      } catch (error) {
        console.error('Error discovering components dynamically:', error);
        
        // Fallback to checking hardcoded components if dynamic discovery fails
        for (const componentName of componentsToCheck) {
          const exists = await checkComponentExists(componentName);
          if (exists) {
            // Format the display name
            const displayName = componentName
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
              .replace(/Table$/, ' Table'); // Add space before "Table" at the end
            
            foundComponents.push({
              id: `generated-${componentName}`,
              text: displayName,
              icon: <ViewListIcon />
            });
          }
        }
      }

      setGeneratedComponents(foundComponents);
    };

    loadGeneratedComponents();
  }, []);

  const staticMenuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'tableDesigner', text: 'Table Designer', icon: <TableChartIcon /> },
    { id: 'codeGenerator', text: 'Page Creator', icon: <CodeIcon /> },
    // { id: 'smartData', text: 'Smart Data', icon: <TableChartIcon /> },
    { id: 'history', text: 'History', icon: <HistoryIcon /> },
    { id: 'settings', text: 'Settings', icon: <SettingsIcon /> },
    { id: 'dbConfig', text: 'Database Config', icon: <StorageIcon /> },
    { id: 'help', text: 'Help', icon: <HelpIcon /> }
  ];

  // Toggle submenu
  const handleToggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  // User menu items
  const userMenuItems = [
    { id: 'profile', text: 'User Profile', icon: <PersonIcon /> },
    ...(hasRole('admin') ? [{ id: 'rolePermissions', text: 'Role Permissions', icon: <SecurityIcon /> }] : [])
  ];

  // Combine static menu items with generated components
  const menuItems = [...staticMenuItems, ...generatedComponents];

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
    >
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white'
        }}
      >
        <Box
          component="img"
          src="/assets/bigtapp_pte_ltd_logo.jpeg"
          alt="BigTapp Logo"
          sx={{
            width: '100%',
            maxWidth: '140px',
            height: 'auto',
            mb: 1,
            borderRadius: '4px'
          }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.id} 
            onClick={() => onMenuItemClick(item.id)}
            selected={currentView === item.id}
            sx={{
              my: 0.5,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                borderLeft: '4px solid #1976d2',
                pl: 2
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)'
              },
              transition: 'all 0.2s'
            }}
          >
            <ListItemIcon sx={{ 
              color: currentView === item.id ? '#1976d2' : 'inherit',
              minWidth: '40px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: currentView === item.id ? 'bold' : 'normal',
                color: currentView === item.id ? '#1976d2' : 'inherit'
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* User section */}
      {currentUser && (
        <List>
          <ListItemButton onClick={handleToggleSubMenu}>
            <ListItemIcon>
              <AdminIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="User Settings" 
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
            {openSubMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {userMenuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.id} 
                  onClick={() => onMenuItemClick(item.id)}
                  selected={currentView === item.id}
                  sx={{
                    pl: 4,
                    my: 0.5,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                      borderLeft: '4px solid #1976d2',
                      pl: 4
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: currentView === item.id ? '#1976d2' : 'inherit',
                    minWidth: '40px'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: currentView === item.id ? 'bold' : 'normal',
                      color: currentView === item.id ? '#1976d2' : 'inherit'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      )}
      
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ 
        p: 2, 
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          BigTapp Pte Ltd
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  // For mobile, we'll use a horizontal scrollable menu
  if (isMobile) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          width: '100%', 
          mb: 3, 
          p: 1.5, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f7fa, #ffffff)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
            scrollbarWidth: 'none', // Hide scrollbar in Firefox
            msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
            '&::-webkit-scrollbar': { // Hide scrollbar in Chrome/Safari
              display: 'none'
            },
            pb: 1, // Add padding to account for hidden scrollbar
            gap: 1,
            justifyContent: { xs: 'flex-start', sm: 'center' }
          }}
        >
          {/* Logo for mobile */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              mr: 1,
              borderRight: '1px solid rgba(0,0,0,0.1)',
              minWidth: '70px'
            }}
          >
            <Box
              component="img"
              src="/assets/bigtapp_pte_ltd_logo.jpeg"
              alt="BigTapp Logo"
              sx={{
                width: '40px',
                height: 'auto',
                borderRadius: '4px'
              }}
            />
          </Box>
          
          {/* Main menu items */}
          {menuItems.map((item) => (
            <Box 
              key={item.id}
              onClick={() => onMenuItemClick(item.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: currentView === item.id ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                },
                minWidth: { xs: '70px', sm: '90px' },
                transition: 'all 0.2s',
                border: currentView === item.id ? '1px solid rgba(25, 118, 210, 0.3)' : '1px solid transparent',
                flexShrink: 0 // Prevent items from shrinking
              }}
            >
              <Box sx={{ 
                color: currentView === item.id ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                mb: 0.5
              }}>
                {item.icon}
              </Box>
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  fontWeight: currentView === item.id ? 'bold' : 'normal',
                  color: currentView === item.id ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
          
          {/* User menu items */}
          {currentUser && userMenuItems.map((item) => (
            <Box 
              key={item.id}
              onClick={() => onMenuItemClick(item.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: currentView === item.id ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                },
                minWidth: { xs: '70px', sm: '90px' },
                transition: 'all 0.2s',
                border: currentView === item.id ? '1px solid rgba(25, 118, 210, 0.3)' : '1px solid transparent',
                flexShrink: 0 // Prevent items from shrinking
              }}
            >
              <Box sx={{ 
                color: currentView === item.id ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                mb: 0.5
              }}>
                {item.icon}
              </Box>
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  fontWeight: currentView === item.id ? 'bold' : 'normal',
                  color: currentView === item.id ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  // For desktop, we'll use a permanent drawer
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          borderLeft: 'none'
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;