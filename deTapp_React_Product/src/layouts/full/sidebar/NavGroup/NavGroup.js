import React from "react";
import PropTypes from "prop-types";
import { ListSubheader, styled } from "@mui/material";
import { useLocation } from "react-router";

const NavGroup = ({ item, onClick, isCollapsed }) => {
  const pathName = useLocation().pathname;
  const isOneSubMenu = item.children.length === 1;
  const ListSubheaderStyle = styled((props) => (
    <ListSubheader disableSticky {...props} />
  ))(({ theme }) => ({
    ...theme.typography.subtitle1,
    fontWeight: !(isOneSubMenu && pathName === item.children[0].href) ? "600" : "700",
    marginBottom: "8px",
    marginTop: "16px",
    padding: "10px 16px",
    borderRadius: "10px",
    backgroundColor:
      isOneSubMenu && pathName === item.children[0].href
        ? theme.palette.primary.main
        : "transparent",
    color:
      isOneSubMenu && pathName === item.children[0].href
        ? "white"
        : theme.palette.text.primary,
    lineHeight: "26px",
    textTransform: "none",
    letterSpacing: "0.5px",
    cursor: item.children.length === 1 ? "pointer" : "default",
    transition: "all 0.2s ease-in-out",
    boxShadow: isOneSubMenu && pathName === item.children[0].href ? "0 4px 10px 0 rgba(0,0,0,0.12)" : "none",
    "&:hover": {
      backgroundColor: isOneSubMenu ? `${theme.palette.primary.light}20` : "transparent",
      color: isOneSubMenu ? theme.palette.primary.main : theme.palette.text.primary,
      transform: isOneSubMenu ? "translateX(3px)" : "none",
    },
  }));
  return (
    <ListSubheaderStyle 
      onClick={onClick}
      sx={{
        px: isCollapsed ? 1 : 2,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        '& .MuiListItemIcon-root': {
          minWidth: 36
        }
      }}
    >
      {isCollapsed && item.children[0] ? (
        React.createElement(item.children[0].icon, { 
          style: { fontSize: '1.3rem' },
          color: isOneSubMenu && pathName === item.children[0].href ? 'primary' : 'inherit'
        })
      ) : (
        item.subheader
      )}
    </ListSubheaderStyle>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool
};

export default NavGroup;
