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
import { storeLoginDetails } from "../../../redux/slices/slice";

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
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();

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

  const rememberMeFunction = (data) => {
    const encodedData = encodeData(data);
    setCookie({
      name: encodedSessionDetailsCookieName,
      value: encodedData,
      expires: 24, // 24 hours
    });
  };

  const onLogin = async (formData) => {
    try {
      // Remove the default password status cookie and reset the state variable
      removeCookie(isEmailVerifiedForDefaultPasswordCookieName);
      removeCookie(isDefaultPasswordChangedCookieName);
      removeCookie(isForgotPasswordCookieName);
      removeCookie(isDefaultPasswordUpdated);
      removeCookie(isPermissionDetailsCookieName);
      removeCookie(isLoginTokenCookieName);
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

        const loginDetails = {
          username: formData.username,
          userDetails: response,
        };

        dispatch(storeLoginDetails(loginDetails));

        // Remember the user if the rememberMe flag is set
        if (formData.rememberMe) {
          rememberMeFunction(response);
        }

        // Set a cookie to indicate the loginStatus status
        setCookie({
          name: isLoginSuccessCookieName,
          value: encodeData(1),
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
