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
import {
  storeLoginDetails,
  storeMenuDetails,
} from "../../../redux/slices/slice";

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
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [apiError, setApiError] = useState(null);
  const [isDefaultPassword, setIsDefaultPassword] = useState(
    getCookie(isEmailVerifiedForDefaultPasswordCookieName) !== null
  );
  const [isDefaultPasswordUpdated, setIsDefaultPasswordUpdated] = useState(
    getCookie(isDefaultPasswordChangedCookieName) !== null
  );
  const [forgotPasswordUpdated, setForgotPasswordUpdated] = useState(
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
      resetCookiesAndState();

      startLoading();
      setApiError(null);

      const response = await loginController(formData);
      handleLoginResponse(response, formData);
    } catch (error) {
      handleLoginError(error);
    } finally {
      stopLoading();
    }
  };

  // Helper function to reset cookies and state variables
  const resetCookiesAndState = () => {
    const cookiesToRemove = [
      isEmailVerifiedForDefaultPasswordCookieName,
      isDefaultPasswordChangedCookieName,
      isForgotPasswordCookieName,
      isDefaultPasswordUpdated,
      isPermissionDetailsCookieName,
      isLoginTokenCookieName,
    ];

    cookiesToRemove.forEach(removeCookie);
    setIsDefaultPasswordUpdated(false);
    setIsDefaultPassword(false);
    setForgotPasswordUpdated(false);
  };

  // Helper function to handle the response from loginController
  const handleLoginResponse = (response, formData) => {
    if (response) {
      console.log("Login response received:", response);
      
      storeLoginCookies(response, formData);
      if (!response?.is_verified) {
        navigate("/auth/emailVerification");
        return;
      }
      if (!response?.is_default_password_changed) {
        navigate("/auth/changePassword");
        return;
      }

      storeLoginDetailsInState(response, formData);

      if (formData.rememberMe) {
        rememberMeFunction(response);
      }

      setCookie({
        name: isLoginSuccessCookieName,
        value: encodeData(1),
      });

      // Store the entire login response in localStorage for later use
      try {
        localStorage.setItem("loginResponse", JSON.stringify(response));
      } catch (e) {
        console.warn("Error storing login response:", e);
      }
      
      // Store token for authentication
      localStorage.setItem("token", response.token);
      
      // Navigate to the first available submenu or dashboard
      let firstSubMenuPath = "/dashboard";
      if (response?.permissions && 
          Array.isArray(response.permissions) && 
          response.permissions.length > 0 && 
          response.permissions[0]?.submenus && 
          response.permissions[0].submenus.length > 0) {
        firstSubMenuPath = response.permissions[0].submenus[0].submenu_path;
      }
      
      console.log("Navigating to:", firstSubMenuPath);
      navigate(firstSubMenuPath);
    }
  };

  // Helper function to store login cookies
  const storeLoginCookies = (response, formData) => {
    setCookie({
      name: isUserIdCookieName,
      value: encodeData(formData?.username),
    });

    setCookie({
      name: isEmailVerifiedStatusCookieName,
      value: encodeData(response?.is_verified ? 1 : 0),
    });

    setCookie({
      name: isDefaultPasswordStatusCookieName,
      value: encodeData(response?.is_default_password_changed ? 1 : 0),
    });
  };

  // Helper function to store login details in the state
  const storeLoginDetailsInState = (response, formData) => {
    const loginDetails = {
      username: formData.username,
      userDetails: response,
    };

    console.log("Login response:", response);
    console.log("Storing login details:", loginDetails);
    
    dispatch(storeLoginDetails(loginDetails));
    
    // Ensure permissions exist and are properly formatted
    if (response?.permissions && Array.isArray(response.permissions)) {
      console.log("Storing menu details from login:", response.permissions);
      dispatch(storeMenuDetails(response.permissions));
    } else {
      console.warn("No valid permissions in login response");
      // If no permissions, we could set default ones here
      // or handle this case differently
    }
  };

  // Helper function to handle login error
  const handleLoginError = (error) => {
    console.error(error);
    setApiError(
      error.errorMessage ||
        "Failed to login. Please check your credentials and try again."
    );
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

      {forgotPasswordUpdated && (
        <Alert severity="success" sx={{ mb: 2, alignItems: "center" }}>
          Your password has been reset successfully.
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
