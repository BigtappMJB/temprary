import { Box, Paper, styled, Typography } from "@mui/material";
import UserFormComponent from "../components/userFormComponent";
import { useState } from "react";

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

const UsersPage = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [formAction, setFormAction] = useState({
    display: false,
    action: 'update',
  });

  const onformSubmit = () => {};

  const onFormReset = () => {};

  return (
    <>
      <Container>
        <Header>
          <Typography variant="h6">
            {formAction.action === "add"
              ? "Add"
              : formAction.action === "update"
              ? "Update"
              : "Read "}
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
    </>
  );
};

export default UsersPage;
