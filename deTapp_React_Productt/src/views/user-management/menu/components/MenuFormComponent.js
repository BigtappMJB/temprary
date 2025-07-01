// src/components/FormComponent.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, styled, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../../utilities/Validators";
import PropTypes from "prop-types";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

// Schema for form validation using Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(validationRegex.isLetters, errorMessages.isLetters),
  description: yup
    .string()
    .required("Description is required")
    .matches(validationRegex.bio, errorMessages.bio),
});

/**
 * RoleFormComponent renders a form with fields for role details.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @example
 * // Sample usage
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   name: 'Role',
 *   description: 'Description for role',
 * };
 *
 * <RoleFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 * />
 */
const RoleFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
}) => {
  const [readOnly, setReadOnly] = useState(false);

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
        name: defaultValues.NAME ?? "",
        description: defaultValues.DESCRIPTION ?? "",
      });
    }
  }, [defaultValues, reset]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        name: "",
        description: "",
      });
    }
  }, [formAction, reset, defaultValues]);

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
      name: "",
      description: "",
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({
      name: "",
      description: "",
    });
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onLocalSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
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
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
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
              color="secondary"
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
RoleFormComponent.propTypes = {
  formAction: PropTypes.shape({
    action: PropTypes.string.isRequired, // formAction should have an 'action' key and is required
  }).isRequired, // formAction is required

  defaultValues: PropTypes.shape({
    NAME: PropTypes.string, // NAME is an optional string
    DESCRIPTION: PropTypes.string, // DESCRIPTION is an optional string
  }).isRequired, // defaultValues is required

  onSubmit: PropTypes.func.isRequired, // onSubmit is a required function
  onReset: PropTypes.func.isRequired, // onReset is a required function
};

export default RoleFormComponent;
