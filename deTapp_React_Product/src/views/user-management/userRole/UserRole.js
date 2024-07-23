import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoading } from "../../../components/Loading/loadingProvider";
import {
  getUserController,
  userupdateController,
} from "../users/controllers/usersControllers";
import { useDialog } from "../../utilities/alerts/DialogContent";

import DataTable from "../users/components/DataTable";
import UserRoleFormComponent from "./components/userRoleFormComponent";
import { getRolesController } from "../roles/controllers/rolesControllers";

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
const UserRole = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [rolesList, setRoleList] = useState([]);

  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const { startLoading, stopLoading } = useLoading();
  const { openDialog } = useDialog();

  // Fetches user data and updates the table
  const getUserData = async () => {
    try {
      startLoading();
      const response = await getUserController();
      setUserList(response);
      setTableData(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setTableData([]);
      }
    } finally {
      stopLoading();
    }
  };

  // Fetches user data and updates the table
  const getRoleData = async () => {
    try {
      startLoading();
      const response = await getRolesController();
      setRoleList(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setTableData([]);
      }
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getUserData();
    getRoleData();
  }, []);

  const columns = {
    // USER_ID: "Username",
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    ROLE_NAME: "Role",
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
      if (formData?.alreadyAdded) {
        return openDialog(
          "warning",
          "Warning",
          `User Role is already assigned.`,
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
      const { user, role } = formData;
      formData = {
        firstName: user?.FIRST_NAME,
        lastName: user?.LAST_NAME,
        email: user?.EMAIL,
        mobileNo: user?.MOBILE,
        ID: user?.ID,
        role: role?.ID,
      };
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await userupdateController(formData);
      else {
        response = await userupdateController(formData);
      }

      if (response) {
        openDialog(
          "success",
          `User Role ${isAdd ? "Addition" : "Updation"} Success`,
          `User Role Updated successfully`,
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
            getUserData();
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
        `User Role ${isAdd ? "Addition" : "Updation"} failed`,
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
    if (selectedRow.ROLE === 1 || selectedRow.ROLE === null) {
      return openDialog(
        "warning",
        "Warning",
        `User ${
          selectedRow.FIRST_NAME + " " + selectedRow.LAST_NAME
        } role hasn't assigned.`,
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
    openDialog(
      "warning",
      `Delete confirmation`,
      `Are you sure you want to remove ${
        selectedRow.FIRST_NAME + " " + selectedRow.LAST_NAME
      } role ${selectedRow.ROLE_NAME}?`,
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

      const formData = {
        firstName: selectedRow?.FIRST_NAME,
        lastName: selectedRow?.LAST_NAME,
        email: selectedRow?.EMAIL,
        mobileNo: selectedRow?.MOBILE,
        ID: selectedRow?.ID,
        role: null,
      };
      const response = await userupdateController(formData);

      if (response) {
        openDialog(
          "success",
          `User Role Removal Success`,
          `User Role removed successfully`,
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
            // getUserData();
          },
          () => {
            getUserData();
          }
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        `User Role Removal failed`,
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
              User Role
            </Typography>
          </Header>
          <UserRoleFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            userList={userList}
            rolesList={rolesList}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>User Roles List</b>
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
              Add User Role
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

export default UserRole;
