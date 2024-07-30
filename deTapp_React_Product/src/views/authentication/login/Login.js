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
  isDashboardRedirectCookieName,
  isDefaultPasswordChangedCookieName,
  isDefaultPasswordStatusCookieName,
  isEmailVerifiedForDefaultPasswordCookieName,
  isEmailVerifiedStatusCookieName,
  isForgotPasswordCookieName,
  isLoginSuccessCookieName,
  isLoginTokenCookieName,
  isPermissionDetailsCookieName,
  isUserIdCookieName,
} from "../../utilities/generals";
import { useLoginProvider } from "../provider/LoginProvider";

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
  const [isDefaultPasswordUpdated, setIsDefaultPasswordUpdated] = useState(
    getCookie(isDefaultPasswordChangedCookieName) !== null
  );
  const [isForgotPasswordUpdated, setForgotPasswordUpdated] = useState(
    getCookie(isForgotPasswordCookieName) !== null
  );

  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { setLoginStatusFunction, setMenuListFunction } = useLoginProvider();
  const formRef = useRef();

  useEffect(() => {
    // clearCookies()
    // Cleanup function to clear the interval
    return () => {
      removeCookie(isEmailVerifiedForDefaultPasswordCookieName);
      removeCookie(isDefaultPasswordChangedCookieName);
      // removeCookie(isForgotPasswordCookieName);
      removeCookie(isDashboardRedirectCookieName);
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
   * Triggers the sending of an OTP email.
   *
   * This function calls the `triggerOTPEmailController` to send an OTP email to the user. Upon success,
   * it sets a cookie indicating that the user should be redirected to the dashboard, and navigates
   * the user to the email verification page. If an error occurs during the process, it logs the error
   * to the console.
   *
   * @example
   * // Call this function to trigger the OTP email and handle navigation
   * triggerOTPEmail()
   *   .then(() => {
   *     console.log('OTP email triggered successfully and user redirected to email verification page.');
   *   })
   *   .catch((error) => {
   *     console.error('Failed to trigger OTP email:', error);
   *   });
   *
   * @returns {Promise<void>} A promise that resolves when the OTP email process is complete.
   */
  // const triggerOTPEmail = async () => {
  //   try {
  //     // Call the controller to trigger the OTP email
  //     await triggerOTPEmailController();

  //     // Set a cookie indicating that the user should be redirected to the dashboard
  //     setCookie({
  //       name: isDashboardRedirectCookieName,
  //       value: encodeData(1),
  //     });

  //     // Navigate the user to the email verification page
  //     navigate("/auth/emailVerification");
  //   } catch (error) {
  //     // Log any errors that occur during the OTP email process
  //     console.error("Error triggering OTP email:", error);
  //   }
  // };

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
      removeCookie(isForgotPasswordCookieName);
      removeCookie(isDefaultPasswordUpdated);
      removeCookie(isPermissionDetailsCookieName);
      removeCookie(isLoginTokenCookieName)
      setIsDefaultPasswordUpdated(false);
      setIsDefaultPassword(false);
      setForgotPasswordUpdated(false);

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

        // Set a cookie to indicate the loginStatus status
        setCookie({
          name: isLoginSuccessCookieName,
          value: encodeData(1),
        });

        setLoginStatusFunction(true);
        setMenuListFunction(response?.permissions);
        // Set a cookie to store permissionList
        setCookie({
          name: isPermissionDetailsCookieName,
          value: encodeData(response?.permissions),
        });

        // Set a cookie to store permissionList
        setCookie({
          name: isLoginTokenCookieName,
          value: encodeData(response?.token),
        });
        const firstSubMenuPath =
          response?.permissions[0]?.submenus[0]?.submenu_path;
        // await triggerOTPEmail();
        navigate(firstSubMenuPath || "/dashboard");
        // Log the successful login and navigate to the dashboard
      }
    } catch (error) {
      // Log the error and set an appropriate API error message
      console.error(error);
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

      {isForgotPasswordUpdated && (
        <Alert severity="success" sx={{ mb: 2, alignItems: "center" }}>
          Your password has been reseted successfully.
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
