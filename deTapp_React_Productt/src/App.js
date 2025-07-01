/* eslint-disable react/react-in-jsx-scope */
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes, useNavigate } from "react-router-dom";
import getRoutes from "./routes/Router";

import { DialogProvider } from "./views/utilities/alerts/DialogContent";
import { baselightTheme } from "./theme/DefaultColors";
import AlertDialog from "./views/utilities/alerts/AlertDialog";
import { LoadingProvider } from "./components/Loading/loadingProvider";
import LoadingScreen from "./components/Loading/LoaderComponent";
import { useEffect, useState } from "react";
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const theme = baselightTheme;
  const [routes, setRoutes] = useState([]); // State to store the resolved routes
  const navigate = useNavigate();

  // Handle redirect after reload for dynamic pages
  useEffect(() => {
    // Check for redirect in localStorage (new method)
    const shouldRedirect = localStorage.getItem('redirectToNewPage');
    const newPagePath = localStorage.getItem('newPagePath');
    
    if (shouldRedirect === 'true' && newPagePath) {
      console.log('App.js detected redirect to newly created page:', newPagePath);
      
      // Only redirect if we're not already on the dashboard
      // This prevents duplicate redirects since Dashboard component also handles this
      if (!window.location.pathname.includes('/dashboard')) {
        // Normalize the path to ensure it starts with a slash
        const normalizedPath = newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`;
        
        console.log('Normalized path for redirect:', normalizedPath);
        
        // Wait for routes to be loaded before redirecting
        if (routes.length > 0) {
          console.log('Routes are loaded, proceeding with redirect');
          
          // Clear the flags
          localStorage.removeItem('redirectToNewPage');
          localStorage.removeItem('newPagePath');
          localStorage.removeItem('newPageName');
          
          // Use a small delay to ensure routes are fully processed
          setTimeout(() => {
            console.log('Navigating to:', normalizedPath);
            navigate(normalizedPath);
          }, 1500);
        } else {
          console.log('Routes not yet loaded, waiting...');
        }
      }
    }
    
    // Check for redirect in sessionStorage (old method - keeping for backward compatibility)
    const redirectPath = sessionStorage.getItem('redirectAfterReload');
    if (redirectPath) {
      console.log('Redirecting to:', redirectPath);
      // Clear the stored path to prevent redirect loops
      sessionStorage.removeItem('redirectAfterReload');
      // Use a small delay to ensure routes are loaded
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    }
  }, [navigate, routes.length]);

  // Load the routes asynchronously using useEffect
  useEffect(() => {
    // Check if we need to force refresh routes due to a new page
    const shouldRedirect = localStorage.getItem('redirectToNewPage');
    const newPagePath = localStorage.getItem('newPagePath');
    const forceRefresh = shouldRedirect === 'true' && newPagePath;
    
    if (forceRefresh) {
      console.log("App.js detected need to force refresh routes for new page:", newPagePath);
    }
    
    // Call getRoutes to get the routes and update the state when they are loaded
    // Pass forceRefresh flag to ensure we get fresh routes if needed
    getRoutes(forceRefresh)
      .then((resolvedRoutes) => {
        console.log("Routes loaded successfully, updating application state");
        setRoutes(resolvedRoutes);
      })
      .catch((error) => {
        console.error("Error loading routes:", error); // Handle error appropriately
      });
  }, []); // Empty dependency array to load the routes only once

  // Use the routes only when they are loaded (not null)
  const routing = useRoutes(routes);

  return (
    <LoadingProvider>
      <DialogProvider>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {routing}
            <AlertDialog />
          </ThemeProvider>
        </NotificationProvider>
      </DialogProvider>
      <LoadingScreen />
    </LoadingProvider>
  );
}

export default App;
