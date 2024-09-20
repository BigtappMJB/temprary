import React, { useEffect, useState, useRef, Fragment } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Paper, Box, Grid, TextField, Button, Typography, styled } from '@mui/material';
import DataTable from "../../user-management/users/components/DataTable";

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
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
}));

const SubHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}));

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({
  professor_name: yup
    .string()
    .max(255, 'Name cannot exceed 255 characters')
    .required('Name is required'),
  joining_date: yup
    .date()
    .required('Joining date is required')
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

const Professors = ({ handleUpdateLogic, handleDelete }) => {
  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  // Store Table Data in useState
  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "add"
  });
  const runAPIOnUseEffect = useRef(false);

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
    if (!runAPIOnUseEffect.current) {
      getTableData();
      runAPIOnUseEffect.current = false;
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
      getTableData(); // Refresh table data after submission
      setFormAction({ ...formAction, display: false });
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
    setFormAction({ ...formAction, display: false });
  };

  return (
    <Fragment>
      {formAction.display && (
        <Container>
          <Header>
            <Typography variant="h6">
              Professors Form
            </Typography>
          </Header>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: 3, mb: 5 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Professor Name"
                  {...register('professor_name')}
                  error={!!errors.professor_name}
                  helperText={errors.professor_name?.message || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register('joining_date')}
                  error={!!errors.joining_date}
                  helperText={errors.joining_date?.message || ''}
                />
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
            <b>Professors List</b>
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
              Add Professors
            </FormButton>
          </Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
        />
      </SecondContainer>
    </Fragment>
  );
};

export default Professors;