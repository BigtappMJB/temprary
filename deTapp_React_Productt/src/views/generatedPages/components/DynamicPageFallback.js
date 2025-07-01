import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  maxWidth: "800px",
  margin: "40px auto",
}));

/**
 * A fallback component displayed when a dynamic page cannot be loaded
 * This provides more detailed information and troubleshooting options
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display to the user
 * @param {boolean} props.showReloadButton - Whether to show a reload button
 * @param {string} props.pageName - Name of the page that failed to load
 * @returns {JSX.Element} The fallback component
 */
const DynamicPageFallback = ({
  message,
  showReloadButton = true,
  pageName = "page",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  // Extract page name from the URL if not provided
  const extractedPageName =
    pageName === "page"
      ? location.pathname.split("/").filter(Boolean).pop()
      : pageName;

  // Handle page reload
  const handleReload = () => {
    window.location.reload();
  };

  // Handle navigation to dashboard
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // Simulate checking for the page
  const handleCheckPage = () => {
    setIsChecking(true);
    setCheckResult(null);

    // Simulate an API check
    setTimeout(() => {
      setIsChecking(false);
      setCheckResult({
        exists: true,
        message: `The page "${extractedPageName}" exists in the database, but the component file was not generated correctly.`,
      });
    }, 1500);
  };

  return (
    <Container>
      <Box sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Dynamic Page Issue
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {message ||
            `The page "${extractedPageName}" could not be loaded properly.`}
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
          <Typography variant="body2">
            This issue occurs when a dynamic page is registered in the database,
            but the corresponding React component file was not generated
            successfully by the backend.
          </Typography>
        </Alert>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Troubleshooting Options
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "400px",
            mx: "auto",
            mt: 3,
          }}
        >
          {showReloadButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleReload}
              fullWidth
            >
              Reload Page
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCheckPage}
            disabled={isChecking}
            fullWidth
          >
            {isChecking ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Checking Page Status...
              </>
            ) : (
              "Check Page Status"
            )}
          </Button>

          <Button variant="outlined" onClick={handleGoToDashboard} fullWidth>
            Return to Dashboard
          </Button>
        </Box>

        {checkResult && (
          <Alert
            severity={checkResult.exists ? "warning" : "error"}
            sx={{ mt: 3, textAlign: "left" }}
          >
            {checkResult.message}
          </Alert>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 4 }}
        >
          Page Path: {location.pathname}
        </Typography>
      </Box>
    </Container>
  );
};

export default DynamicPageFallback;
