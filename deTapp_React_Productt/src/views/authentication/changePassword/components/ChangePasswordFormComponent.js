import React, { useImperativeHandle, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField"; // Ensure the correct path
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PropTypes from "prop-types";

/**
 * ChangePasswordFormComponent handles the login form functionality.
 *
 * This component renders a login form with fields for username and password,
 * and handles form validation, submission, and error display.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import ChangePasswordFormComponent from './path-to-ChangePasswordFormComponent';
 *
 * function LoginPage() {
 *   return (
 *     <div>
 *       <h1>Login Page</h1>
 *       <ChangePasswordFormComponent />
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
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^()\-_=+\/])[A-Za-z\d@$!%*?&^()\-_=+\/]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const ChangePasswordFormComponent = React.forwardRef(
  ({ onSubmit, handleReset }, ref) => {
    const [showPassword, setShowPassword] = useState({
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
    const {
      handleSubmit,
      control,
      getValues,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
    });

    /**
     * Handle form submission.
     * @param {Object} data - Form data containing username and password.
     */
    const onLocalSubmit = async (data) => {
      onSubmit(getValues());
    };

    const handleClickShowPassword = (key) => {
      setShowPassword({ ...showPassword, [key]: !showPassword[key] });
    };

    // Expose a method to reset the form via ref
    useImperativeHandle(ref, () => ({
      resetForm: async () => {
        reset({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      },
    }));

    return (
      <form onSubmit={handleSubmit(onLocalSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Current Password
            </Typography>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="oldPassword"
                  type={showPassword?.oldPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword("oldPassword")}
                          edge="end"
                        >
                          {!showPassword?.oldPassword ? (
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

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              New Password
            </Typography>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="newPassword"
                  type={showPassword?.newPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword("newPassword")}
                          edge="end"
                        >
                          {!showPassword?.newPassword ? (
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

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Confirm Password
            </Typography>
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  id="confirmNewPassword"
                  type={showPassword?.confirmNewPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            handleClickShowPassword("confirmNewPassword")
                          }
                          edge="end"
                        >
                          {!showPassword?.confirmNewPassword ? (
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

          <Grid item xs={12} sm={12}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              flexWrap="wrap"
              gap={2} // Adds space between buttons
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="primary"
              >
                Update
              </Button>

              <Button
                type="button"
                variant="contained"
                color="primary"
                className="danger"
                onClick={handleReset}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  }
);

ChangePasswordFormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};
export default ChangePasswordFormComponent;
