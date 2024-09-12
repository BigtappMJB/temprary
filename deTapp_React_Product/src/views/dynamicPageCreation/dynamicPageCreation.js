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
  const pageDetailsRef = useRef({});

  const allColumnsDataList = useRef([]);

  const isRemovingForm = useRef(false);

  const { startLoading, stopLoading } = useLoading();
  const { openDialog } = useDialog();

  const selectedColumnsRef = useRef([]);
  const tableNameRef = useRef(null);

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

  const onTableSubmit = async (data) => {
    tableNameRef.current = data.TABLE_NAME;
    await getColumnDetails(data.TABLE_NAME);
  };

  const onColumnSubmit = (columnData) => {
    if (!isRemovingForm.current) {
      setColumnsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[columnData.id] = columnData;
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
    const pageDetailsValidation =
      await pageDetailsRef.current.triggerValidation();

    if (!pageDetailsValidation.validated) {
      ScrollToTopButton();
      return;
    }

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
                      // Delay resetting the field value
                      setTimeout(() => {
                        field.onChange(null);
                      }, 0);
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

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        flexWrap="wrap"
        gap={2} // Adds space between buttons
      >
        <FormButton
          onClick={handleCreatePage}
          type="button"
          variant="contained"
          color="primary"
          // disabled={columnsData.length === 0}
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
