// src/components/FormComponent.js
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import PropTypes from "prop-types";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  alignItems: "center",
  background:
    "linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))",
}));
// Validation schema with regex patterns
const schema = yup.object().shape({
  projectPhase: yup
    .object()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Project phase is required"),
  projectRole: yup
    .object()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Project Role is required"),

  activityName: yup.string().required("Activity Name is required"),
});

/**
 * ProjectCreationForm renders a form with fields for user details.
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
 * <ProjectCreationForm
 *   formAction={formAction}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 *   onReset={handleReset}
 *   rolesList={rolesList}
 * />
 */
const ProjectCreationForm = forwardRef(
  (
    { formAction, defaultValues, onSubmit, onReset, projectRole, projectPhase },
    ref
  ) => {
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
    });

    // Effect to set default values and reset the form
    useEffect(() => {
      if (defaultValues) {
        reset({
          projectPhase:
            projectPhase?.filter(
              (ele) => ele.id === defaultValues.PHASE_CODE
            )[0] ?? null,
          projectRole:
            projectRole.filter(
              (ele) => ele.id === Number(defaultValues.PROJECT_ROLE_ID)
            )[0] ?? null,
          activityName: defaultValues?.ACTIVITY_CODE ?? null,
        });
      }
    }, [defaultValues, projectPhase, reset, projectRole, formAction]);

    // Effect to set read-only state and reset form on formAction change
    useEffect(() => {
      setReadOnly(formAction?.action === "read");
      if (formAction.action === "add") {
        reset({
          projectPhase: "",
          projectRole: "",

          activityName: "",
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
        projectPhase: null,
        projectRole: null,
        activityName: "",
      });
    };

    /**
     * Submits the form data
     */
    const onLocalSubmit = () => {
      onSubmit(getValues());
      // reset({
      //   projectPhase: null,
      //   projectRole: null,
      //   activityName: "",
      // });
    };
    // Expose a method to trigger validation via ref
    useImperativeHandle(ref, () => ({
      resetForm: async () => {
        reset({
          projectPhase: null,
          projectRole: null,
          activityName: "",
        });
      },
    }));

    return (
      <Container
        component="form"
        className="panel-bg"
        onSubmit={handleSubmit(onLocalSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="projectPhase"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={projectPhase}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={field.value || null}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select projectPhase"
                      fullWidth
                      error={!!errors.projectPhase}
                      helperText={errors.projectPhase?.message}
                      InputLabelProps={{
                        shrink: Boolean(field.value || isFocused.menu),
                      }}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: readOnly, // Set to true if you want the field to be read-only
                        onFocus: () =>
                          setIsFocused({ ...isFocused, menu: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, menu: false }),
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="projectRole"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={projectRole}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={field.value || null}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select projectRole"
                      fullWidth
                      error={!!errors.projectRole}
                      helperText={errors.projectRole?.message}
                      InputLabelProps={{
                        shrink: Boolean(field.value || isFocused.projectRole),
                      }}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: readOnly, // Set to true if you want the field to be read-only
                        onFocus: () =>
                          setIsFocused({ ...isFocused, projectRole: true }),
                        onBlur: () =>
                          setIsFocused({ ...isFocused, projectRole: false }),
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="activityName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter activity name"
                  fullWidth
                  variant="outlined"
                  error={!!errors.activityName}
                  helperText={errors.activityName?.message}
                  InputLabelProps={{ shrink: field.value }}
                  InputProps={{
                    readOnly: readOnly, // Make the field read-only
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
              {formAction.action !== "read" && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="primary"
                >
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
  }
);

// Define PropTypes for validation
ProjectCreationForm.propTypes = {
  formAction: PropTypes.shape({
    action: PropTypes.string.isRequired, // formAction has an 'action' key and is required
  }).isRequired, // formAction is required

  defaultValues: PropTypes.shape({
    PHASE_CODE: PropTypes.number.isRequired, // PHASE_CODE should be a number
    PROJECT_ROLE_ID: PropTypes.number.isRequired, // PROJECT_ROLE_ID should be a number
    ACTIVITY_CODE: PropTypes.string, // ACTIVITY_CODE should be a string
  }).isRequired, // defaultValues is required

  onSubmit: PropTypes.func.isRequired, // onSubmit is a required function
  onReset: PropTypes.func.isRequired, // onReset is a required function

  projectRole: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // id should be a number and required in projectRole
      name: PropTypes.string, // roleName is optional and should be a string
    })
  ).isRequired, // projectRole is a required array of objects

  projectPhase: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // id should be a number and required in projectPhase
      name: PropTypes.string, // phaseName is optional and should be a string
    })
  ).isRequired, // projectPhase is a required array of objects
};

export default ProjectCreationForm;
