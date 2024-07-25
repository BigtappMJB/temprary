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
  Tooltip,
} from "@mui/material";

import { IconUser, IconUserCircle } from "@tabler/icons-react";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { loginOutController } from "../../../views/authentication/login/controllers/loginController";
import {
  clearCookies,
  getCookie,
} from "../../../views/utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../../../views/utilities/generals";
import { decodeData } from "../../../views/utilities/securities/encodeDecode";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const email = decodeData(getCookie(isUserIdCookieName));

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
      <Tooltip arrow title={email}>
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
      </Tooltip>

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
        {/* <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>{email}</ListItemText>
        </MenuItem> */}
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
