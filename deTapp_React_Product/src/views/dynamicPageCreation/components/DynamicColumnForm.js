import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
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
  debounce,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import OptionsDialogBox from "./DynamicOptionDialog";

// List of input types that can have multiple options
const multipleOptionsList = ["dropdown", "radio", "autocomplete", "checkbox"];

// Define validation schema using Yup

const schema = yup.object().shape({
  COLUMN_NAME: yup.object().nullable().required("Column name is required"),
  DATA_TYPE: yup.string().required("Data type is required"),
  IS_NULLABLE: yup.string().required("Mandatory field is required"),
  inputType: yup.object().nullable().required("Input Field is required"),
  CHARACTER_MAXIMUM_LENGTH: yup.string().nullable(),
  COLUMN_DEFAULT: yup.string().nullable(),
  noOfOptions: yup
    .string()
    .nullable()
    .when("inputType", {
      is: (value) =>
        value && multipleOptionsList.includes(value.NAME.toLowerCase()),
      then: (schema) => schema.required("Number of options is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  optionsList: yup
    .object()
    .nullable()
    .when("inputType", {
      is: (value) =>
        value && multipleOptionsList.includes(value.NAME.toLowerCase()),
      then: (schema) =>
        schema
          .required("Option List is required")
          .test(
            "options-length-match",
            "The number of options must match the specified count",
            function (optionsList) {
              const { noOfOptions } = this.parent;
              if (!optionsList) return false;
              return (
                Object.keys(optionsList).length === parseInt(noOfOptions, 10)
              );
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// Styled Box for the container with flex layout and gap handling
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
 * This component renders a dynamic form for configuring table columns with validation.
 * It allows the user to select various column properties such as column name, data type, and input type,
 * and dynamically adjust the form based on the selected input type.
 *
 * The component also handles real-time validation, sanitization, and interaction with a parent component
 * for state management. It supports custom option lists for input types that require multiple options.
 *
 * @param {Object} props - React props
 * @param {Object} props.data - Pre-filled data for the form
 * @param {Function} props.onReset - Callback function to handle form reset
 * @param {Array<string>} props.inputList - List of available input types
 * @param {React.Ref} ref - Forwarded ref to expose internal methods to the parent
 *
 * @returns {JSX.Element} The rendered component
 */

const DynamicColumnForm = forwardRef(
  (
    { formId, onReset, inputList, remainingColumnList, onColumnChange },
    ref
  ) => {
    // Initialize the form with validation schema and default values
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
    });

    const [open, setDialogOpen] = useState(false); // State to control the options dialog visibility
    const [isFocused, setIsFocused] = useState({}); // State to handle input focus
    const previousValue = useRef(null);
    // Expose a method to trigger form validation amd reset the form through a ref
    useImperativeHandle(ref, () => ({
      triggerValidation: async () => {
        const isValid = await trigger(); // Validate form
        const values = getValues(); // Get form values
        debugger;
        return { columnValues: values, validated: isValid };
      },
      resetForm: async () => {
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
      },
    }));

    // Handler to reset the form fields and notify parent component via `onReset`
    const handleReset = () => {
      if (onReset) onReset(formId, getValues().COLUMN_NAME?.COLUMN_NAME); // Notify parent to remove form

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
    };

    // Effect to sanitize input fields using DOMPurify
    useEffect(() => {
      const sanitizeInputs = () => {
        document.querySelectorAll("input").forEach((input) => {
          input.value = DOMPurify.sanitize(input.value); // Sanitize input value
        });
      };

      const formValues = getValues();
      sanitizeInputs();
    }, []);

    // Watch the input type field for dynamic behavior
    const inputWatchtype = watch("inputType");

    // Determine if the input type allows multiple options
    const isInputTypeValid = useMemo(() => {
      return multipleOptionsList.includes(inputWatchtype?.NAME?.toLowerCase());
    }, [inputWatchtype]);

    // Reset the options fields when the input type is changed and not valid for multiple options
    useEffect(() => {
      if (!isInputTypeValid) {
        reset({
          ...getValues(),
          noOfOptions: "",
          optionsList: null,
        });
      }
    }, [isInputTypeValid, reset, getValues]);

    const columnWatchType = watch("COLUMN_NAME");

    // Local function to handle column change and avoid redundant resets
    const onLocalColumnChange = useCallback(
      (data) => {
        if (data?.COLUMN_NAME !== previousValue.current?.COLUMN_NAME) {
          previousValue.current = data;
          reset({
            DATA_TYPE: data?.DATA_TYPE,
            CHARACTER_MAXIMUM_LENGTH: data?.CHARACTER_MAXIMUM_LENGTH,
            IS_NULLABLE: data?.IS_NULLABLE,
            COLUMN_DEFAULT: data?.COLUMN_DEFAULT,
            noOfOptions: null,
            optionsList: null,
            inputType: null,
            COLUMN_NAME: data,
          });
          if (onColumnChange) onColumnChange(data); // Call external column change handler if provided
        }
      },
      [reset, onColumnChange]
    );

    // Handle submission of the option list dialog
    const onOptionSubmit = (value) => {
      reset({
        ...getValues(),
        optionsList: value,
      });
      setDialogOpen(false); // Close dialog after submission
      trigger(); // Revalidate form
    };

    // Handle option reset
    const onOptionReset = () => {
      setDialogOpen(false); // Close dialog without saving changes
    };

    // Open the option list dialog for input types that allow multiple options
    const openOptionDialogList = async () => {
      const result = await trigger("noOfOptions"); // Validate number of options

      setDialogOpen(result); // Open dialog if validation passes
      debugger;
    };

    // Watch for COLUMN_NAME changes and trigger local column change
    useEffect(() => {
      if (columnWatchType) {
        onLocalColumnChange(columnWatchType);
      }
    }, [columnWatchType, onLocalColumnChange]);

    // Handle Autocomplete value change and debounce it to prevent excessive re-renders
    const handleAutocompleteColumnChange = useCallback(
      debounce((_, data) => {
        if (data && data !== previousValue.current) {
          onLocalColumnChange(data); // Update form value using setValue from react-hook-form
        }
      }, 300),
      [onLocalColumnChange]
    );

    return (
      <Container component="form">
        {/* Column Name Field */}
        <Controller
          name="COLUMN_NAME"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={remainingColumnList}
              getOptionLabel={(option) => option.COLUMN_NAME}
              isOptionEqualToValue={(option, value) => option.ID === value.ID}
              value={field.value || null}
              onChange={handleAutocompleteColumnChange}
              className="input-field"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Column Name"
                  fullWidth
                  error={!!errors.COLUMN_NAME}
                  helperText={errors.COLUMN_NAME?.message}
                  className="input-field"
                  InputLabelProps={{
                    shrink: Boolean(field.value || isFocused.COLUMN_NAME),
                  }}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: false, // Allow editing
                    onFocus: () =>
                      setIsFocused({ ...isFocused, COLUMN_NAME: true }),
                    onBlur: () =>
                      setIsFocused({ ...isFocused, COLUMN_NAME: false }),
                  }}
                />
              )}
            />
          )}
        />

        {/* Data Type Field */}
        <Controller
          name="DATA_TYPE"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data Type"
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

        {/* Character Maximum Length Field */}
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

        {/* Nullable Field */}
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
                readOnly: false, // Allow editing
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

        {/* Default Value Field */}
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

        {/* Input Type Field */}
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
                  label="Select Input Type"
                  fullWidth
                  error={!!errors.inputType}
                  helperText={errors.inputType?.message}
                  className="input-field"
                  InputLabelProps={{
                    shrink: Boolean(field.value || isFocused.inputType),
                  }}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: false, // Allow editing
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

        {/* Number of Options Field */}
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
                  readOnly: false, // Allow editing
                  onFocus: () =>
                    setIsFocused({ ...isFocused, noOfOptions: true }),
                  onBlur: () =>
                    setIsFocused({ ...isFocused, noOfOptions: false }),
                }}
              />
            )}
          />
        )}

        {/* Options List Button and Dialog */}
        {!!watch("noOfOptions") && watch("noOfOptions") > 0 && (
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
                  onClick={openOptionDialogList}
                  type="button"
                  variant="contained"
                  color="primary"
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

        {/* Delete Button */}
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

        {/* Options Dialog Box */}
        <OptionsDialogBox
          onSubmit={onOptionSubmit}
          onReset={onOptionReset}
          columnName={getValues()?.COLUMN_NAME?.COLUMN_NAME}
          noOfOptions={getValues().noOfOptions}
          handleClose={() => setDialogOpen(false)}
          open={open}
          defaultValues={getValues().optionsList}
          key={getValues()?.COLUMN_NAME?.COLUMN_NAME}
        />
      </Container>
    );
  }
);

export default DynamicColumnForm;
