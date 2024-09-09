import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { getActivityCodecontroller } from "../controllers/projectEstimationController";

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
    .min(moment().startOf("day").toDate(), "Start date cannot be in the past"),
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
      (value, originalValue) => (originalValue === "" ? null : value) // Convert empty string to null
    )
    .required("Hours is required")
    .positive("Number should be postive")
    .max(24, "Hours cannot exceed 24"),
  workingDays: yup
    .number()
    .nullable() // Allows null values initially
    .transform(
      (value, originalValue) => (originalValue === "" ? null : value) // Convert empty string to null
    )
    .required("Working Days is required")
    .positive("Number should be postive")
    .max(5, "Working Days cannot exceed 7"),
  // .test("max-days", function (value) {
  //   const { startDate, endDate } = this.parent;

  //   if (!startDate || !endDate) return true; // Skip validation if either date is not provided

  //   const maxDaysDiff = moment(endDate).diff(moment(startDate), "days") + 1;
  //   // Dynamically create the error message based on maxDaysDiff
  //   const isValid = value <= maxDaysDiff;

  //   // Return the validation result and error message
  //   return (
  //     isValid ||
  //     this.createError({
  //       message: `Working days cannot exceed ${maxDaysDiff} days`,
  //     })
  //   );
  // }),

  totalHours: yup.string(),
});

