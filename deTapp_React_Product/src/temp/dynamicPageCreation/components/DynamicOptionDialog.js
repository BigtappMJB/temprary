import React, { useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DynamicFormCreationFormComponent from "./DynamicOptionForm";
import CloseIcon from "@mui/icons-material/Close";

const OptionsDialogBox = ({
  open,
  handleClose,
  noOfOptions,
  onSubmit,
  defaultValues,
  onReset,
}) => {
  // Use useCallback to memoize the handleClose function if it's defined in the parent
  const memoizedHandleClose = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Dialog open={open} onClose={memoizedHandleClose} maxWidth="lg">
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h6" sx={{ color: "white", pr: 2 }}>
            Options Form
          </Typography>
          <IconButton
            aria-label="close"
            onClick={memoizedHandleClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DynamicFormCreationFormComponent
          noOfOptions={noOfOptions}
          onSubmit={onSubmit}
          onReset={onReset}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OptionsDialogBox;
