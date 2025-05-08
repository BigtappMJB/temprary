import React, { useEffect, useRef, useState } from "react";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { People } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { getUserPermissionsController } from "../../../views/user-management/users/controllers/usersControllers";
import { setCookie } from "../../../views/utilities/cookieServices/cookieServices";
import { isPermissionDetailsCookieName } from "../../../views/utilities/generals";
import { encodeData } from "../../../views/utilities/securities/encodeDecode";
import { storeMenuDetails } from "../../../redux/slices/slice";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

const SidebarItems = ({ navItemClicked, isCollapsed }) => {
  const [menuList, setMenuList] = useState([]);
  const hasFetchedRoles = useRef(false);

  //   const menuList = useSelector((state) => state.applicationState.menuDetails.payload)  || [];
  const navigte = useNavigate();
  const dispatch = useDispatch();

  // Transform API data to match the required structure
  const getTableData = async () => {
    try {
      console.log("Fetching menu data...");
      const response = await getUserPermissionsController();
      
      if (response && response.permissions && response.permissions.length > 0) {
        console.log("Menu data received:", response.permissions);
        setMenuList(response.permissions);
        dispatch(storeMenuDetails(response.permissions));
        
        // Set a cookie to store permissionList
        setCookie({
          name: isPermissionDetailsCookieName,
          value: encodeData(response.permissions),
        });
      } else {
        console.warn("No menu data received from API");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      if (error.statusCode === 404) {
        setMenuList([]);
      }
    }
  };
  useEffect(() => {
    if (!hasFetchedRoles.current) {
      getTableData();
      hasFetchedRoles.current = true;
    }
  }, []);
  const transformApiData = (data) => {
    // Return empty array if data is invalid without warning
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Only log transformation for non-empty data
    if (data.length > 0) {
      console.log("Transforming menu data:", data);
    }

    return data.map((menu, index) => {
      // Ensure submenus is always an array
      const submenus = Array.isArray(menu.submenus) ? menu.submenus : [];
      
      return {
        id: index,
        subheader: menu.menu_name || '',
        children: submenus.map((submenu, subIndex) => ({
          id: `${index}-${subIndex}`,
          title: submenu.submenu_name || '',
          href: submenu.submenu_path || '#',
          icon: People,
        })),
      };
    });
  };
  // const dashobardSubItem = {
  //   id: -1,
  //   title: "Dashboard",
  //   href: "/dashboard",
  //   icon: People,
  // };
  const MenuItems = transformApiData(menuList);
  const handleMenuClick = (item) => {
    if (item.children.length === 1) {
      navigte(item.children[0].href); // Redirect to the first submenu page
    } else {
      navItemClicked(item);
    }
  };
  return (
    <Box sx={{ px: isCollapsed ? 0.5 : 1 }}>
      <List sx={{ p: 0 }} className="sidebarNav">
        {MenuItems.map((item) => {
          const hasMultipleChildren = item.children.length > 1;
          
          return (
            <React.Fragment key={item.id}>
              <NavGroup
                item={item}
                isCollapsed={isCollapsed}
                onClick={() => !hasMultipleChildren && item.children[0].href && handleMenuClick(item)}
              />
              {!isCollapsed && hasMultipleChildren && (
                <Box sx={{ pl: 2 }}>
                  {item.children.map((subItem) => (
                    <NavItem
                      onClick={navItemClicked}
                      item={subItem}
                      key={subItem.id}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

SidebarItems.propTypes = {
  navItemClicked: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool
};
export default SidebarItems;
