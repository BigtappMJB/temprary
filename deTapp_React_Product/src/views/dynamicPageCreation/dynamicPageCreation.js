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

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SecondContainer = styled(Paper)(({ theme }) => ({
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

const StyledColumnBox = styled(Box)(({ theme }) => ({
  overflow: "auto",
}));

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

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// Schema for validation
const schema1 = yup.object().shape({
  tableName: yup.object().required("Table is required"),
});

const DynamicPageCreation = () => {
  const [tableList, setTableList] = useState([]);
  const [inputList, setInputList] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const formRefs = useRef([]);
  const allColumnsDataList = useRef([]);

  const isRemovingForm = useRef(false);

  const { startLoading, stopLoading } = useLoading();
  const { openDialog } = useDialog();

  const selectedColumnsRef = useRef([]);
  const columnDetailsRef = useRef([]);
  const currentSelectedRef = useRef(null);
  const hasFetchedRoles = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema1),
    defaultValues: {},
  });

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

  useEffect(() => {
    if (!hasFetchedRoles.current) {
      fetchTableListData();
      fetchInputList();
      hasFetchedRoles.current = true;
    }
  }, [fetchTableListData, fetchInputList]);

  const getColumnDetails = useCallback(
    async (tableName) => {
      try {
        startLoading();
        const response = await getColumnsDetailsController(tableName);
        allColumnsDataList.current = response;
        columnDetailsRef.current = response;
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

  const onTableSubmit = async (data) => {
    await getColumnDetails(data.tableName.TABLE_NAME);
  };

  const onColumnSubmit = (columnData) => {
    if (!isRemovingForm.current) {
      setColumnsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[columnData.id] = columnData;
        console.log({ updatedData });
        return updatedData;
      });
    }
  };

  const onRemoveForm = (id, columnData) => {
    isRemovingForm.current = true;
    const removingData = allColumnsDataList.current.filter(
      (column) => column.COLUMN_NAME === columnData.COLUMN_NAME
    )[0];
    columnDetailsRef.current.unshift(removingData);

    setColumnsData((prevData) =>
      prevData
        .filter((form) => form.id !== id)
        .map((form, index) => ({
          ...form,
          id: index,
        }))
    );
  };

  const updateSelectedColumns = (newColumn) => {
    selectedColumnsRef.current = [...selectedColumnsRef.current, newColumn];
  };

  const updateColumnDetails = (columnName) => {
    columnDetailsRef.current = columnDetailsRef.current.filter(
      (column) => column.COLUMN_NAME !== columnName
    );
  };

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

  const validateColumnForms = async () => {
    const updatedColumnsData = await Promise.all(
      columnsData.map(async (column, index) => {
        if (!column?.validated) {
          // Assuming ColumnForm is a component that has a method to trigger validation
          const isUpdatedDetails = await formRefs.current[
            index
          ].triggerValidation(); // Implement triggerColumnValidation
          return isUpdatedDetails;
        }
        return column;
      })
    );
    return updatedColumnsData;
  };

  const handleCreatePage = async () => {
    // Implement page creation logic here
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

    console.log(updatedColumnsData);
  };

  const handleColumnsClear = () => {
    columnDetailsRef.current = [
      ...columnDetailsRef.current,
      ...selectedColumnsRef.current,
    ];
    selectedColumnsRef.current = [];
  };

  return (
    <>
      {/* Initial Table Selection Form */}
      <Container component="form" onSubmit={handleSubmit(onTableSubmit)}>
        <Header>
          <Typography variant="h6">Create Page</Typography>
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
          {columnDetailsRef.current.length === 0 && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="primary"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  className="danger"
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      {columnDetailsRef.current.length > 0 && selectedColumnsRef.current > 0 ? (
        <Container component="form">
          <Header>
            <Typography variant="h6">Select Columns</Typography>
          </Header>
          <Typography variant="h4" className="error">
            All columns has been selected.
          </Typography>
        </Container>
      ) : null}
      {columnDetailsRef.current.length > 0 && (
        <Container component="form">
          <Header>
            <Typography variant="h6">Select Columns</Typography>
          </Header>

          <Grid container spacing={2}>
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
                    value={currentSelectedRef.current || null}
                    onChange={(_, data) => {
                      field.onChange(data);
                      currentSelectedRef.current = data;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Columns"
                        fullWidth
                        error={!!errors.tableName}
                        helperText={errors.tableName?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  type="button"
                  onClick={addColumnForm}
                  variant="contained"
                  color="primary"
                >
                  Add
                </Button>
                <Button type="button" variant="contained" color="primary">
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
      {selectedColumnsRef.current.length > 0 && (
        <SecondContainer>
          <SubHeader>
            <Typography variant="h6">
              <b>Add columns to Form</b>
            </Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <FormButton
                onClick={handleCreatePage}
                type="button"
                variant="contained"
                color="primary"
                disabled={columnsData.length === 0}
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
          </SubHeader>
          <StyledColumnBox>
            {columnsData?.map((data, index) => (
              <DynamicColumnForm
                key={data.id}
                onColumnSubmit={onColumnSubmit}
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
    </>
  );
};

export default DynamicPageCreation;
