// src/components/FormComponent.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  styled,
  Box,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));
// Validation schema with regex patterns
const schema = yup.object().shape({
  client: yup
    .string()
    .required("Client is required"),
  projectType: yup
    .string()
    .required("Project Type is required"),
 
  projectName: yup
    .string()
    .required("Project Name is required")
});

/**
 * ProjectCreationForm renders a form with fields for user details.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array} props.rolesList - List of roles to populate the Autocomplete
 * @example
 * // Sample usage
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   FIRST_NAME: 'John',
 *   LAST_NAME: 'Doe',
 *   EMAIL: 'john.doe@example.com',
 *   MOBILE: '1234567890'
 * };
 * const rolesList = [
 *   { ID: 'admin', NAME: 'Admin' },
 *   { ID: 'user', NAME: 'User' }
 * ];
 *
 * <ProjectCreationForm
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   rolesList={rolesList}
 * />
 */
const ProjectCreationForm = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  rolesList,
}) => {
  const [readOnly, setReadOnly] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  // Effect to set default values and reset the form
  useEffect(() => {
    if (defaultValues) {
      reset({
        client: defaultValues?.client ?? "",
        projectType: defaultValues?.sub_target ?? "",
        projectCode: defaultValues?.incorporation_city ?? "",
        projectName: defaultValues?.sector_classification ?? "",
      });
    }
  }, [defaultValues, reset, rolesList, formAction]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        client: "",
        projectType: "",
        projectCode: "",
        projectName: "",
      });
    }
  }, [formAction, reset]);

  // Effect to sanitize input values
  useEffect(() => {
    const sanitizeInputs = () => {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.value = DOMPurify.sanitize(input.value);
      });
    };

    sanitizeInputs();
  }, []);

  /**
   * Resets the form to its initial state
   */
  const handleReset = () => {
    onReset();
    reset({
      client: "",
      projectType: "",
      projectCode: "",
      projectName: "",
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({
      client: "",
      projectType: "",
      projectCode: "",
      projectName: "",
    });
  };

  return (
    <Container
      component="form"
      className="panel-bg"
      onSubmit={handleSubmit(onLocalSubmit)}
    >
      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={6}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="User name"
                fullWidth
                variant="outlined"
                error={!!errors.userId}
                helperText={errors.userId?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid> */}

        <Grid item xs={12} sm={6}>
          <Controller
            name="client"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Enter client"
                fullWidth
                variant="outlined"
                error={!!errors.client}
                helperText={errors.client?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Enter projectType"
                fullWidth
                variant="outlined"
                error={!!errors.projectType}
                helperText={errors.projectType?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
      
        <Grid item xs={12} sm={6}>
          <Controller
            name="projectName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Enter project name"
                fullWidth
                variant="outlined"
                error={!!errors.projectName}
                helperText={errors.projectName?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2} // Adds space between buttons
          >
            {formAction.action !== "read" && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="primary"
              >
                {formAction.action === "add" ? "Add" : "Update"}
              </Button>
            )}

            <Button
              type="button"
              variant="contained"
              color="primary"
              className="danger"
              onClick={handleReset}
            >
              {formAction.action !== "read" ? "Cancel" : "Close"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectCreationForm;
