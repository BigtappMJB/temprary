import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLoading } from "../../components/Loading/loadingProvider";
import { useDialog } from "../utilities/alerts/DialogContent";
import {
  getColumnsDetailsController,
  getInputFieldController,
  getTableListDataController,
} from "../dynamicPageCreation/controllers/dynamicPageCreationController";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DynamicColumnForm from "./components/DynamicColumnForm";
import PageCreationForm from "./components/pageDetailsForm";
import { ScrollToTopButton } from "../utilities/generals";

// Styled Components

// Main form container styling
const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Container for dynamic columns form
const SecondContainer = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Header styling
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

// Box to hold dynamic forms
const StyledColumnBox = styled(Box)(({ theme }) => ({
  overflow: "auto",
}));

// Sub-header styling
const SubHeader = styled(Box)(({ theme }) => ({
  color: "#1e88e5",
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// Button styling
const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// Schema for validation of initial form
const schema1 = yup.object().shape({
  tableName: yup.object().required("Table is required"),
});

/**
 * DynamicPageCreation is a React component that allows users to create dynamic forms.
 * Users can select a table, add columns from the table, and dynamically add/remove form inputs for each selected column.
 */
const DynamicPageCreation = () => {
  // State to hold table list data
  const [tableList, setTableList] = useState([]);

  // State to hold input fields data
  const [inputList, setInputList] = useState([]);

  // State to hold column form data
  const [columnsData, setColumnsData] = useState([]);

  // Refs for storing form refs and other data
  const formRefs = useRef([]);
  const pageDetailsRef = useRef({});
  const allColumnsDataList = useRef([]);
  const isRemovingForm = useRef(false);

  const { startLoading, stopLoading } = useLoading();
  const { openDialog } = useDialog();

  // Refs for handling selected columns, table name, etc.
  const selectedColumnsRef = useRef([]);
  const tableNameRef = useRef(null);
  const columnDetailsRef = useRef([]);
  const currentSelectedRef = useRef(null);
  const hasFetchedRoles = useRef(false);

  // Form control for managing inputs and validation
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema1),
    defaultValues: {},
  });

  // Fetch the table list from the API
  const fetchTableListData = useCallback(async () => {
    try {
      startLoading();
      const response = await getTableListDataController();
      setTableList(response);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Fetch the input field list from the API
  const fetchInputList = useCallback(async () => {
    try {
      startLoading();
      const response = await getInputFieldController();
      setInputList(response);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // On initial render, fetch table list and input list once
  useEffect(() => {
    if (!hasFetchedRoles.current) {
      fetchTableListData();
      fetchInputList();
      hasFetchedRoles.current = true;
    }
  }, [fetchTableListData, fetchInputList]);

  // Fetch column details when a table is selected
  const getColumnDetails = useCallback(
    async (tableName) => {
      try {
        startLoading();
        const response = await getColumnsDetailsController(tableName);
        allColumnsDataList.current = response;
        columnDetailsRef.current = response;
        setColumnsData([]);
      } catch (error) {
        openDialog("critical", "Critical", `Column Details Retrieval Failed`, {
          confirm: { name: "Ok", isNeed: true },
        });
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, openDialog]
  );

  // Handle table form submission and load columns for the selected table
  const onTableSubmit = async (data) => {
    tableNameRef.current = data.TABLE_NAME;
    await getColumnDetails(data.TABLE_NAME);
  };

  /**
   * onRemoveForm removes a specific DynamicColumnForm based on its ID.
   * The removed column's data is re-added to the available columns list.
   */
  const onRemoveForm = (id, columnData) => {
    isRemovingForm.current = true;

    // Find the column to be removed and add it back to the available column details
    const removingData = allColumnsDataList.current.find(
      (column) => column.COLUMN_NAME === columnData.COLUMN_NAME
    );

    if (removingData) {
      columnDetailsRef.current = [removingData, ...columnDetailsRef.current];
    }

    // Update columnsData state by filtering out the removed form
    setColumnsData((prevData) => prevData.filter((form) => form.id !== id));

    isRemovingForm.current = false;
  };

  /**
   * Adds a column to the list of selected columns and updates the available columns list.
   */
  const updateSelectedColumns = (newColumn) => {
    selectedColumnsRef.current = [...selectedColumnsRef.current, newColumn];
  };

  /**
   * Updates column details by removing the selected column from the available list.
   */
  const updateColumnDetails = (columnName) => {
    columnDetailsRef.current = columnDetailsRef.current.filter(
      (column) => column.COLUMN_NAME !== columnName
    );
  };

  /**
   * Adds a new DynamicColumnForm for the selected column.
   * The selected column is removed from the available column list.
   */
  const addColumnForm = () => {
    updateSelectedColumns(currentSelectedRef.current);
    updateColumnDetails(currentSelectedRef.current.COLUMN_NAME);
    setColumnsData((prevData) => [
      ...prevData,
      { id: prevData.length, ...currentSelectedRef.current },
    ]);

    currentSelectedRef.current = null;
    isRemovingForm.current = false;
  };

  /**
   * Validates all the dynamic column forms.
   */
  const validateColumnForms = async () => {
    const updatedColumnsData = await Promise.all(
      columnsData.map(async (column, index) => {
        if (!column?.validated) {
          const isUpdatedDetails = await formRefs.current[
            index
          ].triggerValidation();
          return isUpdatedDetails;
        }
        return column;
      })
    );
    return updatedColumnsData;
  };

  /**
   * Handles the creation of the dynamic page after validating all forms.
   */
  const handleCreatePage = async () => {
    const pageDetailsValidation =
      await pageDetailsRef.current.triggerValidation();

    if (!pageDetailsValidation.validated) {
      ScrollToTopButton();
      return;
    }

    if (!tableNameRef.current) {
      await trigger();
      return;
    }

    if (!columnsData.length) {
      return openDialog(
        "warning",
        "Warning",
        "Select Atleast one columns",
        {
          confirm: {
            name: "Ok",
            isNeed: true,
          },
          cancel: {
            name: "Cancel",
            isNeed: false,
          },
        },
        (confirmed) => {
          if (confirmed) {
            return;
          }
        }
      );
    }

    const updatedColumnsData = await validateColumnForms();

    const noOfFormValidated = updatedColumnsData.filter(
      (column) => column?.validated
    ).length;
    const totalForms = updatedColumnsData.length;
    const error = totalForms !== noOfFormValidated;

    if (error) {
      return openDialog(
        "warning",
        "Warning",
        "Columns are not validated properly.",
        {
          confirm: {
            name: "Ok",
            isNeed: true,
          },
          cancel: {
            name: "Cancel",
            isNeed: false,
          },
        },
        (confirmed) => {
          if (confirmed) {
            return;
          }
        }
      );
    }

    // Collect validated column data for submission
    const columnValues = updatedColumnsData.map(
      (column) => column.columnValues
    );

    // Final output to be submitted/used for form creation
    const finalOutputValues = {
      pageDetails: {
        ...pageDetailsValidation.pageDetails,
      },
      tableName: tableNameRef.current,
      columnsData: {
        ...columnValues,
      },
    };

    console.log({ finalOutputValues });
    debugger; // Debugging point to inspect the output
    return;
  };

  /**
   * Clears all selected columns, adding them back to the available list.
   */
  const handleColumnsClear = () => {
    columnDetailsRef.current = [
      ...columnDetailsRef.current,
      ...selectedColumnsRef.current,
    ];
    selectedColumnsRef.current = [];
    setColumnsData([]);
  };

  return (
    <>
      {/* Initial Table Selection Form */}

      <Container component="form" onSubmit={handleSubmit(onTableSubmit)}>
        <Header>
          <Typography variant="h6">Page Details</Typography>
        </Header>
        <PageCreationForm ref={(el) => (pageDetailsRef.current = el)} />
      </Container>

      <Container component="form" onSubmit={handleSubmit(onTableSubmit)}>
        <Header>
          <Typography variant="h6">Table Details</Typography>
        </Header>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="tableName"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={tableList}
                  getOptionLabel={(option) => option.TABLE_NAME}
                  isOptionEqualToValue={(option, value) =>
                    option.TABLE_NAME === value.TABLE_NAME
                  }
                  value={field.value || null}
                  onChange={(_, data) => {
                    field.onChange(data);
                    onTableSubmit(data);
                    columnDetailsRef.current = [];
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select table"
                      fullWidth
                      error={!!errors.tableName}
                      helperText={errors.tableName?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          {tableNameRef.current && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="selectedColumns"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={columnDetailsRef.current}
                    getOptionLabel={(option) => option.COLUMN_NAME}
                    isOptionEqualToValue={(option, value) =>
                      option.COLUMN_NAME === value.COLUMN_NAME
                    }
                    value={field.value || null}
                    onChange={(_, data) => {
                      field.onChange(data);
                      currentSelectedRef.current = data;
                      addColumnForm(data);
                      setTimeout(() => {
                        field.onChange(null);
                      }, 0);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Columns" fullWidth />
                    )}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Container>

      {selectedColumnsRef.current.length > 0 && (
        <SecondContainer>
          <SubHeader>
            <Typography variant="h6">
              <b>Add columns to Form</b>
            </Typography>
          </SubHeader>
          <StyledColumnBox>
            {columnsData?.map((data, index) => (
              <DynamicColumnForm
                key={data.id}
                data={data}
                ref={(el) => (formRefs.current[index] = el)}
                onReset={onRemoveForm}
                inputList={inputList}
                isRemovingForm={isRemovingForm}
              />
            ))}
          </StyledColumnBox>
        </SecondContainer>
      )}

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <FormButton
          onClick={handleCreatePage}
          type="button"
          variant="contained"
          color="primary"
        >
          Create Form
        </FormButton>

        <FormButton
          onClick={handleColumnsClear}
          type="button"
          variant="contained"
          color="error"
          disabled={columnsData.length === 0}
        >
          Clear
        </FormButton>
      </Box>
    </>
  );
};

export default DynamicPageCreation;
