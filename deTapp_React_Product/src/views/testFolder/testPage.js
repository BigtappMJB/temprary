
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Mui from "@mui/material";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import DataTable from "../user-management/users/components/DataTable";

// Styling components using Material-UI and Emotion
const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const Header = Mui.styled(Mui.Box)(({ theme }) => ({
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

const FormButton = Mui.styled(Mui.Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// Validation schema using Yup
const validationSchema = yup.object().shape({
  employee_name: yup.string().max(255).required('Employee Name is required'),
  department: yup.string().oneOf(['HR', 'IT']).required('Department is required'),
  gender: yup.string().oneOf(['Male', 'Female', 'Others']).required('Gender is required'),
  joiningDate: yup.date().required('Joining date is required'),
  workingMode: yup.array().of(yup.string().oneOf(['office', 'online'])).min(1, 'At least one working mode is required'),
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
const EmployeesForm = ({ handleUpdateLogic, handleDelete, columns, permissionLevels }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [tableData, setTableData] = useState([]);
  
  const getTableData = async () => {
    try {
      const response = await axios.get('https://example.com/api/table');
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post('https://example.com/api/submit', formData);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const onReset = () => {
    reset();
  };

  return (
    <>
      <Container>
        <Header>
          <Mui.Typography variant="h6">
            Employees
          </Mui.Typography>
        </Header>

        <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
          <Mui.Grid container spacing={2}>
            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                fullWidth
                label="Employee Name"
                {...register("employee_name")}
                error={!!errors.employee_name}
                helperText={errors.employee_name?.message || ''}
              />
            </Mui.Grid>

            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                fullWidth
                label="Department"
                select
                {...register("department")}
                error={!!errors.department}
                helperText={errors.department?.message || ''}
              >
                <Mui.MenuItem value="HR">HR</Mui.MenuItem>
                <Mui.MenuItem value="IT">IT</Mui.MenuItem>
              </Mui.TextField>
            </Mui.Grid>

            <Mui.Grid item xs={12} sm={6}>
              <Mui.FormLabel component="legend">Gender</Mui.FormLabel>
              {['Male', 'Female', 'Others'].map((option) => (
                <Mui.FormControlLabel
                  key={option}
                  control={<Mui.Radio {...register("gender")} value={option} />}
                  label={option}
                />
              ))}
              <Mui.FormHelperText error={!!errors.gender}>{errors.gender?.message || ''}</Mui.FormHelperText>
            </Mui.Grid>

            <Mui.Grid item xs={12} sm={6}>
              <Mui.TextField
                fullWidth
                label="Joining Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register("joiningDate")}
                error={!!errors.joiningDate}
                helperText={errors.joiningDate?.message || ''}
              />
            </Mui.Grid>

            <Mui.Grid item xs={12} sm={12}>
              <Mui.FormGroup>
                <Mui.FormLabel component="legend">Working Mode</Mui.FormLabel>
                {['office', 'online'].map((mode) => (
                  <Mui.FormControlLabel
                    control={<Mui.Checkbox {...register("workingMode")} value={mode} />}
                    label={mode}
                  />
                ))}
                <Mui.FormHelperText error={!!errors.workingMode}>{errors.workingMode?.message || ''}</Mui.FormHelperText>
              </Mui.FormGroup>
            </Mui.Grid>

            <Mui.Grid item xs={12}>
              <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
                <FormButton type="submit" variant="contained" color="primary">
                  Submit
                </FormButton>
                <FormButton type="button" variant="contained" color="secondary" onClick={onReset}>
                  Cancel
                </FormButton>
              </Mui.Box>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Box>
      </Container>
      
      <Container>
        <Header>
          <Mui.Typography variant="h6">
            Employees List
          </Mui.Typography>
        </Header>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
          columns={columns}
          permissionLevels={permissionLevels}
        />
      </Container>
    </>
  );
};

export default EmployeesForm;