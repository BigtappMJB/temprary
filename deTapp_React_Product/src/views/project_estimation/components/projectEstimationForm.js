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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

// Schema for validation
const schema = yup.object().shape({
  projectName: yup.object().required("Project is required"),

  activityCode: yup.object().required("Activity Code is required"),

  role: yup.object().required("Role is required"),
  phase: yup.object().required("Phase is required"),
  startDate: yup
    .date()
    .nullable()
    .required("Start Date is required")
    .test("is-valid", "Start Date must be a valid date", (value) => {
      return moment(value).isValid();
    })
    .min(moment().toDate(), "Start date cannot be in the past"),
  endDate: yup
    .date()
    .nullable()
    .required("End Date is required")
    .test("is-valid", "End Date must be a valid date", (value) => {
      return moment(value).isValid();
    })
    .min(yup.ref("startDate"), "End date must be after start date"),
  hoursPerDay: yup
    .number()
    .nullable() // Allows null values initially
    .transform(
      (value, originalValue) => (originalValue.trim() === "" ? null : value) // Convert empty string to null
    )
    .required("Hours is required")
    .positive("Number should be postive")
    .max(24, "Hours cannot exceed 24"),

  totalHours: yup.string(),
  // .default(0)
  // .nullable() // Allows null values initially
  // .required("Hours is required")
  // .positive("Number should be postive")
  // .max(24, "Hours cannot exceed 24"),
});

const ProjectEstimateFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  projectList,
  roleList,
  phaseList,
  activityList,
}) => {
  const [readOnly, setReadOnly] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty, isValid, touchedFields, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    shouldFocusError: true, // Focus the first invalid field
    reValidateMode: "onChange", // Revalidate on field change
  });

  const calculateTotalHours = (startDate, endDate, hoursPerDay) => {
    const diffInDays = moment(endDate).diff(moment(startDate), "days") + 1; // +1 to include both start and end date
    return diffInDays * hoursPerDay;
  };

  const [isFocused, setIsFocused] = useState({
    project: false,
    phase: false,
    role: false,
    activityCode: false,
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "startDate" ||
        name === "endDate" ||
        name === "hoursPerDay"
      ) {
        const { startDate, endDate, hoursPerDay } = value;
        if (startDate && endDate && hoursPerDay) {
          const totalHours = calculateTotalHours(
            startDate,
            endDate,
            hoursPerDay
          );
          reset({
            ...getValues(),
            totalHours,
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, reset, getValues]);

  // Effect to set default values and reset the form
  useEffect(() => {
    if (defaultValues) {
      const projectName =
        projectList.find((data) => data.ID === defaultValues.MENU_ID) || null;
      const role =
        roleList.find((data) => data.ID === defaultValues.SUB_MENU_ID) || null;
      const phase =
        phaseList.find((data) => data.id === defaultValues.PHASE_NAME) || null;
      const activityCode =
        activityList.find(
          (data) => data.ID === defaultValues.PERMISSION_LEVEL
        ) || null;
      reset({
        ...defaultValues,
        projectName,
        role,
        phase,
        activityCode,
      });
    }
  }, [defaultValues, reset]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    console.log(getValues());

    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        projectName: null,
        role: null,
        phase: null,
        startDate: null,
        endDate: null,
        hoursPerDay: "",
        totalHours: 0,
      });
    }
  }, [formAction, reset]);

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

  /**
   * Resets the form to its initial state
   */
  const handleReset = () => {
    onReset();
    reset({
      projectName: null,
      role: null,
      phase: null,
      startDate: null,
      endDate: null,
      hoursPerDay: "",
      totalHours: 0,
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = (data) => {
    console.log("Form Status:", {
      isDirty,
      isValid,
      isSubmitting,
      errors,
      touchedFields,
    });
    console.log({ data });

    onSubmit(data);
    handleReset(); // Clear form after submission
  };

  return (
    <Container
      component="form"
      className="panel-bg"
      onSubmit={handleSubmit(onLocalSubmit)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="projectName"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={projectList}
                getOptionLabel={(option) => option.PROJECT_NAME}
                isOptionEqualToValue={(option, value) =>
                  option.PROJECT_ID === value.PROJECT_ID
                }
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select project"
                    fullWidth
                    error={!!errors.menu}
                    helperText={errors.menu?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.project),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, project: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, project: false }),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="phase"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                getOptionLabel={(option) => option.name}
                options={phaseList} // Example options, fetch from API in real use-case
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Phase"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.phase),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, phase: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, phase: false }),
                    }}
                  />
                )}
                onChange={(_, data) => field.onChange(data)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                getOptionLabel={(option) => option.name}
                options={roleList} // Example options, fetch from API in real use-case
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.role),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () => setIsFocused({ ...isFocused, role: true }),
                      onBlur: () => setIsFocused({ ...isFocused, role: false }),
                    }}
                  />
                )}
                onChange={(_, data) => field.onChange(data)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="activityCode"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                options={activityList} // Example options, fetch from API in real use-case
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Activity Code"
                    error={!!fieldState.error}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.activityCode),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, activityCode: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, activityCode: false }),
                    }}
                    helperText={fieldState.error?.message}
                  />
                )}
                onChange={(_, data) => field.onChange(data)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  {...field}
                  label="Start Date"
                  disablePast
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                      InputLabelProps: {
                        shrink: Boolean(field.value || isFocused.startDate),
                      },
                      InputProps: {
                        readOnly: readOnly, // Set to true if you want the field to be read-only
                        onFocus: () =>
                          setIsFocused({ ...isFocused, startDate: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, startDate: false }),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  {...field}
                  label="End Date"
                  minDate={watch("startDate")}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                      InputLabelProps: {
                        shrink: Boolean(field.value || isFocused.endDate),
                      },
                      InputProps: {
                        readOnly: readOnly, // Set to true if you want the field to be read-only
                        onFocus: () =>
                          setIsFocused({ ...isFocused, endDate: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, endDate: false }),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="hoursPerDay"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Hours Per Day"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{
                  shrink: Boolean(field.value),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="totalHours"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Total Hours"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{
                  shrink: Boolean(field.value),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2} // Adds space between buttons
          >
            {formAction.action !== "read" && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="primary"
              >
                {formAction.action === "add" ? "Add" : "Update"}
              </Button>
            )}

            <Button
              type="button"
              variant="contained"
              color="primary"
              className="danger"
              onClick={handleReset}
            >
              {formAction.action !== "read" ? "Cancel" : "Close"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectEstimateFormComponent;
