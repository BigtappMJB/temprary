import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Box, Autocomplete, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../utilities/Validators";
import debounce from "lodash/debounce";

// Define validation schema using Yup
const schema = yup.object().shape({
  COLUMN_NAME: yup
    .string()
    .required("Column name is required")
    .matches(validationRegex.COLUMN_NAME, errorMessages.COLUMN_NAME),
  DATA_TYPE: yup.string().required("Data type is required"),
  IS_NULLABLE: yup.string().required("Data type is required"),
  inputType: yup.object().nullable().required("Input Field is required"),
  CHARACTER_MAXIMUM_LENGTH: yup
    .number()
    .nullable()
    .typeError("Length must be a number")
    .positive("Length must be a positive number")
    .integer("Length must be an integer")
    .min(1, "Length must be greater than 1")
    .required("Length is required"),
  COLUMN_DEFAULT: yup.string().nullable(),
  noOfOptions: yup
    .number()
    .nullable()
    .typeError("noOfOptions must be a number")
    .positive("noOfOptions must be a positive number")
    .integer("noOfOptions must be an integer")
    .min(1, "noOfOptions must be greater than 1")
    .when("inputType", {
      is: (value) =>
        ["dropdown", "radio", "autocomplete"].includes(
          value?.NAME?.toLowerCase()
        ),
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema,
    }),
  optionsList: yup.array().nullable(),
});

const COLUMN_DEFAULT = {
  COLUMN_NAME: "",
  DATA_TYPE: "",
  CHARACTER_MAXIMUM_LENGTH: "",
  IS_NULLABLE: false,
  COLUMN_DEFAULT: "",
  noOfOptions: null,
  optionsList: null,
};

// Styled Box for the container with overflow handling
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  alignItems: "center",
}));

/**
 * DynamicColumnForm component
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
 * // Example usage of DynamicColumnForm
 * <DynamicColumnForm
 *   data={data}
 *   onColumnSubmit={handleColumnSubmit}
 *   onReset={handleReset}
 *   dataTypes={['string', 'number', 'boolean']}
 * />
 *
 * @returns {JSX.Element} The rendered component
 */

const DynamicColumnForm = forwardRef(
  ({ data, onColumnSubmit, onReset, inputList }, ref) => {
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
      defaultValues: COLUMN_DEFAULT,
    });

    const watchInputType = watch("inputType");

    const updateParent = useCallback(
      debounce(() => {
        const fullValue = {
          id: data.id,
          validated: false,
          ...getValues(),
        };
        onColumnSubmit(fullValue);
      }, 300),
      [data.id, getValues, onColumnSubmit]
    );

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
          COLUMN_NAME: data.COLUMN_NAME ?? "",
          DATA_TYPE: data.DATA_TYPE ?? "",
          CHARACTER_MAXIMUM_LENGTH: data.CHARACTER_MAXIMUM_LENGTH ?? "",
          IS_NULLABLE: data.IS_NULLABLE ?? false,
          COLUMN_DEFAULT: data.COLUMN_DEFAULT ?? "",
          noOfOptions: data.noOfOptions ?? null,
          optionsList: data.optionsList ?? null,
          inputType: data.inputType ?? null,
        });
      }
    }, [data, reset]);

    // Reset form handler
    const handleReset = () => {
      reset(COLUMN_DEFAULT);
      if (onReset) onReset(data.id, data);
    };

    // Effect to sanitize input values
    useEffect(() => {
      const sanitizeInputs = () => {
        document.querySelectorAll("input").forEach((input) => {
          input.value = DOMPurify.sanitize(input.value);
        });
      };

      sanitizeInputs();
    }, []);

    useEffect(() => {
      if (!watchInputType) {
        reset((values) => ({
          ...values,
          noOfOptions: null,
          optionsList: [],
        }));
      }
    }, [watchInputType, reset]);

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
          name="COLUMN_NAME"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Column Name"
              variant="outlined"
              error={!!errors.COLUMN_NAME}
              helperText={errors.COLUMN_NAME?.message}
              className="input-field"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
          )}
        />

        <Controller
          name="DATA_TYPE"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="DataType"
              variant="outlined"
              error={!!errors.DATA_TYPE}
              helperText={errors.DATA_TYPE?.message}
              className="input-field"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
          )}
        />

        <Controller
          name="CHARACTER_MAXIMUM_LENGTH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Length"
              type={"number"}
              variant="outlined"
              error={!!errors.CHARACTER_MAXIMUM_LENGTH}
              helperText={errors.CHARACTER_MAXIMUM_LENGTH?.message}
              className="input-field"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
          )}
        />

        <Controller
          name="IS_NULLABLE"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mandatory"
              variant="outlined"
              select
              error={!!errors.IS_NULLABLE}
              helperText={errors.IS_NULLABLE?.message}
              className="input-field"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            >
              <MenuItem value={"YES"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="COLUMN_DEFAULT"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Default Value"
              variant="outlined"
              error={!!errors.COLUMN_DEFAULT}
              helperText={errors.COLUMN_DEFAULT?.message}
              className="input-field"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
          )}
        />

        <Controller
          name="inputType"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={inputList}
              getOptionLabel={(option) => option.NAME}
              isOptionEqualToValue={(option, value) => option.ID === value.ID}
              value={field.value || null}
              onChange={(_, data) => field.onChange(data)}
              className="input-field"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select inputType"
                  fullWidth
                  error={!!errors.inputType}
                  helperText={errors.inputType?.message}
                  className="input-field"
                  InputLabelProps={{
                    shrink: Boolean(field.value),
                  }}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: data?.id === 0, // Make the field read-only
                  }}
                />
              )}
            />
          )}
        />

        <Controller
          name="noOfOptions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={"number"}
              label="No of Options"
              variant="outlined"
              error={!!errors.COLUMN_DEFAULT}
              helperText={errors.COLUMN_DEFAULT?.message}
              className="input-field"
              InputProps={{
                readOnly: false, // Make the field read-only
              }}
            />
          )}
        />

        <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="danger"
            onClick={handleReset}
          >
            Delete
          </Button>
        </Box>
      </Container>
    );
  }
);

export default DynamicColumnForm;
