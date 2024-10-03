import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import ProjectCreationForm from "./components/activityCodeForm";
import DataTable from "../user-management/users/components/DataTable";

import { useSelector } from "react-redux";

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
import { getprojectTypesController } from "../projectTypes/controllers/projectTypesControllers";
import { getprojectPhasesController } from "../projectPhase/controllers/projectPhaseControllers";
import { getprojectRolesController } from "../projectRole/controllers/projectRoleControllers";

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
    try {
      startLoading();
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await projectCreationController(formData);
      else {
        formData = {
          ...formData,
          ID: selectedValue.ACTIVITY_CODE,
        };
        response = await projectUpdateController(formData);
      }

      if (response.message) {
        getTableData();
        formRef.current.resetForm();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `Activity Code ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Activity Code has been ${
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
      if (response.error) {
        getTableData();
        formRef.current.resetForm();
        if (!isAdd) {
          onFormReset();
        }
        openDialog(
          "success",
          `Activity Code ${isAdd ? "Addition" : "Updation"} Failed`,
          response.error ||
            `Activity Code  ${isAdd ? "addded" : "updated"} Failed`,
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
      console.error(error);
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        error.errorMessage ||
          `Activity Code ${isAdd ? "Addition" : "Updation"} failed`,
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
      
      const response = await projectDeleteController(
        selectedRow.ACTIVITY_CODE
      );
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
