import React, { useImperativeHandle } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField";
import { errorMessages, validationRegex } from "../../../utilities/Validators";

/**
 * RegisterFormComponent component for user registration.
 * @param {Object} props - Component properties.
 * @param {string} props.title - Title of the registration form.
 * @param {string} props.subtext - Subtitle or additional text for the form.
 * @returns {JSX.Element} - Rendered component.
 */

// Validation schema
const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .required("First name is required")
    .matches(validationRegex.isLetters, errorMessages.isLetters),
  lastname: Yup.string()
    .required("Last name is required")
    .matches(validationRegex.isLetters, errorMessages.isLetters),
  email: Yup.string()
    .required("Email is required")
    .matches(validationRegex.email, errorMessages.email),

  mobileno: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

});

const RegisterFormComponent = React.forwardRef(({ onSubmit }, ref) => {
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // Toggle password visibility
  // const handleClickShowPassword = () => setShowPassword(!showPassword);
  // const handleClickShowConfirmPassword = () =>
  //   setShowConfirmPassword(!showConfirmPassword);

  // Handle form submission
  const onLocalSubmit = async () => {
    onSubmit(getValues());
  };

  // Expose a method to reset the form via ref
  useImperativeHandle(ref, () => ({
    resetForm: async () => {
      reset({
        firstname: "",
        lastname: "",
        email: "",
        mobileno: "",
        password: "",
        confirmPassword: "",
      });
    },
  }));

  return (
    <>
      <form onSubmit={handleSubmit(onLocalSubmit)}>
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
    </>
  );
});

export default RegisterFormComponent;
