import React from "react";
import PropTypes from "prop-types";
import { ListSubheader, styled } from "@mui/material";
import { useLocation } from "react-router";

const NavGroup = ({ item, onClick }) => {
  const pathName = useLocation().pathname;
  const isOneSubMenu = item.children.length === 1;
  const ListSubheaderStyle = styled((props) => (
    <ListSubheader disableSticky {...props} />
  ))(({ theme }) => ({
    ...theme.typography.overline,
    fontWeight:   !(isOneSubMenu && pathName === item.children[0].href) && "700",
    marginBottom: "2px",
    padding: "8px 10px",
    borderRadius: "8px",
    backgroundColor:
      isOneSubMenu && pathName === item.children[0].href
        ? theme.palette.primary.main
        : "",
    color:
      isOneSubMenu && pathName === item.children[0].href
        ? "white"
        : theme.palette.text.primary,
    lineHeight: "26px",
    textTransform: "none",
    cursor: item.children.length === 1 ? "pointer" : "text",
    "&:hover": {
      backgroundColor: isOneSubMenu && theme.palette.primary.light,
      color: isOneSubMenu && "black",
    },
  }));
  return (
    <ListSubheaderStyle
      onClick={onClick}
    >
      {item.subheader}
    </ListSubheaderStyle>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
