import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { IconUser, IconUserCircle } from "@tabler/icons-react";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { loginOutController } from "../../../views/authentication/login/controllers/loginController";
import { clearCookies } from "../../../views/utilities/cookieServices/cookieServices";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogOut = async () => {
    try {
      startLoading();
      // const response = await loginOutController();
      clearCookies();
      navigate("/auth/login");
      // if (response) {
      //   clearCookies();
      //   navigate("/auth/login");
      // }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
      >
        <IconUserCircle size="28" stroke="1.5" />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            to="/auth/login"
            onClick={handleLogOut}
            variant="outlined"
            color="primary"
            component={Button}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
