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
  menu: yup.object().required("Menu is required"),
  name: yup
    .string()
    .required("Name is required")
    .matches(validationRegex.isLetters, errorMessages.isLetters),
  description: yup
    .string()
    .required("Description is required")
    .matches(validationRegex.bio, errorMessages.bio),
});

/**
 * SubMenuFormComponent renders a form with fields for submenu details.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array} props.menuList - List of menus to populate the Autocomplete
 * @example
 * // Sample usage
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   ID: '1',
 *   MENU_ID: 'admin',
 *   NAME: 'SubMenu1',
 *   DESCRIPTION: 'Description for submenu 1'
 * };
 * const menuList = [
 *   { ID: 'admin', NAME: 'Admin' },
 *   { ID: 'user', NAME: 'User' }
 * ];
 *
 * <SubMenuFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   menuList={menuList}
 * />
 */
const SubMenuFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  menuList,
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
      const menu =
        menuList.find((role) => role.ID === defaultValues.MENU_ID) || null;
      reset({
        menu: menu,
        name: defaultValues.NAME ?? "",
        description: defaultValues.DESCRIPTION ?? "",
      });
    }
  }, [defaultValues, reset, menuList, formAction]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        menu: null,
        name: "",
        description: "",
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
      menu: null,
      name: "",
      description: "",
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({
      menu: null,
      name: "",
      description: "",
    });
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onLocalSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="menu"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={menuList}
                getOptionLabel={(option) => option.NAME}
                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Menu"
                    fullWidth
                    error={!!errors.menu}
                    helperText={errors.menu?.message}
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
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
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
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description?.message}
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
              <Button type="submit" variant="contained" color="primary" className="primary">
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

export default SubMenuFormComponent;
