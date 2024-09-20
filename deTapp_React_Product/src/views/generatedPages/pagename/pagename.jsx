import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Mui from '@mui/material';
import DataTable from '../../user-management/users/components/DataTable';

// Base styles
const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const Header = Mui.styled(Mui.Box)(({ theme }) => ({
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

const FormButton = Mui.styled(Mui.Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({
  employee_name: yup.string().required('Employee Name is required').max(255, 'Must be 255 characters or less'),
  department: yup.string().required('Department is required'),
  gender: yup.string().required('Gender is required'),
  joiningDate: yup.date().required('Joining Date is required'),
  workingMode: yup.array().required('Working Mode is required').min(1, 'At least one working mode is required'),
});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with two-column layout for form elements.
 * Form fields are dynamically generated based on the input data and Yup validation is applied.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @returns {JSX.Element} The rendered React component.
 */
const DynamicForm = () => {
  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [tableData, setTableData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('https://example.com/api/table');
        setTableData(response.data);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTableData([]); // Set empty data if an error occurs
      }
    };

    fetchTableData();
  }, []);

  /**
   * Handles form submission, sends form data to the server using Axios.
   *
   * @param {Object} formData - The data from the form submission.
   */
  const onSubmit = async (formData) => {
    try {
      const response = await axios.post('https://example.com/api/submit', formData);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  /**
   * Handles form reset, resetting the form fields.
   */
  const onReset = () => {
    reset();
  };

  return (
    <>
      <Container>
        <Header>
          <Mui.Typography variant="h6">
            pagename Form
          </Mui.Typography>
        </Header>

        <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
          <Mui.Grid container spacing={2}>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                fullWidth
                label="Employee Name"
                {...register('employee_name')}
                error={!!errors.employee_name}
                helperText={errors.employee_name?.message}
              />
            </Mui.Grid>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                select
                fullWidth
                label="Department"
                {...register('department')}
                error={!!errors.department}
                helperText={errors.department?.message}
              >
                {['IT', 'HR'].map((option) => (
                  <Mui.MenuItem key={option} value={option}>
                    {option}
                  </Mui.MenuItem>
                ))}
              </Mui.TextField>
            </Mui.Grid>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.FormControl component="fieldset" error={!!errors.gender}>
                <Mui.FormLabel component="legend">Gender</Mui.FormLabel>
                <Mui.RadioGroup row {...register('gender')}>
                  {['Male', 'Female', 'Others'].map((option) => (
                    <Mui.FormControlLabel key={option} value={option} control={<Mui.Radio />} label={option} />
                  ))}
                </Mui.RadioGroup>
                <Mui.FormHelperText>{errors.gender?.message}</Mui.FormHelperText>
              </Mui.FormControl>
            </Mui.Grid>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                fullWidth
                type="date"
                label="Joining Date"
                {...register('joiningDate')}
                error={!!errors.joiningDate}
                helperText={errors.joiningDate?.message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Mui.Grid>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.FormControl error={!!errors.workingMode}>
                <Mui.FormLabel component="legend">Working Mode</Mui.FormLabel>
                {['OFFICE', 'WFH'].map((option) => (
                  <Mui.FormControlLabel
                    key={option}
                    control={<Mui.Checkbox {...register('workingMode')} value={option} />}
                    label={option}
                  />
                ))}
                <Mui.FormHelperText>{errors.workingMode?.message}</Mui.FormHelperText>
              </Mui.FormControl>
            </Mui.Grid>
            <Mui.Grid item xs={12}>
              <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
                <Mui.Button type="submit" variant="contained" color="primary">
                  Submit
                </Mui.Button>
                <Mui.Button type="button" variant="contained" color="secondary" onClick={onReset}>
                  Cancel
                </Mui.Button>
              </Mui.Box>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Box>
      </Container>

      <Container>
        <Header>
          <Mui.Typography variant="h6">
             pagename List
          </Mui.Typography>
          <FormButton variant="contained" color="primary" onClick={() => setFormVisible(true)}>
              Add pagename
          </FormButton>
        </Header>
        <DataTable tableData={tableData} handleUpdateLogic={() => {}} handleDelete={() => {}}/>
      </Container>
    </>
  );
};

export default DynamicForm;