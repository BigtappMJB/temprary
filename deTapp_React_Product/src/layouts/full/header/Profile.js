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
import { useDispatch } from "react-redux";
import { resetStore } from "../../../redux/slices/slice";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const email = decodeData(getCookie(isUserIdCookieName));
  const dispatch = useDispatch();

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
      localStorage.clear();
      dispatch(resetStore());
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box 
        sx={{ 
          display: { xs: 'none', sm: 'block' },
          color: 'white',
          fontSize: '0.875rem',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {email}
      </Box>
      <IconButton
        size="large"
        aria-label="user profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{ 
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
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
        <MenuItem sx={{ pointerEvents: 'none', opacity: 0.7 }}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText primary={email} />
        </MenuItem>
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', my: 1 }} />
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText primary="My Account" />
        </MenuItem>
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', mt: 1 }}>
          <MenuItem onClick={handleLogOut} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <IconUser width={20} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
