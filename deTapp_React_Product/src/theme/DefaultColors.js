import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#1e88e5',
      light: '#bbdefb',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5c6bc0',
      light: '#e8eaf6',
      dark: '#303f9f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#43a047',
      light: '#e8f5e9',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    info: {
      main: '#03a9f4',
      light: '#e1f5fe',
      dark: '#0288d1',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e53935',
      light: '#ffebee',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fb8c00',
      light: '#fff3e0',
      dark: '#ef6c00',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#f3e5f5',
      A100: '#9c27b0',
      A200: '#7b1fa2',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f7fa',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
      light: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 0.08,
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography,
  shadows
},
  
);

export { baselightTheme };
