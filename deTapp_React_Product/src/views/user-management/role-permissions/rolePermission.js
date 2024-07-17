import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

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
          setTableData([]);
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
          setTableData([]);
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
          setTableData([]);
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
          setTableData([]);
        }
      } finally {
        stopLoading();
      }
    };
    getRoles();
    getMenus();
    getSubMenus();
    getPermissions();
    getTableData();
  }, []);

  const columns = {
    ROLE_NAME: "Role",
    MENU_NAME: "Menu",
    SUB_MENU_NAME: "SubMenu",
    PERMISSION: "Permission",
  };

  /**
   * Initiates the process to add a new role permission.
   */
  const addUser = () => {
    setFormAction({
      display: true,
      action: "add",
    });
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
        openDialog(
          "success",
          `Role Permission ${isAdd ? "Addition" : "Updation"} Success`,
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
    setSelectedValue(selectedRow);
    setFormAction({
      display: true,
      action: "update",
    });
  };

  /**
   * Initiates the process to delete a role permission.
   * @param {Object} selectedRow - The selected role permission's data.
   */
  const handleDelete = (selectedRow) => {
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
  };

  /**
   * Removes a role permission from the table after confirming deletion.
   * @param {Object} selectedRow - The selected role permission's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      const response = await rolePermissionDeleteController(selectedRow.ID);

      if (response) {
        openDialog(
          "success",
          `Role Permission Deletion Success`,
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
            // getTableData();
          },
          () => {
            getTableData();
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
              Role Permission
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
              className="primary"
              style={{ marginRight: "10px" }}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add Role Permission
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

export default RolePermissionPage;
