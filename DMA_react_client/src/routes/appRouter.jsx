/**
 * AppRouter component that renders a set of routes defined in the `routesObject` array.
 *
 * The `routesObject` array should contain objects with the following properties:
 * - `path`: The path of the route (e.g. `/`, `/about`, etc.)
 * - `element`: The React element to render for the route (e.g. a component, a string, etc.)
 *
 * Example:
 * ```
 * const routesObject = [
 *   {
 *     path: "/",
 *     element: <HomePage />,
 *   },
 *   {
 *     path: "/about",
 *     element: <AboutPage />,
 *   },
 * ];
 * ```
 *
 * @returns {React.ReactElement} The AppRouter component
 */
import React from "react";
import { Routes, Route } from "react-router-dom";
import TableCreation from "../pages/TableCreation";
import { tableConfigurationPath, tableCreationPath } from "./routePath";
import TableConfiguration from "../pages/TableConfiguration";

const routesObject = [
  {
    path: tableCreationPath,
    element: <TableCreation />,
  },
  {
    path: tableConfigurationPath,
    element: <TableConfiguration />,
  },
];

const AppRouter = () => (
  <Routes>
    {routesObject.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AppRouter;
