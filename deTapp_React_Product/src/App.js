/* eslint-disable react/react-in-jsx-scope */
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { DialogProvider } from "./views/utilities/alerts/DialogContent";
import { baselightTheme } from "./theme/DefaultColors";
import AlertDialog from './views/utilities/alerts/AlertDialog';

function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  return (
    <DialogProvider>
    <ThemeProvider theme={theme}>

      <CssBaseline />
      {routing}

    </ThemeProvider>
    <AlertDialog/>
    </DialogProvider>
  );
}

export default App;
