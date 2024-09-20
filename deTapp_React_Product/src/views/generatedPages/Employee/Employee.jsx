import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import DataTable from "../../user-management/users/components/DataTable";
import { styled } from '@mui/system';

// Base styles
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

const SecondContainer = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

const SubHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// Validation schema using Yup
const validationSchema = yup.object().shape({
  employee_name: yup.string().required('Employee name is required').max(255, 'Maximum length is 255 characters'),
  department: yup.string().required('Department is required'),
  gender: yup.string().required('Gender is required'),
  joiningDate: yup.date().required('Joining date is required'),
  workingMode: yup.array().of(yup.string()).required('Working mode is required').min(1, 'Select at least one mode'),
});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with two-column layout for form elements.
 * Form fields are dynamically generated based on the input data and Yup validation is applied.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.handleUpdateLogic - Function to handle update logic.
 * @param {Function} props.handleDelete - Function to handle delete logic.
 * @param {Array} props.columns - Column data for the table.
 * @param {Array} props.permissionLevels - Permission levels for the table.
 * @returns {JSX.Element} The rendered React component.
 */
const Employee = ({ handleUpdateLogic, handleDelete, columns, permissionLevels }) => {
  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // Store Table Data in useState
  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });
  
  const runAPIOnUseEffect= useRef(false);

  /**
   * Fetch and store table data from server using Axios.
   */
  const getTableData = async () => {
    try {
      const response = await axios.get('https://example.com/api/table');
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]); // Set empty data if an error occurs
    }
  };

  useEffect(() => {
    if(!runAPIOnUseEffect.current) {
      getTableData();
      runAPIOnUseEffect.current=false;
    }
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
   * Initiates the process to add a new user.
   */
  const addUser = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  /**
   * Handles form reset, resetting the form fields.
   */
  const onReset = () => {
    reset();
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header>
            <Typography variant="h6">
              Employee Form
            </Typography>
          </Header>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            <Grid container spacing={2}>
              {/* Employee Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  {...register('employee_name')}
                  error={!!errors.employee_name}
                  helperText={errors.employee_name?.message || ''}
                />
              </Grid>
              {/* Department Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    {...register('department')}
                    defaultValue=""
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                  </Select>
                  <FormHelperText>{errors.department?.message || ''}</FormHelperText>
                </FormControl>
              </Grid>
              {/* Gender Field */}
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" error={!!errors.gender}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      {...register('gender')}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Others" control={<Radio />} label="Others" />
                    </RadioGroup>
                    <FormHelperText>{errors.gender?.message || ''}</FormHelperText>
                  </FormControl>
                </FormControl>
              </Grid>
              {/* Joining Date Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Joining Date"
                  InputLabelProps={{ shrink: true }}
                  {...register('joiningDate')}
                  error={!!errors.joiningDate}
                  helperText={errors.joiningDate?.message || ''}
                />
              </Grid>
              {/* Working Mode Field */}
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" error={!!errors.workingMode}>
                  <FormControl component="fieldset">
                    <FormControlLabel
                      control={<Checkbox {...register('workingMode')} value="OFFICE" />}
                      label="OFFICE"
                    />
                    <FormControlLabel
                      control={<Checkbox {...register('workingMode')} value="WFH" />}
                      label="WFH"
                    />
                    <FormHelperText>{errors.workingMode?.message || ''}</FormHelperText>
                  </FormControl>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button type="button" variant="contained" color="secondary" onClick={onReset}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Employee List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addUser}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              className="primary"
            >
              Add Employee
            </FormButton>
          </Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
        />
      </SecondContainer>
    </>
  );
};

export default Employee;