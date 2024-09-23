import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../utilities/Validators";
import debounce from "lodash/debounce";
import OptionsDialogBox from "./DynamicOptionDialog";

const multipleOptionsList = ["dropdown", "radio", "autocomplete", "checkbox"];
// Define validation schema using Yup
const schema = yup.object().shape({
  COLUMN_NAME: yup
    .string()
    .required("Column name is required")
    .matches(validationRegex.COLUMN_NAME, errorMessages.COLUMN_NAME),
  DATA_TYPE: yup.string().required("Data type is required"),
  IS_NULLABLE: yup.string().required("Data type is required"),
  inputType: yup.object().nullable().required("Input Field is required"),
  CHARACTER_MAXIMUM_LENGTH: yup.string(),
  // .required("Length is required"),
  COLUMN_DEFAULT: yup.string().nullable(),
  noOfOptions: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .positive("noOfOptions must be a positive number")
    .integer("noOfOptions must be an integer")
    .min(1, "noOfOptions must be greater than 1")
    .when("inputType", {
      is: (value) => {
        return multipleOptionsList.includes(value?.NAME?.toLowerCase());
      },
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema,
    }),
  optionsList: yup
    .object()
    .nullable()
    .when("inputType", {
      is: (value) => {
        return multipleOptionsList.includes(value?.NAME?.toLowerCase());
      },
      then: (schema) => schema.required("Option List is required"),
      otherwise: (schema) => schema,
    })
    .when("noOfOptions", {
      is: (value) => value === null && value === "" && value <= 0,
      then: (schema) =>
        schema.required(
          "NoOfOption should not be empty and has positive number"
        ),
      otherwise: (schema) => schema,
    }),
});

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
      defaultValues: {
        COLUMN_NAME: data.COLUMN_NAME ?? "",
        DATA_TYPE: data.DATA_TYPE ?? "",
        CHARACTER_MAXIMUM_LENGTH: data.CHARACTER_MAXIMUM_LENGTH ?? "",
        IS_NULLABLE: data.IS_NULLABLE ?? false,
        COLUMN_DEFAULT: data.COLUMN_DEFAULT ?? "",
        noOfOptions:
          data.noOfOptions !== "" && typeof data.noOfOptions === "number"
            ? Number(data.noOfOptions)
            : null,
        optionsList: data.optionsList ?? null,
        inputType: data.inputType ?? null,
      },
    });

    const [open, setDialogOpen] = useState(false);

    const [isFocused, setIsFocused] = useState({});

    const updateParent = useCallback(async () => {
      const fullValue = {
        id: data.id,
        validated: false,
        ...getValues(),
      };
      debugger;
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
          COLUMN_NAME: "",
          DATA_TYPE: data.DATA_TYPE ?? "",
          CHARACTER_MAXIMUM_LENGTH: data.CHARACTER_MAXIMUM_LENGTH ?? "",
          IS_NULLABLE: data.IS_NULLABLE ?? false,
          COLUMN_DEFAULT: data.COLUMN_DEFAULT ?? "",
          noOfOptions: data.noOfOptions ?? null,
          optionsList: data.optionsList ?? null,
          inputType: data.inputType ?? null,
        });
        console.log(getValues());
        debugger;
      }
    }, [data, reset]);

    // Reset form handler
    const handleReset = () => {
      reset({
        COLUMN_NAME: "",
        DATA_TYPE: "",
        CHARACTER_MAXIMUM_LENGTH: "",
        IS_NULLABLE: false,
        COLUMN_DEFAULT: "",
        noOfOptions: null,
        optionsList: null,
        inputType: null,
      });
      debugger;
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

    const inputWatchtype = watch("inputType");

    const isInputTypeValid = useMemo(() => {
      return multipleOptionsList.includes(inputWatchtype?.NAME?.toLowerCase());
    }, [inputWatchtype]);

    useEffect(() => {
      if (!isInputTypeValid) {
        reset({
          ...getValues(),
          noOfOptions: "",
          optionsList: null,
        });
      }
    }, [isInputTypeValid, reset, getValues]);

    const onOptionSubmit = (value) => {
      reset({
        ...getValues(),
        optionsList: value,
      });
      setDialogOpen(false);
      trigger();
    };

    const onOptionReset = () => {
      setDialogOpen(false);
    };

    const openOptionDialogList = async () => {
      const result = await trigger("noOfOptions");
      setDialogOpen(result);
    };

    // Watch for changes and update parent on change
    useEffect(() => {
      const subscription = watch(() => {
        updateParent();
      });

      return () => subscription.unsubscribe();
    }, [watch, updateParent]);

    console.log({ inputList });

    return (
      <Container component="form" onSubmit={handleSubmit(updateParent)}>
        <Controller
          name="COLUMN_NAME"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Column Name"
              value={field.value ?? ""} // Explicitly bind the value
              variant="outlined"
              error={!!errors.COLUMN_NAME}
              helperText={errors.COLUMN_NAME?.message}
              className="input-field"
              InputLabelProps={{
                shrink: Boolean(field.value || isFocused.COLUMN_NAME),
              }}
              InputProps={{
                ...field.InputProps,
                readOnly: true, // Set to true if you want the field to be read-only
                onFocus: () =>
                  setIsFocused({ ...isFocused, COLUMN_NAME: true }),
                onBlur: () =>
                  setIsFocused({ ...isFocused, COLUMN_NAME: false }),
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
              value={field.value ?? ""} // Explicitly bind the value
              error={!!errors.DATA_TYPE}
              helperText={errors.DATA_TYPE?.message}
              className="input-field"
              InputLabelProps={{
                shrink: Boolean(field.value || isFocused.DATA_TYPE),
              }}
              InputProps={{
                ...field.InputProps,
                readOnly: true, // Set to true if you want the field to be read-only
                onFocus: () => setIsFocused({ ...isFocused, DATA_TYPE: true }),
                onBlur: () => setIsFocused({ ...isFocused, DATA_TYPE: false }),
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
              value={field.value ?? ""} // Explicitly bind the value
              error={!!errors.CHARACTER_MAXIMUM_LENGTH}
              helperText={errors.CHARACTER_MAXIMUM_LENGTH?.message}
              className="input-field"
              InputLabelProps={{
                shrink: Boolean(
                  field.value || isFocused.CHARACTER_MAXIMUM_LENGTH
                ),
              }}
              InputProps={{
                ...field.InputProps,
                readOnly: true, // Set to true if you want the field to be read-only
                onFocus: () =>
                  setIsFocused({
                    ...isFocused,
                    CHARACTER_MAXIMUM_LENGTH: true,
                  }),
                onBlur: () =>
                  setIsFocused({
                    ...isFocused,
                    CHARACTER_MAXIMUM_LENGTH: false,
                  }),
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
              value={field.value ?? ""} // Explicitly bind the value
              variant="outlined"
              select
              error={!!errors.IS_NULLABLE}
              helperText={errors.IS_NULLABLE?.message}
              className="input-field"
              InputLabelProps={{
                shrink: Boolean(field.value || isFocused.IS_NULLABLE),
              }}
              InputProps={{
                ...field.InputProps,
                readOnly: false, // Set to true if you want the field to be read-only
                onFocus: () =>
                  setIsFocused({ ...isFocused, IS_NULLABLE: true }),
                onBlur: () =>
                  setIsFocused({ ...isFocused, IS_NULLABLE: false }),
              }}
            >
              <MenuItem value={"YES"}>Yes</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
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
              value={field.value ?? ""} // Explicitly bind the value
              error={!!errors.COLUMN_DEFAULT}
              helperText={errors.COLUMN_DEFAULT?.message}
              className="input-field"
              InputLabelProps={{
                shrink: Boolean(field.value || isFocused.COLUMN_DEFAULT),
              }}
              InputProps={{
                ...field.InputProps,
                readOnly: true, // Set to true if you want the field to be read-only
                onFocus: () =>
                  setIsFocused({ ...isFocused, COLUMN_DEFAULT: true }),
                onBlur: () =>
                  setIsFocused({ ...isFocused, COLUMN_DEFAULT: false }),
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
                    shrink: Boolean(field.value || isFocused.inputType),
                  }}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: false, // Set to true if you want the field to be read-only
                    onFocus: () =>
                      setIsFocused({ ...isFocused, inputType: true }),
                    onBlur: () =>
                      setIsFocused({ ...isFocused, inputType: false }),
                  }}
                />
              )}
            />
          )}
        />

        {multipleOptionsList.includes(
          getValues().inputType?.NAME?.toLowerCase()
        ) && (
          <Controller
            name="noOfOptions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="No of Options"
                variant="outlined"
                value={field.value ?? ""} // Explicitly bind the value
                error={!!errors.noOfOptions}
                helperText={errors.noOfOptions?.message}
                className="input-field"
                InputLabelProps={{
                  shrink: Boolean(field.value || isFocused.noOfOptions),
                }}
                InputProps={{
                  ...field.InputProps,
                  readOnly: false, // Set to true if you want the field to be read-only
                  onFocus: () =>
                    setIsFocused({ ...isFocused, noOfOptions: true }),
                  onBlur: () =>
                    setIsFocused({ ...isFocused, noOfOptions: false }),
                }}
              />
            )}
          />
        )}

        {!!getValues().noOfOptions && getValues().noOfOptions > 0 && (
          <Controller
            name="optionsList"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  {...field}
                  value={field.value ?? ""} // Explicitly bind the value
                  onClick={openOptionDialogList}
                  type="button"
                  variant="contained"
                  color="primary"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                    cursor: "pointer",
                  }}
                  className={`${
                    typeof watch("noOfOptions") !== "number" && // Value is not a number
                    watch("noOfOptions") <= 0
                      ? "custom-display-disabled"
                      : "primary"
                  }`}
                >
                  Option List
                </Button>
                {/* Display validation error if exists */}
                <Box>
                  {errors.optionsList && (
                    <Typography
                      sx={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: "400",
                        fontSize: "0.75rem",
                        lineHeight: "1.66",
                        textAlign: "left",
                        marginTop: "3px",
                        marginRight: "14px",
                        marginBottom: "0",
                        color: "red",
                        marginLeft: "14px",
                      }}
                    >
                      {errors.optionsList?.message}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          />
        )}

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
        <OptionsDialogBox
          onSubmit={onOptionSubmit}
          onReset={onOptionReset}
          noOfOptions={getValues().noOfOptions}
          handleClose={() => setDialogOpen(false)}
          open={open}
          defaultValues={getValues().optionsList}
          key={"dialogKey"}
        />
      </Container>
    );
  }
);

export default DynamicColumnForm;
