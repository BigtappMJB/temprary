import React, { useEffect, useState } from "react";
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
import { useLoading } from "../../../components/Loading/loadingProvider";
import { getColumnsDetailsController } from "../controllers/dynamicPageCreationController";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

// Schema for validation
const schema1 = yup.object().shape({
  tableName: yup.object().required("Table is required"),
});

const DynamicFormCreationFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  inputFieldList,
  tableList,
}) => {
  const [readOnly, setReadOnly] = useState(false);
  const [columnDetails, setColumnDetails] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema1),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  // Dynamically generate Yup schema based on columnDetails
  const generateValidationSchema = (fields) => {
    const shape = {};

    fields.forEach((field) => {
      let schema = yup.mixed();

      if (field.IS_NULLABLE === "NO") {
        schema = schema.required(`${field.COLUMN_NAME} is required`);
      }

      shape[field.COLUMN_NAME] = schema;
    });

    return yup.object().shape(shape);
  };

  // Initialize form with dynamic schema
  const dynamicSchema = generateValidationSchema(columnDetails);

  const {
    control: dynamicControl,
    handleSubmit: handleDynamicSubmit,
    reset: dynamicReset,
    formState: { errors: dynamicErrors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(dynamicSchema),
    defaultValues: {},
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  const getTableListData = async (tableName) => {
    try {
      startLoading();
      const response = await getColumnsDetailsController(tableName);
      setColumnDetails(response);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const onTableSubmit = (data) => {
    getTableListData(data.tableName.TABLE_NAME);
  };

  const onDynamicFormSubmit = (data) => {
    onSubmit(data);
    dynamicReset(); // Clear dynamic form after submission
    setColumnDetails([]); // Clear column details after submission
  };

  const handleDynamicReset = () => {
    dynamicReset(); // Reset dynamic form fields
    setColumnDetails([]); // Clear column details
  };

  const handleReset = () => {
    dynamicReset();
    setColumnDetails([]);
    // onReset();
    reset({
      tableName: "",
    });
  };

  return (
    <>
      {/* Initial Table Selection Form */}
      <Container component="form" onSubmit={handleSubmit(onTableSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="tableName"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={tableList}
                  getOptionLabel={(option) => option.TABLE_NAME}
                  isOptionEqualToValue={(option, value) =>
                    option.TABLE_NAME === value.TABLE_NAME
                  }
                  value={field.value || null}
                  onChange={(_, data) => {
                    field.onChange(data);
                    setColumnDetails([]);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select table"
                      fullWidth
                      error={!!errors.tableName}
                      helperText={errors.tableName?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          {columnDetails.length === 0 && (
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                flexWrap="wrap"
                gap={2} // Adds space between buttons
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="primary"
                  disabled={columnDetails.length > 0}
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
          )}
        </Grid>
      </Container>

      {/* Dynamic Form */}
      {columnDetails.length > 0 && (
        <Container
          component="form"
          onSubmit={handleDynamicSubmit(onDynamicFormSubmit)}
        >
          <Grid container spacing={2}>
            {columnDetails.map((field) => (
              <Grid item xs={12} sm={6} key={field.COLUMN_NAME}>
                <Controller
                  name={field.COLUMN_NAME}
                  control={dynamicControl}
                  render={({ field: controllerField }) => (
                    <Autocomplete
                      {...controllerField}
                      options={inputFieldList}
                      getOptionLabel={(option) => option.NAME || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.ID === value.ID
                      }
                      onChange={(_, value) =>
                        controllerField.onChange(value?.value || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={field.COLUMN_NAME}
                          fullWidth
                          error={!!dynamicErrors[field.COLUMN_NAME]}
                          helperText={dynamicErrors[field.COLUMN_NAME]?.message}
                        />
                      )}
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
                gap={2} // Adds space between buttons
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="primary"
                >
                  Create
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
