import { Box, Button, Paper, styled, Typography } from "@mui/material";
import UserFormComponent from "./components/userFormComponent";
import { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import {
  getRolesController,
  userCreationController,
  userupdateController,
} from "./controllers/usersControllers";
import { useDialog } from "../../utilities/alerts/DialogContent";

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
  // width: "80vw",
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

const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  useEffect(() => {
    const getRoles = async () => {
      const response = await getRolesController();
      // console.log(response);
    };
    getRoles()
  }, []);
  const { openDialog } = useDialog();

  const addUser = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  const onformSubmit = async (formData) => {
    try {
      console.log({ formData });
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await userCreationController(formData);
      else response = await userupdateController(formData);

      if (response) {
        openDialog(
          "success",
          `User ${isAdd ? "Addition" : "Updation"} Success`,
          response,
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
            if (!isAdd) {
              onFormReset();
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        `User ${isAdd ? "Addition" : "Updation"} failed`,
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
      return;
    }
  };

  const onFormReset = () => {
    setFormAction({
      display: false,
      action: null,
    });
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header>
            <Typography variant="h6">
              {formAction.action === "add"
                ? "Add"
                : formAction.action === "update"
                ? "Update"
                : "Read "}{" "}
              User
            </Typography>
          </Header>
          <UserFormComponent
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
            <b>Users List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addUser}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add User
            </FormButton>
          </Box>
        </SubHeader>
        {/* <DataTable /> */}
      </SecondContainer>
    </>
  );
};

export default UsersPage;
