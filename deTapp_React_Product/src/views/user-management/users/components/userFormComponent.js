// src/components/FormComponent.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  styled,
  Box,
  Autocomplete,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../../utilities/Validators";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

// Schema for form validation using Yup
const schema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  role: yup.object().required("Role is required"),
  firstName: yup
    .string()
    .required("First Name is required")
    .matches(validationRegex.firstName, errorMessages.firstName),
  lastName: yup
    .string()
    .required("Last Name is required")
    .matches(validationRegex.lastName, errorMessages.lastName),
  email: yup
    .string()
    .required("Email is required")
    .matches(validationRegex.email, errorMessages.email),
  mobileNo: yup
    .string()
    .matches(validationRegex.phoneNumber, errorMessages.phoneNumber)
    .required("Mobile No is required"),
});

/**
 * UserFormComponent renders a form with fields for user details.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array} props.rolesList - List of roles to populate the Autocomplete
 * @example
 * // Sample usage
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   USER_ID: '1',
 *   ROLE: 'admin',
 *   FIRST_NAME: 'John',
 *   LAST_NAME: 'Doe',
 *   EMAIL: 'john.doe@example.com',
 *   MOBILE: '1234567890'
 * };
 * const rolesList = [
 *   { ID: 'admin', NAME: 'Admin' },
 *   { ID: 'user', NAME: 'User' }
 * ];
 *
 * <UserFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   rolesList={rolesList}
 * />
 */
const UserFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  rolesList,
}) => {
  const [readOnly, setReadOnly] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  // Effect to set default values and reset the form
  useEffect(() => {
    if (defaultValues) {
      const role =
        rolesList.find((role) => role.ID === defaultValues.ROLE) || null;
      reset({
        userId: defaultValues.USER_ID ?? "",
        role: role,
        firstName: defaultValues.FIRST_NAME ?? "",
        lastName: defaultValues.LAST_NAME ?? "",
        email: defaultValues.EMAIL ?? "",
        mobileNo: defaultValues.MOBILE ?? "",
      });
    }
  }, [defaultValues, reset, rolesList, formAction]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        userId: "",
        role: null,
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
      });
    }
  }, [formAction, reset]);

  // Effect to sanitize input values
  useEffect(() => {
    const sanitizeInputs = () => {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.value = DOMPurify.sanitize(input.value);
      });
    };

    sanitizeInputs();
  }, []);

  /**
   * Resets the form to its initial state
   */
  const handleReset = () => {
    onReset();
    reset({
      userId: "",
      role: null,
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({
      userId: "",
      role: null,
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
    });
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onLocalSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="User ID"
                fullWidth
                variant="outlined"
                error={!!errors.userId}
                helperText={errors.userId?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={rolesList}
                getOptionLabel={(option) => option.NAME}
                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Role"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () => setIsFocused(true),
                      onBlur: () => setIsFocused(false),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email ID"
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="mobileNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile No"
                fullWidth
                variant="outlined"
                error={!!errors.mobileNo}
                helperText={errors.mobileNo?.message}
                InputLabelProps={{ shrink: field.value }}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2} // Adds space between buttons
          >
            {formAction.action !== "read" && (
              <Button type="submit" variant="contained" color="primary">
                {formAction.action === "add" ? "Add" : "Update"}
              </Button>
            )}

            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleReset}
            >
              {formAction.action !== "read" ? "Cancel" : "Close"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserFormComponent;
