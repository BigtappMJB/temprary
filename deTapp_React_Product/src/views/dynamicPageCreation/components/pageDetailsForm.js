// src/components/FormComponent.js
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  styled,
  Box,
  Autocomplete,
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
  menu: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Menu is required"),
  subMenu: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("SubMenu is required"),
  pageName: yup.string().required("Page name is required"),

  route: yup.string().required("Routeis required"),
});

/**
 * PageCreationForm renders a form with fields for user details.
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
 * <PageCreationForm
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   rolesList={rolesList}
 * />
 */
const PageCreationForm = forwardRef(
  ({ formAction = {}, onSubmit, onReset }, ref) => {
    const [readOnly, setReadOnly] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

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
        menu: null,
        subMenu: null,
        pageName: "",
        route: "",
      });
    };

    /**
     * Submits the form data
     */
    const onLocalSubmit = () => {
      onSubmit(getValues());
    };
    // Expose a method to trigger validation via ref
    useImperativeHandle(ref, () => ({
      resetForm: async () => {
        reset({
          menu: null,
          subMenu: null,
          pageName: "",
          route: "",
        });
      },
      triggerValidation: async () => {
        const isValid = await trigger();
        const values = getValues();
        return { ...values, validated: isValid };
      },
    }));

    return (
      <Container
        component="form"
        className="panel-bg"
        onSubmit={handleSubmit(onLocalSubmit)}
      >
        <Grid container spacing={2}>
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
                  InputLabelProps={{ shrink: field.value }}
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
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
