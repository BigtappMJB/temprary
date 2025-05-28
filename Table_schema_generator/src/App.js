import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Typography, 
  Box, 
  AppBar, 
  Toolbar, 
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import TableSchemaGenerator from './components/TableSchemaGenerator';
import PageCreator from './components/PageCreator';
// import SmartDataPage from './components/SmartDataPage'
import Sidebar from './components/Sidebar';
import DatabaseConfig from './components/DatabaseConfig';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';
import { AuthProvider } from './context/AuthContext';

// Dynamically import generated components
const importComponent = (componentName) => {
  try {
    return lazy(() => import(`./components/generated/${componentName}`));
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error);
    return null;
  }
};

// Drawer width for desktop
const drawerWidth = 240;



function App() {
  const [currentView, setCurrentView] = useState('tableDesigner');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Set document title based on current view
  useEffect(() => {
    const viewTitles = {
      dashboard: 'Dashboard',
      tableDesigner: 'Table Designer',
      codeGenerator: 'Page Creator',
      // smartData: 'Smart Data',
      history: 'History',
      settings: 'Settings',
      dbConfig: 'Database Configuration',
      help: 'Help'
    };
    
    // For generated components, extract the component name
    let title = viewTitles[currentView] || 'Table Designer';
    if (currentView.startsWith('generated-')) {
      const componentName = currentView.replace('generated-', '');
      title = componentName;
    }
    
    document.title = `${title} | Schema Generator`;
  }, [currentView]);

  const handleMenuItemClick = (itemId) => {
    setCurrentView(itemId);
  };

  const renderContent = () => {
    // Check if the current view is a dynamically generated component
    if (currentView.startsWith('generated-')) {
      const componentName = currentView.replace('generated-', '');
      try {
        // Use lazy loading to import the component
        const DynamicComponent = lazy(() => {
          return import(`./components/generated/${componentName}`)
            .catch(error => {
              console.error(`Error importing component ${componentName}:`, error);
              // Return a module with a default export that renders an error message
              return { 
                default: () => (
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" color="error" gutterBottom>Component Error</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography paragraph>
                      Failed to load the component "{componentName}". The component might not exist or there might be an error in the code.
                    </Typography>
                  </Paper>
                )
              };
            });
        });
        
        return (
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ ml: 2 }}>Loading component...</Typography>
            </Box>
          }>
            <DynamicComponent />
          </Suspense>
        );
      } catch (error) {
        console.error(`Error loading dynamic component: ${componentName}`, error);
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" color="error" gutterBottom>Component Error</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Failed to load the component "{componentName}". Error: {error.message}
            </Typography>
          </Paper>
        );
      }
    }
    
    // Handle standard views
    switch (currentView) {
      case 'tableDesigner':
        return <TableSchemaGenerator />;
      case 'dashboard':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Dashboard</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Welcome to the Table Schema Generator dashboard. This tool helps you design database tables
              and generate corresponding Spring Boot code.
            </Typography>
            <Typography paragraph>
              Use the sidebar menu to navigate between different sections of the application.
            </Typography>
          </Paper>
        );
      case 'codeGenerator':
        return <PageCreator />;
      // case 'smartData':
      //   return <SmartDataPage />;
      case 'history':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>History</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              View your previously generated table schemas and code.
            </Typography>
            <Typography paragraph>
              This feature is coming soon.
            </Typography>
          </Paper>
        );
      case 'settings':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Configure application settings and preferences.
            </Typography>
            <Typography paragraph>
              This feature is coming soon.
            </Typography>
          </Paper>
        );
      case 'dbConfig':
        return <DatabaseConfig />;
      case 'profile':
        return <UserProfile />;
      case 'rolePermissions':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Role Permissions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Manage user roles and permissions for the application.
            </Typography>
            <Typography paragraph>
              This feature is coming soon.
            </Typography>
          </Paper>
        );
      case 'help':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Help</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Need help using the Table Schema Generator?
            </Typography>
            <Typography paragraph>
              This section provides documentation and guidance on how to use the application.
            </Typography>
            <Typography variant="h6" gutterBottom>Quick Start</Typography>
            <Typography paragraph>
              1. Go to the Table Designer section
            </Typography>
            <Typography paragraph>
              2. Enter a table name
            </Typography>
            <Typography paragraph>
              3. Add fields with their properties (name, type, primary key)
            </Typography>
            <Typography paragraph>
              4. Click "Generate Table & API" to send the request to the backend
            </Typography>
          </Paper>
        );
      default:
        return <TableSchemaGenerator />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
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
              ? `Table Schema Generator - ${currentView.replace('generated-', '')}`
              : `Table Schema Generator - ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`
            }
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: 'flex', pt: '64px' }}>
        {/* Desktop sidebar on the left */}
        {!isMobile && (
          <Sidebar 
            onMenuItemClick={handleMenuItemClick} 
            currentView={currentView} 
          />
        )}
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            ml: isMobile ? 0 : 0,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            minHeight: 'calc(100vh - 64px)',
            overflowX: 'hidden'
          }}
        >
          {/* Mobile sidebar at the top */}
          {isMobile && <Sidebar onMenuItemClick={handleMenuItemClick} currentView={currentView} />}
          
          {/* Main content */}
          {renderContent()}
          
          {/* Footer for mobile */}
          {isMobile && (
            <Box 
              sx={{ 
                mt: 4, 
                pt: 2, 
                borderTop: '1px solid rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                BigTapp Pte Ltd • Version 1.0.0
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// Wrap the App component with the AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;