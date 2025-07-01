import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";

// components
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import { useLoading } from "../../../components/Loading/loadingProvider";
import {
  getCookie,
} from "../../utilities/cookieServices/cookieServices";
import {
  isUserIdCookieName,
} from "../../utilities/generals";
import ForgotPasswordFormComponent from "./components/ForgotPasswordFormComponent";
import { forgotPasswordController } from "./controllers/forgotPasswordController";
import { decodeData } from "../../utilities/securities/encodeDecode";

/**
 * ForgotPassword component for user password recovery.
 *
 * This component renders a password recovery page with a card component, logo, and a password recovery form.
 * It also provides a link to the login page.
 *
 * **Example Usage:**
 * ```jsx
 * import React from 'react';
 * import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 * import ForgotPassword from './path-to-forgot-password';
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/auth/forgotPassword" element={<ForgotPassword />} />
 *         <Route path="/auth/login" element={<Login />} />
 *       </Routes>
 *     </Router>
 *   );
 * }
 *
 * export default App;
 * ```
 *
 * @returns {JSX.Element} The rendered password recovery page component.
 */
const ForgotPassword = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();
  const userEmail = decodeData(getCookie(isUserIdCookieName));

  /**
   * Handles form submission.
   * It sends the form data to the password recovery controller and handles the response.
   *
   * @param {Object} formData - The form data containing email and other required fields.
   */
  const onForgotPassword = async (formData) => {
    try {
      startLoading();
      setApiError(null); // Reset API error before making a new request
      const response = await forgotPasswordController(formData);
      if (response) {
        // removeCookie(isForgotPasswordCookieName);
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
      setApiError(
        error.errorMessage ||
          "Failed to recover your password. Please check your details."
      );
    } finally {
      stopLoading();
    }
  };

  const handleReset = () => {
    formRef.current.resetForm();
    navigate("/auth/login");
  };

  return (
    <AuthCardComponent
      title="Forgot Password"
      description="this is forgot password page"
    >
      {/* Logo Section */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <Logo />
      </Box>

      <Box paddingY={"15px"} sx={{ lineHeight: "normal" }}>
        <Typography
          component={"h1"}
          fontSize={"20px"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          Check your Email
        </Typography>
        <Typography component={"p"} textAlign={"center"}>
          A 6-digit code has been sent to{" "}
          <a href={"mailto:" + userEmail}>
            <b>{userEmail}</b>
          </a>
        </Typography>
      </Box>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2, alignItems: "center" }}>
          {apiError}
        </Alert>
      )}

      {/*  Form Section */}
      <ForgotPasswordFormComponent
        onSubmit={onForgotPassword}
        handleReset={handleReset}
        ref={(el) => (formRef.current = el)}
      />
    </AuthCardComponent>
  );
};

export default ForgotPassword;
