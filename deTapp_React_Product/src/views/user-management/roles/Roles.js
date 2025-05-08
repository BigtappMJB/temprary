import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  getRolesController,
  roleCreationController,
  roleupdateController,
  roledeleteController,
} from "./controllers/rolesControllers";
import { useDialog } from "../../utilities/alerts/DialogContent";
import RoleFormComponent from "./components/roleFormComponent";
import DataTable from "../users/components/DataTable";
import { useLoading } from "../../../components/Loading/loadingProvider";
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

/**
 * Roles component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <Roles />
 * )
 */
const Roles = () => {
  // Define table columns
  const columns = useMemo(() => [
    { field: 'name', title: 'Name' },
    { field: 'description', title: 'Description' }
  ], []);

  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];

  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
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

  const { openDialog } = useDialog();
  const { startLoading, stopLoading } = useLoading();
  const hasFetchedRoles = useRef(false);
  const getRoles = async () => {
    try {
      startLoading();
      console.log("[DEBUG] Fetching roles data...");
      const response = await getRolesController();
      console.log("[DEBUG] Raw API response:", response);
      
      if (response && Array.isArray(response)) {
        // Transform the data to match the expected format
        const formattedData = response.map(role => {
          const formatted = {
            id: role.ID || role.id,
            name: role.NAME || role.name,
            description: role.DESCRIPTION || role.description
          };
          console.log("[DEBUG] Formatted role data:", formatted);
          return formatted;
        });
        console.log("[DEBUG] Setting table data with:", formattedData);
        setTableData(formattedData);
      } else {
        console.warn("[DEBUG] Invalid roles data format:", response);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error in getRoles:", error);
      setTableData([]);
    } finally {
      stopLoading();
    }
  };

  // Fetches roles data and updates the roles list
  useEffect(() => {
    try {
      const submenuDetails = getSubmenuDetails(
        menuList,
        getCurrentPathName(),
        "path"
      );
      let permissionList = [];
      if (submenuDetails && submenuDetails.permission_level) {
        permissionList = submenuDetails.permission_level
          .split(",")
          .map((ele) => ele.trim().toLowerCase());
      } else {
        // Default to full permissions if not specified
        permissionList = ["create", "edit", "view", "delete"];
      }

      setPermissionLevels({
        create: permissionList.includes("create"),
        edit: permissionList.includes("edit"),
        view: permissionList.includes("view"),
        delete: permissionList.includes("delete"),
      });
    } catch (error) {
      console.error("Error processing permissions:", error);
      // Set default permissions
      setPermissionLevels({
        create: true,
        edit: true,
        view: true,
        delete: true,
      });
    }
    
    if (!hasFetchedRoles.current) {
      getRoles();
      hasFetchedRoles.current = true;
    }
  }, [menuList]);



  /**
   * Initiates the process to add a new user.
   */
  const addRoles = () => {
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

  /**
   * Handles form submission for adding or updating a user.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await roleCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.id };
        response = await roleupdateController(formData);
      }

      if (response) {
        getRoles();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `Role ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Role has been ${isAdd ? "addded" : "updated"} successfully  `,
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
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        `Role ${isAdd ? "Addition" : "Updation"} failed`,
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
    if (permissionLevels?.edit) {
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

  /**
   * Initiates the process to delete a user.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleDelete = (selectedRow) => {
    if (permissionLevels?.delete)
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete this role "${selectedRow.name}"?`,
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
    else
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
  };

  /**
   * Removes a user from the table after confirming deletion.
   * @param {Object} selectedRow - The selected user's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      setFormAction({
        display: false,
        action: null,
      });
      const response = await roledeleteController(selectedRow.id);

      if (response) {
        getRoles();

        openDialog(
          "success",
          `Role Deletion Success`,
          response.message || `Role has been deleted successfully  `,

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
          (confirmed) => {},
          () => {}
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `Role Deletion failed`,
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
              Role
            </Typography>
          </Header>
          <RoleFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Roles List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addRoles}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              className={`${
                permissionLevels?.create ? "primary" : "custom-disabled"
              }`}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add Role
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

export default Roles;
