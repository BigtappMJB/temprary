import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  getprojectTypesController,
  projectTypesCreationController,
  projectTypesupdateController,
  projectTypesdeleteController,
} from "./controllers/projectTypesControllers";
import FormComponent from "./components/projectTypesComponent";

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
import { errorMessages } from "../utilities/Validators";

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
      const response = await getprojectTypesController();
      setTableData(response);
      // debugger;
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
    id: "Project Type Code",
    name: "Project Type",
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

  const handleExport = () => {
    const columnOrder = ["id", "name"];
    generateCSV(
      tableData,
      `projectTypes_${timeStampFileName(new Date())}`,
      columnOrder
    );
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
      if (isAdd) response = await projectTypesCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.id };
        response = await projectTypesupdateController(formData);
      }

      if (response.message) {
        getRoles();
        formRef.current.resetForm();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `Project Type ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Project Type has been ${
              isAdd ? "addded" : "updated"
            } successfully  `,
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
      if (response.error) {
        openDialog(
          "success",
          `Project Type ${isAdd ? "Addition" : "Updation"} Failed`,
          response.error ||
            `Project Type ${isAdd ? "addded" : "updated"} Failed `,
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
        error?.errorMessages ||
          `Project Type ${isAdd ? "Addition" : "Updation"} failed`,
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

      const response = await projectTypesdeleteController(selectedRow.id);
      debugger;
      if (response) {
        getRoles();

        openDialog(
          "success",
          `Project Type Deletion Success`,
          response.message || `Project Type has been deleted successfully  `,

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
      console.error(error);

      openDialog(
        "warning",
        "Warning",
        error.errorMessage || `Project Type Deletion failed`,
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
              Project Type
            </Typography>
          </Header>
          <FormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            ref={(el) => (formRef.current = el)}
            onSubmit={onformSubmit}
            onReset={onFormReset}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Project Types List</b>
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
              Add Project Type
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
