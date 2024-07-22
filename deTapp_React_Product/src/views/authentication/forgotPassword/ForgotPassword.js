import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";

// components
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import { useLoading } from "../../../components/Loading/loadingProvider";
import {
  getCookie,
  removeCookie,
} from "../../utilities/cookieServices/cookieServices";
import {
  isForgotPasswordCookieName,
  isUserIdCookieName,
} from "../../utilities/generals";
import ForgotPasswordFormComponent from "./components/ForgotPasswordFormComponent";
import { forgotPasswordController } from "./controllers/forgotPasswordController";
import { triggerOTPEmailController } from "../emailVerification/controllers/EmailVerificationController";
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
  const [optMailStatus, setoptMailStatus] = useState();

  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();
  const userEmail = decodeData(getCookie(isUserIdCookieName));
  const hasTriggeredRef = useRef(false);
  /**
   * Handles form submission.
   * It sends the form data to the password recovery controller and handles the response.
   *
   * @param {Object} formData - The form data containing email and other required fields.
   */

  const triggerOTPEmail = useCallback(async () => {
    try {
      startLoading();
      await triggerOTPEmailController();
      setoptMailStatus(1);
      localStorage.setItem("otpMailStatus", "success");
    } catch (error) {
      setoptMailStatus(0);
      console.error(error);
      localStorage.removeItem("otpMailStatus");
    } finally {
      stopLoading();
    }
  }, []);

  useEffect(() => {
    if (!hasTriggeredRef.current) {
      const storedStatus = localStorage.getItem("otpMailStatus");
      if (storedStatus !== "success") {
        hasTriggeredRef.current = true;
        triggerOTPEmail();
      }
    }
  }, [triggerOTPEmail]);

  const onForgotPassword = async (formData) => {
    try {
      startLoading();
      setApiError(null); // Reset API error before making a new request
      const response = await forgotPasswordController(formData);
      if (response) {
        removeCookie(isForgotPasswordCookieName);
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
      {/* <Box paddingY={"15px"} sx={{ lineHeight: "normal" }}>
        <Typography
          component={"h1"}
          fontSize={"22px"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          Forgot Password
        </Typography>
      </Box> */}
      {optMailStatus === 0 && (
        <Alert severity="error" sx={{ mb: 2, alignItems: "center" }}>
          "There is an issue in generating OTP.Kindly retry it or contact system
          administrator"
        </Alert>
      )}

      {optMailStatus === 1 && (
        <Alert severity="success" sx={{ mb: 2, alignItems: "center" }}>
          A 6-digit code has been sent to{" "}
          <a href={"mailto:" + userEmail}>
            <b>{userEmail}</b>
          </a>
        </Alert>
      )}
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
