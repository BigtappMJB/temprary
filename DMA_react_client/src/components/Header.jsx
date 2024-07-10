// src/Header.js

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";

/**
 * Styled AppBar component with a custom background color.
 */
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff", // Use exact color from the design
}));

/**
 * Styled Toolbar component with a custom display and justification.
 */
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

/**
 * Styled Typography component for the title with custom font styles.
 */
const Title = styled(Typography)(({ theme }) => ({
  color: "#000000", // Use exact color from the design
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem", // Reduce font size for mobile devices
  },
}));

/**
 * Styled div component for user information with custom display and padding.
 */
const UserInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // backgroundColor: '#f5f5f5', // Light background color
  borderRadius: "8px",
  padding: "8px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    padding: "4px", // Reduce padding for mobile devices
  },
}));

/**
 * Styled div component for user text with custom margin and text alignment.
 */
const UserText = styled("div")(({ theme }) => ({
  marginLeft: "8px",
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    display: "none", // Hide text on mobile devices
  },
}));

/**
 * Styled div component for mobile user text with custom margin and text alignment.
 */
const MobileUserText = styled("div")(({ theme }) => ({
  marginLeft: "8px",
  textAlign: "left",
}));

/**
 * Styled Typography component for user name with custom font styles.
 */
const UserName = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "bold",
  color: "#000000",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px", // Reduce font size for mobile devices
  },
}));

/**
 * Styled Typography component for user ID with custom font styles.
 */
const UserID = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  color: "#888888",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px", // Reduce font size for mobile devices
  },
}));

/**
 * Header component that renders a navigation bar with a hamburger menu, title, and user information.
 *
 * @param {function} handleDrawerToggle - Function to handle drawer toggle
 * @returns {React.ReactElement} - Header component
 */
function Header({ open, handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Handles menu open event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - Menu open event
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles menu close event.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {/* Hamburger Menu Button */}

        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          disabled={open}
        >
          {!open && <MenuIcon style={{ color: "black" }} />}
        </IconButton>

        <Title variant="h6">NBF CAD&CMD</Title>
        <UserInfo onClick={handleMenuOpen}>
          <Avatar />
          <UserText>
            <UserName>Chandra Shekar</UserName>
            <UserID>ID: 1234567890</UserID>
          </UserText>
          <IconButton edge="end" color="inherit">
            <i className="fas fa-chevron-down"></i>
          </IconButton>
        </UserInfo>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          fullWidth
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          style={{ textAlign: "right" }}
        >
          {isMobile && (
            <MenuItem style={{ pointerEvents: "none", cursor: "default" }}>
              <MobileUserText>
                <UserName>Chandra Shekar</UserName>
                <UserID>ID: 1234567890</UserID>
              </MobileUserText>
            </MenuItem>
          )}
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Header;
