/**
 * The main App component that wraps the entire application.
 *
 * This component sets up the basic layout of the application, including
 * the sidebar, header, main content area, and footer. It also handles
 * the toggling of the sidebar on mobile devices.
 *
 * @example
 * <App />
 */
import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { styled } from "@mui/system";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useMediaQuery } from "@mui/material";
import { DialogProvider } from "./components/alerts/DialogContent";
import AlertDialog from "./components/alerts/AlertDialog";
import AppRouter from "./routes/appRouter";

/**
 * The width of the sidebar in pixels.
 *
 * @constant
 * @type {string}
 */
const drawerWidth = "0px"; // Updated width to 250px for better spacing

/**
 * A styled main component that handles the layout of the main content area.
 *
 * This component takes an `open` prop that determines whether the sidebar
 * is open or closed. It also uses the `theme` prop to access the current
 * theme and apply styles accordingly.
 *
 * @example
 * <Main open={true}>
 *   <Header />
 *   <MainPage />
 *   <Footer />
 * </Main>
 */
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : "0",
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

const SubMain = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : "0",
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

/**
 * The main App function component.
 *
 * This component sets up the application's theme, handles the toggling
 * of the sidebar, and renders the main layout components.
 *
 * @returns {React.ReactElement} The App component.
 */
const App = () => {
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(!isMobile);

  /**
   * Handles the toggling of the sidebar.
   *
   * @function
   */
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <DialogProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: "flex" }}>
          <Sidebar
            isMobile={isMobile}
            open={open}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Main open={open}>
            <Header open={open} handleDrawerToggle={handleDrawerToggle} />
            <SubMain>
              <AppRouter />
            </SubMain>
            <Footer />
          </Main>
        </div>
        <AlertDialog />
      </ThemeProvider>
    </DialogProvider>
  );
};

export default App;
