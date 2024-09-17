import React from "react";

import {
  Box,
  Button,
  Container as MuiContainer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Checkbox,
  Typography,
  styled,
  MenuItem,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { format, parseISO } from "date-fns";

// Define form validation schema using Yup

const validationSchema = yup
  .object({
    employee_name: yup.string().required("Employee name is required").max(255),

    department: yup.string().required("Department is required"),

    gender: yup.string().required("Gender is required"),

    joiningDate: yup.date().required("Joining date is required").nullable(),

    workingMode: yup
      .array()
      .of(yup.string())
      .required("Working mode is required")
      .min(1),
  })
  .required();

// Create and style Material UI components

const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),

  marginBottom: theme.spacing(5),

  borderRadius: theme.spacing(1),

  boxShadow: theme.shadows[3],

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#1e88e5",

  color: "#fff",

  padding: theme.spacing(2),

  borderTopLeftRadius: theme.spacing(1),

  borderTopRightRadius: theme.spacing(1),

  marginBottom: theme.spacing(2),

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
}));

const SubHeader = styled(Box)(({ theme }) => ({
  color: "#1e88e5",

  padding: theme.spacing(2),

  borderTopLeftRadius: theme.spacing(1),

  borderTopRightRadius: theme.spacing(1),

  marginBottom: theme.spacing(2),

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
}));

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// Define constants for form field options

const DEPARTMENTS = ["1", "2"];

const GENDERS = ["Male", "Female", "Others"];

const WORKING_MODES = ["WFH", "Online"];

// The main Employees component

const Employees = () => {
  const {
    control,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Form submit handler

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <Typography variant="h6">Add Employee</Typography>
        </Header>

        <Grid container spacing={2} paddingX={2}>
          <Grid item xs={12} sm={6}>
            {/* Employee Name - Text Field */}

            <Controller
              name="employee_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employee Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.employee_name}
                  helperText={
                    errors.employee_name ? errors.employee_name.message : ""
                  }
                  inputProps={{
                    maxLength: 255,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Department - Dropdown */}

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Department"
                  variant="outlined"
                  fullWidth
                  error={!!errors.department}
                  helperText={
                    errors.department ? errors.department.message : ""
                  }
                >
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Gender - Radio Buttons */}

            <FormControl component="fieldset" error={!!errors.gender}>
              <FormLabel component="legend">Gender</FormLabel>

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    {GENDERS.map((gender) => (
                      <FormControlLabel
                        key={gender}
                        value={gender}
                        control={<Radio />}
                        label={gender}
                      />
                    ))}
                  </RadioGroup>
                )}
              />

              {errors.gender && (
                <FormHelperText>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Joining Date - Date Field */}

            <Controller
              name="joiningDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Joining Date"
                  variant="outlined"
                  fullWidth
                  error={!!errors.joiningDate}
                  helperText={
                    errors.joiningDate ? errors.joiningDate.message : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: format(new Date(), "yyyy-MM-dd"), // Prevent future dates
                  }}
                  value={
                    field.value
                      ? format(parseISO(field.value), "yyyy-MM-dd")
                      : ""
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Working Mode - Checkbox */}

            <FormControl component="fieldset" error={!!errors.workingMode}>
              <FormLabel component="legend">Working Mode</FormLabel>

              <Box>
                {WORKING_MODES.map((mode) => (
                  <Controller
                    key={mode}
                    name="workingMode"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes(mode)}
                            onChange={() => {
                              const newValue = field.value.includes(mode)
                                ? field.value.filter((val) => val !== mode)
                                : [...field.value, mode];

                              field.onChange(newValue);
                            }}
                          />
                        }
                        label={mode}
                      />
                    )}
                  />
                ))}
              </Box>

              {errors.workingMode && (
                <FormHelperText>{errors.workingMode.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            {/* Form action buttons */}

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
                Add
              </Button>

              <Button
                type="button"
                variant="contained"
                color="primary"
                className="danger"
                onClick={() => reset()}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container>
        <SubHeader>
          <Typography variant="h6">
            <b>Users List</b>
          </Typography>

          <FormButton type="button" variant="contained" color="primary">
            Add employees
          </FormButton>
        </SubHeader>
      </Container>
    </>
  );
};

export default Employees;
