import React from "react";

import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  FormHelperText,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

/* Define Yup validation schema */

const validationSchema = yup.object().shape({
  employee_name: yup.string().max(255).required("Employee name is required"),

  department: yup.string().required("Department is required"),

  gender: yup.string().required("Gender is required"),

  joiningDate: yup.date().required("Joining date is required"),

  workingMode: yup
    .array()
    .of(yup.string())
    .min(1, "At least one working mode is required"),
});

/* Define styled components */

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

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

/** 

* Employees form component 

* @returns {JSX.Element} 

*/

const EmployeesForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),

    defaultValues: {
      employee_name: "",

      department: "",

      gender: "",

      joiningDate: "",

      workingMode: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const onCancel = () => {
    reset();
  };

  return (
    <Container>
      <Header>
        <Typography variant="h6">Employees Form</Typography>
      </Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box padding={2}>
          {/* Employee Name Field */}

          <FormControl fullWidth error={!!errors.employee_name} margin="normal">
            <Controller
              name="employee_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employee Name"
                  variant="outlined"
                />
              )}
            />

            <FormHelperText>{errors.employee_name?.message}</FormHelperText>
          </FormControl>

          {/* Department Field */}

          <FormControl fullWidth error={!!errors.department} margin="normal">
            <InputLabel id="department-label">Department</InputLabel>

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="department-label"
                  label="Department"
                >
                  <MenuItem value="HR">HR</MenuItem>

                  <MenuItem value="IT">IT</MenuItem>
                </Select>
              )}
            />

            <FormHelperText>{errors.department?.message}</FormHelperText>
          </FormControl>

          {/* Gender Field */}

          <FormControl
            component="fieldset"
            error={!!errors.gender}
            margin="normal"
          >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />

                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              )}
            />

            <FormHelperText>{errors.gender?.message}</FormHelperText>
          </FormControl>

          {/* Joining Date Field */}

          <FormControl fullWidth error={!!errors.joiningDate} margin="normal">
            <Controller
              name="joiningDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Joining Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              )}
            />

            <FormHelperText>{errors.joiningDate?.message}</FormHelperText>
          </FormControl>

          {/* Working Mode Field */}

          <FormControl
            component="fieldset"
            error={!!errors.workingMode}
            margin="normal"
          >
            <FormGroup row>
              <Controller
                name="workingMode"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("WFH")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "WFH"]
                              : field.value.filter((value) => value !== "WFH");

                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="WFH"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("Office")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "Office"]
                              : field.value.filter(
                                  (value) => value !== "Office"
                                );

                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="Office"
                    />
                  </>
                )}
              />
            </FormGroup>

            <FormHelperText>{errors.workingMode?.message}</FormHelperText>
          </FormControl>

          {/* Submit and Cancel Buttons */}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <FormButton type="submit" variant="contained" color="primary">
              Submit
            </FormButton>

            <FormButton
              type="button"
              variant="outlined"
              color="secondary"
              onClick={onCancel}
            >
              Cancel
            </FormButton>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default EmployeesForm;
