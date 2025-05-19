import { Box, Drawer, IconButton } from "@mui/material";
import Logo from "../shared/logo/Logo";
import SidebarItems from "./SidebarItems";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";

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
        width: open ? 280 : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 280 : 80,
          boxSizing: "border-box",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          backgroundColor: "#ffffff",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        role="presentation"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            minHeight: '64px'
          }}
        >
          {open && <Logo />}
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: '8px',
              backgroundColor: 'rgba(0,0,0,0.02)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.08)'
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <Box 
          sx={{ 
            flex: 1, 
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            }
          }}
        >
          <SidebarItems navItemClicked={navItemClicked} isCollapsed={!open} />
        </Box>
      </Box>
    </Drawer>
  );
};
Sidebar.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Sidebar;
