import React, { useRef, useState } from "react";
import { Alert, Box } from "@mui/material";

// components
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { changePasswordController } from "./controllers/changePasswordController";
import ChangePasswordFormComponent from "./components/ChangePasswordFormComponent";

/**
 * ChangePassword component for user login.
 *
 * This component renders a login page with a card component, logo, and a login form.
 * It also provides a link to the registration page.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 * import ChangePassword from './path-to-login2';
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/auth/changePassword" element={<ChangePassword />} />
 *         <Route path="/auth/register" element={<Register />} />
 *       </Routes>
 *     </Router>
 *   );
 * }
 *
 * export default App;
 * ```
 *
 * @returns {JSX.Element} The rendered login page component.
 */
const ChangePassword = () => {
  const [apiError, setApiError] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();
  /**
   * Function to handle form submission.
   * It sends the form data to the login controller and handles the response.
   *
   * @param {Object} formData - The form data containing username, password, and remember me.
   */
  const onEmailVerification = async (formData) => {
    try {
      startLoading();
      setApiError(null); // Reset API error before making a new request
      const response = await changePasswordController(formData);
      if (response) {
        window.history.back();
      }
    } catch (error) {
      console.log(error);
      setApiError(
        error.errorMessage ||
          "Failed to change your password. Please check your details."
      );
    } finally {
      stopLoading();
    }
  };

  const handleFormReset = () => {
    formRef.current.resetForm();
  };

  return (
    <AuthCardComponent
      title="Change Password"
      description="this is change passowrd page"
    >
      {/* Logo Section */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <Logo />
      </Box>

      {/* <Box paddingY={"15px"} sx={{ lineHeight: "normal" }}>
        <Typography
          component={"h1"}
          fontSize={"22px"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          Change Password
        </Typography>
      </Box> */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2, alignItems: "center" }}>
          {apiError}
        </Alert>
      )}

      {/*  Form Section */}
      <ChangePasswordFormComponent
        onSubmit={onEmailVerification}
        handleReset={handleFormReset}
        ref={(el) => (formRef.current = el)}
      />
    </AuthCardComponent>
  );
};

export default ChangePassword;
