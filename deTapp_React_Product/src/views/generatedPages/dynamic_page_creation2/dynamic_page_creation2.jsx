import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DataTable from "../../user-management/users/components/DataTable";
import * as Mui from '@mui/material';

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
  dynamic_page_id: yup.date().required('This field is required'),
});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with a two-column layout for form elements.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @param {Object} props - Component props
 * @param {function} props.handleUpdateLogic - Function to handle update logic
 * @param {function} props.handleDelete - Function to handle delete logic
 * @returns {JSX.Element} The rendered React component.
 */
const DynamicPageCreation2 = ({ handleUpdateLogic, handleDelete }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const [tableData, setTableData] = useState([]);
  const runAPIOnUseEffect = useRef(true);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  /**
   * Fetches and stores table data from the server using Axios.
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
    if (runAPIOnUseEffect.current) {
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
      getTableData(); // Refresh the table data after submission
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  /**
   * Resets the form.
   */
  const onReset = () => {
    reset();
  };

  /**
   * Initiates adding a new user form.
   */
  const addUser = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header>
            <Mui.Typography variant="h6">
              Dynamic Page Creation2 Form
            </Mui.Typography>
          </Header>
          <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            <Mui.Grid container spacing={2}>
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="Dynamic Page ID"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('dynamic_page_id')}
                  error={!!errors.dynamic_page_id}
                  helperText={errors.dynamic_page_id?.message || ''}
                />
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
      )}
      <Mui.Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center">
          <Mui.Typography variant="h6">Dynamic Page Creation2 List</Mui.Typography>
          <FormButton variant="contained" color="primary" onClick={addUser}>
            Add Dynamic Page Creation2
          </FormButton>
        </Mui.Box>
        <DataTable tableData={tableData} handleUpdate={handleUpdateLogic} handleDelete={handleDelete} />
      </Mui.Paper>
    </>
  );
};

export default DynamicPageCreation2;