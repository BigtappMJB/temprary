import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Mui from "@mui/material";
import DataTable from "../../user-management/users/components/DataTable";

// Base styles using Material UI and Emotion
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

const SecondContainer = Mui.styled(Mui.Container)({
  marginBottom: "20px",
  padding: "15px",
  borderRadius: "5px",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
});

const SubHeader = Mui.styled(Mui.Box)({
  paddingBottom: "15px",
});

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({
  tableName: yup
    .string()
    .max(255, "Maximum length is 255 characters")
    .required("Table Name is required"),
});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with a two-column layout for form elements.
 * Form fields are dynamically generated based on the input data and Yup validation is applied.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @returns {JSX.Element} The rendered React component.
 */
const DynamicPageCreation = ({
  handleUpdateLogic,
  handleDelete,
  columns,
  permissionLevels,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const runAPIOnUseEffect = useRef(false);

  /**
   * Fetch and store table data from server using Axios.
   */
  const getTableData = async () => {
    try {
      const response = await axios.get("https://example.com/api/table");
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
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
      const response = await axios.post(
        "https://example.com/api/submit",
        formData
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error submitting the form:", error);
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
            <Mui.Typography variant="h6">
              dynamic_page_creation Form
            </Mui.Typography>
          </Header>

          <Mui.Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: 3, mb: 5 }}
          >
            <Mui.Grid container spacing={2}>
              <Mui.Grid item xs={12} sm={6}>
                <Mui.TextField
                  fullWidth
                  label="Table Name"
                  {...register("tableName", { required: true })}
                  error={!!errors.tableName}
                  helperText={errors.tableName?.message || ""}
                />
              </Mui.Grid>
              <Mui.Grid item xs={12}>
                <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
                  <Mui.Button type="submit" variant="contained" color="primary">
                    Submit
                  </Mui.Button>
                  <Mui.Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={onReset}
                  >
                    Cancel
                  </Mui.Button>
                </Mui.Box>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Box>
        </Container>
      )}
      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Mui.Typography variant="h6">
            <b>dynamic_page_creation List</b>
          </Mui.Typography>
          <Mui.Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <FormButton
              type="button"
              onClick={addUser}
              variant="contained"
              color="primary"
              sx={{ marginRight: "10px" }}
            >
              Add dynamic_page_creation
            </FormButton>
          </Mui.Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
        />
      </SecondContainer>
    </>
  );
};

export default DynamicPageCreation;
