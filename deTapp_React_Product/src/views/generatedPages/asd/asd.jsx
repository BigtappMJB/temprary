import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Mui from '@mui/material';
import DataTable from '../../user-management/users/components/DataTable';

/**
 * Custom styles using Material UI and Emotion.
 */
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

// Define validation schema
const validationSchema = yup.object().shape({
  CLIENT_NAME: yup.string().required('Client Name is required').max(255, 'Max length is 255 characters'),
});

/**
 * A dynamic form component using React Hook Form, Material UI, and Axios.
 * It fetches and displays data in a table and provides a form to submit and reset data.
 *
 * @component
 * @returns {JSX.Element} The dynamic form component.
 */
const AsdComponent = ({ handleUpdateLogic, handleDelete, columns, permissionLevels }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: 'update',
  });

  const fetchDataOnce = useRef(false);

  /**
   * Fetches table data and sets it in the state.
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
    if (!fetchDataOnce.current) {
      getTableData();
      fetchDataOnce.current = true;
    }
  }, []);

  /**
   * Submits the form data to the server.
   *
   * @param {Object} formData The form data to submit.
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
   * Resets the form fields.
   */
  const onReset = () => {
    reset();
  };

  /**
   * Initiates to add a new entry.
   */
  const addUser = () => {
    setFormAction({
      display: true,
      action: 'add',
    });
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header>
            <Mui.Typography variant="h6">
              asd Form
            </Mui.Typography>
          </Header>

          <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            <Mui.Grid container spacing={2}>
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="Client Name"
                  {...register('CLIENT_NAME')}
                  error={!!errors.CLIENT_NAME}
                  helperText={errors.CLIENT_NAME ? errors.CLIENT_NAME.message : ''}
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
      <Container className="common-table">
        <Header>
          <Mui.Typography variant="h6">
            <b>asd List</b>
          </Mui.Typography>
          <Mui.Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addUser}
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
              className="primary"
            >
              Add asd
            </FormButton>
          </Mui.Box>
        </Header>
        <DataTable
          tableData={tableData}
        />
      </Container>
    </>
  );
};

export default AsdComponent;