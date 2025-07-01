import React, { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  styled,
  Box,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";

// Styled Container for dynamic form layout
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

/**
 * DynamicFormCreationFormComponent generates a dynamic form based on the number of options (`noOfOptions`).
 * Each form field is validated using a dynamically generated Yup schema.
 *
 * @component
 * @param {Object} props - The component props
 * @param {number} props.noOfOptions - Number of dynamic options/fields to generate
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Object} props.defaultValues - Default values for form fields
 *
 * @example
 * <DynamicFormCreationFormComponent
 *   noOfOptions={5}
 *   onSubmit={handleFormSubmit}
 *   onReset={handleFormReset}
 *   defaultValues={{ "Option 1": "Value 1", "Option 2": "Value 2" }}
 * />
 */
const DynamicFormCreationFormComponent = ({
  noOfOptions,
  onSubmit,
  onReset,
  defaultValues,
}) => {
  /**
   * Generates an array of option labels like ['Option 1', 'Option 2', ...]
   * @param {number} start - Starting index for the options
   * @param {number} end - Ending index for the options
   * @returns {string[]} - Array of option labels
   */
  const rangeArray = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => `Option ${i + 1}`);

  // Memoized list of dynamic form field names based on the number of options
  const columnDetails = useMemo(
    () => rangeArray(1, noOfOptions),
    [noOfOptions]
  );

  /**
   * Generates a Yup validation schema dynamically based on the provided column names.
   * @param {string[]} columns - List of form field names to be validated
   * @returns {Object} - Yup validation schema object
   */
  const generateValidationSchema = useCallback(
    (columns) => {
      const schema = {};
      const customDefaultValues = {};
      columns.forEach((column) => {
        customDefaultValues[column] = defaultValues
          ? defaultValues[column]
          : null;
        schema[column] = yup
          .string()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .required(`${column} is required`);
      });

      return { schema: yup.object().shape(schema), customDefaultValues };
    },
    [defaultValues]
  );

  // Memoized validation schema based on column details
  const { schema, customDefaultValues } = useMemo(
    () => generateValidationSchema(columnDetails),
    [columnDetails, generateValidationSchema]
  );

  // Initialize React Hook Form with dynamic validation schema
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    shouldFocusError: true,
    reValidateMode: "onChange",
    defaultValues: customDefaultValues,
  });

  /**
   * Handles the form submission and passes the data to the parent `onSubmit` function.
   * Resets the form after submission.
   * @param {Object} data - Form submission data
   */
  const onDynamicFormSubmit = (data) => {
    onSubmit(data); // Send form data to parent
    reset(); // Reset the form fields
  };

  /**
   * Handles the form reset and triggers the parent `onReset` function.
   */
  const handleReset = () => {
    reset(); // Reset the form
    if (onReset) {
      onReset(); // Trigger the parent reset handler
    }
  };

  return (
    <>
      {/* Render dynamic form fields if there are options */}
      {columnDetails.length > 0 && (
        <Container
          component="form"
          onSubmit={handleSubmit(onDynamicFormSubmit)}
        >
          <Grid container spacing={3}>
            {columnDetails.map((column) => (
              <Grid item xs={12} md={12} key={column}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ mr: 2 }}>{column}</Typography>
                  <Typography sx={{ mr: 2 }}>:</Typography>
                  <Controller
                    name={column}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        error={!!errors[column]} // Show error if validation fails
                        helperText={errors[column]?.message} // Display validation error message
                        InputLabelProps={{ shrink: !!field.value }} // Shrink label if field has value
                      />
                    )}
                  />
                </Box>
              </Grid>
            ))}

            {/* Submit and Cancel buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3, // Add margin to separate the buttons from the form fields
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="primary"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary" // changed to secondary to represent a Cancel action better
                  onClick={handleReset}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};
DynamicFormCreationFormComponent.propTypes = {
  noOfOptions: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  defaultValues: PropTypes.any.isRequired,
};

export default DynamicFormCreationFormComponent;
