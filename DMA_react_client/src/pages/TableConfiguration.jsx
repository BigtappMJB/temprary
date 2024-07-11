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
import { validationFunction } from "../generals/validators";
import TableColumnForm from "../components/ColumnForm";
import { useDialog } from "../components/alerts/DialogContent";
import { tableCreationController } from "../controllers/tableCreationController";
import {
  getTableDefinitionController,
  getTableListController,
} from "../controllers/tableConfigurationController";
import DialogComponent from "../components/DialogComponent";

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
 * TableConfiguration component
 *
 * This component renders the form to create a table with dynamic columns.
 *
 * @returns {JSX.Element} The rendered component
 */
const TableConfiguration = () => {
  const [tableName, setTableName] = useState("data");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [tableList, settableList] = useState([]);
  const [tableDefinition, setTableDefinition] = useState([]);
  const [dialogOpen, setDialogComponent] = useState(false);

  //   const { openDialog } = useDialog();

  useEffect(() => {
    // inputRef.current.focus();
    const gettableList = async () => {
      try {
        settableList(await getTableListController());
      } catch (error) {
        console.error(error);
      }
    };
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
      setTableName(value);
    }
  };

  const addColumnForm = () => {
    setDialogComponent(true);
  };

  const ondialogClose = () => {
    setDialogComponent(false);
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
          <DialogComponent
            title={"Add Column"}
            open={dialogOpen}
            onClose={ondialogClose}
          />
        </SecondContainer>
      )}
    </>
  );
};

export default TableConfiguration;
