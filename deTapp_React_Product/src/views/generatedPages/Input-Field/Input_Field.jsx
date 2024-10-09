import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Mui from "@mui/material";
import DataTable from "../../user-management/users/components/DataTable";

// Styles
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

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({
  ID: yup.string()
    .required('ID is required'),
  NAME: yup.string()
    .max(255, 'Name cannot exceed 255 characters')
    .required('Name is required'),
});

/**
 * A dynamic form component using React Hook Form, Material UI, and Axios for HTTP requests.
 *
 * @component
 * @returns {JSX.Element} The rendered React component.
 */
const InputFieldForm = ({ handleUpdateLogic, handleDelete }) => {
  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // Store Table Data in useState
  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({ display: true, action: "update" });
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
      // Optionally re-fetch the table data after successful submission
      getTableData();
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
      {formAction.display && (
        <Container>
          <Header>
            <Mui.Typography variant="h6">Input Field Form</Mui.Typography>
          </Header>

          <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            <Mui.Grid container spacing={2}>
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="ID"
                  {...register("ID")}
                  error={!!errors.ID}
                  helperText={errors.ID?.message}
                />
              </Mui.Grid>
              
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="Name"
                  {...register("NAME")}
                  error={!!errors.NAME}
                  helperText={errors.NAME?.message}
                />
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
      )}
      <Mui.Paper className="common-table" sx={{ mb: 5 }}>
        <Mui.Box
          sx={{
            p: 2,
            backgroundColor: '#1e88e5',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Mui.Typography variant="h6">
            <strong>Input Field List</strong>
          </Mui.Typography>
          <FormButton
            onClick={() => setFormAction({ display: true, action: "add" })}
            variant="contained"
            color="primary"
          >
            Add Input Field
          </FormButton>
        </Mui.Box>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
        />
      </Mui.Paper>
    </>
  );
};

export default InputFieldForm;