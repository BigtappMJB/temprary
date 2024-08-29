import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import DynamicFormCreationFormComponent from "./components/dynamicPageCreationForm";
import DataTable from "../user-management/users/components/DataTable";

import { useLoading } from "../../components/Loading/loadingProvider";
import { useDialog } from "../utilities/alerts/DialogContent";
import { useLoginProvider } from "../authentication/provider/LoginProvider";
import {
  generateCSV,
  getCurrentPathName,
  getSubmenuDetails,
  ScrollToTopButton,
  timeStampFileName,
} from "../utilities/generals";
import TableErrorDisplay from "../../components/tableErrorDisplay/TableErrorDisplay";
import {
  createReactFormController,
  getInputFieldController,
  getTableListDataController,
} from "../dynamicPageCreation/controllers/dynamicPageCreationController";

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
 * DynamicPageCreation component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <DynamicPageCreation />
 * )
 */
const DynamicPageCreation = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);

  const [tableList, setTableList] = useState([]);
  const [inputFieldList, setInputField] = useState([]);

  const { startLoading, stopLoading } = useLoading();

  const [formAction, setFormAction] = useState({
    display: true,
    action: "add",
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
  //   const getTableData = async () => {
  //     try {
  //       startLoading();
  //       const response = await getProjectEstimationControllers();
  //       setTableData(response);
  //     } catch (error) {
  //       console.error(error);
  //       if (error.statusCode === 404) {
  //         setTableData([]);
  //       }
  //     } finally {
  //       stopLoading();
  //     }
  //   };

  const getInputFieldList = async () => {
    try {
      startLoading();
      const response = await getInputFieldController();
      // console.log({response});
      setInputField(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        return;
      }
    } finally {
      stopLoading();
    }
  };

  const getTableListData = async () => {
    try {
      startLoading();
      const response = await getTableListDataController();
      // console.log({response});
      setTableList(response);
    } catch (error) {
      console.error(error);
      if (error.statusCode === 404) {
        return;
      }
    } finally {
      stopLoading();
    }
  };
  const { menuList } = useLoginProvider();

  // Fetches roles data and updates the roles list
  useEffect(() => {
    if (!hasFetchedRoles.current) {
      const submenuDetails = getSubmenuDetails(
        menuList,
        getCurrentPathName(),
        "path"
      );
      const permissionList = submenuDetails?.permission_level
        .split(",")
        .map((ele) => ele.trim().toLowerCase());

      //   setPermissionLevels({
      //     create: permissionList?.includes("create"),
      //     edit: permissionList?.includes("edit"),
      //     view: permissionList?.includes("view"),
      //     delete: permissionList?.includes("delete"),
      //   });
      setPermissionLevels({
        create: true,
        edit: true,
        view: true,
        delete: true,
      });
      getTableListData();
      getInputFieldList();
      //   getTableData();
      hasFetchedRoles.current = true;
    }
  }, []);

  const columns = {
    // USER_ID: "Username",
    target: "Target",
    sub_target: "Sub Target",
    incorporation_city: "Incorporation City",
    sector_classification: "Sector Classification",
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
      if (isAdd) response = await createReactFormController(formData);
      else {
        formData = {
          ...formData,
          ID: selectedValue.id,
        };
        // response = await cmdupdateController(formData);
      }

      if (response) {
        openDialog(
          "success",
          `CMD ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `CMD has been ${isAdd ? "addded" : "updated"} successfully`,
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
            if (!isAdd) {
              onFormReset();
            }
          }
        );
      }
    } catch (error) {
      console.error(error);
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        `CMD ${isAdd ? "Addition" : "Updation"} failed`,
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
            // removeDataFromTable(selectedRow);
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
  //   const removeDataFromTable = async (selectedRow) => {
  //     try {
  //       startLoading();
  //       setFormAction({
  //         display: false,
  //         action: null,
  //       });
  //       const response = await cmddeleteController(selectedRow.id);

  //       if (response) {
  //         openDialog(
  //           "success",
  //           `CMD Deletion Success`,
  //           response.message || `CMD has been deleted successfully  `,
  //           {
  //             confirm: {
  //               name: "Ok",
  //               isNeed: true,
  //             },
  //             cancel: {
  //               name: "Cancel",
  //               isNeed: false,
  //             },
  //           },
  //           (confirmed) => {
  //             confirmed && getTableData();
  //           },
  //           () => {
  //             getTableData();
  //           }
  //         );
  //       }
  //     } catch (error) {
  //       openDialog(
  //         "warning",
  //         "Warning",
  //         `CMD Deletion failed`,
  //         {
  //           confirm: {
  //             name: "Ok",
  //             isNeed: true,
  //           },
  //           cancel: {
  //             name: "Cancel",
  //             isNeed: false,
  //           },
  //         },
  //         (confirmed) => {
  //           if (confirmed) {
  //             return;
  //           }
  //         }
  //       );
  //     } finally {
  //       stopLoading();
  //     }
  //   };

  const handleExport = () => {
    generateCSV(
      tableData,
      `central_manual_depository_${timeStampFileName(new Date())}`
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
              Page
            </Typography>
          </Header>
          <DynamicFormCreationFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            tableList={tableList}
            inputFieldList={inputFieldList}
          />
        </Container>
      )}

      {/* <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Typography variant="h6">
            <b>Page Creation</b>
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
              Add Page
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
      </SecondContainer> */}
    </>
  );
};

export default DynamicPageCreation;
