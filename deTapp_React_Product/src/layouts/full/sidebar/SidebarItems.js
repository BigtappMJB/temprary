import React, { useEffect, useRef, useState } from "react";
import { Box, List, Typography, Divider } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { 
  Dashboard, 
  People, 
  TableChart, 
  Settings, 
  Chat, 
  Code, 
  ViewQuilt,
  Business,
  Assignment,
  Category,
  WorkOutline,
  Timeline,
  AccountTree
} from "@mui/icons-material";
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
  // Map menu names to appropriate icons
  const getIconForMenu = (menuName, submenuName) => {
    const menuNameLower = (menuName || '').toLowerCase();
    const submenuNameLower = (submenuName || '').toLowerCase();
    
    // First check for specific submenu matches
    if (submenuNameLower.includes('user') || submenuNameLower.includes('employee')) {
      return People;
    } else if (submenuNameLower.includes('dashboard')) {
      return Dashboard;
    } else if (submenuNameLower.includes('table') || submenuNameLower.includes('data')) {
      return TableChart;
    } else if (submenuNameLower.includes('chat') || submenuNameLower.includes('message')) {
      return Chat;
    } else if (submenuNameLower.includes('code') || submenuNameLower.includes('cmd')) {
      return Code;
    } else if (submenuNameLower.includes('page') || submenuNameLower.includes('dynamic')) {
      return ViewQuilt;
    } else if (submenuNameLower.includes('client') || submenuNameLower.includes('company')) {
      return Business;
    } else if (submenuNameLower.includes('project')) {
      return Assignment;
    } else if (submenuNameLower.includes('type') || submenuNameLower.includes('category')) {
      return Category;
    } else if (submenuNameLower.includes('role')) {
      return WorkOutline;
    } else if (submenuNameLower.includes('activity') || submenuNameLower.includes('timeline')) {
      return Timeline;
    }
    
    // Then check for menu name matches
    if (menuNameLower.includes('user') || menuNameLower.includes('admin')) {
      return People;
    } else if (menuNameLower.includes('project')) {
      return AccountTree;
    } else if (menuNameLower.includes('setting')) {
      return Settings;
    }
    
    // Default icon
    return ViewQuilt;
  };

  const transformApiData = (data) => {
    // Return empty array if data is invalid without warning
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Only log transformation for non-empty data
    if (data.length > 0) {
      console.log("Transforming menu data:", data);
    }
    
    // Add a dashboard item if it doesn't exist
    const hasExistingDashboard = data.some(menu => 
      menu.menu_name?.toLowerCase() === 'dashboard' || 
      (Array.isArray(menu.submenus) && menu.submenus.some(sub => 
        sub.submenu_name?.toLowerCase() === 'dashboard' || 
        sub.submenu_path?.includes('/dashboard')
      ))
    );
    
    let transformedData = data.map((menu, index) => {
      // Ensure submenus is always an array
      const submenus = Array.isArray(menu.submenus) ? menu.submenus : [];
      
      return {
        id: index,
        subheader: menu.menu_name || '',
        children: submenus.map((submenu, subIndex) => ({
          id: `${index}-${subIndex}`,
          title: submenu.submenu_name || '',
          href: submenu.submenu_path || '#',
          icon: getIconForMenu(menu.menu_name, submenu.submenu_name),
        })),
      };
    });
    
    // Add dashboard if it doesn't exist
    if (!hasExistingDashboard) {
      transformedData = [
        {
          id: 'dashboard-group',
          subheader: 'Dashboard',
          children: [
            {
              id: 'dashboard',
              title: 'Dashboard',
              href: '/dashboard',
              icon: Dashboard,
            }
          ]
        },
        ...transformedData
      ];
    }
    
    return transformedData;
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
  // Group menu items by category
  const groupMenuItems = (items) => {
    const categories = {
      'core': ['dashboard', 'home'],
      'user': ['user', 'role', 'permission', 'menu'],
      'project': ['project', 'client', 'activity'],
      'data': ['table', 'data', 'employee'],
      'tools': ['chat', 'cmd', 'cad', 'code'],
      'settings': ['setting', 'config']
    };
    
    const categorizedItems = {
      'core': [],
      'user': [],
      'project': [],
      'data': [],
      'tools': [],
      'settings': [],
      'other': []
    };
    
    items.forEach(item => {
      let assigned = false;
      
      // Check which category this item belongs to
      for (const [category, keywords] of Object.entries(categories)) {
        const matchesCategory = keywords.some(keyword => 
          item.subheader.toLowerCase().includes(keyword) || 
          item.children.some(child => child.title.toLowerCase().includes(keyword))
        );
        
        if (matchesCategory) {
          categorizedItems[category].push(item);
          assigned = true;
          break;
        }
      }
      
      // If no category matched, put in "other"
      if (!assigned) {
        categorizedItems['other'].push(item);
      }
    });
    
    return categorizedItems;
  };
  
  const categorizedMenuItems = groupMenuItems(MenuItems);
  
  // Category labels and icons
  const categoryLabels = {
    'core': { label: 'Main', icon: Dashboard },
    'user': { label: 'User Management', icon: People },
    'project': { label: 'Projects', icon: AccountTree },
    'data': { label: 'Data Management', icon: TableChart },
    'tools': { label: 'Tools', icon: Code },
    'settings': { label: 'Settings', icon: Settings },
    'other': { label: 'Other', icon: Category }
  };
  
  return (
    <Box sx={{ 
      px: isCollapsed ? 0.5 : 2,
      py: 2
    }}>
      <List sx={{ p: 0 }} className="sidebarNav">
        {Object.entries(categorizedMenuItems).map(([category, items]) => {
          // Skip empty categories
          if (items.length === 0) return null;
          
          return (
            <React.Fragment key={category}>
              {/* Category header - only show when not collapsed */}
              {!isCollapsed && items.length > 0 && (
                <Box sx={{ 
                  px: 2, 
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  opacity: 0.7
                }}>
                  {React.createElement(categoryLabels[category].icon, { 
                    fontSize: 'small',
                    color: 'inherit'
                  })}
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.7rem'
                    }}
                  >
                    {categoryLabels[category].label}
                  </Typography>
                </Box>
              )}
              
              {/* Menu items in this category */}
              {items.map((item) => {
                const hasMultipleChildren = item.children.length > 1;
                
                return (
                  <React.Fragment key={item.id}>
                    <NavGroup
                      item={item}
                      isCollapsed={isCollapsed}
                      onClick={() => !hasMultipleChildren && item.children[0].href && handleMenuClick(item)}
                    />
                    {hasMultipleChildren && (
                      <Box sx={{ pl: isCollapsed ? 0 : 2 }}>
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
              
              {/* Divider between categories - only when not collapsed */}
              {!isCollapsed && (
                <Divider sx={{ my: 2, opacity: 0.1 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
      
      {/* User profile section at bottom */}
      {!isCollapsed && (
        <Box sx={{ 
          mt: 'auto', 
          pt: 2,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)'
          }
        }}>
          <Box sx={{ 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            backgroundColor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            fontWeight: 'bold',
            mr: 2
          }}>
            {/* User initials - can be replaced with actual user data */}
            <Typography variant="body2">UA</Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>User Account</Typography>
            <Typography variant="caption" color="textSecondary">Administrator</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

SidebarItems.propTypes = {
  navItemClicked: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool
};
export default SidebarItems;
