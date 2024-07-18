import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";

// components
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { emailVerifyCodeController } from "./controllers/EmailVerificationController";
import EmailVerificationFormComponent from "./components/EmailVerificationFormComponent";
import {
  getCookie,
  setCookie,
} from "../../utilities/cookieServices/cookieServices";
import {
  isDefaultPasswordCookieName,
  isForgotPasswordCookieName,
  isUserIdCookieName,
} from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

/**
 * EmailVerification component for user login.
 *
 * This component renders a login page with a card component, logo, and a login form.
 * It also provides a link to the registration page.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 * import EmailVerification from './path-to-login2';
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/auth/emailVerification" element={<EmailVerification />} />
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
const EmailVerification = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();
  const userEmail = decodeData(getCookie(isUserIdCookieName));
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

      const response = await emailVerifyCodeController(formData);

      if (response) {
        if (getCookie(isForgotPasswordCookieName) !== null) {
          navigate("/auth/forgotPassword");
        } else {
          setCookie({
            name: isDefaultPasswordCookieName,
            value: true,
            unit: {
              h: "24",
            },
          });
          navigate("/auth/login");
        }
      }
    } catch (error) {
      setApiError(
        error.errorMessage ||
          "Failed to Verfiy. Please check your verification code."
      );
    } finally {
      stopLoading();
    }
  };

  const handleReset = () => {
    formRef.current.resetForm();
    window.history.back();
  };

  return (
    <AuthCardComponent
      title="Email Verification"
      description="this is Email Verification page"
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
          Verify your Email
        </Typography>
        <Typography component={"p"} textAlign={"center"}>
          A 6-digit code has been sent to{" "}
          <a href={"mailto:" + userEmail}>
            <b>{userEmail}</b>
          </a>
        </Typography>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {/* Login Form Section */}
      <EmailVerificationFormComponent
        onSubmit={onEmailVerification}
        handleReset={handleReset}
        ref={(el) => (formRef.current = el)}
      />
    </AuthCardComponent>
  );
};

export default EmailVerification;
