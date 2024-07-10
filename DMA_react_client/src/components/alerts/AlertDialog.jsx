// src/components/AlertDialog.js

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDialog } from "./DialogContent";

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
        }}
      >
        {dialogTitle}
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="pt-2">
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {buttonNeeded?.confirm?.isNeed && (
          <Button
            onClick={handleConfirmYes}
            // variant="contained"
            color="primary"
            autoFocus
          >
            {buttonNeeded?.confirm?.name}
          </Button>
        )}
        {buttonNeeded?.cancel?.isNeed && (
          <Button
            onClick={handleConfirmNo}
            // variant="contained"
            color="secondary"
          >
            {buttonNeeded?.cancel?.name}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
