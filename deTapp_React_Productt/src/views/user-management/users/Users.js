import { Box, Button, Paper, styled, Typography } from "@mui/material";
import UserFormComponent from "./components/userFormComponent";
import { useEffect, useRef, useState, useMemo } from "react";
import DataTable from "./components/DataTable";
import {
  getUserController,
  userCreationController,
  userdeleteController,
  userupdateController,
} from "./controllers/usersControllers";
import { useDialog } from "../../utilities/alerts/DialogContent";
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useLoading } from "../../../components/Loading/loadingProvider";
import { getRolesController } from "../roles/controllers/rolesControllers";
import {
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
} from "../../utilities/generals";
import { useSelector } from "react-redux";
import TableErrorDisplay from "../../../components/tableErrorDisplay/TableErrorDisplay";
import { useOutletContext } from "react-router";

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

const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});

  const { startLoading, stopLoading } = useLoading();
  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const [permissionLevels, setPermissionLevels] = useState({
    create: null,
    edit: null,
    view: null,
    delete: null,
  });
  const hasFetchedRoles = useRef(false);

  const { openDialog } = useDialog();
  const { notifySuccess, notifyError, notifyWarning } = useNotificationContext();

  // Function to fetch roles data
  const getRolesData = async () => {
    try {
      console.log("Fetching roles for user form...");
      const response = await getRolesController();
      
      if (response && Array.isArray(response)) {
        console.log("Roles for user form received:", response);
        const formattedRoles = response.map(role => ({
          id: role.ID || role.id,
          name: role.NAME || role.name,
          description: role.DESCRIPTION || role.description
        }));
        setRolesList(formattedRoles);
      } else {
        console.warn("Invalid roles data format for user form:", response);
        setRolesList([]);
      }
    } catch (error) {
      console.error("Error fetching roles for user form:", error);
      setRolesList([]);
    }
  };

  // Fetch roles when component mounts
  useEffect(() => {
    if (!hasFetchedRoles.current) {
      getTableData();
      getRolesData();
      hasFetchedRoles.current = true;
    }
  }, []);

  // Fetches user data and updates the table
  const getTableData = async () => {
    try {
      startLoading();
      console.log("Fetching users data...");
      const response = await getUserController();
      
      if (response && Array.isArray(response)) {
        console.log("Users data received:", response);
        // Transform the data to match the expected format if needed
        const formattedData = response.map(user => ({
          id: user.ID || user.id,
          FIRST_NAME: user.FIRST_NAME || user.first_name,
          LAST_NAME: user.LAST_NAME || user.last_name,
          EMAIL: user.EMAIL || user.email,
          MOBILE: user.MOBILE || user.mobile,
          ROLE_NAME: user.ROLE_NAME || user.role_name
        }));
        setTableData(formattedData);
      } else {
        console.warn("Invalid users data format:", response);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error in getTableData:", error);
      setTableData([]);
    } finally {
      stopLoading();
    }
  };

  // Set up permission levels
  useEffect(() => {
    const submenuDetails = getSubmenuDetails(
      menuList,
      getCurrentPathName(),
      "path"
    );
    const permissionList = submenuDetails?.permission_level
      ?.split(",")
      .map((ele) => ele.trim().toLowerCase());
    setPermissionLevels({
      create: permissionList?.includes("create"),
      edit: permissionList?.includes("edit"),
      view: permissionList?.includes("view"),
      delete: permissionList?.includes("delete"),
    });
  }, [menuList]);

  // Define table columns
  const columns = useMemo(() => [
    { field: 'FIRST_NAME', title: 'First Name' },
    { field: 'LAST_NAME', title: 'Last Name' },
    { field: 'EMAIL', title: 'Email' },
    { field: 'MOBILE', title: 'Mobile No' },
    { field: 'ROLE_NAME', title: 'Role' }
  ], []);


  // Initialize table data state
  const [tableData, setTableData] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  const addUser = () => {
    if (permissionLevels?.create)
      setFormAction({
        display: true,
        action: "add",
      });
    else {
      openDialog(
        "critical",
        `Access Denied`,
        "Your access is denied, Kindly contact system administrator.",
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
  };

  const onformSubmit = async (formData) => {
    try {
      startLoading();
      const isAdd = formAction.action === "add";
      let response;
      
      if (isAdd) {
        response = await userCreationController(formData);
      } else {
        if (!selectedValue.id) {
          console.error("No user ID available for updating.");
          return;
        }
        formData = { ...formData, id: selectedValue.id };
        response = await userupdateController(formData);
      }

      if (response) {
        getTableData();
        if (!isAdd) {
          onFormReset();
        }
        notifySuccess(response.message || `User has been ${isAdd ? 'created' : 'updated'} successfully`);
      } else {
        notifyError(`Failed to ${isAdd ? 'create' : 'update'} user`);
      }
    } catch (error) {
      console.error(error);
      notifyError(`Failed to ${formAction.action === 'add' ? 'create' : 'update'} user`);
    } finally {
      stopLoading();
    }
  };

  const onFormReset = () => {
    setFormAction({
      display: false,
      action: null,
    });
  };

  const handleUpdateLogic = (selectedRow) => {
    if (permissionLevels?.edit) {
      if (!selectedRow.id) {
        console.error("Selected row does not contain an ID:", selectedRow);
        return;
      }
      setSelectedValue(selectedRow);
      ScrollToTopButton();
      setFormAction({
        display: true,
        action: "update",
      });
    } else {
      openDialog(
        "critical",
        `Access Denied`,
        "Your access is denied, Kindly contact system administrator.",
        {
          confirm: { name: "Ok", isNeed: true },
          cancel: { name: "Cancel", isNeed: false },
        },
        (confirmed) => {}
      );
    }
  };

  const handleDelete = (selectedRow) => {
    if (permissionLevels?.delete) {
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete the following user?

Name: ${selectedRow.FIRST_NAME} ${selectedRow.LAST_NAME}
Email: ${selectedRow.EMAIL}`,
        {
          confirm: { name: "Yes", isNeed: true },
          cancel: { name: "No", isNeed: true },
        },
        (confirmed) => {
          if (confirmed) {
            removeDataFromTable(selectedRow);
          }
        }
      );
    } else {
      openDialog(
        "critical",
        `Access Denied`,
        "Your access is denied, Kindly contact system administrator.",
        {
          confirm: { name: "Ok", isNeed: true },
          cancel: { name: "Cancel", isNeed: false },
        },
        (confirmed) => {}
      );
    }
  };

  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      setFormAction({
        display: false,
        action: null,
      });
      const response = await userdeleteController(selectedRow.id);

      if (response) {
        getTableData();
        notifySuccess(response.message || 'User has been deleted successfully');
      } else {
        notifyError('Failed to delete user');
      }
    } catch (error) {
      notifyError('User deletion failed. Please try again.');
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
            rolesList={rolesList}
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
              style={{ marginRight: "10px" }}
              className={`${
                permissionLevels?.create ? "primary" : "custom-disabled"
              }`}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add User
            </FormButton>
          </Box>
        </SubHeader>
        {permissionLevels?.view ? (
          <DataTable
            tableData={tableData}
            handleUpdateLogic={handleUpdateLogic}
            handleDelete={handleDelete}
            columns={columns}
            permissionLevels={permissionLevels}
          />
        ) : (
          <TableErrorDisplay />
        )}
      </SecondContainer>
    </>
  );
};

export default UsersPage;
