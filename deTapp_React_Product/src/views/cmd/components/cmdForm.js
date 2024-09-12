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
  target: yup
    .string()
    .required("Target is required")
    .matches(/^[a-zA-Z\s-_]+$/, "Target must be alphabetic"),
  subTarget: yup
    .string()
    .required("Sub Target is required")
    .matches(/^[a-zA-Z\s-_]+$/, "Sub Target must be alphabetic"),
  incorporationCity: yup
    .string()
    .required("Incorporation City is required")
    .matches(/^[a-zA-Z\s-_]+$/, "Incorporation City must be alphabetic"),
  sectorClassification: yup
    .string()
    .required("Sector Classification is required")
    .matches(/^[a-zA-Z\s-_]+$/, "Sector Classification must be alphabetic"),
});

/**
 * CMDFormComponent renders a form with fields for user details.
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
 * <CMDFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   rolesList={rolesList}
 * />
 */
const CMDFormComponent = forwardRef(
  ({ formAction, defaultValues, onSubmit, onReset, rolesList }, ref) => {
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
      defaultValues,
    });

    // Effect to set default values and reset the form
    useEffect(() => {
      if (defaultValues) {
        reset({
          target: defaultValues?.target ?? "",
          subTarget: defaultValues?.sub_target ?? "",
          incorporationCity: defaultValues?.incorporation_city ?? "",
          sectorClassification: defaultValues?.sector_classification ?? "",
        });
      }
    }, [defaultValues, reset, rolesList, formAction]);

    // Effect to set read-only state and reset form on formAction change
    useEffect(() => {
      setReadOnly(formAction?.action === "read");
      if (formAction.action === "add") {
        reset({
          target: "",
          subTarget: "",
          incorporationCity: "",
          sectorClassification: "",
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
        target: "",
        subTarget: "",
        incorporationCity: "",
        sectorClassification: "",
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
          target: "",
          subTarget: "",
          incorporationCity: "",
          sectorClassification: "",
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
              name="target"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter target"
                  fullWidth
                  variant="outlined"
                  error={!!errors.target}
                  helperText={errors.target?.message}
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
              name="subTarget"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter target"
                  fullWidth
                  variant="outlined"
                  error={!!errors.subTarget}
                  helperText={errors.subTarget?.message}
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
              name="incorporationCity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Incorporation City "
                  fullWidth
                  variant="outlined"
                  error={!!errors.incorporationCity}
                  helperText={errors.incorporationCity?.message}
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
              name="sectorClassification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Sector Classification"
                  fullWidth
                  variant="outlined"
                  error={!!errors.sectorClassification}
                  helperText={errors.sectorClassification?.message}
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
  }
);

export default CMDFormComponent;
