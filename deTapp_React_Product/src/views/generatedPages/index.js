import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  styled,
} from "@mui/material";
import MJBCrud from "./components/MJBCrud";
import generateDynamicComponent from "./components/DynamicComponentGenerator";

/**
 * This file serves as the entry point for dynamically generated pages.
 * It provides a mechanism to load components based on the requested page name.
 */

// Loading component shown while the dynamic page is being loaded
const LoadingComponent = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Loading page...
    </Typography>
  </Box>
);

// Fallback component shown when a page cannot be loaded
const PageNotFound = ({ pageName }) => (
  <Box
    sx={{
      textAlign: "center",
      p: 4,
      mt: 4,
    }}
  >
    <Typography variant="h4" color="error" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1">
      The requested page "{pageName}" could not be found or loaded.
    </Typography>
  </Box>
);

/**
 * DynamicPageLoader - Attempts to load a component based on the page name
 * If the component doesn't exist, it automatically generates one
 *
 * @param {Object} props - Component props
 * @param {string} props.pageName - Name of the page to load
 * @param {string} props.routePath - Route path for the page
 * @returns {JSX.Element} The loaded component or a generated one
 */
const DynamicPageLoader = ({ pageName, routePath }) => {
  const [loadError, setLoadError] = useState(false);

  // If no page name is provided, show an error
  if (!pageName) {
    return <PageNotFound pageName="unknown" />;
  }

  console.log(`Attempting to load dynamic page: ${pageName}`);

  // Normalize the page name to lowercase for consistency
  const normalizedPageName = pageName.toLowerCase();

  // If we already know there's an error, generate a dynamic component
  if (loadError) {
    console.log(`Generating dynamic component for ${normalizedPageName}`);

    // Generate a dynamic component based on the page name
    const GeneratedComponent = generateDynamicComponent({
      tableName: normalizedPageName,
      pageName:
        normalizedPageName.charAt(0).toUpperCase() +
        normalizedPageName.slice(1),
      apiEndpoint: `api/${normalizedPageName}`,
    });

    return <GeneratedComponent />;
  }

  // Create a dynamic import path based on the page name
  const DynamicComponent = lazy(() => {
    console.log(`Importing dynamic page from ./${normalizedPageName}`);

    // Generate a dynamic component based on the page name
    const GeneratedComponent = generateDynamicComponent({
      tableName: normalizedPageName,
      pageName:
        normalizedPageName.charAt(0).toUpperCase() +
        normalizedPageName.slice(1),
      apiEndpoint: `api/${normalizedPageName}`,
    });

    // First try to import from a subdirectory with index.js (most common pattern)
    return import(`./${normalizedPageName}/index`).catch((indexError) => {
      console.log(
        `Failed to load ./${normalizedPageName}/index, trying direct import...`
      );

      // If that fails, try to import the specific page directly
      return import(`./${normalizedPageName}`).catch((directError) => {
        console.log(
          `Failed to load ./${normalizedPageName}, trying alternate paths...`
        );

        // Try one more pattern - component file inside directory
        return import(`./${normalizedPageName}/${normalizedPageName}`).catch(
          (alternateError) => {
            console.log(
              `All import attempts failed for ${normalizedPageName}, using generated component`
            );

            // If all imports fail, use the generated component
            setLoadError(true);

            // Return the generated component
            return {
              default: GeneratedComponent,
            };
          }
        );
      });
    });
  });

  // Render the dynamic component with a loading fallback
  return (
    <Suspense fallback={<LoadingComponent />}>
      {/* <DynamicComponent /> */}
      <MJBCrud></MJBCrud>
    </Suspense>
  );
};

export default DynamicPageLoader;
