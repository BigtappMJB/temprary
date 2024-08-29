import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { css } from "@emotion/react";

// Define validation schema
const formSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  age: Yup.number()
    .min(18, "You must be at least 18 years old")
    .required("Age is required"),
  signup_date: Yup.date().required("Signup date is required"),
});

const UserForm = ({ formAction }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/users", data);
      console.log("Form data submitted:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => reset();

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={formStyles}>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <TextField
            label="Username"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            label="Age"
            type="number"
            {...register("age")}
            error={!!errors.age}
            helperText={errors.age?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            label="Signup Date"
            type="date"
            {...register("signup_date")}
            error={!!errors.signup_date}
            helperText={errors.signup_date?.message}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
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
            {'reaad' !== "read" && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="primary"
              >
                {'add '=== "add" ? "Add" : "Update"}
              </Button>
            )}
            <Button
              type="button"
              variant="contained"
              color="primary"
              className="danger"
              onClick={handleReset}
            >
              {'read' !== "read" ? "Cancel" : "Close"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

const formStyles = css`
  .primary {
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  }
  .danger {
    background-color: #dc3545;
    color: white;
    &:hover {
      background-color: #c82333;
    }
  }
`;

export default UserForm;
