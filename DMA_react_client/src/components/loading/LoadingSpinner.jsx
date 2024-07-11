// src/components/LoadingSpinner.js
import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { useLoading } from "../contexts/LoadingContext";

const LoadingSpinner = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(255, 255, 255, 0.8)"
      zIndex={1300} // Higher than the default MUI zIndex for other components
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
