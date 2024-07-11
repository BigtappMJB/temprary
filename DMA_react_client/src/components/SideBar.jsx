import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Box,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { tableConfigurationPath, tableCreationPath } from "../routes/routePath";
import { useLocation } from "react-router-dom";

/**
 * Sidebar component renders a navigation drawer.
 * @param {boolean} isMobile - Determines if the device is mobile.
 * @param {boolean} open - Controls if the drawer is open.
 * @param {function} handleDrawerToggle - Function to toggle the drawer open/close.
 */
const Logo = styled("img")(({ theme }) => ({
  width: "150px",
  margin: "20px auto",
  display: "block",
}));

const Sidebar = ({ isMobile, open, handleDrawerToggle }) => {
  const navigatorOnClick = () => {
    isMobile && handleDrawerToggle();
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: open ? 250 : "0",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 250 : 70,
          boxSizing: "border-box",
          transition: "width 0.3s",
        },
      }}
    >
      <Box role="presentation">
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Logo
          src="https://bigtappanalytics.com/uploads/logo/logo.png"
          alt="BigTapp Logo"
        />

        <List>
          <ListItem
            button
            component={Link}
            onClick={navigatorOnClick}
            to={tableCreationPath}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Table Creation" />
          </ListItem>

          <ListItem
            button
            component={Link}
            onClick={navigatorOnClick}
            to={tableConfigurationPath}
            dis
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Table Configuration" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
