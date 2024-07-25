import React from "react";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { People } from "@mui/icons-material";
import { useLoginProvider } from "../../../views/authentication/provider/LoginProvider";

const SidebarItems = ({ navItemClicked }) => {
  const { menuList } = useLoginProvider();
  // Transform API data to match the required structure
  const transformApiData = (data) => {
    return (
      data &&
      data?.map((menu, index) => ({
        id: index,
        subheader: menu.menu_name,
        children: menu.submenus.map((submenu, subIndex) => ({
          id: `${index}-${subIndex}`,
          title: submenu.submenu_name,
          href: submenu.submenu_path,
          icon: People, // Adjust the icon as per your needs
        })),
      }))
    );
  };
  const dashobardSubItem = {
    id: -1,
    title: "Dashboard",
    href: "/dashboard",
    icon: People,
  };
  const MenuItems = transformApiData(menuList);
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        <React.Fragment key={dashobardSubItem.id}>
          <NavGroup item={"Dashboard"} />

          <NavItem
            onClick={navItemClicked}
            item={dashobardSubItem}
            key={dashobardSubItem.id}
          />
        </React.Fragment>
        {MenuItems.map((item) => (
          <React.Fragment key={item.id}>
            <NavGroup item={item} />
            {item.children.map((subItem) => (
              <NavItem
                onClick={navItemClicked}
                item={subItem}
                key={subItem.id}
              />
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
export default SidebarItems;
