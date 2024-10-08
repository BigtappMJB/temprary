import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDialog } from "../../utilities/alerts/DialogContent";
import {
  getRolePermissionsController,
  rolePermissionCreationController,
  rolePermissionDeleteController,
  rolePermissionUpdateController,
} from "./controllers/rolePermissionControllers";
import RolePermissionFormComponent from "./components/rolesPermissionFormComponent";
import DataTable from "../users/components/DataTable";
import { getRolesController } from "../roles/controllers/rolesControllers";
import { getMenusController } from "../menu/controllers/MenuControllers";
import { getSubMenusController } from "../submenu/controllers/subMenuControllers";
import { getPermissionList } from "../permissions/controllers/permissionControllers";
import { useLoading } from "../../../components/Loading/loadingProvider";
import {
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
} from "../../utilities/generals";
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
 * RolePermissionPage component displays a role permission management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <RolePermissionPage />
 * )
 */
const RolePermissionPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [menusList, setMenuList] = useState([]);
  const [subMenusList, setSubMenuList] = useState([]);
  const [permissionLevelList, setPermissionLevelList] = useState([]);
  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });
  const [permissionLevels] = useState({
    create: true,
    edit: true,
    view: true,
    delete: true,
  });

  const hasFetchedRoles = useRef(false);

  const { openDialog } = useDialog();
  const { startLoading, stopLoading } = useLoading();

  // Fetches role permission data and updates the table
  const getTableData = async () => {
    try {
      startLoading();
      const response = await getRolePermissionsController();
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

  // Fetches roles data and updates the roles list
  useEffect(() => {
    const getRoles = async () => {
      try {
        startLoading();
        const response = await getRolesController();

        setRolesList(response);
      } catch (error) {
        console.error(error);
        if (error.statusCode === 404) {
          setRolesList([]);
        }
      } finally {
        stopLoading();
      }
    };
    const getMenus = async () => {
      try {
        startLoading();
        const response = await getMenusController();
        setMenuList(response);
      } catch (error) {
        console.error(error);
        if (error.statusCode === 404) {
          setMenuList([]);
        }
      } finally {
        stopLoading();
      }
    };
    const getSubMenus = async () => {
      try {
        startLoading();
        const response = await getSubMenusController();
        setSubMenuList(response);
      } catch (error) {
        console.error(error);
        if (error.statusCode === 404) {
          setSubMenuList([]);
        }
      } finally {
        stopLoading();
      }
    };
    const getPermissions = async () => {
      try {
        startLoading();
        const response = await getPermissionList();
        setPermissionLevelList(response);
      } catch (error) {
        console.error(error);
        if (error.statusCode === 404) {
          setPermissionLevelList([]);
        }
      } finally {
        stopLoading();
      }
    };
    // const submenuDetails = getSubmenuDetails(
    //   menuList,
    //   getCurrentPathName(),
    //   "path"
    // );
    // const permissionList = submenuDetails?.permission_level
    //   .split(",")
    //   .map((ele) => ele.trim().toLowerCase());

    if (!hasFetchedRoles.current) {
      getTableData();
      getRoles();
      getMenus();
      getSubMenus();
      getPermissions();
      hasFetchedRoles.current = true;
    }
  }, [menuList]);

  const columns = {
    role_name: "Role",
    menu_name: "Menu",
    sub_menu_name: "SubMenu",
    permission: "Permission",
  };

  /**
   * Initiates the process to add a new role permission.
   */
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

  /**
   * Handles form submission for adding or updating a role permission.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await rolePermissionCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await rolePermissionUpdateController(formData);
      }

      if (response) {
        getTableData();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `Role Permission ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Role Permission has been ${
              isAdd ? "addded" : "updated"
            } successfully`,
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
        `Role Permission ${isAdd ? "Addition" : "Updation"} failed`,
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
   * Initiates the process to update a role permission's information.
   * @param {Object} selectedRow - The selected role permission's data.
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
   * Initiates the process to delete a role permission.
   * @param {Object} selectedRow - The selected role permission's data.
   */
  const handleDelete = (selectedRow) => {
    if (permissionLevels?.delete)
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete this role permission ?`,
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
   * Removes a role permission from the table after confirming deletion.
   * @param {Object} selectedRow - The selected role permission's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      setFormAction({
        display: false,
        action: null,
      });
      const response = await rolePermissionDeleteController(selectedRow.ID);

      if (response) {
        getTableData();

        openDialog(
          "success",
          `Role Permission Deletion Success`,
          response.message || `Role Permission has been deleted successfully`,
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
            // getTableData();
          },
          () => {
            // getTableData();
          }
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        `Role Permission Deletion failed`,
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

  const getActionText = () => {
    if (formAction.action === "add") {
      return "Add";
    } else if (formAction.action === "update") {
      return "Update";
    } else {
      return "Read";
    }
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header className="panel-header">
            <Typography variant="h6">
              {getActionText()} Role Permission
            </Typography>
          </Header>
          <RolePermissionFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            rolesList={rolesList}
            permissionLevelList={permissionLevelList}
            subMenusList={subMenusList}
            menuList={menusList}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Role Permissions List</b>
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
              Add Role Permission
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

export default RolePermissionPage;
