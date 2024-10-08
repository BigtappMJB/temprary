import React, { useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DynamicFormCreationFormComponent from "./DynamicOptionForm";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const OptionsDialogBox = ({
  open,
  handleClose,
  noOfOptions,
  onSubmit,
  defaultValues,
  onReset,
  columnName,
}) => {
  // Use useCallback to memoize the handleClose function if it's defined in the parent
  const memoizedHandleClose = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Dialog open={open} onClose={memoizedHandleClose} fullWidth={true}>
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
            {columnName} Options Form
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

OptionsDialogBox.propTypes = {
  open: PropTypes.bool.isRequired, // open should be a required boolean

  handleClose: PropTypes.func.isRequired, // handleClose should be a required function

  noOfOptions: PropTypes.number, // noOfOptions should be a number (optional)

  onSubmit: PropTypes.func.isRequired, // onSubmit should be a required function

  defaultValues: PropTypes.any,

  onReset: PropTypes.func.isRequired, // onReset is a required function

  columnName: PropTypes.string.isRequired, // columnName should be a required string
};

export default OptionsDialogBox;
