import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import { getDynamicPages } from "./controllers/routingController";
import { convertToRelativePath } from "../views/utilities/generals";
import BlankLayout from "../layouts/blank/BlankLayout";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));

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

const ErrorPage = Loadable(lazy(() => import("../views/authentication/Error")));
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

const DynamicPageFallback = Loadable(
  lazy(() => import("../views/generatedPages/components/DynamicPageFallback"))
);
const CMDPage = Loadable(lazy(() => import("../views/cmd/CMDPage")));
const CADPage = Loadable(lazy(() => import("../views/cad/CADPage")));
// Simplified placeholder for removed components
const PlaceholderComponent = ({ title }) => (
  <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
    <h2>{title || 'Component Not Available'}</h2>
    <p>This component has been removed during restructuring.</p>
  </div>
);

// Use the placeholder for removed components
const ProjectEstimation = Loadable(
  lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Estimation" /> }))
);
const ProjectCreation = Loadable(
  lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Creation" /> }))
);
const PageCreation = Loadable(
  lazy(() => import("../views/dynamicPageCreation/dynamicPageCreation"))
);

const ClientPage = Loadable(lazy(() => import("../views/client/client")));

const ProjectTypePage = Loadable(
  lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Types" /> }))
);

const ProjectRolePage = Loadable(
  lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Roles" /> }))
);

