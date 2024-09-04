import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, styled, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

const DynamicFormCreationFormComponent = ({
  noOfOptions,
  onSubmit,
  onReset,
  defaultValues,
}) => {
  const rangeArray = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => `Option ${i + 1}`);

  const columnDetails = useMemo(
    () => rangeArray(1, noOfOptions),
    [noOfOptions]
  );

  const generateValidationSchema = (columns) => {
    const schema = {};

    columns.forEach((column) => {
      schema[column] = yup
        .string()
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        )
        .required(`${column} is required`);
    });

    return yup.object().shape(schema);
  };

  const validationSchema = useMemo(
    () => generateValidationSchema(columnDetails),
    [columnDetails]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    shouldFocusError: true,
    reValidateMode: "onChange",
    defaultValues,
  });

  const onDynamicFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleReset = () => {
    reset();
    if (onReset) {
      onReset();
    }
  };

  return (
    <>
      {/* Dynamic Form */}
      {columnDetails.length > 0 && (
        <Container
          component="form"
          onSubmit={handleSubmit(onDynamicFormSubmit)}
        >
          <Grid container spacing={2}>
            {columnDetails.map((column) => (
              <Grid item xs={12} sm={6} key={column}>
                <Controller
                  name={column}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={column}
                      fullWidth
                      variant="outlined"
                      error={!!errors[column]}
                      helperText={errors[column]?.message}
                      InputLabelProps={{ shrink: field.value }}
                      InputProps={{
                        readOnly: false, // Make the field read-only
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={12}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
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
                  color="primary"
                  className="danger"
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

export default DynamicFormCreationFormComponent;
