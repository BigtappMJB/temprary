import React from 'react';
import {
  Box,
  Button,
  Paper,
  styled,
  Typography,
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
  Grid,
  FormHelperText
} from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Define the validation schema using Yup
const validationSchema = yup.object({
  employee_name: yup.string().required('Employee name is required').max(255, 'Maximum length is 255'),
  department: yup.string().required('Department is required'),
  gender: yup.string().required('Gender is required'),
  joiningDate: yup.date().required('Joining date is required'),
  workingMode: yup.array().of(yup.string()).min(1, 'At least one working mode must be selected').required('Working mode is required'),
});

const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SecondContainer = styled(Paper)(({ theme }) => ({
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

/**
 * EmployeesForm Component
 * @returns {JSX.Element}
 */
const EmployeesForm = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      employee_name: '',
      department: '',
      gender: '',
      joiningDate: '',
      workingMode: [],
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://example.com/api/submit', data);
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Typography variant="h6">
            Employees Form
          </Typography>
        </Header>

        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Employee Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="employee_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Name"
                    fullWidth
                    error={!!errors.employee_name}
                    helperText={errors.employee_name?.message}
                  />
                )}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.department}>
                    <InputLabel>Department</InputLabel>
                    <Select {...field}>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="IT">IT</MenuItem>
                    </Select>
                    <FormHelperText>{errors.department?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.gender}>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Others" control={<Radio />} label="Others" />
                    </RadioGroup>
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Joining Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Joining Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.joiningDate}
                    helperText={errors.joiningDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Working Mode */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="workingMode"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.workingMode}>
                    <FormGroup row>
                      <FormControlLabel
                        control={<Checkbox {...field} value="Online" />}
                        label="Online"
                      />
                      <FormControlLabel
                        control={<Checkbox {...field} value="Offline" />}
                        label="Offline"
                      />
                    </FormGroup>
                    <FormHelperText>{errors.workingMode?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => reset()}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Container>
      </Container>

      <SecondContainer>
        <SubHeader>
          <Typography variant="h6">
            <b>Employees List</b>
          </Typography>
          <FormButton type="button" onClick={() => {}} variant="contained" color="primary">
            Add Employee
          </FormButton>
        </SubHeader>
      </SecondContainer>
    </>
  );
};

export default EmployeesForm;
