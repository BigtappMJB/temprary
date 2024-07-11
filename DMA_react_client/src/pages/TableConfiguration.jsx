import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  addColumnsController,
  getTableDefinitionController,
  getTableListController,
  updateColumnsController,
} from "../controllers/tableConfigurationController";
import SingleColumnsForm from "../components/SingleColumnsForm";
import { useDialog } from "../components/alerts/DialogContent";
import { getDataTypesController } from "../controllers/tableCreationController";

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
 * TableConfiguration component
 *
 * This component renders the form to create a table with dynamic columns.
 *
 * @returns {JSX.Element} The rendered component
 */
const TableConfiguration = () => {
  const [tableName, setTableName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [tableList, settableList] = useState([]);
  const [tableDefinition, setTableDefinition] = useState([]);
  const [selectedColumnData, setselectedColumnData] = useState({});
  const [dataTypes, setDataTypes] = useState([]);

  const [formActions, setFormAction] = useState({
    display: false,
    action: null,
  });

  const { openDialog } = useDialog();

  useEffect(() => {
    // inputRef.current.focus();
    const gettableList = async () => {
      try {
        settableList(await getTableListController());
      } catch (error) {
        console.error(error);
      }
    };

    const getDataTypes = async () => {
      try {
        setDataTypes(await getDataTypesController());
      } catch (error) {
        console.error(error);
      }
    };

    getDataTypes();
    gettableList();
  }, []);

  useEffect(() => {
    // inputRef.current.focus();
    const getTableDefinition = async () => {
      try {
        console.log(await getTableDefinitionController(tableName));
        // setTableDefinition(await getTableDefinitionController(tableName));
      } catch (error) {
        console.error(error);
      }
    };
    getTableDefinition();
  }, [tableName]);

  const handleInputChange = (event, value) => {
    setInputValue(value);
    setError(false);
  };

  const handleChange = (event, value) => {
    if (value && !tableList.some((option) => option === value)) {
      setError(true);
      setTableName(null);
    } else {
      setError(false);
      setFormAction({
        display: false,
        action: null,
      });
      setTableName(value);
    }
  };

  const addColumnForm = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  const onFormSubmit = async (formData) => {
    try {
      let response;
      formData = {
        tableName,
        formData,
      };
      const isAdd = formActions.action === "add";
      if (isAdd) {
        response = await addColumnsController(formData);
      } else {
        response = await updateColumnsController(formData);
      }
      openDialog(
        "success",
        `Column ${isAdd ? "Addition" : "Updation"} Success`,
        response,
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
          formCancelled();
        }
      );
    } catch (error) {
      console.log(error);
      openDialog(
        "critical",
        `Column ${
          formActions.action === "add" ? "Addition" : "Updation"
        } Failed`,
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
    }
  };

  const updateColumnForm = () => {
    setFormAction({
      display: true,
      action: "update",
    });
  };

  const formCancelled = () => {
    setselectedColumnData({});
    setFormAction({
      display: false,
      action: null,
    });
  };

  const openDeleteDialog = () => {
    openDialog(
      "warning",
      "Are you want to delete this column?",
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
          deleteColumn();
          return;
        }
      }
    );
  };

  const deleteColumn = async () => {
    try {
      const formData = {
        tableName,
        columnName: selectedColumnData?.columnInfo.columnName,
      };
      const response = await addColumnsController(formData);

      openDialog(
        "success",
        "Column Deletion Success",
        response,
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
          setselectedColumnData({});
          if (formActions.action !== "add")
            setFormAction({
              display: false,
              action: null,
            });
        }
      );
    } catch (error) {
      openDialog(
        "critical",
        "Delete Column Failed",
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
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Typography variant="h6">Table Configuration</Typography>
        </Header>
        <Form>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={tableList}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Table Name"
                error={error}
                helperText={error ? "Invalid Table " : ""}
              />
            )}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isOptionEqualToValue={(option, value) => option === value}
          />
        </Form>
      </Container>

      {formActions.display && (
        <Container>
          <Header>
            <Typography variant="h6">
              {formActions.action === "add" ? "Add" : "Update"} Column
            </Typography>
          </Header>
          <SingleColumnsForm
            dataTypes={dataTypes}
            formCancelled={formCancelled}
            action={formActions}
            onColumnSubmit={onFormSubmit}
            data={selectedColumnData}
          />
        </Container>
      )}
      {tableName && (
        <SecondContainer>
          <SubHeader>
            <Typography variant="h6">
              <b>Column List</b>
            </Typography>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <FormButton
                type="button"
                onClick={addColumnForm}
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
              >
                Add Column
              </FormButton>
            </Box>
          </SubHeader>
        </SecondContainer>
      )}
    </>
  );
};

export default TableConfiguration;
