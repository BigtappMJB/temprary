// src/components/FormComponent.js
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, styled, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";

// Styled Container for the form layout
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

// Validation schema with Yup, validating form fields
const schema = yup.object().shape({
  menu: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Menu is required"),
  subMenu: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  // .required("SubMenu is required"),
  pageName: yup.string().required("Page name is required"),
  route: yup.string().required("Route is required"),
});

/**
 * PageCreationForm is a form component for creating or updating page details.
 * It handles input fields like menu, sub-menu, page name, and route.
 * The form is validated using Yup schema and controlled with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing the action type (e.g., 'add', 'read')
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {React.Ref} ref - Forwarded ref for exposing internal methods to parent
 *
 * @example
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   menu: 'Main Menu',
 *   subMenu: 'Settings',
 *   pageName: 'Dashboard',
 *   route: '/dashboard'
 * };
 *
 * <PageCreationForm
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 * />
 */
const PageCreationForm = forwardRef(
  ({ formAction = {}, onSubmit, onReset }, ref) => {
    // State for managing whether the form fields should be read-only
    const [readOnly, setReadOnly] = useState(false);

    // State to track focus events
    const [isFocused, setIsFocused] = useState(false);

    // React Hook Form setup with validation and default values
    const {
      control,
      handleSubmit,
      reset,
      getValues,
      trigger,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
    });

    // Effect to sanitize all input values to prevent XSS attacks using DOMPurify
    useEffect(() => {
      const sanitizeInputs = () => {
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
          input.value = DOMPurify.sanitize(input.value);
        });
      };

      sanitizeInputs(); // Call sanitize on initial render
    }, []);

    /**
     * Resets the form to its initial state and calls the parent onReset function.
     */
    const handleReset = () => {
      onReset(); // Parent reset handler
      reset({
        menu: null,
        subMenu: null,
        pageName: "",
        route: "",
      }); // Clear form fields
    };

    /**
     * Handles the form submission by sending the form data to the parent onSubmit handler.
     */
    const onLocalSubmit = () => {
      onSubmit(getValues()); // Send form data to parent component
    };

    // Expose form methods (reset and trigger validation) to parent component via ref
    useImperativeHandle(ref, () => ({
      /**
       * Resets the form to its default values.
       */
      resetForm: async () => {
        reset({
          menu: null,
          subMenu: null,
          pageName: "",
          route: "",
        });
      },
      /**
       * Triggers validation of the form and returns the form values if valid.
       * @returns {Object} Contains page details and validation status
       */
      triggerValidation: async () => {
        const isValid = await trigger(); // Trigger validation
        const values = getValues(); // Get form values
        return { pageDetails: values, validated: isValid }; // Return validation result and values
      },
    }));

    return (
      <Container
        component="form"
        className="panel-bg"
        onSubmit={handleSubmit(onLocalSubmit)} // Handle form submission
      >
        <Grid container spacing={2}>
          {/* Menu Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="menu"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter menu"
                  fullWidth
                  variant="outlined"
                  error={!!errors.menu}
                  helperText={errors.menu?.message}
                  InputLabelProps={{ shrink: field.value }} // Shrink label when field has value
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only if necessary
                  }}
                />
              )}
            />
          </Grid>

          {/* SubMenu Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="subMenu"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter subMenu"
                  fullWidth
                  variant="outlined"
                  error={!!errors.subMenu}
                  helperText={errors.subMenu?.message}
                  InputLabelProps={{ shrink: field.value }} // Shrink label when field has value
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only if necessary
                  }}
                />
              )}
            />
          </Grid>

          {/* Page Name Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="pageName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter page Name"
                  fullWidth
                  variant="outlined"
                  error={!!errors.pageName}
                  helperText={errors.pageName?.message}
                  InputLabelProps={{ shrink: field.value }} // Shrink label when field has value
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only if necessary
                  }}
                />
              )}
            />
          </Grid>

          {/* Route Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="route"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter route"
                  fullWidth
                  variant="outlined"
                  error={!!errors.route}
                  helperText={errors.route?.message}
                  InputLabelProps={{ shrink: field.value }} // Shrink label when field has value
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only if necessary
                  }}
                />
              )}
            />
          </Grid>

          {/* Submit and Reset Button Section */}
          <Grid item xs={12} sm={12}>
            {/* Uncomment to add action buttons */}
            {/* <Box
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
                Submit
              </Button>
            </Box> */}
          </Grid>
        </Grid>
      </Container>
    );
  }
);

export default PageCreationForm;
