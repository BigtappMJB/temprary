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
import { decodeData } from "../views/utilities/securities/encodeDecode";
import { getCookie } from "../views/utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../views/utilities/generals";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

const DynamicFormCreationFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  columnDetails,
  inputList,
}) => {
  const [dynamicSchema, setDynamicSchema] = useState(null);
  const [defaultValue] = useState(null);

  const [isFocused, setIsFocused] = useState({});
  const [isAPIRequired, setIsAPIFieldRequired] = useState({});

  // Define the keywords to search for, handling underscores and case-insensitivity
  const UserKeyword = [
    "created by",
    "create by",
    "updated by",
    "update by",
    "created_by",
    "create_by",
    "updated_by",
    "update_by",
    "deleted_by",
    "delete_by",
    "delete by",
  ];

  // Define the date-related keywords to search for, handling underscores and case-insensitivity
  const dateKeywords = [
    "created on",
    "create on",
    "updated on",
    "update on",
    "created_on",
    "create_on",
    "updated_on",
    "update_on",
    "created_date",
    "updated_date",
    "deleted_date",
  ];

  // Create a regular expression to match any of the keywords, case-insensitively
  const dateRegex = new RegExp(dateKeywords.join("|").replace(/ /g, "_"), "i");
  const userRegex = new RegExp(UserKeyword.join("|").replace(/ /g, "_"), "i");

  const containsUserKeywords = (columnName) => userRegex.test(columnName);

  const containsDateKeywords = (columnName) => dateRegex.test(columnName);
  const email = getCookie(isUserIdCookieName)
    ? decodeData(getCookie(isUserIdCookieName))
    : "admin@gmail.com";

  const customAssignDefaultValue = (columnName, defaultValue) => {
    if (containsUserKeywords(columnName)) return email;
    else if (containsDateKeywords(columnName)) return new Date().toISOString();
    else return defaultValue;
  };

  // Generate Yup schema dynamically based on column details
  const generateValidationSchema = (columns) => {
    const schema = {};

    columns.forEach((column) => {
      let validator = yup
        .object()
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        )
        .required(`${column.COLUMN_NAME} is required`);
      schema[column.COLUMN_NAME] = validator;
    });

    return {
      schema: yup.object().shape(schema),
    };
  };

  const {
    control: dynamicControl,
    handleSubmit: handleDynamicSubmit,
    reset: dynamicReset,
    trigger: dynamicTrigger,
    formState: { errors: dynamicErrors },
  } = useForm({
    mode: "onChange",
    resolver: dynamicSchema ? yupResolver(dynamicSchema) : undefined,
    defaultValues: { defaultValue },
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (columnDetails.length > 0) {
      const { schema } = generateValidationSchema(columnDetails);
      setDynamicSchema(schema);
    }
  }, [columnDetails]);

  const onDynamicFormSubmit = (data) => {
    onSubmit(data);
    dynamicReset();
  };

  const handleReset = () => {
    dynamicReset();
    if (onReset) {
      onReset();
    }
  };

  // const formatDateForInput = (date) => {
  //   if (!date) return "";
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const hours = String(d.getHours()).padStart(2, "0");
  //   const minutes = String(d.getMinutes()).padStart(2, "0");
  //   return `${year}-${month}-${day}T${hours}:${minutes}`;
  // };

  return (
    <>
      {/* Dynamic Form */}
      {columnDetails.length > 0 && (
        <Container
          component="form"
          onSubmit={handleDynamicSubmit(onDynamicFormSubmit)}
        >
          <Grid container spacing={2}>
            {columnDetails.map((column) => (
              <Grid item xs={12} sm={6} key={column.COLUMN_NAME}>
                <Controller
                  name={column.COLUMN_NAME}
                  control={dynamicControl}
                  defaultValue=""
                  rules={{ required: column.IS_NULLABLE === "NO" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={inputList}
                      getOptionLabel={(option) => option.NAME}
                      isOptionEqualToValue={(option, value) =>
                        option.ID === value.ID
                      }
                      value={field.value || null}
                      onChange={(_, data) => {
                        console.log(data);
                        if (
                          ["radio", "dropdown", "autocomplete"].includes(
                            data.NAME.toLowerCase()
                          )
                        ) {
                          setIsAPIFieldRequired({
                            ...isAPIRequired,
                            [column.COLUMN_NAME]: true,
                          });
                        }
                        field.onChange(data);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`Select ${column.COLUMN_NAME}`}
                          fullWidth
                          error={!!dynamicErrors[column.COLUMN_NAME]}
                          helperText={
                            dynamicErrors[column.COLUMN_NAME]?.message
                          }
                          InputLabelProps={{
                            shrink: Boolean(
                              field.value || isFocused[column.COLUMN_NAME]
                            ),
                          }}
                          InputProps={{
                            ...params.InputProps,
                            // readOnly: readOnly, // Set to true if you want the field to be read-only
                            onFocus: () =>
                              setIsFocused({
                                ...isFocused,
                                [column.COLUMN_NAME]: true,
                              }),
                            onBlur: () =>
                              setIsFocused({
                                ...isFocused,
                                [column.COLUMN_NAME]: false,
                              }),
                          }}
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

// Generate Yup schema dynamically based on column details
// const generateValidationSchema = (columns) => {
//   const schema = {};
//   const defaultValues = {};

//   columns.forEach((column) => {
//     let validator = yup.mixed();
//     let defaultValue = column.DEFAULT_VALUE || "";
//     if (column.DATA_TYPE === "TEXT") {
//       validator = yup.string();

//       // Handle required fields
//       if (column.IS_NULLABLE === "NO") {
//         console.log(`${column.COLUMN_NAME} is required`);
//         validator = validator.required(`${column.COLUMN_NAME} is required`);
//       }

//       if (column.CHARACTER_MAXIMUM_LENGTH) {
//         validator = validator.max(
//           column.CHARACTER_MAXIMUM_LENGTH,
//           `${column.COLUMN_NAME} must be at most ${column.CHARACTER_MAXIMUM_LENGTH} characters`
//         );
//       }
//       if (column.IS_NULLABLE === "NO")
//         validator = validator.min(
//           1,
//           `${column.COLUMN_NAME} must be at least 1 character`
//         );
//     } else if (column.DATA_TYPE === "BOOLEAN") {
//       validator = yup.boolean();
//       // Handle required fields
//       if (column.IS_NULLABLE === "NO") {
//         console.log(`${column.COLUMN_NAME} is required`);
//         validator = validator.required(`${column.COLUMN_NAME} is required`);
//       }
//     } else if (column.DATA_TYPE.includes("TIMESTAMP")) {
//       validator = yup
//         .date()
//         .nullable()
//         .transform((value, originalValue) =>
//           originalValue === "" ? null : value
//         )
//         .typeError(`${column.COLUMN_NAME} must be a valid date`);

//       // Handle required fields
//       if (column.IS_NULLABLE === "NO") {
//         console.log(`${column.COLUMN_NAME} is required`);
//         validator = validator.required(`${column.COLUMN_NAME} is required`);
//       }
//       defaultValue = column.DEFAULT_VALUE || null;
//     }
//     schema[column.COLUMN_NAME] = validator;

//     defaultValues[column.COLUMN_NAME] = customAssignDefaultValue(
//       column.COLUMN_NAME,
//       defaultValue
//     );
//   });

//   return {
//     schema: yup.object().shape(schema),
//     defaultValues,
//   };
// };

// {columnDetails.length > 0 && (
//   <Container
//     component="form"
//     onSubmit={handleDynamicSubmit(onDynamicFormSubmit)}
//   >
//     <Grid container spacing={2}>
//       {columnDetails.map((column) => (
//         <Grid item xs={12} sm={6} key={column.COLUMN_NAME}>
//           <Controller
//             name={column.COLUMN_NAME}
//             control={dynamicControl}
//             defaultValue=""
//             rules={{ required: column.IS_NULLABLE === "NO" }}
//             render={({ field }) => {
//               if (column.DATA_TYPE === "BOOLEAN") {
//                 return (
//                   <FormControlLabel
//                     control={
//                       <Checkbox {...field} checked={!!field.value} />
//                     }
//                     label={column.COLUMN_NAME.replace(/_/g, " ")}
//                   />
//                 );
//               }

//               if (column.DATA_TYPE.includes("TIMESTAMP")) {
//                 return (
//                   <TextField
//                     {...field}
//                     label={column.COLUMN_NAME.replace(/_/g, " ")}
//                     fullWidth
//                     InputProps={{
//                       readOnly:
//                         containsUserKeywords(column.COLUMN_NAME) ||
//                         containsDateKeywords(column.COLUMN_NAME),
//                     }}
//                     value={formatDateForInput(field.value)}
//                     type="datetime-local"
//                     InputLabelProps={{ shrink: true }}
//                     error={!!dynamicErrors[column.COLUMN_NAME]}
//                     helperText={
//                       dynamicErrors[column.COLUMN_NAME]?.message
//                     }
//                   />
//                 );
//               }

//               return (
//                 <TextField
//                   {...field}
//                   label={column.COLUMN_NAME.replace(/_/g, " ")}
//                   fullWidth
//                   InputProps={{
//                     readOnly:
//                       containsUserKeywords(column.COLUMN_NAME) ||
//                       containsDateKeywords(column.COLUMN_NAME),
//                   }}
//                   type={column.DATA_TYPE === "NUMBER" ? "number" : "text"}
//                   error={!!dynamicErrors[column.COLUMN_NAME]}
//                   helperText={dynamicErrors[column.COLUMN_NAME]?.message}
//                 />
//               );
//             }}
//           />
//         </Grid>
//       ))}
//       <Grid item xs={12} sm={12}>
//         <Box
//           display="flex"
//           justifyContent="flex-end"
//           alignItems="center"
//           flexWrap="wrap"
//           gap={2}
//         >
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             className="primary"
//           >
//             Submit
//           </Button>
//           <Button
//             type="button"
//             variant="contained"
//             color="primary"
//             className="danger"
//             onClick={handleReset}
//           >
//             Cancel
//           </Button>
//         </Box>
//       </Grid>
//     </Grid>
//   </Container>
// )}
