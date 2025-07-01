import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { validationFunction } from "../utilities/Validators";
import TableColumnForm from "./components/ColumnForm";
import { useDialog } from "../utilities/alerts/DialogContent";
import {
  getDataTypesController,
  tableCreationController,
} from "./controllers/tableCreationController";
import { useLoading } from "../../components/Loading/loadingProvider";
import { useSelector } from "react-redux";
import { getCurrentPathName, getSubmenuDetails } from "../utilities/generals";
import { useOutletContext } from "react-router";
import { getTableListDataController } from "../dynamicPageCreation/controllers/dynamicPageCreationController";

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
  // width: "80vw",
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

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(2),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const FormField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// const FormButtonContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "flex-end",
//   [theme.breakpoints.down("sm")]: {
//     width: "100%",
//     justifyContent: "flex-start",
//   },
// }));

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

/**
 * CreateTableForm component
 *
 * This component renders the form to create a table with dynamic columns.
 *
 * @returns {JSX.Element} The rendered component
 */
const CreateTableForm = () => {
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(true);
  const inputRef = useRef(null);
  const [columnsData, setFormData] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const formRefs = useRef([]);
  const isRemovingForm = useRef(false);

  const [permissionLevels, setPermissionLevels] = useState({
    create: null,
    edit: null,
    view: null,
    delete: null,
  });
  const [tableList, setTableList] = useState([]);
  const hasFetchedRoles = useRef(false);

  const { openDialog } = useDialog();
  const { startLoading, stopLoading } = useLoading();

  const validateTableName = (name) => {
    if (!name) {
      return "Table name is required";
    }
    const { valid, message } = validationFunction("tableName", name);
    if (!valid) {
      return message;
    }
    return "";
  };

  const handleChange = (e) => {
    setTableName(e.target.value);
    if (submitted) {
      setError(validateTableName(e.target.value));
    } else {
      setSubmitted(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateTableName(tableName);
    setError(validationError);

    if (!validationError) {
      setSubmitted(true);
      if (columnsData.length === 0) addColumnForm();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];

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

  useEffect(() => {
    const submenuDetails = getSubmenuDetails(
      menuList,
      getCurrentPathName(),
      "path"
    );
    const permissionList = submenuDetails?.permission_level
      .split(",")
      .map((ele) => ele.trim().toLowerCase());

    setPermissionLevels({
      create: permissionList?.includes("create"),
      edit: permissionList?.includes("edit"),
      view: permissionList?.includes("view"),
      delete: permissionList?.includes("delete"),
    });
    inputRef.current.focus();

    const getDataTypes = async () => {
      try {
        startLoading();
        setDataTypes(await getDataTypesController());
      } catch (error) {
        console.error(error);
      } finally {
        stopLoading();
      }
    };
    if (!hasFetchedRoles.current) {
      getDataTypes();
      fetchTableListData();
      hasFetchedRoles.current = true;
    }
  }, [menuList]);

  const addColumnForm = () => {
    const validationError = validateTableName(tableName);
    isRemovingForm.current = false;

    setError(validationError);
    if (validationError) {
      return;
    }
    let updatedFormData = {
      id: columnsData.length,
    };
    if (columnsData.length === 0) {
      updatedFormData = {
        id: columnsData.length,
        columnName: `${tableName.toLowerCase()}_id`,
        dataType: { id: 5, name: "BIGINT" },
        length: null,
        isPrimary: true,
        isMandatory: true,
        defaultValue: null,
        validated: true,
      };
    }
    setFormData((prevFormData) => [...prevFormData, updatedFormData]);
  };

  const onRemoveForm = (id) => {
    isRemovingForm.current = true;
    const updatedFormData = columnsData
      .filter((form) => form.id !== id)
      .map((form, index) => ({
        ...form,
        id: index,
      }));
    setFormData(updatedFormData);
  };

  const onColumnSubmit = (columnData) => {
    if (!isRemovingForm.current) {
      let updatedData = columnsData;
      updatedData[columnData.id] = columnData;
      setFormData(updatedData);
    } else {
      isRemovingForm.current = true;
    }
  };

  const handleColumnsClear = () => {
    setFormData([]);
  };
  const handleCreateTable = async () => {
    try {
      const validationError = validateTableName(tableName);
      setError(validationError);

      if (tableName === "" && validationError) {
        openDialog(
          "warning",
          "Warning",
          "Invalid Table Name",
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
        return;
      }

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

      const updatedColumnsData = await validateColumnForms();

      const noOfFormValidated = updatedColumnsData.filter(
        (column) => column?.validated
      ).length;
      const totalForms = updatedColumnsData.length;
      const error = totalForms !== noOfFormValidated;

      if (error) {
        openDialog(
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
        return;
      }
      startLoading();
      const finalObject = {
        tableName,
        columnsData: updatedColumnsData,
      };

      const response = await tableCreationController(finalObject);

      if (response) {
        setTableName("");
        //   setSubmitted(false);
        handleColumnsClear();
        openDialog(
          response.success ? "success" : "warning",
          response.success ? "Success" : "Warning ",
          "Table Created Successfully",
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
          (confirmed) => {}
        );
      }
    } catch (error) {
      console.error(error);
      openDialog(
        "critical",
        "Table Creation Failed",
        error?.errorMessage,
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
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <Container>
        <Header className="panel-header">
          <Typography variant="h6">Create Table</Typography>
        </Header>
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Table Name"
            variant="outlined"
            value={tableName}
            onChange={handleChange}
            error={Boolean(error)}
            helperText={error}
            inputRef={inputRef}
            onKeyDown={handleKeyPress}
          />
          {/* <FormButtonContainer>
            <FormButton type="submit" variant="contained" color="primary">
              Submit
            </FormButton>
          </FormButtonContainer> */}
        </Form>
      </Container>
      {submitted && (
        <SecondContainer>
          <SubHeader>
            <Typography variant="h6">
              <b>Add columns to Table</b>
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
            >
              <FormButton
                type="button"
                onClick={addColumnForm}
                variant="contained"
                color="primary"
                className="primary"
              >
                Add Column
              </FormButton>
              <FormButton
                onClick={handleCreateTable}
                type="button"
                variant="contained"
                color="primary"
                className={`${
                  permissionLevels.create ? "primary" : "custom-disabled"
                }`}
                disabled={columnsData.length === 0}
              >
                Create Table
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
              <TableColumnForm
                key={data.id}
                tableList={tableList}
                onColumnSubmit={onColumnSubmit}
                data={data}
                ref={(el) => (formRefs.current[index] = el)}
                onReset={onRemoveForm}
                dataTypes={dataTypes}
                isRemovingForm={isRemovingForm} // Pass the flag to the child
              />
            ))}
          </StyledColumnBox>
        </SecondContainer>
      )}
    </>
  );
};

export default CreateTableForm;
