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
  clearCookies,
  getCookie,
  removeCookie,
  setCookie,
} from "../../utilities/cookieServices/cookieServices";

import { encodeData } from "../../utilities/securities/encodeDecode";
import { encodedSessionDetailsCookieName, isForgotPasswordCookieName } from "../../utilities/generals";

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
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef();

  useEffect(() => {
    clearCookies()
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
   * Function to handle form submission.
   * It sends the form data to the login controller and handles the response.
   *
   * @param {Object} formData - The form data containing username, password, and remember me.
   */
  const onLogin = async (formData) => {
    try {
      console.log({ formData });

      startLoading();
      setApiError(null); // Reset API error before making a new request
      const response = await loginController(formData);
      if (response) {
        if (formData.rememberMe) {
          rememberMeFunction(formData);
        }
        console.log("Login successful:", response);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setApiError(
        error.errorMessage ||
          "Failed to login. Please check your credentials and try again."
      );
    } finally {
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
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
