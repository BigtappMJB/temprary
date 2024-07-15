import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { loginController } from '../controllers/loginController';

// Validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required'),
        //.matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Invalid username format'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be below at 20 characters')
        //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        try {
            setApiError(null); // Reset API error before making a new request
            const response = await loginController(data);
            console.log('Login successful:', response);
            // Redirect to the dashboard on successful login
            navigate('/dashboard');
        } catch (error) {
            setApiError(error.message || 'Failed to login. Please check your credentials and try again.');
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {subtext}
                </Typography>
            ) : null}

            {apiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {apiError}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor='username'
                            mb="5px"
                        >
                            Username
                        </Typography>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    id="username"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mt="25px">
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor='password'
                            mb="5px"
                        >
                            Password
                        </Typography>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    id="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                    </Box>
                    <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Remember this Device"
                            />
                        </FormGroup>
                        <Typography
                            component={Link}
                            to="/"
                            fontWeight="500"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Stack>
                </Stack>
                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                    >
                        Sign In
                    </Button>
                </Box>
            </form>

            {subtitle}
        </>
    );
};

export default AuthLogin;
