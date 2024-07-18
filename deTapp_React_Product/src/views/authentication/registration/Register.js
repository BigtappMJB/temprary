import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../layouts/full/shared/logo/Logo";
import AuthCardComponent from "../generalComponents/CardComponent";
import { Alert, Box, Grid, Typography } from "@mui/material";
import RegisterFormComponent from "./components/registerFormComponent";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../../components/Loading/loadingProvider";
import { registerController } from "./controllers/registerController";
import { encodeData } from "../../utilities/securities/encodeDecode";
import {
  clearCookies,
  getCookie,
  removeCookie,
  setCookie,
} from "../../utilities/cookieServices/cookieServices";
import {
  encodedSessionDetailsCookieName,
  encodedTempUsersCookieName,
} from "../../utilities/generals";

/**
 * RegisterPage component for user registration.
 *
 * This component renders a registration page with a card component, logo, and a registration form.
 * It also provides a link to the login page.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 * import RegisterPage from './path-to-registerPage';
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/auth/register" element={<RegisterPage />} />
 *         <Route path="/auth/login" element={<Login />} />
 *       </Routes>
 *     </Router>
 *   );
 * }
 *
 * export default App;
 * ```
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
const RegisterPage = () => {
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const formRef = useRef();

  useEffect(() => {
    clearCookies();
  }, []);

  /**
   * Function to handle remember me functionality.
   * It encodes the form data and sets it in a cookie.
   *
   * @param {Object} data - The form data.
   */
  const storeUserDetailsInCookies = (data) => {
    const encodedData = encodeData(data);
    setCookie({
      name: encodedTempUsersCookieName,
      value: encodedData,
      expires: 24, // 24 hours
    });
  };

  /**
   * Handles user registration by sending a request to the register controller.
   *
   * @param {Object} formData - The user registration form data.
   * @returns {void}
   *
   * @example
   * const formData = {
   *   firstname: 'johnDoe',
   *   lastname:"",
   *   email: 'johndoe@example.com',
   *   mobileNo: ''
   * };
   * onRegister(formData);
   */

  const onRegister = async (formData) => {
    try {
      startLoading();
      setApiError(null);
      const response = await registerController(formData);
      storeUserDetailsInCookies(formData);
      if (response) {
        formRef.current.resetForm();
        console.log("Register successful", response);
        setApiSuccess("User registration has been successful.");
        navigate("/auth/emailVerification");
      }
    } catch (error) {
      console.log(error);
      setApiSuccess(null);
      setApiError(
        "Failed to register. Please check your details and try again."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <AuthCardComponent title={"Register"} description={"for registration"}>
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
          Register
        </Typography>
      </Box> */}

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      {apiSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {apiSuccess}
        </Alert>
      )}

      {/* Registration Form Section */}
      <RegisterFormComponent
        ref={(el) => (formRef.current = el)}
        onSubmit={onRegister}
      />

      {/* Link to Login Page */}
      <Box mt={3}>
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm="auto">
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              align="center"
            >
              Already have an Account?
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Typography
              component={Link}
              to="/auth/login"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                display: "block",
                textAlign: "center",
              }}
            >
              Sign In
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </AuthCardComponent>
  );
};

export default RegisterPage;
