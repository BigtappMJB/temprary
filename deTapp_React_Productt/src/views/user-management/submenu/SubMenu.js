import { Box, Button, Paper, styled, Typography } from "@mui/material";
import SubMenuFormComponent from "./components/subMenuFormComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialog } from "../../utilities/alerts/DialogContent";
import DataTable from "../users/components/DataTable";
import {
  getSubMenusController,
  subMenuCreationController,
  subMenuDeleteController,
  subMenuUpdateController,
} from "./controllers/subMenuControllers";
import { getMenusController } from "../menu/controllers/MenuControllers";
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
 * UsersPage component displays a submenu management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <UsersPage />
 * )
 */
// Define columns for the data table
const tableColumns = [
  { field: 'menu_name', title: 'Menu' },
  { field: 'NAME', title: 'Submenu Name' },
  { field: 'DESCRIPTION', title: 'Description' },
  { field: 'ROUTE', title: 'Path' },
  { field: 'STATUS', title: 'Status' }
];

const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [menuLists, setRolesList] = useState([]);
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

  const { startLoading, stopLoading } = useLoading();
  const hasFetchedRoles = useRef(false);

  const { openDialog } = useDialog();

  const getTableData = useCallback(async () => {
    try {
      startLoading();
      const response = await getSubMenusController();
      
      // Handle different response formats
      let dataToProcess = response;
      
      // Check if response has a data property (new API format)
      if (response && response.data) {
        dataToProcess = response.data;
      }
      
      // Transform the response data to match the table columns
      const transformedData = Array.isArray(dataToProcess) ? dataToProcess.map(item => ({
        ...item,
        ID: item.ID || item.id,
        NAME: item.NAME || item.name,
        DESCRIPTION: item.DESCRIPTION || item.description,
        ROUTE: item.ROUTE || item.route,
        menu_name: item.menu_name || 
                  (item.menu?.NAME || item.menu?.name) || 
                  '',
        STATUS: item.STATUS || item.status || 'Active'
      })) : [];
      
      console.log("Transformed submenu data:", transformedData);
      setTableData(transformedData);
    } catch (error) {
      console.error("Error fetching submenu data:", error);
      if (error.statusCode === 404) {
        setTableData([]);
      }
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setTableData]);

  const getMenus = useCallback(async () => {
    try {
      startLoading();
      const response = await getMenusController();
      
      // Handle different response formats
      let menuData = response;
      
      // Check if response has a data property (new API format)
      if (response && response.data) {
        menuData = response.data;
      }
      
      // Transform menu data if needed
      const transformedMenus = Array.isArray(menuData) ? menuData.map(item => ({
        ...item,
        ID: item.ID || item.id,
        NAME: item.NAME || item.name,
        DESCRIPTION: item.DESCRIPTION || item.description
      })) : [];
      
      console.log("Transformed menu data:", transformedMenus);
      setRolesList(transformedMenus);
    } catch (error) {
      console.error("Error fetching menus:", error);
      if (error.statusCode === 404) {
        setRolesList([]);
      }
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setRolesList]);

  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];

  // Initial data fetch for menus
  useEffect(() => {
    if (!hasFetchedRoles.current) {
      getMenus();
    }
  }, [getMenus]);

  // Get submenu details and set permissions
  useEffect(() => {
    const submenuDetails = getSubmenuDetails(
      menuList,
      getCurrentPathName(),
      "path"
    );
    
    const permissionList = submenuDetails?.permission_level
      ?.split(",")
      ?.map((ele) => ele.trim().toLowerCase()) || [];

    setPermissionLevels({
      create: permissionList?.includes("create"),
      edit: permissionList?.includes("edit"),
      view: permissionList?.includes("view"),
      delete: permissionList?.includes("delete"),
    });
  }, [menuList]);
  
  // Fetch table data once permissions are set
  useEffect(() => {
    if (!hasFetchedRoles.current && permissionLevels.view !== null) {
      console.log("Initial data fetch");
      getTableData();
      hasFetchedRoles.current = true;
    }
  }, [permissionLevels, getTableData]);

  // Columns are already defined at the top of the file

  /**
   * Initiates the process to add a new submenu.
   */
  const addUser = useCallback(() => {
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
  }, [permissionLevels, setFormAction, openDialog]);

  /**
   * Resets the form and hides it.
   */
  const onFormReset = useCallback(() => {
    setFormAction({
      display: false,
      action: null,
    });
  }, [setFormAction]);

  /**
   * Handles form submission for adding or updating a submenu.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = useCallback(async (formData) => {
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await subMenuCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await subMenuUpdateController(formData);
      }

      if (response) {
        getTableData();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `SubMenu ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Submenu has been ${isAdd ? "added" : "updated"} successfully`,
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
      console.error('Error in submenu operation:', error);
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `SubMenu ${isAdd ? "Addition" : "Updation"} failed`,
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
  }, [startLoading, stopLoading, formAction, selectedValue, getTableData, onFormReset, openDialog]);

  /**
   * Initiates the process to update a submenu's information.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const handleUpdateLogic = useCallback((selectedRow) => {
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
  }, [permissionLevels, setSelectedValue, setFormAction, openDialog]);

  /**
   * Removes a submenu from the table after confirming deletion.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const removeDataFromTable = useCallback(async (selectedRow) => {
    try {
      startLoading();
      setFormAction({
        display: false,
        action: null,
      });
      const response = await subMenuDeleteController(selectedRow.ID);

      if (response) {
        getTableData();

        openDialog(
          "success",
          `SubMenu Deletion Success`,
          response.message || `SubMenu has been deleted successfully  `,
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
          () => {
            // Dialog confirmed callback
          },
          () => {
            // Dialog cancel callback
          }
        );
      }
    } catch (error) {
      console.error('Error deleting submenu:', error);
      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `SubMenu Deletion failed`,
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
  }, [startLoading, stopLoading, setFormAction, getTableData, openDialog]);

  /**
   * Initiates the process to delete a submenu.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const handleDelete = useCallback((selectedRow) => {
    if (permissionLevels?.delete)
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete this submenu "${selectedRow.NAME}"?`,
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
  }, [permissionLevels, removeDataFromTable, openDialog]);

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
              SubMenu
            </Typography>
          </Header>
          <SubMenuFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            menuList={menuLists}
          />
        </Container>
      )}

      <SecondContainer>
        <SubHeader>
          <Typography variant="h6">
            <b>SubMenus List</b>
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
              Add SubMenu
            </FormButton>
          </Box>
        </SubHeader>
        {permissionLevels?.view ? (
          <DataTable
            tableData={tableData}
            handleUpdateLogic={handleUpdateLogic}
            handleDelete={handleDelete}
            columns={tableColumns}
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
