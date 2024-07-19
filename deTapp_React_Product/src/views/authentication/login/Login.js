import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Typography } from "@mui/material";

// components
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import LoginFormComponent from "./components/loginFormComponent";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { loginController } from "./controllers/loginController";
import {
  getCookie,
  removeCookie,
  setCookie,
} from "../../utilities/cookieServices/cookieServices";

import { encodeData } from "../../utilities/securities/encodeDecode";
import {
  encodedSessionDetailsCookieName,
  isDefaultPasswordChangedCookieName,
  isDefaultPasswordStatusCookieName,
  isEmailVerifiedForDefaultPasswordCookieName,
  isEmailVerifiedStatusCookieName,
  isUserIdCookieName,
} from "../../utilities/generals";

/**
 * LoginPage component for user login.
 *
 * This component renders a login page with a card component, logo, and a login form.
 * It also provides a link to the registration page.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 * import LoginPage from './path-to-login2';
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/auth/login" element={<LoginPage />} />
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
const LoginPage = () => {
  const [apiError, setApiError] = useState(null);
  const [isDefaultPassword, setIsDefaultPassword] = useState(
    getCookie(isEmailVerifiedForDefaultPasswordCookieName) !== null
  );
  const [isDefaultPasswordUpdated, setisDefaultPasswordUpdated] = useState(
    getCookie(isDefaultPasswordChangedCookieName) !== null
  );

  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();

  useEffect(() => {
    // clearCookies()
    // Cleanup function to clear the interval
    return () => {
      removeCookie(isEmailVerifiedForDefaultPasswordCookieName);
      removeCookie(isDefaultPasswordChangedCookieName);
    };
  }, []);

  /**
   * Function to handle remember me functionality.
   * It encodes the form data and sets it in a cookie.
   *
   * @param {Object} data - The form data.
   */
  const rememberMeFunction = (data) => {
    const encodedData = encodeData(data);
    setCookie({
      name: encodedSessionDetailsCookieName,
      value: encodedData,
      expires: 24, // 24 hours
    });
  };
  /**
   * Handles the login process.
   *
   * This function sends the login credentials to the server for authentication. Based on the response,
   * it sets necessary cookies, handles email verification and password change requirements, and redirects
   * the user to the appropriate page.
   *
   * @param {Object} formData - The form data containing username, password, and rememberMe flag.
   * @returns {Promise<void>}
   */
  const onLogin = async (formData) => {
    try {
      // Remove the default password status cookie and reset the state variable
      removeCookie(isEmailVerifiedForDefaultPasswordCookieName);
      removeCookie(isDefaultPasswordChangedCookieName);

      setIsDefaultPassword(false);

      // Start the loading indicator and reset any existing API errors
      startLoading();
      setApiError(null);

      // Send the login credentials to the server for authentication
      const response = await loginController(formData);
      // Set a cookie to store the encoded username
      setCookie({
        name: isUserIdCookieName,
        value: encodeData(formData?.username),
      });

      if (response) {
        // Set a cookie to indicate the email verification status
        setCookie({
          name: isEmailVerifiedStatusCookieName,
          value: encodeData(response?.is_verified ? 1 : 0),
        });

        // Set a cookie to indicate the default password status
        setCookie({
          name: isDefaultPasswordStatusCookieName,
          value: encodeData(response?.is_default_password_changed ? 1 : 0),
        });
        // Redirect to the email verification page if the email is not verified
        if (!response?.is_verified) {
          navigate("/auth/emailVerification");
          return;
        }

        // Redirect to the change password page if the default password is not changed
        if (!response?.is_default_password_changed) {
          navigate("/auth/changePassword");
          return;
        }

        // Remember the user if the rememberMe flag is set
        if (formData.rememberMe) {
          rememberMeFunction(response);
        }

        // Log the successful login and navigate to the dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Log the error and set an appropriate API error message
      console.log(error);
      setApiError(
        error.errorMessage ||
          "Failed to login. Please check your credentials and try again."
      );
    } finally {
      // Stop the loading indicator
      stopLoading();
    }
  };

  return (
    <AuthCardComponent title="Login" description="this is Login page">
      {/* Logo Section */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <Logo />
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2, alignItems: "center" }}>
          {apiError}
        </Alert>
      )}

      {isDefaultPassword && (
        <Alert severity="success" sx={{ mb: 2, alignItems: "center" }}>
          Your email has been verified successfully and one time password has
          been mailed.
        </Alert>
      )}
      {isDefaultPasswordUpdated && (
        <Alert severity="success" sx={{ mb: 2, alignItems: "center" }}>
          Your password has been updated successfully.
        </Alert>
      )}

      {/* Login Form Section */}
      <LoginFormComponent
        onSubmit={onLogin}
        ref={(el) => (formRef.current = el)}
      />

      {/* Link to Registration Page */}
      <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
        <Typography
          component={Link}
          to="/auth/register"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Create an account
        </Typography>
      </Stack>
    </AuthCardComponent>
  );
};

export default LoginPage;