const ProjectPhasePage = Loadable(
  lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Phases" /> }))
);
const ActivityCodePage = Loadable(
  lazy(() => import("../views/activityCodePage/ActivityCode"))
);
// Import the dynamic page loader instead of using require.context
const DynamicPageLoader = Loadable(
  lazy(() => import("../views/generatedPages"))
);
const generateDynamicRoutes = async (forceRefresh = false) => {
  try {
    console.log("Fetching dynamic pages...");
    const dynamicPages = await getDynamicPages(forceRefresh);
    console.log("Dynamic pages received:", dynamicPages);
    
    if (!dynamicPages || dynamicPages.length === 0) {
      console.log("No dynamic pages found");
      return [];
    }
    
    // Simplified approach - use the DynamicPageLoader component for all dynamic pages
    return dynamicPages.map((page) => {
      console.log("Processing dynamic page:", page);
      
      // Extract route path and normalize it
      const routePath = page.routePath || '';
      console.log("Route path:", routePath);
      
      // Get the page name from the route path (last part after the last slash)
      const routePathParts = routePath.split('/').filter(part => part);
      const pageName = routePathParts[routePathParts.length - 1];
      
      // Create a lazy-loaded component that passes the page name and route path to the DynamicPageLoader
      // This will work even if the actual component file doesn't exist
      const LazyComponent = lazy(() => 
        Promise.resolve({
          default: (props) => {
            console.log(`Creating dynamic route component for: ${pageName} with path: ${page.routePath}`);
            return React.createElement(DynamicPageLoader, {
              ...props,
              pageName: pageName,
              routePath: page.routePath,
              tableName: page.tableName || pageName // Pass tableName if available
            });
          }
        })
      );
      
      // Ensure the route path is properly formatted
      const normalizedPath = page.routePath.startsWith('/') ? page.routePath : `/${page.routePath}`;
      
      console.log(`Creating route for dynamic page: ${normalizedPath}`);
      
      return {
        path: normalizedPath,
        element: (
          <Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '40px',
              textAlign: 'center'
            }}>
              <div>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div style={{ marginTop: '20px' }}>
                  Loading {normalizedPath.split('/').pop()}...
                </div>
              </div>
            </div>
          }>
            <LazyComponent />
          </Suspense>
        ),
      };
    });
  } catch (error) {
    console.error("Error generating dynamic routes:", error);
    return [];
  }
};

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
      // Add direct route for employee page using DynamicPageLoader
      { 
        path: "/employee", 
        element: <Suspense fallback={<div>Loading Employee page...</div>}>
          <DynamicPageLoader pageName="employee" routePath="/employee" />
        </Suspense> 
      },
      // Add direct route for sample page using DynamicPageLoader
      { 
        path: "/sample", 
        element: <Suspense fallback={<div>Loading Sample page...</div>}>
          <DynamicPageLoader pageName="sample" routePath="/sample" />
        </Suspense> 
      },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <ErrorPage /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/emailVerification", element: <EmailVerification /> },
      { path: "/auth/changePassword", element: <ChangePassword /> },
      { path: "/auth/forgotPassword", element: <ForgotPassword /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

/* Router Setup with Dynamic Routes */
const setupRouter = (forceRefresh = false) => {
  // Check if we need to force refresh based on localStorage
  const shouldRedirect = localStorage.getItem('redirectToNewPage');
  const newPagePath = localStorage.getItem('newPagePath');
  
  // If we're redirecting to a new page, force a refresh of dynamic routes
  const shouldForceRefresh = forceRefresh || (shouldRedirect === 'true' && newPagePath);
  
  if (shouldForceRefresh) {
    console.log("Forcing refresh of dynamic routes due to new page creation");
  }
  
  return generateDynamicRoutes(shouldForceRefresh) // Get dynamic routes with potential force refresh
    .then((dynamicRoutes) => {
      // If dynamicRoutes contains promises, resolve them
      return Promise.all(dynamicRoutes); // Wait for all promises to resolve
    })
    .then((resolvedRoutes) => {
      console.log("Resolved dynamic routes:", resolvedRoutes);
      // Find the first route (FullLayout) and add the dynamic routes inside its `children`
      const fullLayoutRoute = staticRoutes.find((route) => route.path === "/");
      if (fullLayoutRoute) {
        // Get all existing route paths to avoid duplicates
        const existingPaths = new Set(
          fullLayoutRoute.children.map(route => route.path)
        );
        
        // Filter out any dynamic routes that would conflict with existing routes
        const filteredDynamicRoutes = resolvedRoutes.filter(route => {
          // Extract the path without the leading slash
          const pathWithoutSlash = route.path.startsWith('/') 
            ? route.path.substring(1) 
            : route.path;
            
          // Check if this path already exists
          if (existingPaths.has(pathWithoutSlash)) {
            console.warn(`Skipping dynamic route "${route.path}" as it conflicts with an existing route`);
            return false;
          }
          
          return true;
        });
        
        console.log("Filtered dynamic routes:", filteredDynamicRoutes);
        
        // Check if we have the new page path in our routes
        if (newPagePath && shouldRedirect === 'true') {
          // Normalize the path for comparison
          const normalizedNewPath = newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`;
          
          const hasNewPage = filteredDynamicRoutes.some(route => {
            const normalizedRoutePath = route.path.startsWith('/') ? route.path : `/${route.path}`;
            return normalizedRoutePath === normalizedNewPath;
          });
          
          if (!hasNewPage) {
            console.warn(`New page path "${normalizedNewPath}" not found in dynamic routes. Adding it manually.`);
            
            // Extract the page name from the path
            const pageName = normalizedNewPath.split('/').filter(Boolean).pop();
            
            if (pageName) {
              console.log(`Creating manual route for new page: ${pageName}`);
              
              // Create a component for this route
              const LazyComponent = lazy(() => 
                Promise.resolve({
                  default: (props) => {
                    console.log(`Creating dynamic component for new page: ${pageName}`);
                    return React.createElement(DynamicPageLoader, {
                      ...props,
                      pageName: pageName,
                      routePath: normalizedNewPath
                    });
                  }
                })
              );
              
              // Add this route to our filtered routes
              filteredDynamicRoutes.push({
                path: normalizedNewPath,
                element: (
                  <Suspense fallback={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      padding: '40px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                          Loading {pageName}...
                        </div>
                      </div>
                    </div>
                  }>
                    <LazyComponent />
                  </Suspense>
                ),
              });
              
              console.log(`Manual route added for ${normalizedNewPath}`);
            }
          } else {
            console.log(`New page path "${normalizedNewPath}" successfully loaded in dynamic routes.`);
          }
        }
        
        // Add dynamic routes before the catch-all route
        fullLayoutRoute.children = [
          ...fullLayoutRoute.children,
          ...filteredDynamicRoutes, // Use the filtered routes here
          
          // Add a dynamic page fallback route that will handle any dynamic pages
          // that might be missing their component files
          {
            path: "dynamic/*",
            element: <DynamicPageFallback />
          },
          
          // Only add the PageNotReady for specific paths that we know should exist
          // but aren't ready yet, not as a catch-all
          { 
            path: "page-not-ready", 
            element: <PageNotReady /> 
          },
          
          // Use a more informative 404 page for truly unknown routes
          { 
            path: "*", 
            element: <ErrorPage /> 
          },
        ];
      }

      return staticRoutes; // Return updated routes
    })
    .catch((error) => {
      console.error("Error generating dynamic routes:", error);
      // throw error; // Optionally rethrow or handle the error
      return staticRoutes;
    });
};

// Export a function that returns the promise with an optional forceRefresh parameter
export default (forceRefresh = false) => setupRouter(forceRefresh);
