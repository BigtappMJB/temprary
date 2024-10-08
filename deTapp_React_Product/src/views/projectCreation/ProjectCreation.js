import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import ProjectCreationForm from "./components/projectCreationForm";
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
  getClientInfoController,
  getProjectController,
  projectCreationController,
  projectDeleteController,
  projectUpdateController,
} from "./controllers/projectCreatioControllers";
import { useOutletContext } from "react-router";
import { getprojectTypesController } from "../projectTypes/controllers/projectTypesControllers";

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
 * CMDPage component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <CMDPage />
 * )
 */
const CMDPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [projectType, setProjectTypeData] = useState([]);
  const [clientInfo, setClientInfo] = useState([]);
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
      const response = await getProjectController();
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
  const getProjectTypeData = async () => {
    try {
      startLoading();
      const response = await getprojectTypesController();
      setProjectTypeData(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setProjectTypeData([]);
      }
    } finally {
      stopLoading();
    }
  };

  // Fetches user data and updates the table
  const getClientInfo = async () => {
    try {
      startLoading();
      const response = await getClientInfoController();
      setClientInfo(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        setClientInfo([]);
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
      getProjectTypeData();
      getTableData();
      getClientInfo();
      hasFetchedRoles.current = true;
    }
  }, [menuList]);

  const columns = {
    CLIENT_NAME: "Client",
    PROJECT_TYPE_NAME: "Project Type",
    PROJECT_NAME_CODE: "Project Code",
    PROJECT_NAME: "Project Name",
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

      // Process the response
      processResponse(response, isAdd);
    } catch (error) {
      const isAdd = formAction.action === "add";
      handleErrorResponse(error, isAdd);
    } finally {
      stopLoading();
    }
  };

  // Helper function to handle form submission
  const handleFormSubmission = async (formData, isAdd) => {
    if (isAdd) {
      return await projectCreationController(formData);
    } else {
      const updatedFormData = {
        ...formData,
        ID: selectedValue.PROJECT_NAME_CODE,
      };
      return await projectUpdateController(updatedFormData);
    }
  };

  // Helper function to process the response
  const processResponse = (response, isAdd) => {
    if (response.message) {
      handleSuccessResponse(response.message, isAdd);
    } else if (response.error) {
      handleErrorResponse(response.error, isAdd);
    }
  };

  // Helper function for success response handling
  const handleSuccessResponse = (message, isAdd) => {
    getTableData();
    formRef.current?.resetForm();

    if (!isAdd) {
      onFormReset();
    }

    openDialog(
      "success",
      `Project ${isAdd ? "Addition" : "Updation"} Success`,
      message || `Project has been ${isAdd ? "added" : "updated"} successfully`,
      {
        confirm: { name: "Ok", isNeed: true },
        cancel: { name: "Cancel", isNeed: false },
      },
      (confirmed) => {}
    );
  };

  // Helper function for error response handling
  const handleErrorResponse = (error, isAdd) => {
    getTableData();
    formRef.current?.resetForm();

    if (!isAdd) {
      onFormReset();
    }

    openDialog(
      "warning",
      `Project ${isAdd ? "Addition" : "Updation"} Failed`,
      error?.errorMessage ||
        `Project ${isAdd ? "Addition" : "Updation"} failed`,
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

      const response = await projectDeleteController(
        selectedRow.PROJECT_NAME_CODE
      );
      console.log(response);

      if (response) {
        getTableData();
        openDialog(
          "success",
          `Project Deletion Success`,
          response.message || `Project has been deleted successfully  `,
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
        error.errorMessage || `Project Deletion failed`,
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
      "PROJECT_NAME_CODE",
      "PROJECT_NAME",
      "CLIENT_ID",
      "CLIENT_NAME",
      "PROJECT_TYPE_CODE",
      "PROJECT_TYPE_NAME",
    ];
    generateCSV(
      tableData,
      `project_creation_${timeStampFileName(new Date())}`,
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
            <Typography variant="h6">{getActionText()} Project</Typography>
          </Header>
          <ProjectCreationForm
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            ref={(el) => (formRef.current = el)}
            projectType={projectType}
            clientInfo={clientInfo}
          />
        </Container>
      )}

      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Project List</b>
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
              Add Project
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

export default CMDPage;
