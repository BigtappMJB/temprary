// src/components/FormComponent.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Grid, styled, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { errorMessages, validationRegex } from "../../../utilities/Validators";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  // overflow: "auto",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));

const schema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  role: yup.string().required("Role is required"),
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

const UserFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
}) => {
  const [readOnly, setReadOnly] = useState(false);

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

  useEffect(() => {
    if (defaultValues) {
      reset({
        columnName: defaultValues.columnName ?? "",
        defaultValuesType: defaultValues.defaultValuesType ?? "",
        length: defaultValues.length ?? "",
        isPrimary: defaultValues.isPrimary ?? false,
        isForeign: defaultValues.isForeign ?? false,
        isMandatory: defaultValues.isMandatory ?? false,
        defaultValue: defaultValues.defaultValue ?? "",
        fkTableName: defaultValues.fkTableName ?? "",
        fkTableFieldName: defaultValues.fkTableFieldName ?? "",
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    setReadOnly(formAction?.action === "read");
  }, [formAction]);

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

  // Reset form handler
  const handleReset = () => {
    reset({});
    onReset();
  };

  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({});
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
              <TextField
                {...field}
                label="Select Role"
                select
                fullWidth
                variant="outlined"
                error={!!errors.role}
                helperText={errors.role?.message}
                InputProps={{
                  readOnly: readOnly, // Make the field read-only
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </TextField>
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
