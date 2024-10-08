import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import ProjectEstimateFormComponent from "./components/projectEstimationForm";
import DataTable from "../user-management/users/components/DataTable";

import {
  projectEstimateCreationController,
  getProjectEstimationControllers,
  getProjectPhaseControllers,
  getProjectRoleControllers,
  projectEstimateDeletionController,
  projectEstimateUpdateController,
} from "./controllers/projectEstimationController";
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
import { getProjectController } from "../projectCreation/controllers/projectCreatioControllers";
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
 * ProjectEstimationPage component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <ProjectEstimationPage />
 * )
 */
const ProjectEstimationPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);

  const [project, setProject] = useState([]);
  const [role, setRole] = useState([]);
  const [phase, setPhase] = useState([]);

  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef({});
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const [filtertedTableData, setFiltertedTableData] = useState([]);

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
      const response = await getProjectEstimationControllers();
      setFiltertedTableData(response);
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

  const getProjectData = async () => {
    try {
      startLoading();
      const response = await getProjectController();
      // console.log({response});
      setProject(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        return;
      }
    } finally {
      stopLoading();
    }
  };

  const getProjectRole = async () => {
    try {
      startLoading();
      const response = await getProjectRoleControllers();
      setRole(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        return;
      }
    } finally {
      stopLoading();
    }
  };

  const getProjectPhase = async () => {
    try {
      startLoading();
      const response = await getProjectPhaseControllers();
      setPhase(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        return;
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
      getProjectData();
      getProjectPhase();
      getProjectRole();
      getTableData();

      hasFetchedRoles.current = true;
    }
  }, [menuList]);

  const columns = {
    // USER_ID: "Username",
    PROJECT_NAME: "Project",
    PHASE_NAME: "Phase",
    PROJECT_ROLE_NAME: "Role",
    ACTIVITY_CODE: "Activity Code",
    START_DATE: "Start Date",
    END_DATE: "End Date",
    No_of_working_days: "Working Days",
    NO_OF_HOURS_PER_DAY: "Hours/Day",
    TOTAL_HOURS: "Total Hours",
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
    try {
      startLoading();
      const isAdd = formAction.action === "add";

      // Handle form submission
      const response = await handleFormSubmission(formData, isAdd);

      if (response?.message) {
        handleSuccessResponse(response.message, isAdd);
      } else {
        handleWarningResponse(response?.error, isAdd);
      }
    } catch (error) {
      const isAdd = formAction.action === "add";
      handleErrorResponse(error, isAdd);
    } finally {
      stopLoading();
    }
  };

  // Helper function to handle form submission logic
  const handleFormSubmission = async (formData, isAdd) => {
    if (isAdd) {
      return await projectEstimateCreationController(formData);
    } else {
      const updatedFormData = {
        ...formData,
        ID: selectedValue.ESTIMATE_ID,
      };
      return await projectEstimateUpdateController(updatedFormData);
    }
  };

  // Helper function to handle success response
  const handleSuccessResponse = (message, isAdd) => {
    getTableData();
    formRef.current?.resetForm();

    if (!isAdd) {
      onFormReset();
    }

    openDialog(
      "success",
      `Project Estimation ${isAdd ? "Addition" : "Updation"} Success`,
      message ||
        `Project Estimation has been ${
          isAdd ? "added" : "updated"
        } successfully`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      },
      (confirmed) => {}
    );
  };

  // Helper function to handle warning response
  const handleWarningResponse = (error, isAdd) => {
    openDialog(
      "warning",
      `Project Estimation ${isAdd ? "Addition" : "Updation"} Failed`,
      error || `Project Estimation ${isAdd ? "Addition" : "Updation"} failed`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      },
      (confirmed) => {}
    );
  };

  // Helper function to handle error responses
  const handleErrorResponse = (error, isAdd) => {
    console.error(error);
    openDialog(
      "warning",
      `Project Estimation ${isAdd ? "Addition" : "Updation"} Failed`,
      error?.errorMessage ||
        `Project Estimation ${isAdd ? "Addition" : "Updation"} failed`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      },
      (confirmed) => {}
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
      const response = await projectEstimateDeletionController(
        selectedRow.ESTIMATE_ID
      );

      if (response) {
        getTableData();
        openDialog(
          "success",
          `Project Estimation Deletion Success`,
          response.message ||
            `Project Estimation has been deleted successfully  `,
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
      openDialog(
        "warning",
        "Warning",
        `Project Estimation Deletion failed`,
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

  const sendUpdatedPaginatedData = (tableData) => {
    setFiltertedTableData(tableData);
  };

  const handleExport = () => {
    const columnOrder = [
      "ESTIMATE_ID",
      "PROJECT_NAME_CODE",
      "PROJECT_NAME",
      "PROJECT_PHASE_CODE",
      "PHASE_NAME",
      "PROJECT_ROLE_ID",
      "PROJECT_ROLE_NAME",
      "ACTIVITY_CODE",
      "START_DATE",
      "END_DATE",
      "No_of_working_days",
      "NO_OF_HOURS_PER_DAY",
      "TOTAL_HOURS",
    ];

    generateCSV(
      filtertedTableData,
      `project_estimation_${timeStampFileName(new Date())}`,
      columnOrder
    );
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
              {getActionText()} Project Estimation
            </Typography>
          </Header>
          <ProjectEstimateFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            projectList={project}
            roleList={role}
            phaseList={phase}
            ref={(el) => (formRef.current = el)}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Project Estimation</b>
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
              Add Estimation
            </FormButton>
            <FormButton
              type="button"
              onClick={handleExport}
              variant="contained"
              disabled={filtertedTableData.length === 0}
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
            sendUpdatedPaginatedData={sendUpdatedPaginatedData}
            permissionLevels={permissionLevels}
          />
        ) : (
          <TableErrorDisplay />
        )}
      </SecondContainer>
    </>
  );
};

export default ProjectEstimationPage;
