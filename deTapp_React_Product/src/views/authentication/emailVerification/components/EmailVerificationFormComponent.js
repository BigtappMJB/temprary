import React, { useImperativeHandle } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
  Grid,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField"; // Ensure the correct path

/**
 * EmailVerificationFormComponent handles the login form functionality.
 *
 * This component renders a login form with fields for username and password,
 * and handles form validation, submission, and error display.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import EmailVerificationFormComponent from './path-to-EmailVerificationFormComponent';
 *
 * function LoginPage() {
 *   return (
 *     <div>
 *       <h1>Login Page</h1>
 *       <EmailVerificationFormComponent />
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
  code: Yup.string().required("Code is required"),
});

const EmailVerificationFormComponent = React.forwardRef(({ onSubmit }, ref) => {
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
   * @param {Object} data - Form data containing code.
   */
  const onLocalSubmit = async (data) => {
    onSubmit(getValues());
  };

  // Expose a method to reset the form via ref
  useImperativeHandle(ref, () => ({
    resetForm: async () => {
      reset({
        code: "",
      });
    },
  }));

  return (
    <form onSubmit={handleSubmit(onLocalSubmit)}>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="code"
            mb="5px"
          >
            Email Verification Code
          </Typography>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                id="code"
                variant="outlined"
                fullWidth
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            )}
          />
        </Box>
      </Stack>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Verify
        </Button>
      </Box>
    </form>
  );
});

export default EmailVerificationFormComponent;
