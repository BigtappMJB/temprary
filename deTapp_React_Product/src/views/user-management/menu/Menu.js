import { Box, Tooltip, Typography } from "@mui/material";
import { useEffect, useCallback, useState, useRef } from "react";
import { useDialog } from "../../utilities/alerts/DialogContent";
import RoleFormComponent from "./components/MenuFormComponent";
import DataTable from "../users/components/DataTable";
import {
  getMenusController,
  menuCreationController,
  menuDeleteController,
  menuUpdateController,
} from "./controllers/MenuControllers";
import { useLoading } from "../../../components/Loading/loadingProvider";
import {
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
} from "../../utilities/generals";
import TableErrorDisplay from "../../../components/tableErrorDisplay/TableErrorDisplay";
import { useOutletContext } from "react-router";
import { Container, SecondContainer, Header, SubHeader, FormButton } from './styles';

/**
 * Menus component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <Menus />
 * )
 */
const Menus = () => {
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

  const getRoles = useCallback(async () => {
    try {
      startLoading();
      const response = await getMenusController();
      setTableData(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setTableData([]);
      }
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setTableData]);

  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || []; // Fetches roles data and updates the roles list
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
    if (!hasFetchedRoles.current) {
      getRoles();
      hasFetchedRoles.current = true;
    }
  }, [startLoading, stopLoading]);
  const columns = [
    { 
      field: 'NAME', 
      title: 'Menu Name',
      sortable: true
    },
    { 
      field: 'DESCRIPTION', 
      title: 'Description',
      sortable: true
    }
  ];

  /**
   * Initiates the process to add a new user.
   */
  const addRoles = useCallback(() => {
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
   * Handles form submission for adding or updating a user.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = useCallback(async (formData) => {
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await menuCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await menuUpdateController(formData);
      }

      if (response) {
        getRoles();
        if (!isAdd) {
          setFormAction({
            display: false,
            action: null,
          });
        }
        openDialog(
          "success",
          `Menu ${isAdd ? "Creation" : "Update"} Success`,
          response.message || `Menu has been ${isAdd ? "created" : "updated"} successfully  `,
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
            // getRoles();
          },
          () => {
            getRoles();
          }
        );
      }
    } catch (error) {
      console.error(error);
      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `Menu ${formAction.action === "add" ? "Creation" : "Update"} failed`,
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
  }, [startLoading, stopLoading, formAction, selectedValue, getRoles, setFormAction, openDialog]);

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
   * Initiates the process to update a user's information.
   * @param {Object} selectedRow - The selected user's data.
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
   * Initiates the process to delete a user.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleDelete = useCallback((selectedRow) => {
    if (permissionLevels?.delete) {
      openDialog(
        "warning",
        "Warning",
        "Are you sure you want to delete this Menu?",
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
  }, [permissionLevels, openDialog, removeDataFromTable]);

  /**
   * Removes a user from the table after confirming deletion.
   * @param {Object} selectedRow - The selected user's data.
   */
  const removeDataFromTable = useCallback(async (selectedRow) => {
    try {
      startLoading();
      setFormAction({
        display: false,
        action: null,
      });
      const response = await menuDeleteController(selectedRow.ID);

      if (response) {
        getRoles();

        openDialog(
          "success",
          `Menu Deletion Success`,
          response.message || `Menu has been deleted successfully  `,
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
            // getRoles();
          },
          () => {
            getRoles();
          }
        );
      }
    } catch (error) {
      console.error(error);
      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `Menu Deletion failed`,
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
  }, [startLoading, stopLoading, setFormAction, getRoles, openDialog]);

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
              Menu
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

      <SecondContainer>
        <SubHeader>
          <Typography variant="h6">
            <b>Menus List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Tooltip
              title={permissionLevels?.create ? "" : "Access denied"}
              arrow
            >
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
                Add Menu
              </FormButton>
            </Tooltip>
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

export default Menus;
