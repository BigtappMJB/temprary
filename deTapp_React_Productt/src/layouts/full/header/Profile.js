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

import { IconUser, IconUserCircle, IconSettings, IconLogout } from "@tabler/icons-react";
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title="Account settings">
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            cursor: 'pointer',
            borderRadius: 2,
            p: '6px 12px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
          onClick={handleClick2}
        >
          <Box 
            sx={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              backgroundColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {/* Display first letter of email as avatar */}
            {email ? email.charAt(0).toUpperCase() : 'U'}
          </Box>
          
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              color: 'text.primary',
              fontSize: '0.875rem',
              maxWidth: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {email ? email.split('@')[0] : 'User'}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: '-2px' }}>
              Administrator
            </Box>
          </Box>
        </Box>
      </Tooltip>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "240px",
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            mt: 1
          },
          "& .MuiMenuItem-root": {
            borderRadius: "6px",
            mx: 1,
            my: 0.5,
            px: 2
          }
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {email || 'User Account'}
          </Box>
          <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>
            Administrator
          </Box>
        </Box>
        
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', my: 1 }} />
        
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText 
            primary="My Profile" 
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <IconSettings width={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Account Settings" 
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>
        
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', my: 1 }} />
        
        <MenuItem 
          onClick={handleLogOut} 
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.dark'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <IconLogout width={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
