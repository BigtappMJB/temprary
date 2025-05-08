import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDialog } from "./DialogContent.js";

/**
 * AlertDialog Component
 *
 * A reusable alert dialog component using Material UI.
 *
 * @example
 * ```jsx
 * import AlertDialog from './AlertDialog';
 *
 * const MyComponent = () => {
 *   const [open, setOpen] = React.useState(false);
 *   const [title, setTitle] = React.useState('Alert Title');
 *   const [message, setMessage] = React.useState('Alert Message');
 *   const [type, setType] = React.useState('warning'); // 'critical', 'warning', or 'primary'
 *
 *   const handleConfirm = (confirmed) => {
 *     if (confirmed) {
 *       console.log('Confirmed!');
 *     } else {
 *       console.log('Cancelled!');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <Button onClick={() => setOpen(true)}>Open Alert Dialog</Button>
 *       <AlertDialog
 *         open={open}
 *         title={title}
 *         message={message}
 *         type={type}
 *         onClose={() => setOpen(false)}
 *         onConfirm={handleConfirm}
 *       />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} The AlertDialog component.
 */
const AlertDialog = () => {
  const {
    dialogOpen,
    dialogTitle,
    dialogMessage,
    dialogType,
    closeDialog,
    confirmDialog,
    buttonNeeded,
  } = useDialog();

  const handleConfirmYes = () => {
    confirmDialog(true); // Return true for 'Yes'
  };

  const handleConfirmNo = () => {
    confirmDialog(false); // Return false for 'No'
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor:
            dialogType === "critical"
              ? "error.main"
              : dialogType === "warning"
              ? "warning.main"
              : "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          p: 2,
          '& .MuiTypography-root': {
            fontSize: '1.1rem',
            fontWeight: 600
          }
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h6" sx={{ color: "white", pr: 2 }}>
            {dialogTitle}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            sx={{ 
              color: "white",
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            color: 'text.primary',
            fontSize: '1rem',
            mb: 0
          }}
        >
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        {buttonNeeded?.confirm?.isNeed && (
          <Button 
            onClick={handleConfirmYes} 
            variant="contained"
            color={dialogType === "critical" ? "error" : dialogType === "warning" ? "warning" : "primary"}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 500
            }}
            autoFocus
          >
            {buttonNeeded?.confirm?.name}
          </Button>
        )}
        {buttonNeeded?.cancel?.isNeed && (
          <Button 
            onClick={handleConfirmNo} 
            variant="outlined"
            color="inherit"
            sx={{
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {buttonNeeded?.cancel?.name}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
