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

const UserRole = Loadable(
  lazy(() => import("../views/user-management/userRole/UserRole"))
);

const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Register = Loadable(
  lazy(() => import("../views/authentication/registration/Register"))
);

const EmailVerification = Loadable(
  lazy(() =>
    import("../views/authentication/emailVerification/EmailVerification")
  )
);
const ChangePassword = Loadable(
  lazy(() => import("../views/authentication/changePassword/ChangePassword"))
);
const ForgotPassword = Loadable(
  lazy(() => import("../views/authentication/forgotPassword/ForgotPassword"))
);
const Login = Loadable(
  lazy(() => import("../views/authentication/login/Login"))
);
const ChatInterface = Loadable(
  lazy(() => import("../views/chat-interface/chat"))
);
const PageNotReady = Loadable(
  lazy(() => import("../views/pageNotReady/PageNotReady"))
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
      { path: "/user-roles", exact: true, element: <UserRole /> },

      { path: "*", element: <PageNotReady /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/emailVerification", element: <EmailVerification /> },
      { path: "/auth/changePassword", element: <ChangePassword /> },
      { path: "/auth/forgotPassword", element: <ForgotPassword /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
