import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/system';

// Initial Styles
const CustomContainer = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e88e5',
  color: '#fff',
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const SubHeader = styled(Box)(({ theme }) => ({
  color: '#1e88e5',
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

// Validation Schema
const validationSchema = yup.object().shape({
  employee_name: yup.string().max(255).required('Employee name is required'),
  department: yup.string().required('Department is required'),
  gender: yup.string().required('Gender is required'),
  joiningDate: yup.date().required('Joining date is required'),
  workingMode: yup.array().of(yup.string()).min(1, 'Working mode is required'),
});

const Employees = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    // Sanitize data here before logging
    console.log(data);
  };

  const handleReset = () => reset();

  return (
    <Box>
      <CustomContainer>
        <Header>
          <Typography variant="h6">Employees Form</Typography>
        </Header>

        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {/* Employee Name Field */}
              <Controller
                name="employee_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.employee_name}
                    helperText={errors.employee_name?.message}
                    inputProps={{ maxLength: 255 }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {/* Department Field */}
              <Controller
                name="department"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    variant="outlined"
                    select
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  >
                    {['Male', 'Female'].map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* Gender Field */}
              <FormControl component="fieldset" error={!!errors.gender}>
                <FormLabel component="legend">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      {['Male', 'Female', 'Others'].map((option) => (
                        <FormControlLabel 
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* Joining Date Field */}
              <Controller
                name="joiningDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Joining Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.joiningDate}
                    helperText={errors.joiningDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* Working Mode Field */}
              <FormControl component="fieldset" error={!!errors.workingMode}>
                <FormLabel component="legend">Working Mode</FormLabel>
                <Controller
                  name="workingMode"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      {['WFH', 'Office'].map((option) => (
                        <FormControlLabel 
                          key={option}
                          control={
                            <Checkbox
                              {...field}
                              value={option}
                              checked={field.value.includes(option)}
                              onChange={(e) => {
                                const newValue = [...field.value];
                                if (e.target.checked) {
                                  newValue.push(option);
                                } else {
                                  const index = newValue.indexOf(option);
                                  newValue.splice(index, 1);
                                }
                                field.onChange(newValue);
                              }}
                            />
                          }
                          label={option}
                        />
                      ))}
                      <FormHelperText>{errors.workingMode?.message}</FormHelperText>
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
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
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleReset}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </CustomContainer>

      <CustomContainer>
        <SubHeader>
          <Typography variant="h6"><b>Users List</b></Typography>
          <FormButton type="button" variant="contained" color="primary">
            Add Employee
          </FormButton>
        </SubHeader>
      </CustomContainer>
    </Box>
  );
};

export default Employees;