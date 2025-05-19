import React from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  Tooltip,
} from "@mui/material";

const NavItem = ({ item, level, onClick, isCollapsed }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon style={{ fontSize: '1.3rem' }} />;
  const pathName = useLocation().pathname;

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "6px",
    padding: "10px 16px",
    borderRadius: "10px",
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color: theme.palette.text.secondary,
    paddingLeft: isCollapsed ? "8px" : "16px",
    transition: "all 0.2s ease-in-out",
    fontWeight: 500,
    justifyContent: isCollapsed ? "center" : "flex-start",
    "&:hover": {
      backgroundColor: `${theme.palette.primary.light}20`,
      color: theme.palette.primary.main,
      transform: isCollapsed ? "none" : "translateX(3px)",
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,0.12)",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
        color: "white",
        transform: isCollapsed ? "none" : "translateX(3px)",
      },
    },
  }));

  const listItem = (
    <ListItemStyled
      button
      component={item.external ? "a" : NavLink}
      to={item.href}
      href={item.external ? item.href : ""}
      disabled={item.disabled}
      selected={pathName === item.href}
      target={item.external ? "_blank" : ""}
      onClick={onClick}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? "auto" : "36px",
          color: "inherit",
          mr: isCollapsed ? 0 : 2,
        }}
      >
        {itemIcon}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText>
          <>{item.title}</>
        </ListItemText>
      )}
    </ListItemStyled>
  );

  return (
    <List
      component="li"
      disablePadding
      key={item.id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {isCollapsed ? (
        <Tooltip title={item.title} placement="right">
          {listItem}
        </Tooltip>
      ) : (
        listItem
      )}
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

export default NavItem;
