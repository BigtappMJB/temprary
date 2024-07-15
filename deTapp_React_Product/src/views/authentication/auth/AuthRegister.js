import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { registerController } from "../controllers/registerController";
import { useNavigate } from "react-router";
import { useLoading } from "../../../components/Loading/loadingProvider";

// Validation schema
const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  mobileno: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { startLoading, stopLoading } = useLoading();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data) => {
    try {
      startLoading();
      setApiError(null);
      const response = await registerController(data);
      console.log("Register successfull", response);
      // Redirect to dashboard on successful registration
      // Replace this with your actual redirect logic
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        "Failed to register. Please check your details and try again."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="firstname"
              mb="5px"
            >
              First Name
            </Typography>
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="firstname"
                  variant="outlined"
                  fullWidth
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="lastname"
              mb="5px"
            >
              Last Name
            </Typography>
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="lastname"
                  variant="outlined"
                  fullWidth
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="mobileno"
              mb="5px"
            >
              Mobile No
            </Typography>
            <Controller
              name="mobileno"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="mobileno"
                  variant="outlined"
                  fullWidth
                  error={!!errors.mobileno}
                  helperText={errors.mobileno?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
                <CustomTextField
                  {...field}
                  id="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="confirmPassword"
              mb="5px"
            >
              Confirm Password
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign Up
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthRegister;
