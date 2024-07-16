import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank/BlankLayout"))
);

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import("../views/dashboard/Dashboard")));
const Tablecreation = Loadable(
  lazy(() => import("../views/table-creation/Tablecreation"))
);
const UsersPage = Loadable(
  lazy(() => import("../views/user-management/users/Users"))
);
const Roles = Loadable(
  lazy(() => import("../views/user-management/roles/Roles"))
);
const Menu = Loadable(lazy(() => import("../views/user-management/menu/Menu")));
const SubMenu = Loadable(
  lazy(() => import("../views/user-management/submenu/SubMenu"))
);

const RolePermission = Loadable(
  lazy(() => import("../views/user-management/role-permissions/rolePermission"))
);

const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Register = Loadable(
  lazy(() => import("../views/authentication/Register"))
);
const Login = Loadable(lazy(() => import("../views/authentication/Login")));
const ChatInterface = Loadable(
  lazy(() => import("../views/chat-interface/chat"))
);

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/auth/login" /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/table-creation", exact: true, element: <Tablecreation /> },
      { path: "/chat-interface", exact: true, element: <ChatInterface /> },
      { path: "/users", exact: true, element: <UsersPage /> },
      { path: "/roles", exact: true, element: <Roles /> },
      { path: "/menu", exact: true, element: <Menu /> },
      { path: "/subMenu", exact: true, element: <SubMenu /> },
      { path: "/role-permissions", exact: true, element: <RolePermission /> },

      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/login", element: <Login /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
