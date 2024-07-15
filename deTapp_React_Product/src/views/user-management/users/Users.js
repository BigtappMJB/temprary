import { Box, Button, Paper, styled, Typography } from "@mui/material";
import UserFormComponent from "./components/userFormComponent";
import { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import {
  getRolesController,
  getUserController,
  userCreationController,
  userdeleteController,
  userupdateController,
} from "./controllers/usersControllers";
import { useDialog } from "../../utilities/alerts/DialogContent";
import { useLoading } from "../../../components/Loading/loadingProvider";

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

/**
 * UsersPage component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <UsersPage />
 * )
 */
const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  // const [rolesList, setRolesList] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const { openDialog } = useDialog();

  // Fetches user data and updates the table
  const getTableData = async () => {
    try {
      startLoading();
      const response = await getUserController();
      setTableData(response);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  // Fetches roles data and updates the roles list
  useEffect(() => {
    // const getRoles = async () => {
    //   const response = await getRolesController();
    //   setRolesList(response);
    // };
    // getRoles();
    getTableData();
  }, []);

  const columns = {
    // USER_ID: "Username",
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    EMAIL: "Email",
    MOBILE: "Mobile No",
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
   * Handles form submission for adding or updating a user.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await userCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await userupdateController(formData);
      }

      if (response) {
        openDialog(
          "success",
          `User ${isAdd ? "Addition" : "Updation"} Success`,
          response.message,
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
            getTableData();
            if (!isAdd) {
              onFormReset();
            }
          }
        );
      }
    } catch (error) {
      console.error(error);
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        `User ${isAdd ? "Addition" : "Updation"} failed`,
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

  /**
   * Resets the form and hides it.
   */
  const onFormReset = () => {
    setFormAction({
      display: false,
      action: null,
    });
  };

  /**
   * Initiates the process to update a user's information.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleUpdateLogic = (selectedRow) => {
    setSelectedValue(selectedRow);
    setFormAction({
      display: true,
      action: "update",
    });
  };

  /**
   * Initiates the process to delete a user.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleDelete = (selectedRow) => {
    openDialog(
      "warning",
      `Delete confirmation`,
      `Are you sure you want to delete this user "${
        selectedRow.FIRST_NAME + " " + selectedRow.LAST_NAME
      }"?`,
      {
        confirm: {
          name: "Yes",
          isNeed: true,
        },
        cancel: {
          name: "No",
          isNeed: true,
        },
      },
      (confirmed) => {
        if (confirmed) {
          removeDataFromTable(selectedRow);
        }
      }
    );
  };

  /**
   * Removes a user from the table after confirming deletion.
   * @param {Object} selectedRow - The selected user's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      const response = await userdeleteController(selectedRow.ID);

      if (response) {
        openDialog(
          "success",
          `User Deletion Success`,
          response.message,
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
            getTableData();
          }
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        `User Deletion failed`,
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
      {formAction.display && (
        <Container>
          <Header className="panel-header">
            <Typography variant="h6">
              {formAction.action === "add"
                ? "Add"
                : formAction.action === "update"
                ? "Update"
                : "Read "}{" "}
              User
            </Typography>
          </Header>
          <UserFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            // rolesList={rolesList}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Users List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addUser}
              variant="contained"
              color="primary"
              className="primary"
              style={{ marginRight: "10px" }}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add User
            </FormButton>
          </Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
          columns={columns}
        />
      </SecondContainer>
    </>
  );
};

export default UsersPage;
