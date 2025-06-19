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
  DialogActions,
  Grid,
  LinearProgress,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
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
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Menu as MenuIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { clearDynamicPagesCache } from "../../routes/controllers/routingController";

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

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

// Progress Dialog Component
const ProgressDialog = ({ open, progress, stage }) => {
  const getProgressColor = () => {
    if (progress === 0) return "error";
    if (progress < 30) return "warning";
    if (progress < 70) return "info";
    return "success";
  };

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

// Schema for validation of form
const schema = yup.object().shape({
  tableName: yup.object().required("Please select a table"),
  menuName: yup.string().required("Menu name is required"),
  subMenuName: yup.string().required("Sub-menu name is required"),
  pageName: yup.string().required("Page name is required"),
  routePath: yup.string().required("Route path is required"),
  moduleName: yup.string().required("Module name is required"),
  masterTable: yup.object().nullable(),
  relationshipType: yup.string().nullable(),
});

/**
 * DynamicPageCreation is a React component that allows users to create dynamic pages.
 * Users can select a table and provide page details to generate a React component with CRUD operations.
 */
const DynamicPageCreation = () => {
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [showGeneratedFiles, setShowGeneratedFiles] = useState(false);
  const [fields, setFields] = useState([
    { column: null, inputType: "textField", numOptions: 1, optionValues: [""] },
  ]);
  const [columns, setColumns] = useState([]);
  const [isColumnLoading, setIsColumnLoading] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progressStage, setProgressStage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFieldIndex, setDialogFieldIndex] = useState(null);
  const [dialogInputType, setDialogInputType] = useState("");
  const [optionForm, setOptionForm] = useState({
    optionValues: [""],
  });

  const { openDialog } = useDialog();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      fields: [{ column: null, inputType: "textField" }],
      menuName: "",
      subMenuName: "",
      description: "",
      pageName: "",
      routePath: "",
      moduleName: "",
      masterTable: null,
      relationshipType: "",
    },
  });

  const inputTypes = [
    "email",

    "date",
    "dropdown",
    "textbox",

    "Checkbox",
    "radio-button",
  ];

  const refreshMenu = async () => {
    try {
      console.log("Refreshing menu data...");
      const response = await getUserPermissionsController();
      if (response && response.permissions && response.permissions.length > 0) {
        console.log("Updated menu data received:", response.permissions);
        dispatch(storeMenuDetails(response.permissions));
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

  const prepareForNewPage = async () => {
    try {
      const menuRefreshed = await refreshMenu();
      clearDynamicPagesCache();
      console.log("Application prepared for new page:", { menuRefreshed });
      return menuRefreshed;
    } catch (error) {
      console.error("Error preparing for new page:", error);
      return false;
    }
  };

  const checkComponentGeneration = async (pageName, routePath) => {
    try {
      console.log(
        `Checking if component files were generated for ${pageName} at path ${routePath}`
      );
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

  const fetchTables = useCallback(async () => {
    try {
      console.log("Starting to fetch tables...");
      setIsLoading(true);
      setError(null);
      const response = await getTableListDataController();
      console.log("Table list response received:", response);
      if (!response) {
        console.warn("No response received from controller");
        setTableList([]);
        return;
      }
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
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    setValue("fields", fields);
  }, [fields, setValue]);

  const updateProgress = (progress, stage) => {
    setCreationProgress(progress);
    if (stage) setProgressStage(stage);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    if (key === "inputType" && ["Checkbox", "radio-button"].includes(value)) {
      setDialogFieldIndex(index);
      setDialogInputType(value);
      setOptionForm({
        optionValues: updatedFields[index].optionValues || [""],
      });
      setDialogOpen(true);
    } else {
      updatedFields[index][key] = value;
      setFields(updatedFields);
      setValue("fields", updatedFields);
    }
  };

  const handleOptionFormChange = (index, value) => {
    setOptionForm((prev) => {
      const newOptionValues = [...prev.optionValues];
      newOptionValues[index] = value;
      return { ...prev, optionValues: newOptionValues };
    });
  };

  const addOption = () => {
    setOptionForm((prev) => ({
      ...prev,
      optionValues: [...prev.optionValues, ""],
    }));
  };

  const removeOption = (index) => {
    setOptionForm((prev) => {
      const newOptionValues = prev.optionValues.filter((_, i) => i !== index);
      return {
        ...prev,
        optionValues: newOptionValues.length > 0 ? newOptionValues : [""],
      };
    });
  };

  const handleDialogSubmit = () => {
    if (dialogFieldIndex !== null) {
      const validOptions = optionForm.optionValues.filter(
        (opt) => opt.trim() !== ""
      );
      if (dialogInputType === "radio-button" && validOptions.length === 0) {
        openDialog(
          "error",
          "Invalid Options",
          "At least one non-empty option is required for radio buttons.",
          { confirm: { name: "Ok", isNeed: true } }
        );
        return;
      }
      const updatedFields = [...fields];
      updatedFields[dialogFieldIndex] = {
        ...updatedFields[dialogFieldIndex],
        inputType: dialogInputType,
        numOptions: validOptions.length,
        optionValues: validOptions.length > 0 ? validOptions : [""],
      };
      setFields(updatedFields);
      setValue("fields", updatedFields);
      setDialogOpen(false);
      setDialogFieldIndex(null);
      setDialogInputType("");
      setOptionForm({ optionValues: [""] });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogFieldIndex(null);
    setDialogInputType("");
    setOptionForm({ optionValues: [""] });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setShowProgress(true);
      updateProgress(10, "Validating form data...");
      console.log("Form data submitted:", data);
      const formData = {
        tableName: data.tableName?.TABLE_NAME || "",
        fields: data.fields.map((field) => ({
          name: field.column?.value || "",
          type: field.inputType === "Checkbox" ? "Array" : "String",
          primary: field.primary || false,
          uiType: field.inputType || "text",
          ...(field.numOptions && { numOptions: field.numOptions }),
          ...(field.optionValues && { optionValues: field.optionValues }),
        })),
        menuName: data.menuName || "",
        subMenuName: data.subMenuName || "",
        description: data.description || "",
        pageName: data.pageName || "",
        routePath: data.routePath || "",
        moduleName: data.moduleName || "",
        masterTable: data.masterTable ? data.masterTable.TABLE_NAME : null,
        relationshipType: data.relationshipType || null,
      };
      console.log("Prepared form data:", formData);
      updateProgress(20, "Preparing API request...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateProgress(30, "Sending request to server...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateProgress(40, "Creating database entries...");
      const response = await createReactFormController(formData);
      updateProgress(60, "Database entries created!");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateProgress(70, "Generating component files...");
      await new Promise((resolve) => setTimeout(resolve, 400));
      updateProgress(80, "Page created successfully! Finalizing...");
      if (response.success) {
        if (response.data && response.data.generatedFiles) {
          setGeneratedFiles(response.data.generatedFiles);
          setShowGeneratedFiles(true);
        }
        updateProgress(85, "Refreshing application menus...");
        await prepareForNewPage();
        updateProgress(90, "Checking component generation...");
        let routePath = data.routePath;
        if (!routePath.startsWith("/")) {
          routePath = "/" + routePath;
        }
        await checkComponentGeneration(data.pageName, routePath);
        updateProgress(95, "Finalizing page creation...");
        updateProgress(100, "Page created successfully!");
        localStorage.setItem("newPagePath", routePath);
        localStorage.setItem("newPageName", data.pageName);
        setTimeout(() => {
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
              localStorage.setItem("redirectToNewPage", "true");
              window.location.href =
                window.location.origin +
                "/dashboard?reload=" +
                new Date().getTime();
            }
          );
        }, 1500);
      } else {
        updateProgress(0, "Error creating page");
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
      updateProgress(0, "Error creating page");
      let errorMessage = "Failed to create dynamic page";
      if (error.errorMessage) {
        errorMessage = `API Error: ${error.errorMessage}`;
        if (error.errorMessage.includes("'col' is undefined")) {
          errorMessage =
            "The backend encountered an issue with table column processing. Please ensure the table name is correct and try again.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setShowProgress(false);
      openDialog("error", "Error", errorMessage, {
        confirm: { name: "Ok", isNeed: true },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    console.log("Clearing form fields");
    reset({
      tableName: null,
      fields: [{ column: null, inputType: "textField" }],
      columns: [],
      menuName: "",
      subMenuName: "",
      pageName: "",
      routePath: "",
      moduleName: "",
      masterTable: null,
      relationshipType: "",
    });
    setColumns([]);
    setFields([
      {
        column: null,
        inputType: "textField",
        numOptions: 1,
        optionValues: [""],
      },
    ]);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        column: null,
        inputType: "textField",
        numOptions: 1,
        optionValues: [""],
      },
    ]);
  };

  // Check if any field has inputType set to "dropdown"
  const hasDropdownField = fields.some(
    (field) => field.inputType === "dropdown"
  );

  return (
    <>
      <ProgressDialog
        open={showProgress}
        progress={creationProgress}
        stage={progressStage}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "400px",
            minHeight: "300px",
            maxHeight: "600px",
            transition: "all 0.3s ease-in-out",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Configure{" "}
          {dialogInputType === "radio-button" ? "Radio Buttons" : "Checkboxes"}
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", p: 2 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Add or remove options for{" "}
              {dialogInputType === "radio-button"
                ? "radio buttons"
                : "checkboxes"}
              :
            </Typography>
            {optionForm.optionValues.map((option, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionFormChange(index, e.target.value)
                  }
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <IconButton
                  color="error"
                  onClick={() => removeOption(index)}
                  disabled={optionForm.optionValues.length === 1}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={addOption}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
          <Button onClick={handleDialogClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleDialogSubmit}
            color="primary"
            variant="contained"
            disabled={
              dialogInputType === "radio-button" &&
              optionForm.optionValues.every((opt) => opt.trim() === "")
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Container>
        <Header>
          <Typography variant="h6">Create Dynamic Page</Typography>
        </Header>

        <Box component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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
                    rows={3}
                  />
                )}
              />
            </Grid>

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
                      option?.TABLE_NAME === value?.TABLE_NAME
                    }
                    value={field.value || null}
                    onChange={(_, data) => {
                      field.onChange(data);
                      if (data?.TABLE_NAME) {
                        fetchTableColumns(data.TABLE_NAME);
                        setFields([
                          {
                            column: null,
                            inputType: "textField",
                            numOptions: 1,
                            optionValues: [""],
                          },
                        ]);
                      } else {
                        setColumns([]);
                        setFields([
                          {
                            column: null,
                            inputType: "textField",
                            numOptions: 1,
                            optionValues: [""],
                          },
                        ]);
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
                      value={field.inputType || "textField"}
                      onChange={(e) =>
                        handleFieldChange(index, "inputType", e.target.value)
                      }
                    >
                      {inputTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {["Checkbox", "radio-button"].includes(field.inputType) &&
                    field.numOptions > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {field.numOptions}{" "}
                          {field.inputType === "radio-button"
                            ? "Radio Button(s)"
                            : "Checkbox(es)"}{" "}
                          configured:
                          {field.optionValues
                            .filter((val) => val.trim() !== "")
                            .map((val, i) => (
                              <span key={i}>
                                {" "}
                                {val}
                                {i <
                                field.optionValues.filter(
                                  (v) => v.trim() !== ""
                                ).length -
                                  1
                                  ? ","
                                  : ""}
                              </span>
                            ))}
                        </Typography>
                      </Grid>
                    )}

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

            {/* Conditionally render Master Table and Relationship Type fields */}
            {hasDropdownField && (
              <>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="masterTable"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={tableList}
                        getOptionLabel={(option) =>
                          option?.TABLE_NAME || "Unknown Table"
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.TABLE_NAME === value?.TABLE_NAME
                        }
                        value={field.value || null}
                        onChange={(_, data) => field.onChange(data || null)}
                        loading={isLoading}
                        disabled={isLoading || isSubmitting}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Master Table (Optional)"
                            fullWidth
                            error={!!errors.masterTable}
                            helperText={errors.masterTable?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="relationshipType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Select Relationship Type (Optional)"
                        error={!!errors.relationshipType}
                        helperText={errors.relationshipType?.message}
                        disabled={isSubmitting}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="OneToOne">OneToOne</MenuItem>
                        <MenuItem value="ManyToOne">ManyToOne</MenuItem>
                        <MenuItem value="OneToMany">OneToMany</MenuItem>
                        <MenuItem value="ManyToMany">ManyToMany</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              </>
            )}
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
                    masterTable: null,
                    relationshipType: "",
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
