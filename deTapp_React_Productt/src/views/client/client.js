import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  getRolesController,
  clientCreationController,
  clientupdateController,
  clientdeleteController,
} from "./controllers/clientControllers";
import FormComponent from "./components/clientFormComponent";

import TableErrorDisplay from "../../components/tableErrorDisplay/TableErrorDisplay";
import { useOutletContext } from "react-router";
import {
  generateCSV,
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
  timeStampFileName,
} from "../utilities/generals";
import { useLoading } from "../../components/Loading/loadingProvider";
import { useDialog } from "../utilities/alerts/DialogContent";
import DataTable from "../user-management/users/components/DataTable";

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
  const formRef = useRef();

  const { openDialog } = useDialog();
  const { startLoading, stopLoading } = useLoading();
  const hasFetchedRoles = useRef(false);
  const getRoles = async () => {
    try {
      startLoading();
      const response = await getRolesController();
      setTableData(response);
      //
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setTableData([]);
      }
    } finally {
      stopLoading();
    }
  };

  // Fetches clients data and updates the clients list
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
  }, [menuList]);

  const columns = {
    name: "Client",
    // description: "Description",
  };

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
      const isAdd = formAction.action === "add";
      const response = await handleFormSubmit(formData, isAdd);

      if (response?.message) {
        processSuccess(response.message, isAdd);
      }

      if (response?.error) {
        processError(response.error, isAdd);
      }
    } catch (error) {
      const isAdd = formAction.action === "add";

      handleFormError(error, isAdd);
    } finally {
      stopLoading();
    }
  };

  // Helper function to handle form submission logic
  const handleFormSubmit = async (formData, isAdd) => {
    if (isAdd) {
      return await clientCreationController(formData);
    } else {
      const updatedFormData = { ...formData, ID: selectedValue.id };
      return await clientupdateController(updatedFormData);
    }
  };

  // Helper function to handle successful form submission
  const processSuccess = (message, isAdd) => {
    getRoles();
    formRef.current.resetForm();
    if (!isAdd) {
      onFormReset();
    }
    openDialog(
      "success",
      `Client ${isAdd ? "Addition" : "Updation"} Success`,
      message || `Client has been ${isAdd ? "added" : "updated"} successfully`,
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

  // Helper function to handle form submission error
  const processError = (error, isAdd) => {
    openDialog(
      "error",
      `Client ${isAdd ? "Addition" : "Updation"} Failed`,
      error || `Client ${isAdd ? "added" : "updated"} failed`,
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

  // Helper function to handle errors during form submission
  const handleFormError = (error, isAdd) => {
    openDialog(
      "warning",
      "Warning",
      error?.errorMessage || `Client ${isAdd ? "Addition" : "Updation"} failed`,
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
        if (confirmed) return;
      }
    );
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

  const handleExport = () => {
    const columnOrder = ["id", "name"];
    generateCSV(
      tableData,
      `client_${timeStampFileName(new Date())}`,
      columnOrder
    );
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
        `Are you sure you want to delete this value "${selectedRow.name}"?`,
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
      const response = await clientdeleteController(selectedRow.id);

      if (response) {
        getRoles();

        openDialog(
          "success",
          `Client Deletion Success`,
          response.message || `Client has been deleted successfully  `,

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
        error.errorMessage || `Client Deletion failed`,
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
            <Typography variant="h6">{getActionText()} Client</Typography>
          </Header>
          <FormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            ref={(el) => (formRef.current = el)}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Clients List</b>
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
              Add Client
            </FormButton>
            <FormButton
              type="button"
              onClick={handleExport}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              className={`${
                tableData.length ? "secondary" : "custom-disabled"
              }`}
            >
              Export
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
