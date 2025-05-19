import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import ProjectCreationForm from "./components/activityCodeForm";
import DataTable from "../user-management/users/components/DataTable";

import { useLoading } from "../../components/Loading/loadingProvider";
import { useDialog } from "../utilities/alerts/DialogContent";
import {
  generateCSV,
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
  timeStampFileName,
} from "../utilities/generals";
import TableErrorDisplay from "../../components/tableErrorDisplay/TableErrorDisplay";
import {
  getActivityCodeController,
  projectCreationController,
  projectDeleteController,
  projectUpdateController,
} from "./controllers/activityCodeControllers";
import { useOutletContext } from "react-router";
// Mock controllers to replace the removed ones
const getprojectPhasesController = async () => {
  console.log('Using mock project phases controller');
  return [
    { PHASE_CODE: 'PH001', PHASE_NAME: 'Planning' },
    { PHASE_CODE: 'PH002', PHASE_NAME: 'Development' },
    { PHASE_CODE: 'PH003', PHASE_NAME: 'Testing' },
    { PHASE_CODE: 'PH004', PHASE_NAME: 'Deployment' }
  ];
};

const getprojectRolesController = async () => {
  console.log('Using mock project roles controller');
  return [
    { PROJECT_ROLE_ID: 'PR001', PROJECT_ROLE_NAME: 'Developer' },
    { PROJECT_ROLE_ID: 'PR002', PROJECT_ROLE_NAME: 'Designer' },
    { PROJECT_ROLE_ID: 'PR003', PROJECT_ROLE_NAME: 'Tester' },
    { PROJECT_ROLE_ID: 'PR004', PROJECT_ROLE_NAME: 'Project Manager' }
  ];
};

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
 * ActivityCodePage component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <ActivityCodePage />
 * )
 */
const ActivityCodePage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [projectPhase, setProjectPhase] = useState([]);
  const [projectRole, setProjectRole] = useState([]);
  const formRef = useRef();

  const { startLoading, stopLoading } = useLoading();

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

  // Fetches user data and updates the table
  const getTableData = async () => {
    try {
      startLoading();
      const response = await getActivityCodeController();
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
  const getProjectPhase = async () => {
    try {
      startLoading();
      const response = await getprojectPhasesController();
      setProjectPhase(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setProjectPhase([]);
      }
    } finally {
      stopLoading();
    }
  };

  // Fetches user data and updates the table
  const getProjectRole = async () => {
    try {
      startLoading();
      const response = await getprojectRolesController();
      setProjectRole(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setProjectRole([]);
      }
    } finally {
      stopLoading();
    }
  };
  const { reduxStore } = useOutletContext() || [];
  const menuList = reduxStore?.menuDetails || [];

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
      getProjectPhase();
      getTableData();
      getProjectRole();
      hasFetchedRoles.current = true;
    }
  }, [menuList]);

  const columns = {
    PHASE_NAME: "Phase",
    PROJECT_ROLE_NAME: "Role",
    ACTIVITY_CODE: "Activity Name",
  };

  /**
   * Initiates the process to add a new user.
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
   * Handles form submission for adding or updating a user.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
    const isAdd = formAction.action === "add";
    try {
      startLoading();

      // Prepare the form data for add or update
      const updatedFormData = isAdd
        ? formData
        : {
            ...formData,
            ID: selectedValue.ACTIVITY_CODE,
          };

      // Make the appropriate API call
      const response = isAdd
        ? await projectCreationController(updatedFormData)
        : await projectUpdateController(updatedFormData);

      // Handle success and error cases
      handleResponse(response, isAdd);
    } catch (error) {
      handleError(error, isAdd);
    } finally {
      stopLoading();
    }
  };

  // Helper function to handle API response
  const handleResponse = (response, isAdd) => {
    const actionType = isAdd ? "Addition" : "Updation";

    // If the response contains a message (success)
    if (response.message) {
      processSuccessResponse(response.message, actionType, isAdd);
    }

    // If the response contains an error (failure)
    if (response.error) {
      processErrorResponse(response.error, actionType, isAdd);
    }
  };

  // Process successful response
  const processSuccessResponse = (message, actionType, isAdd) => {
    getTableData();
    formRef.current.resetForm();
    if (!isAdd) {
      onFormReset();
    }
    openDialog(
      "success",
      `Activity Code ${actionType} Success`,
      message ||
        `Activity Code has been ${actionType.toLowerCase()} successfully`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      }
    );
  };

  // Process error response
  const processErrorResponse = (error, actionType, isAdd) => {
    getTableData();
    formRef.current.resetForm();
    if (!isAdd) {
      onFormReset();
    }
    openDialog(
      "error",
      `Activity Code ${actionType} Failed`,
      error || `Activity Code ${actionType.toLowerCase()} Failed`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      }
    );
  };

  // Helper function to handle errors
  const handleError = (error, isAdd) => {
    const actionType = isAdd ? "Addition" : "Updation";
    openDialog(
      "warning",
      "Warning",
      error.errorMessage || `Activity Code ${actionType} failed`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
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

  /**
   * Initiates the process to delete a user.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleDelete = (selectedRow) => {
    if (permissionLevels?.delete)
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete this value?`,
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

      const response = await projectDeleteController(selectedRow.ACTIVITY_CODE);
      console.log(response);

      if (response) {
        getTableData();
        openDialog(
          "success",
          `Activity Code Deletion Success`,
          response.message || `Activity Code has been deleted successfully  `,
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
        error.errorMessage || `Activity Code Deletion failed`,
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

  const handleExport = () => {
    const columnOrder = [
      "PHASE_CODE",
      "PHASE_NAME",
      "PROJECT_ROLE_ID",
      "PROJECT_ROLE_NAME",
      "ACTIVITY_CODE",
    ];
    generateCSV(
      tableData,
      `activity_code_${timeStampFileName(new Date())}`,
      columnOrder
    );
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
              Activity Code
            </Typography>
          </Header>
          <ProjectCreationForm
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            ref={(el) => (formRef.current = el)}
            projectPhase={projectPhase}
            projectRole={projectRole}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Activity Code List</b>
          </Typography>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
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
              Add Activity Code
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

export default ActivityCodePage;
