import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Box, Autocomplete, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../utilities/Validators";
import debounce from "lodash/debounce";
import { getColumnsDetailsController } from "../../dynamicPageCreation/controllers/dynamicPageCreationController";
import { useLoading } from "../../../components/Loading/loadingProvider";
import PropTypes from "prop-types";

const dataTypeRequiredLength = [
  "CHAR",
  "VARCHAR",
  "BINARY",
  "VARBINARY",
  "DECIMAL",
  "FLOAT",
  "DOUBLE",
  "ENUM",
  "SET",
];
// Define validation schema using Yup
const schema = yup.object().shape({
  columnName: yup
    .string()
    .required("Column name is required")
    .matches(validationRegex.columnName, errorMessages.columnName),
  dataType: yup
    .object()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Data type is required"),
  length: yup
    .number()
    .nullable()
    .typeError("Length must be a number")
    .positive("Length must be a positive number")
    .integer("Length must be an integer")
    .min(1, "Length must be greater than 1")
    .max(255, "Length must be lesser or equal to 255")
    .when("dataType", {
      is: (value) => {
        return value && dataTypeRequiredLength.includes(value?.name);
      },

      then: (schema) => schema.required("Length is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  isPrimary: yup.boolean().required("Primary status is required"),
  isForeign: yup.boolean().required("Foreign status is required"),
  isMandatory: yup.boolean(),
  defaultValue: yup.string(),
  fkTableFieldName: yup
    .object()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))

    .when("isForeign", {
      is: true,
      then: (schema) => schema.required("FK Table Field Name is required "),
      otherwise: (schema) => schema,
    }),
  fkTableName: yup
    .object()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))

    .when("isForeign", {
      is: true,
      then: (schema) => schema.required("FK Table Name is required "),
      otherwise: (schema) => schema,
    }),
});

const defaultValue = {
  columnName: "",
  dataType: "",
  length: null,
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
  (
    { data, onColumnSubmit, onReset, dataTypes, isRemovingForm, tableList },
    ref
  ) => {
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
    const watchTableName = watch("fkTableName");

    const { startLoading, stopLoading } = useLoading();
    const allColumnsDataList = useRef([]);
    const previousTableValue = useRef();

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
        console.log(Object.keys(errors));

        // Iterate over errors and log the error messages
        Object.keys(errors).forEach((field) => {
          console.log(`Field: ${field}, Message: ${errors[field]?.message}`);
        });

        return { ...values, validated: isValid };
      },
    }));

    useEffect(() => {
      if (data) {
        reset({
          columnName: data.columnName ?? "",
          dataType: data.dataType ?? "",
          length: data.length ? Number(data.length) : null,
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

    // Fetch column details when a table is selected
    const getColumnDetails = useCallback(
      async (tableName) => {
        try {
          startLoading();
          const response = await getColumnsDetailsController(tableName);
          allColumnsDataList.current = response;
        } catch (error) {
          console.error(error);
        } finally {
          stopLoading();
        }
      },
      [startLoading, stopLoading]
    );

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
    const stableReset = useCallback((values) => reset(values), [reset]);

    // Effect for handling form reset logic
    useEffect(() => {
      if (watchIsForeign === true) {
        stableReset((prevValues) => ({
          ...prevValues,
          isMandatory: true,
        }));
        return;
      }

      if (!data?.isForeign && watchIsForeign === true) {
        stableReset((prevValues) => ({
          ...prevValues,
          fkTableName: "",
          fkTableFieldName: "",
        }));
        return;
      }

      if (watchIsPrimary === true) {
        stableReset((prevValues) => ({
          ...prevValues,
          isMandatory: true,
        }));
        return;
      }
      if (data?.isForeign) {
        stableReset((prevValues) => ({
          ...prevValues,
          fkTableName: data.fkTableName ?? "",
          fkTableFieldName: data.fkTableFieldName ?? "",
        }));

        return;
      }
    }, [watchIsForeign, watchIsPrimary, stableReset, data]);

    // Effect for handling API call logic
    useEffect(() => {
      if (
        watchTableName?.TABLE_NAME &&
        previousTableValue.current !== watchTableName?.TABLE_NAME
      ) {
        // Call the API to get column details only if the table name has changed
        getColumnDetails(watchTableName?.TABLE_NAME);
        stableReset((prevValues) => ({
          ...prevValues,
          fkTableFieldName: data?.fkTableFieldName ?? null,
        }));
        previousTableValue.current = watchTableName?.TABLE_NAME; // Update the previous value to avoid rerun
      }
    }, [watchTableName]); // Only depend on watchTableName
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
        <Controller
          name="dataType"
          readOnly
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={dataTypes}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
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
                />
              )}
            />
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
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          )}
        />

        {watch("isForeign") && watch("isForeign") === true && (
          <>
            <Controller
              name="fkTableName"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={tableList}
                  getOptionLabel={(option) => option.TABLE_NAME}
                  isOptionEqualToValue={(option, value) =>
                    option.TABLE_NAME === value.TABLE_NAME
                  }
                  className="input-field"
                  value={field.value || null}
                  onChange={(_, data) => {
                    field.onChange(data);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select FK table"
                      fullWidth
                      className="input-field"
                      error={!!errors.fkTableName}
                      helperText={errors.fkTableName?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="fkTableFieldName"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={allColumnsDataList.current}
                  getOptionLabel={(option) => option.COLUMN_NAME}
                  isOptionEqualToValue={(option, value) =>
                    option.COLUMN_NAME === value.COLUMN_NAME
                  }
                  className="input-field"
                  value={field.value || null}
                  onChange={(_, data) => {
                    field.onChange(data);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select FK Column"
                      fullWidth
                      className="input-field"
                      error={!!errors.fkTableFieldName}
                      helperText={errors.fkTableFieldName?.message}
                    />
                  )}
                />
              )}
            />
          </>
        )}

        {data?.id !== 0 && (
          <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
            {/* <Tooltip title="Delete" arrow>
              <IconButton sx={{ color: "#d92d20" }} onClick={handleReset}>
                <CloseIcon />
              </IconButton>
            </Tooltip> */}

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
        )}
      </Container>
    );
  }
);
// Define PropTypes validation
TableColumnForm.propTypes = {
  data: PropTypes.shape({
    columnName: PropTypes.string, // columnName should be a string
    dataType: PropTypes.string, // dataType should be a string
    length: PropTypes.oneOfType([
      // length can be a number or null
      PropTypes.number,
      PropTypes.oneOf([null]),
    ]),
    isPrimary: PropTypes.bool, // isPrimary should be a boolean
    isForeign: PropTypes.bool, // isForeign should be a boolean
    isMandatory: PropTypes.bool, // isMandatory should be a boolean
    defaultValue: PropTypes.any, // defaultValue should be a any
    fkTableName: PropTypes.any, // fkTableName should be a any
    fkTableFieldName: PropTypes.any, // fkTableFieldName should be a any
  }).isRequired, // data object is required
  onColumnSubmit: PropTypes.func.isRequired, // onColumnSubmit should be a function and required
  onReset: PropTypes.func.isRequired, // onReset should be a function and required
  dataTypes: PropTypes.arrayOf(PropTypes.any), // dataTypes should be an array of strings
  isRemovingForm: PropTypes.bool, // isRemovingForm should be a boolean
  tableList: PropTypes.arrayOf(
    // tableList should be an array of objects
    PropTypes.shape({
      tableName: PropTypes.string, // Define the structure for each table object
      tableId: PropTypes.number,
    })
  ),
};
export default TableColumnForm;
