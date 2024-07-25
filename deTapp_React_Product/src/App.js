/* eslint-disable react/react-in-jsx-scope */
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import Router from "./routes/Router";

import { DialogProvider } from "./views/utilities/alerts/DialogContent";
import { baselightTheme } from "./theme/DefaultColors";
import AlertDialog from "./views/utilities/alerts/AlertDialog";
import { LoadingProvider } from "./components/Loading/loadingProvider";
import LoadingScreen from "./components/Loading/LoaderComponent";

function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <LoadingProvider>
      <DialogProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {routing}
        </ThemeProvider>
        <AlertDialog />
        <LoadingScreen />
      </DialogProvider>
    </LoadingProvider>
  );
}

export default App;
