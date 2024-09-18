import React from 'react';
import {
  Box,
  Button,
  Container, 
  FormControl,
  FormHelperText,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Checkbox,
  styled,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const validationSchema = yup.object().shape({
  employee_name: yup.string().max(255).required('Employee name is required'),
  department: yup.string().required('Department is required'),
  gender: yup.string().required('Gender is required'),
  joiningDate: yup.date().required('Joining date is required'),
  workingMode: yup.array().of(yup.string()).min(1, 'Working mode is required'),
});

// Styling definitions
const StyledContainer = styled(Paper)(({ theme }) => ({
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

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Employees = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => console.log(data);
  const handleReset = () => reset();

  return (
    <StyledContainer>
      <Header>
        <Typography variant="h6">Employees Form</Typography>
      </Header>

      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.employee_name}>
              <TextField
                label="Employee Name"
                {...control.register('employee_name')}
                error={!!errors.employee_name}
              />
              <FormHelperText>{errors.employee_name?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    error={!!errors.department}
                  >
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                  </Select>
                )}
                name="department"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors.department?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset" margin="normal" error={!!errors.gender}>
              <Typography>Gender</Typography>
              <Controller
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Others" control={<Radio />} label="Others" />
                  </RadioGroup>
                )}
                name="gender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors.gender?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" error={!!errors.joiningDate}>
              <Controller
                name="joiningDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Joining Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.joiningDate}
                  />
                )}
              />
              <FormHelperText>{errors.joiningDate?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset" margin="normal" error={!!errors.workingMode}>
              <Typography>Working Mode</Typography>
              <Controller
                name="workingMode"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          value="WFH"
                          checked={field.value.includes('WFH')}
                          onChange={e => {
                            if (e.target.checked) {
                              field.onChange([...field.value, 'WFH']);
                            } else {
                              field.onChange(field.value.filter(value => value !== 'WFH'));
                            }
                          }}
                        />
                      }
                      label="WFH"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          value="Office"
                          checked={field.value.includes('Office')}
                          onChange={e => {
                            if (e.target.checked) {
                              field.onChange([...field.value, 'Office']);
                            } else {
                              field.onChange(field.value.filter(value => value !== 'Office'));
                            }
                          }}
                        />
                      }
                      label="Office"
                    />
                  </Box>
                )}
              />
              <FormHelperText>{errors.workingMode?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button type="button" variant="contained" color="secondary" onClick={handleReset}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default Employees;
