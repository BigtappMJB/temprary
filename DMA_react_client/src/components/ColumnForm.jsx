import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Box, IconButton, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../generals/validators";

// Define validation schema using Yup
const schema = yup.object().shape({
  columnName: yup
    .string()
    .required("Column name is required")
    .matches(validationRegex.columnName, errorMessages.columnName),
  dataType: yup.string().required("Data type is required"),
  length: yup
    .number()
    .typeError("Length must be a number")
    .positive("Length must be a positive number")
    .integer("Length must be an integer")
    .min(1, "Length must be greater than 1")
    .max(255, "Length must be lesser or equal to 255")
    .required("Length is required"),
  isPrimary: yup.boolean().required("Primary status is required"),
  isForeign: yup.boolean().required("Foreign status is required"),
  isMandatory: yup.boolean(),
  defaultValue: yup.string(),
  fkTableFieldName: yup.string().when("isForeign", {
    is: true,
    then: (schema) => schema.required("FK Table Field Name is required "),
    otherwise: (schema) => schema,
  }),
  fkTableName: yup.string().when("isForeign", {
    is: true,
    then: (schema) => schema.required("FK Table Name is required "),
    otherwise: (schema) => schema,
  }),
});

// Styled Box for the container with overflow handling
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  overflow: "auto",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

/**
 * TableColumnForm component
 *
 * This component renders a form for table column configuration with real-time validation
 * and sanitization of input values.
 *
 * @param {Object} props - React props
 * @param {Object} props.data - Data for the form
 * @param {Function} props.onColumnSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @returns {JSX.Element} The rendered component
 */
const TableColumnForm = ({ data, onColumnSubmit, onReset }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      columnName: "",
      dataType: "",
      length: "",
      isPrimary: false,
      isForeign: false,
      isMandatory: false,
      defaultValue: "",
      fkTableName: "",
      fkTableFieldName: "",
    },
  });

  const watchIsForeign = watch("isForeign");
  const watchIsPrimary = watch("isPrimary");

  const onLocalSubmit = useCallback(() => {
    const fullValue = {
      id: data.id,
      formSubmitted: true,
      ...getValues(),
    };
    setFormSubmitted(true);
    onColumnSubmit(fullValue);
  }, [data.id, getValues, onColumnSubmit]);

  useEffect(() => {
    if (data) {
      reset({
        columnName: data.columnName ?? "",
        dataType: data.dataType ?? "",
        length: data.length ?? "",
        isPrimary: data.isPrimary ?? false,
        isForeign: data.isForeign ?? false,
        isMandatory: data.isMandatory ?? false,
        defaultValue: data.defaultValue ?? "",
        fkTableName: data.fkTableName ?? "",
        fkTableFieldName: data.fkTableFieldName ?? "",
      });

      data?.formSubmitted && onLocalSubmit();
    }

    console.log({
      ID: data.id,
      formValues: getValues(),
    });
  }, [data, reset, getValues, onLocalSubmit]);

  // Reset form handler
  const handleReset = () => {
    reset({});
    if (onReset) onReset(data.id);
  };

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

  useEffect(() => {
    if (watchIsForeign === false) {
      reset((values) => ({
        ...values,
        fkTableName: "",
        fkTableFieldName: "",
      }));
    }

    if (watchIsPrimary === true) {
      setValue("isMandatory", true);
    }
  }, [watchIsForeign, watchIsPrimary, reset, setValue]);

  return (
    <Container component="form" onSubmit={handleSubmit(onLocalSubmit)}>
      <Controller
        name="columnName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Column Name"
            variant="outlined"
            error={!!errors.columnName}
            helperText={errors.columnName?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          />
        )}
      />
      <Controller
        name="dataType"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Data Type"
            variant="outlined"
            select
            error={!!errors.dataType}
            helperText={errors.dataType?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="length"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Length"
            variant="outlined"
            error={!!errors.length}
            helperText={errors.length?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          />
        )}
      />
      <Controller
        name="isPrimary"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Is Primary"
            variant="outlined"
            select
            error={!!errors.isPrimary}
            helperText={errors.isPrimary?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="isForeign"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Is Foreign Key"
            variant="outlined"
            select
            error={!!errors.isForeign}
            helperText={errors.isForeign?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="isMandatory"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Mandatory"
            variant="outlined"
            select
            InputProps={{
              readOnly: formSubmitted || watchIsPrimary === true, // Make the field read-only
            }}
            error={!!errors.isMandatory}
            helperText={errors.isMandatory?.message}
            className="input-field"
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="defaultValue"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Default Value"
            variant="outlined"
            error={!!errors.defaultValue}
            helperText={errors.defaultValue?.message}
            className="input-field"
            InputProps={{
              readOnly: formSubmitted, // Make the field read-only
            }}
          />
        )}
      />
      <Controller
        name="fkTableName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="FK Table ID"
            variant="outlined"
            select
            InputProps={{
              readOnly: formSubmitted || watchIsForeign === false,
            }}
            error={!!errors.fkTableName}
            helperText={errors.fkTableName?.message}
            className="input-field"
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="fkTableFieldName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="FK Table Field Name"
            variant="outlined"
            select
            InputProps={{
              readOnly: formSubmitted || watchIsForeign === false,
            }}
            error={!!errors.fkTableFieldName}
            helperText={errors.fkTableFieldName?.message}
            className="input-field"
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </TextField>
        )}
      />
      {!formSubmitted && (
        <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
          <Tooltip title={data?.formSubmitted ? "Update" : "Save"}>
            <IconButton type="submit" color="primary">
              {data?.formSubmitted ? <CheckIcon /> : <CheckIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="secondary" onClick={handleReset}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Container>
  );
};

export default TableColumnForm;
