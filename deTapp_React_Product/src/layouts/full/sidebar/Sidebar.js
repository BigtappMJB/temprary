import { Box, Drawer, IconButton } from "@mui/material";
import Logo from "../shared/logo/Logo";
import SidebarItems from "./SidebarItems";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/**
 * Sidebar component renders a navigation drawer.
 * @param {boolean} isMobile - Determines if the device is mobile.
 * @param {boolean} open - Controls if the drawer is open.
 * @param {function} handleDrawerToggle - Function to toggle the drawer open/close.
 */
// const Logo = styled("img")(({ theme }) => ({
//   width: "150px",
//   margin: "20px auto",
//   display: "block",
// }));

const Sidebar = ({ isMobile, open, handleDrawerToggle }) => {
  const navItemClicked = () => {
    isMobile && handleDrawerToggle()
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
        <Logo />

        <SidebarItems navItemClicked={navItemClicked} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
