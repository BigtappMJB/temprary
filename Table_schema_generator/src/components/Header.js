import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Notifications,
  Security,
  Person,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = ({ currentView, drawerWidth, onMenuItemClick }) => {
  const { currentUser, logout, hasRole } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!currentUser) return '?';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };
  
  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#d32f2f'; // red
      case 'developer':
        return '#1976d2'; // blue
      case 'user':
        return '#388e3c'; // green
      default:
        return '#757575'; // grey
    }
  };
  
  // Handle menu open
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle notification menu open
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle notification menu close
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  
  // Handle menu item click
  const handleMenuItemClick = (action) => {
    handleMenuClose();
    if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      onMenuItemClick('profile');
    } else if (action === 'rolePermissions') {
      onMenuItemClick('rolePermissions');
    }
  };
  
  // Format view name for display
  const formatViewName = (view) => {
    if (view.startsWith('generated-')) {
      return view.replace('generated-', '');
    }
    return view.charAt(0).toUpperCase() + view.slice(1);
  };
  
  // User menu
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      id="user-menu"
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          mt: 1.5,
          width: 220,
          borderRadius: 2,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          }
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {currentUser && (
        <>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {currentUser.firstName} {currentUser.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{currentUser.username}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'inline-block', 
                mt: 0.5, 
                bgcolor: getRoleColor(currentUser.role),
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              {currentUser.role}
            </Typography>
          </Box>
          <Divider />
        </>
      )}
      
      <MenuItem onClick={() => handleMenuItemClick('profile')}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      
      <MenuItem onClick={() => handleMenuItemClick('settings')}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      
      {currentUser && hasRole('admin') && (
        <MenuItem onClick={() => handleMenuItemClick('rolePermissions')}>
          <ListItemIcon>
            <Security fontSize="small" />
          </ListItemIcon>
          Role Permissions
        </MenuItem>
      )}
      
      <Divider />
      
      <MenuItem onClick={() => handleMenuItemClick('logout')}>
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        <Typography color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );
  
  // Notification menu
  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      id="notification-menu"
      keepMounted
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          mt: 1.5,
          width: 320,
          maxWidth: '90vw',
          borderRadius: 2
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Notifications
        </Typography>
      </Box>
      <Divider />
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No new notifications
        </Typography>
      </Box>
    </Menu>
  );
  
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo in AppBar for mobile */}
        {isMobile && (
          <Box
            component="img"
            src="/assets/bigtapp_pte_ltd_logo.jpeg"
            alt="BigTapp Logo"
            sx={{
              height: '32px',
              width: 'auto',
              borderRadius: '4px',
              mr: 2
            }}
          />
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentView.startsWith('generated-') 
            ? `Table Schema Generator - ${formatViewName(currentView)}`
            : `Table Schema Generator - ${formatViewName(currentView)}`
          }
        </Typography>
        
        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Theme toggle button - just for show in this demo */}
          <Tooltip title="Toggle theme">
            <IconButton
              size="large"
              color="inherit"
              sx={{ ml: 1 }}
            >
              <LightMode />
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User menu */}
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              {currentUser ? (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: getRoleColor(currentUser.role),
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials()}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      {userMenu}
      {notificationMenu}
    </AppBar>
  );
};

export default Header;