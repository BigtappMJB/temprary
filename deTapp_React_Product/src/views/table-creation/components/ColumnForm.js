import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../utilities/Validators";
import debounce from "lodash/debounce";

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

const defaultValue = {
  columnName: "",
  dataType: "",
  length: "",
  isPrimary: false,
  isForeign: false,
  isMandatory: false,
  defaultValue: "",
  fkTableName: "",
  fkTableFieldName: "",
};

// Styled Box for the container with overflow handling
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",

  padding: theme.spacing(2),
  gap: theme.spacing(1),
  alignItems: "center",
  // background:
  //   "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

/**
 * TableColumnForm component
 *
 * This component renders a form for table column configuration with real-time validation
 * and sanitization of input values. It updates the parent component with the form values
 * whenever the form or any field changes.
 *
 * @param {Object} props - React props
 * @param {Object} props.data - Data for the form
 * @param {Function} props.onColumnSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array<string>} props.dataTypes - Array of DataTypes
 *
 * @example
 * // Example usage of TableColumnForm
 * <TableColumnForm
 *   data={data}
 *   onColumnSubmit={handleColumnSubmit}
 *   onReset={handleReset}
 *   dataTypes={['string', 'number', 'boolean']}
 * />
 *
 * @returns {JSX.Element} The rendered component
 */

const TableColumnForm = forwardRef(
  ({ data, onColumnSubmit, onReset, dataTypes, isRemovingForm }, ref) => {
    const [isFocused, setIsFocused] = useState({
      dataType: false,
    });
    const {
      control,
      handleSubmit,
      reset,
      getValues,
      watch,
      trigger,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: defaultValue,
    });

    const watchIsForeign = watch("isForeign");
    const watchIsPrimary = watch("isPrimary");

    const updateParent = useCallback(async () => {
      const fullValue = {
        id: data.id,
        validated: false,
        ...getValues(),
      };
      onColumnSubmit(fullValue);
    }, [data.id, getValues, onColumnSubmit]);

    useCallback(debounce(updateParent, 300), [updateParent]);

    // Expose a method to trigger validation via ref
    useImperativeHandle(ref, () => ({
      triggerValidation: async () => {
        const isValid = await trigger();
        const values = getValues();
        return { ...values, validated: isValid };
      },
    }));

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
      }
    }, [data, reset]);

    // Reset form handler
    const handleReset = (event) => {
      // event.stopPropagation();
      reset(defaultValue);
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
        reset((values) => ({
          ...values,
          isMandatory: true,
        }));
      }
    }, [watchIsForeign, watchIsPrimary, reset]);

    // Watch for changes and update parent on change
    useEffect(() => {
      const subscription = watch(() => {
        updateParent();
      });
      return () => subscription.unsubscribe();
    }, [watch, updateParent]);

    return (
      <Container component="form" onSubmit={handleSubmit(updateParent)}>
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
                readOnly: data?.id === 0, // Make the field read-only
              }}
            />
          )}
        />
        {data?.id === 0 ? (
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
                  readOnly: data?.id === 0, // Make the field read-only
                }}
              >
                {dataTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ) : (
          <Controller
            name="dataType"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={dataTypes}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                className="input-field"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select datatype"
                    fullWidth
                    error={!!errors.dataType}
                    helperText={errors.dataType?.message}
                    className="input-field"
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.dataType),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: data?.id === 0, // Make the field read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, dataType: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, dataType: false }),
                    }}
                    disabled={data?.id === 0} // Disable the input to make it read-only
                  />
                )}
              />
            )}
          />
        )}
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
                readOnly: data?.id === 0, // Make the field read-only
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
                readOnly: true, // Make the field read-only
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
                readOnly: data?.id === 0, // Make the field read-only
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
              error={!!errors.isMandatory}
              helperText={errors.isMandatory?.message}
              className="input-field"
              InputProps={{
                readOnly: data?.id === 0, // Make the field read-only
              }}
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
                readOnly: data?.id === 0, // Make the field read-only
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
              error={!!errors.fkTableName}
              helperText={errors.fkTableName?.message}
              className="input-field"
              InputProps={{
                readOnly: data?.id === 0, // Make the field read-only
              }}
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
              error={!!errors.fkTableFieldName}
              helperText={errors.fkTableFieldName?.message}
              className="input-field"
              InputProps={{
                readOnly: data?.id === 0, // Make the field read-only
              }}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
            </TextField>
          )}
        />
        {data?.id !== 0 && (
          <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
            <Tooltip title="Delete" arrow>
              <IconButton sx={{ color: "#d92d20" }} onClick={handleReset}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Container>
    );
  }
);

export default TableColumnForm;
