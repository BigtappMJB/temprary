import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import { getDynamicPages } from "./controllers/routingController";
import { convertToRelativePath } from "../views/utilities/generals";

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
const CMDPage = Loadable(lazy(() => import("../views/cmd/CMDPage")));
const CADPage = Loadable(lazy(() => import("../views/cad/CADPage")));
const ProjectEstimation = Loadable(
  lazy(() => import("../views/project_estimation/project_estimation"))
);
const ProjectCreation = Loadable(
  lazy(() => import("../views/projectCreation/ProjectCreation"))
);
const PageCreation = Loadable(
  lazy(() => import("../views/dynamicPageCreation/dynamicPageCreation"))
);

const ClientPage = Loadable(lazy(() => import("../views/client/client")));

const ProjectTypePage = Loadable(
  lazy(() => import("../views/projectTypes/projectTypes"))
);

const ProjectRolePage = Loadable(
  lazy(() => import("../views/projectRole/projectRoles"))
);

const ProjectPhasePage = Loadable(
  lazy(() => import("../views/projectPhase/projectPhases"))
);
const ActivityCodePage = Loadable(
  lazy(() => import("../views/activityCodePage/ActivityCode"))
);

const Employee = Loadable(
  lazy(() => import("../views/generatedPages/Employee/Employee"))
);

// Pre-load all files from 'generatedPages' directory
// const context = require.context('../views/generatedPages', true, /\.jsx?$/);


// const generateDynamicRoutes = async () => {
//   const dynamicPages = await getDynamicPages();

//   const loadComponent = (relativePath) => {
//     const resolvedPath = `./${relativePath}.jsx`;  // Adjust based on how your files are structured
//     console.log(context.keys());
    
//     if (context.keys().includes(resolvedPath)) {
//       return context(resolvedPath).default;
//     } else {
//       console.error(`Module not found: ${resolvedPath}`);
      
//       // throw new Error(`Module not found: ${resolvedPath}`);
//     }
//   };

//   return dynamicPages.map((page) => {
//     const relativePath = "."+convertToRelativePath(page.file_path);  // Adjust to match your project structure
//     const LazyComponent = lazy(() =>
//       Promise.resolve(loadComponent(relativePath)) // Dynamically resolve the component
//     );

//     return {
//       path: page.routePath,
//       element: (
//         <Suspense fallback={<div>Loading...</div>}>
//           <LazyComponent />
//         </Suspense>
//       ),
//     };
//   });
// };

const staticRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/auth/login" /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/table-creation", element: <Tablecreation /> },
      { path: "/chat-interface", element: <ChatInterface /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/roles", element: <Roles /> },
      { path: "/menu", element: <Menu /> },
      { path: "/subMenu", element: <SubMenu /> },
      { path: "/role-permissions", element: <RolePermission /> },
      { path: "/user-roles", element: <UserRole /> },
      { path: "/cmd", element: <CMDPage /> },
      { path: "/cad", element: <CADPage /> },
      { path: "/project-estimate", element: <ProjectEstimation /> },
      { path: "/projectCreation", element: <ProjectCreation /> },
      { path: "/dynamicPageCreation", element: <PageCreation /> },
      { path: "/clientPage", element: <ClientPage /> },
      { path: "/projectType", element: <ProjectTypePage /> },
      { path: "/projectRole", element: <ProjectRolePage /> },
      { path: "/projectPhase", element: <ProjectPhasePage /> },
      { path: "/activityCode", element: <ActivityCodePage /> },
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

// /* Router Setup with Dynamic Routes */
// const setupRouter = () => {
//   return generateDynamicRoutes() // Get dynamic routes
//     .then((dynamicRoutes) => {
//       // If dynamicRoutes contains promises, resolve them
//       return Promise.all(dynamicRoutes);  // Wait for all promises to resolve
//     })
//     .then((resolvedRoutes) => {
//       // Find the first route (FullLayout) and add the dynamic routes inside its `children`
//       const fullLayoutRoute = staticRoutes.find((route) => route.path === "/");
//       if (fullLayoutRoute) {
//         fullLayoutRoute.children = [
//           ...fullLayoutRoute.children,
//           ...resolvedRoutes, // Use the resolved routes here
//           { path: "*", element: <PageNotReady /> },
//         ];
//       }

//       return staticRoutes; // Return updated routes
//     })
//     .catch((error) => {
//       console.error("Error generating dynamic routes:", error);
//       throw error; // Optionally rethrow or handle the error
//     });
// };


// console.log(await setupRouter());

export default staticRoutes;
