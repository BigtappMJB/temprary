import fs from 'fs';
import path from 'path';

/**
 * Utility function to generate a basic component file for dynamic pages
 * This is used as a fallback when the backend fails to generate the component
 * 
 * @param {string} pageName - The name of the page
 * @param {string} routePath - The route path for the page
 * @returns {Promise<boolean>} - Whether the file was successfully created
 */
export const generateBasicComponent = async (pageName, routePath) => {
  try {
    // Normalize the page name (remove leading slash if present)
    const normalizedPageName = pageName.startsWith('/') ? pageName.substring(1) : pageName;
    
    // Create the directory path
    const dirPath = path.join(process.env.PUBLIC_URL, '..', 'src', 'views', 'generatedPages', normalizedPageName);
    
    // Create the component content
    const componentContent = `
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, styled } from '@mui/material';

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
}));

/**
 * ${pageName} component - Auto-generated component for the dynamic page
 */
const ${normalizedPageName.charAt(0).toUpperCase() + normalizedPageName.slice(1)} = () => {
  return (
    <Container>
      <Header>
        <Typography variant="h6">${pageName} Page</Typography>
      </Header>
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" paragraph>
          This is an auto-generated component for the ${pageName} page.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This component was created as a fallback because the backend component generation was not successful.
        </Typography>
        <Button variant="contained" color="primary">
          Sample Button
        </Button>
      </Box>
    </Container>
  );
};

export default ${normalizedPageName.charAt(0).toUpperCase() + normalizedPageName.slice(1)};
`;

    // Check if directory exists, if not create it
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(path.join(dirPath, 'index.js'), componentContent);
    
    console.log(`Successfully created component file for ${pageName}`);
    return true;
  } catch (error) {
    console.error(`Error creating component file for ${pageName}:`, error);
    return false;
  }
};