// DynamicForm.jsx
import React, { useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { css } from "@emotion/react";
import Axios from "axios";

/**
 * Generates validation schema based on columns data configuration.
 * @param {Object} columnsData - Columns data configuration object
 * @returns {Object} - Yup validation schema
 */
const generateValidationSchema = (columnsData) => {
  const schema = {};

  Object.values(columnsData).forEach((column) => {
    const { COLUMN_NAME, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH, optionsList } =
      column;
    let validator = yup.string();

    if (column.DATA_TYPE === "date") {
      validator = yup.date();
    } else if (column.DATA_TYPE === "varchar") {
      validator = yup.string().max(CHARACTER_MAXIMUM_LENGTH);
    }

    if (IS_NULLABLE === "NO") {
      validator = validator.required("This field is required");
    }

    if (column.inputType.NAME === "CHECKBOX" && optionsList) {
      validator = yup
        .array()
        .min(1, "At least one option must be selected")
        .of(yup.string());
    }

    schema[COLUMN_NAME.COLUMN_NAME] = validator;
  });

  return yup.object().shape(schema);
};

/**
 * Component for rendering dynamic form
 * @param {Object} props - Component properties
 * @param {Object} props.columnsData - Columns data configuration object
 * @returns {JSX.Element} - Rendered form component
 */
const DynamicForm = ({ columnsData }) => {
  const schema = useMemo(
    () => generateValidationSchema(columnsData),
    [columnsData]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data) => {
    try {
      console.log("Form Data:", data);
      // Replace this URL with your actual endpoint
      const response = await Axios.post(
        "https://your-api-endpoint.com/submit",
        data
      );
      console.log("Form submission response:", response);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }, []);

  return (
    <Box css={formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {Object.values(columnsData).map((column, index) => {
            const { COLUMN_NAME, inputType, optionsList } = column;
            const fieldName = COLUMN_NAME.COLUMN_NAME;

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {inputType.NAME === "TEXT" && (
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={fieldName}
                        fullWidth
                        error={!!errors[fieldName]}
                        helperText={errors[fieldName]?.message}
                      />
                    )}
                  />
                )}

                {inputType.NAME === "DROPDOWN" && (
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel>{fieldName}</InputLabel>
                        <Select {...field} fullWidth>
                          {Object.entries(optionsList).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[fieldName] && (
                          <FormHelperText error>
                            {errors[fieldName]?.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                )}

                {inputType.NAME === "RADIO" && (
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        {Object.entries(optionsList).map(([key, value]) => (
                          <FormControlLabel
                            key={key}
                            value={value}
                            control={<Radio />}
                            label={value}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                )}

                {inputType.NAME === "CHECKBOX" && (
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <>
                        {Object.entries(optionsList).map(([key, value]) => (
                          <FormControlLabel
                            key={key}
                            control={
                              <Checkbox
                                checked={field.value.includes(value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, value]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((v) => v !== value)
                                    );
                                  }
                                }}
                              />
                            }
                            label={value}
                          />
                        ))}
                        {errors[fieldName] && (
                          <FormHelperText error>
                            {errors[fieldName]?.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                )}

                {inputType.NAME === "DATE" && (
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        type="date"
                        {...field}
                        label={fieldName}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors[fieldName]}
                        helperText={errors[fieldName]?.message}
                      />
                    )}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

// Custom styling using Emotion
const formContainer = css`
  padding: 16px;
  margin: auto;
  max-width: 800px;
`;

// Example usage
const inputData = {
  pageDetails: {
    menu: "asdsa",
    subMenu: "asd",
    pageName: "asd",
    route: "asd",
  },
  tableName: "employees",
  columnsData: {
    0: {
      DATA_TYPE: "varchar",
      CHARACTER_MAXIMUM_LENGTH: 255,
      IS_NULLABLE: "YES",
      COLUMN_DEFAULT: null,
      noOfOptions: null,
      optionsList: null,
      inputType: { ID: 1, NAME: "TEXT" },
      COLUMN_NAME: {
        CHARACTER_MAXIMUM_LENGTH: 255,
        COLUMN_DEFAULT: null,
        COLUMN_KEY: "",
        COLUMN_NAME: "employee_name",
        DATA_TYPE: "varchar",
        EXTRA: "",
        IS_NULLABLE: "NO",
        NUMERIC_PRECISION: null,
        NUMERIC_SCALE: null,
      },
    },
    1: {
      DATA_TYPE: "varchar",
      CHARACTER_MAXIMUM_LENGTH: 255,
      IS_NULLABLE: "YES",
      COLUMN_DEFAULT: null,
      noOfOptions: "2",
      optionsList: { "Option 1": "HR", "Option 2": "IT" },
      inputType: { ID: 4, NAME: "DROPDOWN" },
      COLUMN_NAME: {
        CHARACTER_MAXIMUM_LENGTH: 255,
        COLUMN_DEFAULT: null,
        COLUMN_KEY: "",
        COLUMN_NAME: "department",
        DATA_TYPE: "varchar",
        EXTRA: "",
        IS_NULLABLE: "NO",
        NUMERIC_PRECISION: null,
        NUMERIC_SCALE: null,
      },
    },
    2: {
      DATA_TYPE: "varchar",
      CHARACTER_MAXIMUM_LENGTH: 255,
      IS_NULLABLE: "NO",
      COLUMN_DEFAULT: null,
      noOfOptions: "3",
      optionsList: {
        "Option 1": "Male ",
        "Option 2": "Female",
        "Option 3": "Others",
      },
      inputType: { ID: 3, NAME: "RADIO" },
      COLUMN_NAME: {
        CHARACTER_MAXIMUM_LENGTH: 255,
        COLUMN_DEFAULT: null,
        COLUMN_KEY: "",
        COLUMN_NAME: "gender",
        DATA_TYPE: "varchar",
        EXTRA: "",
        IS_NULLABLE: "NO",
        NUMERIC_PRECISION: null,
        NUMERIC_SCALE: null,
      },
    },
    3: {
      DATA_TYPE: "date",
      CHARACTER_MAXIMUM_LENGTH: null,
      IS_NULLABLE: "NO",
      COLUMN_DEFAULT: null,
      noOfOptions: null,
      optionsList: null,
      inputType: { ID: 2, NAME: "DATE" },
      COLUMN_NAME: {
        CHARACTER_MAXIMUM_LENGTH: null,
        COLUMN_DEFAULT: null,
        COLUMN_KEY: "",
        COLUMN_NAME: "joiningDate",
        DATA_TYPE: "date",
        EXTRA: "",
        IS_NULLABLE: "NO",
        NUMERIC_PRECISION: null,
        NUMERIC_SCALE: null,
      },
    },
    4: {
      DATA_TYPE: "varchar",
      CHARACTER_MAXIMUM_LENGTH: 255,
      IS_NULLABLE: "NO",
      COLUMN_DEFAULT: null,
      noOfOptions: "2",
      optionsList: { "Option 1": "Office", "Option 2": "WFH" },
      inputType: { ID: 10, NAME: "CHECKBOX" },
      COLUMN_NAME: {
        CHARACTER_MAXIMUM_LENGTH: 255,
        COLUMN_DEFAULT: null,
        COLUMN_KEY: "",
        COLUMN_NAME: "workingMode",
        DATA_TYPE: "varchar",
        EXTRA: "",
        IS_NULLABLE: "NO",
        NUMERIC_PRECISION: null,
        NUMERIC_SCALE: null,
      },
    },
  },
};

export default function App() {
  return <DynamicForm columnsData={inputData.columnsData} />;
}
