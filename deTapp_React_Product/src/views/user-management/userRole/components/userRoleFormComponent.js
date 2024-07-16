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

// Styled container for form layout
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
  user: yup.object().required("User is required"),
  role: yup.object().required("Role is required"),
});

/**
 * UserRoleFormComponent renders a form with fields for user and role selection.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read', 'update')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array} props.userList - List of users to populate the Autocomplete
 * @param {Array} props.rolesList - List of roles to populate the Autocomplete
 * <UserRoleFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   userList={userList}
 *   rolesList={rolesList}
 * />
 */
const UserRoleFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  rolesList,
  userList,
}) => {
  const [readOnly, setReadOnly] = useState(false);
  const [isFocused, setIsFocused] = useState({
    user: false,
    role: false,
  });

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
      const user =
        userList.find((data) => data.ID === defaultValues.ID) || null;
      const role =
        rolesList.find((data) => data.ID === defaultValues.ROLE) || null;
      reset({
        user,
        role,
      });
    }
  }, [defaultValues, reset, userList, rolesList, formAction]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        user: null,
        role: null,
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
      user: null,
      role: null,
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    if (formAction.action === "add") {
      if (getValues().user.ROLE_NAME) {
        onSubmit({ alreadyAdded: true });
        return;
      } else {
        onSubmit(getValues());
      }
    } else {
      onSubmit(getValues());
    }
    reset({
      user: null,
      role: null,
    });
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onLocalSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="user"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={userList}
                getOptionLabel={(option) =>
                  `${option.FIRST_NAME} ${option.LAST_NAME}`
                }
                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                readOnly={formAction.action === "update"} // Set readOnly to true for Autocomplete
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select user"
                    fullWidth
                    error={!!errors.user}
                    helperText={errors.user?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.user),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () => setIsFocused({ ...isFocused, user: true }),
                      onBlur: () => setIsFocused({ ...isFocused, user: false }),
                    }}
                  />
                )}
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
                      shrink: Boolean(field.value || isFocused.role),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () => setIsFocused({ ...isFocused, role: true }),
                      onBlur: () => setIsFocused({ ...isFocused, role: false }),
                    }}
                  />
                )}
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
              className="danger"
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

export default UserRoleFormComponent;
