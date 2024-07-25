// src/contexts/DialogContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Creates a context for managing dialogs in the application.
 */
const DialogContext = createContext();

/**
 * Hook to access the dialog context.
 *
 * @returns {object} The dialog context object.
 */
export const useDialog = () => useContext(DialogContext);

/**
 * Provider component for the dialog context.
 *
 * @param {ReactNode} children The children components to wrap with the dialog context.
 * @returns {ReactElement} The dialog context provider component.
 */
export const DialogProvider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("primary");
  const [dialogCallback, setDialogCallback] = useState(null);
  const [buttonNeeded, setButtonNeeded] = useState({});
  const [onClose, setOnClose] = useState(null);

  /**
   * Opens a dialog with the specified type, title, message, and callback.
   *
   * @param {string} type The type of dialog (e.g. "primary", "success", "error").
   * @param {string} title The title of the dialog.
   * @param {string} message The message to display in the dialog.
   * @param {function} callback The callback function to call when the dialog is confirmed.
   */
  const openDialog = (
    type,
    title,
    message,
    buttonNeeded,
    callback,
    onClose
  ) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogCallback(() => callback);
    setButtonNeeded(buttonNeeded);
    setDialogOpen(true);
    setOnClose(onClose);
  };

  useEffect(() => {
    return () => {
      if (onClose) {
        onClose();
      }
    };
  }, [onClose]);

  /**
   * Closes the current dialog.
   */
  const closeDialog = () => {
    setDialogOpen(false);
    setDialogCallback(null);
  };

  /**
   * Confirms the current dialog and calls the callback function if provided.
   *
   * @param {boolean} confirmed Whether the dialog was confirmed or not.
   */
  const confirmDialog = (confirmed) => {
    if (dialogCallback) {
      dialogCallback(confirmed);
    }
    closeDialog();
  };

  return (
    <DialogContext.Provider
      value={{
        dialogOpen,
        dialogTitle,
        dialogMessage,
        dialogType,
        openDialog,
        closeDialog,
        confirmDialog,
        buttonNeeded,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

// Example usage:
// import React from "react";
// import { DialogProvider, useDialog } from "./DialogContext";

// const App = () => {
//   const { openDialog } = useDialog();

//   const handleButtonClick = () => {
//     openDialog("success", "Success!", "You did it!", () => console.log("Callback called!"));
//   };

//   return (
//     <DialogProvider>
//       <button onClick={handleButtonClick}>Open Dialog</button>
//     </DialogProvider>
//   );
// };
