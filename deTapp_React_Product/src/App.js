/* eslint-disable react/react-in-jsx-scope */
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import setupRouter from "./routes/Router";

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

  // Load the routes asynchronously using useEffect
  useEffect(() => {
    // Call setupRouter to get the routes and update the state when they are loaded
    setupRouter
      .then((resolvedRoutes) => {
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
