import { Box, Button, Paper, styled, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import { useLoginProvider } from "../../authentication/provider/LoginProvider";
import TableErrorDisplay from "../../../components/tableErrorDisplay/TableErrorDisplay";

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

  const getRoles = async () => {
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

      setPermissionLevels({
        create: permissionList.includes("create"),
        edit: permissionList.includes("edit"),
        view: permissionList.includes("view"),
        delete: permissionList.includes("delete"),
      });

      getRoles();
      hasFetchedRoles.current = true;
    }
  }, []);
  const columns = {
    NAME: "Menu",
    DESCRIPTION: "Description",
  };

  /**
   * Initiates the process to add a new user.
   */
  const addRoles = () => {
    if (permissionLevels.create)
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
      if (isAdd) response = await menuCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await menuUpdateController(formData);
      }

      if (response) {
        openDialog(
          "success",
          `Menu ${isAdd ? "Addition" : "Updation"} Success`,
          response.message ||
            `Menu has been ${isAdd ? "addded" : "updated"} successfully`,

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
            getRoles();
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
        `Menu ${isAdd ? "Addition" : "Updation"} failed`,
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
    if (permissionLevels.edit) {
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
    if (permissionLevels.delete) {
      openDialog(
        "warning",
        `Delete confirmation`,
        `Are you sure you want to delete this menu "${selectedRow.NAME}"?`,
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
      const response = await menuDeleteController(selectedRow.ID);

      if (response) {
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
              title={permissionLevels.create ? "" : "Access denied"}
              arrow
            >
              <FormButton
                type="button"
                onClick={addRoles}
                variant="contained"
                color="primary"
                className="primary"
                style={{ marginRight: "10px" }}
                disabled={formAction.action === "add" && formAction.display}
              >
                Add Menu
              </FormButton>
            </Tooltip>
          </Box>
        </SubHeader>
        {permissionLevels.view ? (
          <DataTable
            tableData={tableData}
            handleUpdateLogic={handleUpdateLogic}
            handleDelete={handleDelete}
            columns={columns}
          />
        ) : (
          <TableErrorDisplay />
        )}
      </SecondContainer>
    </>
  );
};

export default Menus;