const ProjectEstimateFormComponent = forwardRef(
  (
    {
      formAction,
      defaultValues,
      onSubmit,
      onReset,
      projectList,
      roleList,
      phaseList,
    },
    ref
  ) => {
    const [readOnly, setReadOnly] = useState(false);

    const {
      control,
      handleSubmit,
      reset,
      getValues,
      watch,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
      shouldFocusError: true, // Focus the first invalid field
      reValidateMode: "onChange", // Revalidate on field change
    });

    const activityCodeList = useRef([]);

    const getDaysDiff = (startDate, endDate) => {
      return moment(endDate).diff(moment(startDate), "days") + 1;
    };

    const calculateWorkingHours = (
      startDate,
      endDate,
      workingDaysPerWeek,
      hoursPerDay
    ) => {
      // Convert input dates to JavaScript Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure start date is earlier than end date
      if (end < start) {
        throw new Error("End date must be after start date");
      }

      // Helper function to calculate the difference in days
      const getDayDifference = (start, end) =>
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      // Find the day of the week for start and end dates (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const startDay = start.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const endDay = end.getDay();

      // Calculate the total number of days between the start and end dates
      const totalDays = getDayDifference(start, end);

      // Calculate the number of full weeks between the start and end dates
      const fullWeeks = Math.floor(totalDays / 7);

      // Calculate the working days in full weeks
      const workingDaysInFullWeeks = fullWeeks * workingDaysPerWeek;

      // Calculate the remaining days that don't form a full week
      const remainingDays = totalDays % 7;

      // Determine how many of the remaining days are working days
      let workingDaysInPartialWeek = 0;

      // If there are remaining days, check if they fall on working days (Monday - Friday)
      for (let i = 0; i < remainingDays; i++) {
        const currentDay = (startDay + i) % 7; // Calculate the day of the week (0 = Sunday, 6 = Saturday)
        if (currentDay > 0 && currentDay <= workingDaysPerWeek) {
          workingDaysInPartialWeek++;
        }
      }

      // Calculate the total number of working days
      const totalWorkingDays =
        workingDaysInFullWeeks + workingDaysInPartialWeek;

      // Calculate the total working hours
      const totalWorkingHours = totalWorkingDays * hoursPerDay;

      return totalWorkingHours;
    };
    const [isFocused, setIsFocused] = useState({
      project: false,
      phase: false,
      role: false,
      activityCode: false,
      startDate: false,
      endDate: false,
      totalHours: false,
      hoursPerDay: false,
      workingDays: false,
    });

    const { startDate, endDate, hoursPerDay, workingDays } = watch();

    // Memoize the total working hours calculation
    const totalHours = useMemo(() => {
      if (startDate && endDate && hoursPerDay && workingDays) {
        return calculateWorkingHours(
          startDate,
          endDate,
          workingDays,
          hoursPerDay
        );
      }
      return 0; // Fallback if any value is missing
    }, [startDate, endDate, hoursPerDay, workingDays]);

    // Effect to update the form whenever the calculated hours change
    useEffect(() => {
      if (totalHours > 0) {
        reset({
          ...getValues(),
          totalHours,
        });
      }
    }, [totalHours, reset, getValues]);
    // Effect to set default values and reset the form
    useEffect(() => {
      if (defaultValues) {
        console.log({ defaultValues });

        const projectName =
          projectList.find(
            (data) => data.PROJECT_NAME_CODE === defaultValues.PROJECT_NAME_CODE
          ) || null;
        const role =
          roleList.find((data) => data.id === defaultValues.PROJECT_ROLE_ID) ||
          null;

        const phase =
          phaseList.find(
            (data) => data.id === defaultValues.PROJECT_PHASE_CODE
          ) || null;

        reset({
          projectName: projectName,
          role: role,
          phase: phase,
          startDate: defaultValues?.START_DATE
            ? moment(defaultValues?.START_DATE, "YYYY-MM-DD")
            : null,
          endDate: defaultValues?.END_DATE
            ? moment(defaultValues?.END_DATE, "YYYY-MM-DD")
            : null,
          hoursPerDay: Number(defaultValues?.NO_OF_HOURS_PER_DAY) ?? null,
          totalHours: defaultValues?.TOTAL_HOURS ?? null,
          workingDays: defaultValues?.No_of_working_days ?? null,
          activityCode: null,
        });
        formAction.action !== "add" &&
          defaultValues?.ACTIVITY_CODE &&
          getActivityCode(defaultValues?.ACTIVITY_CODE);
      }
    }, [defaultValues, reset]);

    // Expose a method to trigger validation via ref
    useImperativeHandle(ref, () => ({
      resetForm: async () => {
        debugger;
        reset({
          projectName: null,
          role: null,
          phase: null,
          startDate: null,
          endDate: null,
          hoursPerDay: "",
          totalHours: null,
          activityCode: null,
          workingDays: null,
        });
      },
    }));

    // Effect to set read-only state and reset form on formAction change
    useEffect(() => {
      setReadOnly(formAction?.action === "read");
      if (formAction.action === "add") {
        reset({
          projectName: null,
          role: null,
          phase: null,
          startDate: null,
          endDate: null,
          hoursPerDay: "",
          totalHours: null,
          activityCode: null,
          workingDays: null,
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
      debugger;
      onReset();
      reset({
        projectName: null,
        role: null,
        phase: null,
        startDate: null,
        endDate: null,
        hoursPerDay: "",
        totalHours: null,
        activityCode: null,
        workingDays: null,
      });
    };

    /**
     * Submits the form data
     */
    const onLocalSubmit = (data) => {
      onSubmit(data);
      // handleReset(); // Clear form after submission
    };

    const getActivityCode = async (defaultValue = null) => {
      const { phase, role } = getValues();
      if (phase && role) {
        const response = await getActivityCodecontroller(phase?.id, role?.id);
        activityCodeList.current = response;
        let activityCodeValue = null;

        if (defaultValue) {
          activityCodeValue =
            activityCodeList.current.find(
              (ele) => ele.activityName === defaultValue
            ) ?? null;
        }

        reset({
          ...getValues(),
          activityCode: activityCodeValue,
        });
      }
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
                      error={!!errors.projectName}
                      helperText={errors.projectName?.message}
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={field.value || null}
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
                  onChange={(_, data) => {
                    field.onChange(data);
                    getActivityCode(data);
                  }}
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={field.value || null}
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
                        onFocus: () =>
                          setIsFocused({ ...isFocused, role: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, role: false }),
                      }}
                    />
                  )}
                  onChange={(_, data) => {
                    field.onChange(data);
                    getActivityCode(data);
                  }}
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
                  options={activityCodeList.current || []}
                  getOptionLabel={(option) => option.activityName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.activityName === value.activityName
                  }
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
                        readOnly: readOnly,
                        onFocus: () =>
                          setIsFocused({ ...isFocused, activityCode: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, activityCode: false }),
                      }}
                      helperText={fieldState.error?.message}
                    />
                  )}
                  onChange={(_, data) => {
                    field.onChange(data);
                  }}
                  value={field.value || null} // Ensure controlled value, reset to null
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
              name="workingDays"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value || null}
                  type="number"
                  label="Working days"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputLabelProps={{
                    shrink: Boolean(field.value || isFocused.workingDays),
                  }}
                  InputProps={{
                    ...field.InputProps,
                    readOnly: readOnly,
                    onFocus: () =>
                      setIsFocused({ ...isFocused, workingDays: true }),
                    onBlur: () =>
                      setIsFocused({ ...isFocused, workingDays: false }),
                  }}
                />
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
                  value={field.value || null}
                  type="number"
                  label="Hours/Day"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputLabelProps={{
                    shrink: Boolean(field.value || isFocused.hoursPerDay),
                  }}
                  InputProps={{
                    ...field.InputProps,
                    readOnly: readOnly,
                    onFocus: () =>
                      setIsFocused({ ...isFocused, hoursPerDay: true }),
                    onBlur: () =>
                      setIsFocused({ ...isFocused, hoursPerDay: false }),
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
                  value={field.value || null}
                  type="number"
                  label="Total Hours"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputLabelProps={{
                    shrink: Boolean(field.value || isFocused.totalHours),
                  }}
                  InputProps={{
                    ...field.InputProps,
                    readOnly: readOnly,
                    onFocus: () =>
                      setIsFocused({ ...isFocused, totalHours: true }),
                    onBlur: () =>
                      setIsFocused({ ...isFocused, totalHours: false }),
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
  }
);

export default ProjectEstimateFormComponent;
