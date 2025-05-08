import {
  IconLayoutDashboard,
  IconLogin,
  IconUsers,
  IconUserCircle,
  IconLock,
  IconTable,
  IconMenu2,
  IconListDetails,
  IconMessageCircle,
  IconLogout
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Table creation",
    icon: IconTable,
    href: "/table-creation",
  },
  {
    navlabel: true,
    subheader: "User Management",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUsers,
    href: "/users",
  },

  {
    id: uniqueId(),
    title: "Roles",
    icon: IconUserCircle,
    href: "/roles",
  },
  {
    id: uniqueId(),
    title: "Role Permissions",
    icon: IconLock,
    href: "/role-permissions",
  },
  {
    navlabel: true,
    subheader: "Menu Management",
  },
  {
    id: uniqueId(),
    title: "Menu",
    icon: IconMenu2,
    href: "/menu",
  },
  {
    id: uniqueId(),
    title: "SubMenu",
    icon: IconListDetails,
    href: "/subMenu",
  },
  {
    navlabel: true,
    subheader: "Chat Interface",
  },
  {
    id: uniqueId(),
    title: "Chat",
    icon: IconMessageCircle,
    href: "/chat-interface",
  },
  {
    navlabel: true,
    subheader: "Logout",
  },
  {
    id: uniqueId(),
    title: "Logout",
    icon: IconLogout,
    href: "/auth/login",
  },
];

export default Menuitems;
