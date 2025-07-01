import React, { useImperativeHandle, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
  Grid,
  FormControlLabel,
  IconButton,
  ButtonBase,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField"; // Ensure the correct path
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { setCookie } from "../../../utilities/cookieServices/cookieServices";
import {
  isForgotPasswordCookieName,
  isUserIdCookieName,
} from "../../../utilities/generals";
import { validationRegex } from "../../../utilities/Validators";
import { encodeData } from "../../../utilities/securities/encodeDecode";
import { triggerOTPEmailController } from "../../emailVerification/controllers/EmailVerificationController";
import { useLoading } from "../../../../components/Loading/loadingProvider";

/**
 * LoginFormComponent handles the login form functionality.
 *
 * This component renders a login form with fields for username and password,
 * and handles form validation, submission, and error display.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import LoginFormComponent from './path-to-loginFormComponent';
 *
 * function LoginPage() {
 *   return (
 *     <div>
 *       <h1>Login Page</h1>
 *       <LoginFormComponent />
 *     </div>
 *   );
 * }
 *
 * export default LoginPage;
 * ```
 *
 * @returns {JSX.Element} The rendered login form component.
 */

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Email is required")
    .matches(validationRegex.email, "Invalid Email"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

const LoginFormComponent = React.forwardRef(({ onSubmit }, ref) => {
  const {
    handleSubmit,
    control,
    getValues,
    trigger,
    getFieldState,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  /**
   * Handle passwordToggle.
   */
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handle form submission.
   * @param {Object} data - Form data containing username and password.
   */
  const onLocalSubmit = async (data) => {
    onSubmit(getValues());
  };

  // Expose a method to reset the form via ref
  useImperativeHandle(ref, () => ({
    resetForm: async () => {
      reset({
        username: "",
        password: "",
        rememberMe: true,
      });
    },
  }));
  const triggerOTPEmail = async () => {
    try {
      startLoading();
      await triggerOTPEmailController();
      navigate("/auth/forgotPassword");
    } catch (error) {
      console.error(error);
      setApiError(
        error.errorMessage ||
          "Failed to login. Please check your credentials and try again."
      );
    } finally {
      stopLoading();
    }
  };

  const handleForgotPassword = () => {
    if (getValues().username && !getFieldState("username").invalid) {
      setCookie({
        name: isUserIdCookieName,
        value: encodeData(getValues().username),
        unit: {
          h: 24,
        },
      });
      setCookie({
        name: isForgotPasswordCookieName,
        value: encodeData("true"),
        unit: {
          h: 24,
        },
      });
      triggerOTPEmail();
    } else {
      trigger(["username"]);
    }
  };

  return (
    <>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2, alignItems: "center" }}>
          {apiError}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onLocalSubmit)}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Email
            </Typography>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Box position="relative">
                  <CustomTextField
                    {...field}
                    id="username"
                    variant="outlined"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputProps={{
                      startAdornment: (
                        <Email color="action" sx={{ mr: 1, ml: 0.5 }} />
                      ),
                    }}
                  />
                </Box>
              )}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Box position="relative">
                  <CustomTextField
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <Lock color="action" sx={{ mr: 1, ml: 0.5 }} />
                      ),
                    }}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleTogglePassword()}
                    edge="end"
                    sx={{ position: "absolute", right: 8, top: 8 }}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
              )}
            />
          </Box>

          <Box mt={3}>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sm="auto">
                <Controller
                  name="rememberMe"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} defaultChecked />}
                      label="Remember Me"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm="auto">
                <Typography
                  component={ButtonBase}
                  onClick={handleForgotPassword}
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  Forgot Password?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
        <Box mt={4}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </form>
    </>
  );
});

export default LoginFormComponent;
