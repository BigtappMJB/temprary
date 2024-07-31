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
  role: yup.object().required("Role is required"),
  subMenu: yup.object().required("SubMenu is required"),
  permission: yup.object().required("Permission is required"),
});

/**
 * RolePermissionFormComponent renders a form with fields for role permissions.
 * The form is validated using Yup schema and managed with React Hook Form.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.formAction - Object containing action type (e.g., 'add', 'read')
 * @param {Object} props.defaultValues - Default values for the form fields
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onReset - Function to handle form reset
 * @param {Array} props.menuList - List of menus to populate the Autocomplete
 * @param {Array} props.permissionLevelList - List of permission levels
 * @param {Array} props.subMenusList - List of submenus to populate the Autocomplete
 * @param {Array} props.rolesList - List of roles to populate the Autocomplete
 * @example
 * // Sample usage
 * const formAction = { action: 'add' };
 * const defaultValues = {
 *   ID: '1',
 *   MENU_ID: '1',
 *   SUB_MENU_ID: '1',
 *   ROLE_ID: '1',
 *   PERMISSION_LEVEL: '1',
 * };
 * const menuList = [
 *   { ID: '1', NAME: 'Admin' },
 *   { ID: '2', NAME: 'User' }
 * ];
 * const permissionLevelList = [
 *   { ID: '1', LEVEL: 'Level 1' },
 *   { ID: '2', LEVEL: 'Level 2' }
 * ];
 * const subMenusList = [
 *   { ID: 'sub1', NAME: 'SubMenu 1', MENU_ID: '1' },
 *   { ID: 'sub2', NAME: 'SubMenu 2', MENU_ID: '1' }
 * ];
 * const rolesList = [
 *   { ID: '1', NAME: 'Role 1' },
 *   { ID: '2', NAME: 'Role 2' }
 * ];
 *
 * <RolePermissionFormComponent
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   menuList={menuList}
 *   permissionLevelList={permissionLevelList}
 *   subMenusList={subMenusList}
 *   rolesList={rolesList}
 * />
 */
const RolePermissionFormComponent = ({
  formAction,
  defaultValues,
  onSubmit,
  onReset,
  menuList,
  permissionLevelList,
  subMenusList,
  rolesList,
}) => {
  const [readOnly, setReadOnly] = useState(false);
  const [subMenuList, setSubMenuList] = useState(subMenusList);

  const [isFocused, setIsFocused] = useState({
    role: false,
    permission: false,
    subMenu: false,
    menu: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    // watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  //   const watchMenu = watch("menu");

  //   // Effect to update subMenuList and reset subMenu when menu changes
  //   useEffect(() => {
  //     if (watchMenu && watchMenu.ID !== defaultValues.MENU_ID) {
  //       const filteredSubMenus = subMenusList.filter(
  //         (data) => data.MENU_ID === watchMenu.ID
  //       );
  //       setSubMenuList(filteredSubMenus);

  //       // Reset only the 'subMenu' field
  //       reset((prevValues) => ({
  //         ...prevValues,
  //         subMenu: null,
  //       }));
  //     }
  //   }, [watchMenu, subMenusList, reset, defaultValues.MENU_ID]);

  // Effect to set default values and reset the form

  useEffect(() => {
    if (defaultValues) {
      const menu =
        menuList.find((data) => data.ID === defaultValues.MENU_ID) || null;
      const subMenu =
        subMenusList.find((data) => data.ID === defaultValues.SUB_MENU_ID) ||
        null;
      const role =
        rolesList.find((data) => data.id === defaultValues.ROLE_ID) || null;
      const permission =
        permissionLevelList.find(
          (data) => data.ID === defaultValues.PERMISSION_LEVEL
        ) || null;
      reset({
        menu,
        subMenu,
        permission,
        role,
      });
    }
  }, [
    defaultValues,
    reset,
    menuList,
    rolesList,
    permissionLevelList,
    subMenusList,
    formAction,
  ]);

  // Effect to set read-only state and reset form on formAction change
  useEffect(() => {
    setReadOnly(formAction?.action === "read");
    if (formAction.action === "add") {
      reset({
        menu: null,
        subMenu: null,
        permission: null,
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
      menu: null,
      subMenu: null,
      permission: null,
      role: null,
    });
  };

  /**
   * Submits the form data
   */
  const onLocalSubmit = () => {
    onSubmit(getValues());
    reset({
      menu: null,
      subMenu: null,
      permission: null,
      role: null,
    });
  };

  return (
    <Container component="form" className="panel-bg" onSubmit={handleSubmit(onLocalSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={rolesList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select role"
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
                      shrink: Boolean(field.value || isFocused.menu),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () => setIsFocused({ ...isFocused, menu: true }),
                      onBlur: () => setIsFocused({ ...isFocused, menu: false }),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="subMenu"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={subMenusList}
                getOptionLabel={(option) => option.NAME}
                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select submenu"
                    fullWidth
                    error={!!errors.subMenu}
                    helperText={errors.subMenu?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.subMenu),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, subMenu: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, subMenu: false }),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="permission"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={permissionLevelList}
                getOptionLabel={(option) => option.LEVEL}
                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                value={field.value || null}
                onChange={(_, data) => field.onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select permission"
                    fullWidth
                    error={!!errors.permission}
                    helperText={errors.permission?.message}
                    InputLabelProps={{
                      shrink: Boolean(field.value || isFocused.permission),
                    }}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: readOnly, // Set to true if you want the field to be read-only
                      onFocus: () =>
                        setIsFocused({ ...isFocused, permission: true }),
                      onBlur: () =>
                        setIsFocused({ ...isFocused, permission: true }),
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
              color="primary"
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

export default RolePermissionFormComponent;
