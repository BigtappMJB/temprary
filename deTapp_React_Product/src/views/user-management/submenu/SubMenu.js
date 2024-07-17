import { Box, Button, Paper, styled, Typography } from "@mui/material";
import SubMenuFormComponent from "./components/subMenuFormComponent";
import { useEffect, useState } from "react";
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
const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [menuList, setRolesList] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });
  const { startLoading, stopLoading } = useLoading();

  const { openDialog } = useDialog();

  // Fetches submenu data and updates the table
  const getTableData = async () => {
    try {
      startLoading();
      const response = await getSubMenusController();
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

  // Fetches roles data and updates the roles list
  useEffect(() => {
    const getMenus = async () => {
      try {
        startLoading();
        const response = await getMenusController();
        setRolesList(response);
      } catch (error) {
        console.error(error);
        if (error.statusCode === 404) {
          setTableData([]);
        }
      } finally {
        stopLoading();
      }
    };
    getMenus();
    getTableData();
  }, []);

  const columns = {
    MENU_NAME: "Menu",
    NAME: "SubMenu",
    DESCRIPTION: "Description",
  };

  /**
   * Initiates the process to add a new submenu.
   */
  const addUser = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  /**
   * Handles form submission for adding or updating a submenu.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
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
        openDialog(
          "success",
          `SubMenu ${isAdd ? "Addition" : "Updation"} Success`,
          response.message,
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
            getTableData();
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
        `SubMenu ${isAdd ? "Addition" : "Updation"} failed`,
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
   * Initiates the process to update a submenu's information.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const handleUpdateLogic = (selectedRow) => {
    setSelectedValue(selectedRow);
    setFormAction({
      display: true,
      action: "update",
    });
  };

  /**
   * Initiates the process to delete a submenu.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const handleDelete = (selectedRow) => {
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
  };

  /**
   * Removes a submenu from the table after confirming deletion.
   * @param {Object} selectedRow - The selected submenu's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      startLoading();
      const response = await subMenuDeleteController(selectedRow.ID);

      if (response) {
        openDialog(
          "success",
          `SubMenu Deletion Success`,
          response.message,
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
          },
          () => {
            getTableData();
          }
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        `SubMenu Deletion failed`,
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
              SubMenu
            </Typography>
          </Header>
          <SubMenuFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
            menuList={menuList}
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
              className="primary"
              style={{ marginRight: "10px" }}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add SubMenu
            </FormButton>
          </Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
          columns={columns}
        />
      </SecondContainer>
    </>
  );
};

export default UsersPage;
