import React from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton } from "@mui/material";

// components
import Profile from "./Profile";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";

const Header = ({ handleDrawerToggle, open }) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    background: "#ffffff",
    padding: theme.spacing(1, 3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 2),
    },
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={handleDrawerToggle}
          disabled={open}
          sx={{
            borderRadius: '8px',
            backgroundColor: 'rgba(0,0,0,0.03)',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.08)',
            },
            mr: 2
          }}
        >
          {!open && <MenuIcon />}
        </IconButton>

        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.875rem'
          }}
        >
          Welcome to DeTapp React Product
        </Box>

        <Box flexGrow={1} />
        <Stack spacing={2} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  handleDrawerToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default Header;
