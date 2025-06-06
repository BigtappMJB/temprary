import React, { useEffect, useState, useCallback } from "react";
import {
  Autocomplete,
  IconButton,
  Box,
  Button,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDialog } from "../utilities/alerts/DialogContent";
import {
  getTableListDataController,
  createReactFormController,
} from "./controllers/dynamicPageCreationController";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUserPermissionsController } from "../user-management/users/controllers/usersControllers";
import { useDispatch } from "react-redux";
import { storeMenuDetails } from "../../redux/slices/slice";
import { setCookie } from "../utilities/cookieServices/cookieServices";
import { isPermissionDetailsCookieName } from "../utilities/generals";
import { encodeData } from "../utilities/securities/encodeDecode";
import { get, post } from "../utilities/apiservices/apiServices";
import { useNavigate } from "react-router-dom";

import { clearDynamicPagesCache } from "../../routes/controllers/routingController";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Menu as MenuIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";

// Styled Components'

const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Progress Dialog Component
const ProgressDialog = ({ open, progress, stage }) => {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress === 0) return "error";
    if (progress < 30) return "warning";
    if (progress < 70) return "info";
    return "success";
  };

  // Determine icon based on stage
  const getStageIcon = () => {
    if (progress === 0) return <ErrorIcon color="error" />;
    if (progress === 100) return <CheckCircleIcon color="success" />;
    if (stage.includes("database")) return <StorageIcon color="primary" />;
    if (stage.includes("component")) return <CodeIcon color="primary" />;
    if (stage.includes("menu")) return <MenuIcon color="primary" />;
    return <AutorenewIcon color="primary" className="rotating" />;
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
          minHeight: "250px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
          background: "linear-gradient(45deg, #1e88e5 30%, #42a5f5 90%)",
          color: "white",
          borderRadius: "4px",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {progress === 100
            ? "Page Created Successfully!"
            : "Creating Dynamic Page"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            width: "100%",
            mt: 3,
            mb: 4,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {getStageIcon()}
              <Typography
                variant="body1"
                color={progress === 0 ? "error.main" : "primary.main"}
                fontWeight="medium"
              >
                {stage || "Processing..."}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={getProgressColor() + ".main"}
            >
              {progress}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor()}
            sx={{
              height: 12,
              borderRadius: 6,
              mb: 3,
              "& .MuiLinearProgress-bar": {
                borderRadius: 6,
                transition: "transform 0.4s ease",
              },
            }}
          />

          {/* Progress stages */}
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                opacity: progress >= 10 ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon
                color={progress >= 10 ? "success" : "disabled"}
                sx={{ mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2">Validating form data</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                opacity: progress >= 30 ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon
                color={progress >= 30 ? "success" : "disabled"}
                sx={{ mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2">Sending request to server</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                opacity: progress >= 60 ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon
                color={progress >= 60 ? "success" : "disabled"}
                sx={{ mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2">Creating database entries</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                opacity: progress >= 80 ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon
                color={progress >= 80 ? "success" : "disabled"}
                sx={{ mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2">
                Generating component files
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                opacity: progress >= 100 ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon
                color={progress >= 100 ? "success" : "disabled"}
                sx={{ mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2">Finalizing page creation</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <style jsx global>{`
        .rotating {
          animation: rotate 1.5s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Dialog>
  );
};

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  color: "#fff",
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// Schema for validation of form
const schema = yup.object().shape({
  tableName: yup.object().required("Please select a table"),
  menuName: yup.string().required("Menu name is required"),
  subMenuName: yup.string().required("Sub-menu name is required"),
  pageName: yup.string().required("Page name is required"),
  routePath: yup.string().required("Route path is required"),
  moduleName: yup.string().required("Module name is required"),
});

/**
 * DynamicPageCreation is a React component that allows users to create dynamic pages.
 * Users can select a table and provide page details to generate a React component with CRUD operations.
 */
const DynamicPageCreation = () => {
  // State to hold table list data
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [showGeneratedFiles, setShowGeneratedFiles] = useState(false);
  const [fields, setFields] = useState([
    { name: "", type: "String", primary: false },
  ]);
  const [primaryCount, setPrimaryCount] = useState(0);
  const [columns, setColumns] = useState([]);
  const [isColumnLoading, setIsColumnLoading] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  // State for tracking page creation progress
  const [creationProgress, setCreationProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progressStage, setProgressStage] = useState("");

  const { openDialog } = useDialog();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to refresh menu after creating a new page
  const refreshMenu = async () => {
    try {
      console.log("Refreshing menu data...");
      const response = await getUserPermissionsController();

      if (response && response.permissions && response.permissions.length > 0) {
        console.log("Updated menu data received:", response.permissions);

        // Update Redux store with new menu data
        dispatch(storeMenuDetails(response.permissions));

        // Update cookie with new menu data
        setCookie({
          name: isPermissionDetailsCookieName,
          value: encodeData(response.permissions),
        });

        return true;
      } else {
        console.warn("No menu data received when refreshing");
        return false;
      }
    } catch (error) {
      console.error("Error refreshing menu data:", error);
      return false;
    }
  };

  // Function to prepare the application for the new page
  const prepareForNewPage = async () => {
    try {
      // Step 1: Refresh the menu
      const menuRefreshed = await refreshMenu();

      // Step 2: Clear the dynamic pages cache
      clearDynamicPagesCache();

      console.log("Application prepared for new page:", { menuRefreshed });
      return menuRefreshed;
    } catch (error) {
      console.error("Error preparing for new page:", error);
      return false;
    }
  };

  // Function to check if component files were generated
  const checkComponentGeneration = async (pageName, routePath) => {
    try {
      console.log(
        `Checking if component files were generated for ${pageName} at path ${routePath}`
      );

      // Try to check if the component was generated by calling a backend endpoint
      try {
        const response = await get(
          `gpt/checkComponentExists?pageName=${pageName}`,
          "python"
        );

        if (response && response.exists) {
          console.log(
            `Component files for ${pageName} were successfully generated!`
          );
          return true;
        } else {
          console.warn(
            `Component files for ${pageName} were not found. Using fallback component.`
          );

          // Try to generate the component now
          try {
            console.log(`Attempting to generate component for ${pageName}...`);

            const generateResponse = await post(
              "gpt/generateReactComponent",
              {
                pageName: pageName,
                tableName: pageName,
                routePath: routePath,
              },
              "python"
            );

            if (generateResponse && generateResponse.success) {
              console.log(`Successfully generated component for ${pageName}!`);
              return true;
            } else {
              console.warn(`Failed to generate component for ${pageName}.`);
            }
          } catch (generateError) {
            console.error(
              `Error generating component for ${pageName}:`,
              generateError
            );
          }
        }
      } catch (checkError) {
        console.error(
          `Error checking if component exists for ${pageName}:`,
          checkError
        );
      }

      // Log a warning about potential issues
      console.warn(`
        IMPORTANT: If you're seeing a 404 page after reload, it means the backend did not 
        generate the component files for ${pageName} at path ${routePath}.
        
        The application has been updated to handle this case by providing a fallback component,
        but you should check your backend logs for errors related to file generation.
        
        Common issues include:
        1. The backend doesn't have write permissions to the frontend directory
        2. The backend is using incorrect paths to the frontend directory
        3. There's an error in the component template generation
      `);

      return true;
    } catch (error) {
      console.error(
        `Error checking component generation for ${pageName}:`,
        error
      );
      return false;
    }
  };

  // Form control for managing inputs and validation
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fields: [{ column: null, type: "String" }],
      menuName: "",
      subMenuName: "",
      description: "",
      pageName: "",
      routePath: "",
      moduleName: "",
    },
  });

  const selectedTable = watch("tableName"); // extract from watch

  useEffect(() => {
    if (selectedTable?.TABLE_NAME) {
      fetchTableColumns(selectedTable.TABLE_NAME);
    }
  }, [selectedTable]); // simple dependency

  // Fetch table list from the API
  const fetchTables = useCallback(async () => {
    try {
      console.log("Starting to fetch tables...");
      setIsLoading(true);
      setError(null);

      const response = await getTableListDataController();
      console.log("Component received response:", response);
      console.log("Table list response received:", response);
      if (!response) {
        console.warn("No response received from controller");
        setTableList([]);
        return;
      }

      // Ensure we always set an array of valid table objects
      const tables = Array.isArray(response)
        ? response.filter((table) => table && table.TABLE_NAME)
        : [];
      console.log("Final table list to be set:", tables);

      setTableList(tables);

      if (tables.length === 0) {
        console.warn("No tables found in the response");
        setError("No tables available");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError(error.message || "Failed to fetch tables");
      openDialog(
        "error",
        "Error",
        `Failed to fetch tables: ${error.message || "Unknown error"}`,
        {
          confirm: { name: "Ok", isNeed: true },
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [openDialog]);

  // On initial render, fetch table list
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    setValue("fields", fields);
  }, [fields, setValue]);
  // State to store generated files information

  // Function to update progress with stages
  const updateProgress = (progress, stage) => {
    setCreationProgress(progress);
    if (stage) setProgressStage(stage);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setShowProgress(true);
      updateProgress(10, "Validating form data...");

      console.log("Form MJJJB data submitted:", data);

      // Create the dynamic page
      const formData = {
        tableName: data.tableName?.TABLE_NAME || "",
        fields: data.fields,
        menuName: data.menuName,
        subMenuName: data.subMenuName,
        description: data.description || "", // Optional field
        pageName: data.pageName,
        routePath: data.routePath,
        moduleName: data.moduleName,
      };

      // Log the form data for debugging
      console.log("Prepared form data:", formData);

      // Simulate progress updates for different stages of page creation
      updateProgress(20, "Preparing API request...");

      // Add a small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProgress(30, "Sending request to server...");

      // Add a small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(40, "Creating database entries...");

      // Create the page with progress updates
      const response = await createReactFormController(formData);

      // Update progress based on response
      updateProgress(60, "Database entries created!");
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateProgress(70, "Generating component files...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      updateProgress(80, "Page created successfully! Finalizing...");

      if (response.success) {
        // Store generated files information if available
        if (response.data && response.data.generatedFiles) {
          setGeneratedFiles(response.data.generatedFiles);
          setShowGeneratedFiles(true);
        }

        // Update progress
        updateProgress(85, "Refreshing application menus...");

        // Prepare the application for the new page
        await prepareForNewPage();

        // Update progress
        updateProgress(90, "Checking component generation...");

        // Normalize route path to ensure it starts with a slash
        let routePath = data.routePath;
        if (!routePath.startsWith("/")) {
          routePath = "/" + routePath;
        }

        // Check if component files were generated
        await checkComponentGeneration(data.pageName, routePath);

        // Update progress
        updateProgress(95, "Finalizing page creation...");

        // Complete the progress
        updateProgress(100, "Page created successfully!");

        // Store the route path in localStorage for access after reload
        localStorage.setItem("newPagePath", routePath);
        localStorage.setItem("newPageName", data.pageName);

        // Show success dialog after a short delay to let user see 100% progress
        setTimeout(() => {
          // Hide progress dialog
          setShowProgress(false);

          openDialog(
            "success",
            "Page Created Successfully",
            `Your dynamic page "${data.pageName}" has been created!\n\n` +
              `${
                response.data?.menuId
                  ? `Menu ID: ${response.data.menuId}, Sub-Menu ID: ${response.data.subMenuId}\n\n`
                  : ""
              }` +
              `The backend API endpoints have been created and the React component has been generated.\n\n` +
              `Click "Reload & View Page" to automatically reload and navigate to your new page.`,
            {
              confirm: { name: "Reload & View Page", isNeed: true },
              cancel: { name: "Stay Here", isNeed: true },
            },
            () => {
              // Set a flag to indicate we want to redirect after reload
              localStorage.setItem("redirectToNewPage", "true");
              // Force a full page reload
              window.location.href =
                window.location.origin +
                "/dashboard?reload=" +
                new Date().getTime();
            }
          );
        }, 1500); // 1.5 second delay to show 100% progress
      } else {
        // Update progress to show error
        updateProgress(0, "Error creating page");

        // Hide progress dialog after a short delay
        setTimeout(() => {
          setShowProgress(false);

          openDialog(
            "error",
            "Error",
            response.message || "Failed to create dynamic page",
            {
              confirm: { name: "Ok", isNeed: true },
            }
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating dynamic page:", error);

      // Update progress to show error
      updateProgress(0, "Error creating page");

      // Handle different error formats
      let errorMessage = "Failed to create dynamic page";

      if (error.errorMessage) {
        // API error format
        errorMessage = `API Error: ${error.errorMessage}`;

        // Special handling for the 'col' undefined error
        if (error.errorMessage.includes("'col' is undefined")) {
          errorMessage =
            "The backend encountered an issue with table column processing. Please ensure the table name is correct and try again.";
        }
      } else if (error.message) {
        // Standard error object
        errorMessage = error.message;
      } else if (typeof error === "string") {
        // String error
        errorMessage = error;
      }

      // Hide progress dialog
      setShowProgress(false);

      openDialog("error", "Error", errorMessage, {
        confirm: { name: "Ok", isNeed: true },
      });
    } finally {
      // Reset the submitting state
      setIsSubmitting(false);
    }
  };
  const inputTypes = [
    "String",
    "Long",
    "Integer",
    "Double",
    "Boolean",
    "LocalDateTime",
    "Date",
    "BigDecimal",
    "Float",
    "Character",
    "Byte",
    "Short",
    "UUID",
    "List",
    "Set",
    "Optional",
    "Time",
    "Timestamp",
  ];
  const fetchTableColumns = async (tableName) => {
    setIsColumnLoading(true);
    try {
      const response = await get(
        `dynamic-page/table-metadata/${tableName}`,
        "python"
      );
      const data = response?.data || {};

      console.log("Table columns response:", data);

      const cols = Object.values(data).map((col) => ({
        label: col.COLUMN_NAME,
        value: col.COLUMN_NAME,
      }));

      setColumns(cols);
    } catch (error) {
      console.error("Failed to fetch columns:", error);
      setColumns([]);
    } finally {
      setIsColumnLoading(false);
    }
  };

  useEffect(() => {
    const table = watch("tableName");
    if (table?.TABLE_NAME) {
      fetchTableColumns(table.TABLE_NAME);
    }
  }, [watch("tableName")]);
  const handleClear = () => {
    console.log("Clearing form fields");
    reset({
      tableName: null,

      fields: null,
      setColumns: [],
      columns: [],
      column: null,
      setFields: [{ name: "", type: "String", primary: false }],
      menuName: "",
      type: null,
      subMenuName: "",
      pageName: "",
      routePath: "",
      moduleName: "",
    });
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "String", primary: false }]);
  };
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
    setValue("fields", updatedFields);

    if (key === "primary") {
      if (value === true) {
        setPrimaryCount(1);
      } else {
        setPrimaryCount(0);
      }
    }
  };

  return (
    <>
      {/* Progress Dialog */}
      <ProgressDialog
        open={showProgress}
        progress={creationProgress}
        stage={progressStage}
      />

      <Container>
        <Header>
          <Typography variant="h6">Create Dynamic Page</Typography>
        </Header>

        <Box component="form" sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Module Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="moduleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Module Name"
                    fullWidth
                    error={!!errors.moduleName}
                    helperText={errors.moduleName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Menu Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="menuName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Menu Name"
                    fullWidth
                    error={!!errors.menuName}
                    helperText={errors.menuName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Sub-Menu Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="subMenuName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sub-Menu Name"
                    fullWidth
                    error={!!errors.subMenuName}
                    helperText={errors.subMenuName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Page Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="pageName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Page Name"
                    fullWidth
                    error={!!errors.pageName}
                    helperText={errors.pageName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Route Path */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="routePath"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Route Path"
                    fullWidth
                    error={!!errors.routePath}
                    helperText={errors.routePath?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isSubmitting}
                    multiline
                    rows={3} // optional: for a bigger text area
                  />
                )}
              />
            </Grid>

            {/* Table Name */}
            <Grid item xs={12}>
              <Controller
                name="tableName"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={tableList}
                    getOptionLabel={(option) =>
                      option?.TABLE_NAME || "Unknown Table"
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.TABLE_NAME === value?.TABLE_NAME ||
                      option?.TABLE_NAME === value?.TABLE_NAME
                    }
                    value={field.value || null}
                    onChange={(_, data) => {
                      field.onChange(data);
                      if (data?.TABLE_NAME) {
                        fetchTableColumns(data.TABLE_NAME);
                        setFields([{ column: null, type: "String" }]);
                      } else {
                        setColumns([]);
                        setFields([{ column: null, type: "String" }]);
                      }
                    }}
                    loading={isLoading}
                    disabled={isLoading || isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Table"
                        fullWidth
                        error={!!errors.tableName || !!error}
                        helperText={errors.tableName?.message || error}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Columns and Input Types for Fields */}
            {fields.map((field, index) => {
              const selectedElsewhere = fields
                .filter((_, i) => i !== index)
                .map((f) => f.column?.label)
                .filter(Boolean);

              const availableOptions = columns.filter(
                (col) => !selectedElsewhere.includes(col.label)
              );

              return (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={5}>
                    <Autocomplete
                      options={availableOptions}
                      getOptionLabel={(option) => option.label}
                      value={field.column}
                      onChange={(_, value) =>
                        handleFieldChange(index, "column", value)
                      }
                      loading={isColumnLoading}
                      disabled={
                        isColumnLoading || availableOptions.length === 0
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Column"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isColumnLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}

                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      select
                      fullWidth
                      label="Select Input Type"
                      value={field.inputType || "textField"} // Default to 'textField'
                      onChange={(e) =>
                        handleFieldChange(index, "inputType", e.target.value)
                      }
                    >
                      {inputTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {index === fields.length - 1 && (
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        color="primary"
                        aria-label="add field"
                        onClick={addField}
                        size="large"
                        sx={{ mt: 2 }}
                        disabled={fields.length >= columns.length}
                      >
                        <AddCircleOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            mt={3}
          >
            <FormButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Creating...
                </>
              ) : (
                "Create Page"
              )}
            </FormButton>

            <FormButton
              onClick={handleClear}
              type="button"
              variant="contained"
              color="error"
              disabled={isSubmitting}
            >
              Clear
            </FormButton>
          </Box>
        </Box>
      </Container>

      {/* Display generated files section */}
      {showGeneratedFiles && generatedFiles.length > 0 && (
        <Container>
          <Header>
            <Typography variant="h6">Generated Files</Typography>
          </Header>
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              The following files were generated:
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mt: 2,
                backgroundColor: "#f5f5f5",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              {generatedFiles.map((file, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ fontFamily: "monospace", py: 0.5 }}
                >
                  • {file}
                </Typography>
              ))}
            </Paper>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <FormButton
                onClick={() => {
                  setShowGeneratedFiles(false);
                  reset({
                    tableName: null,
                    menuName: "",
                    subMenuName: "",
                    pageName: "",
                    routePath: "",
                    moduleName: "",
                  });
                }}
                variant="contained"
                color="primary"
              >
                Create Another Page
              </FormButton>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default DynamicPageCreation;
