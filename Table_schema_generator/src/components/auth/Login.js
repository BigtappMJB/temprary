import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Link
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Login successful - no need to navigate as the parent component will handle this
    } catch (error) {
      setError(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box
            component="img"
            src="/assets/bigtapp_pte_ltd_logo.jpeg"
            alt="BigTapp Logo"
            sx={{
              width: '120px',
              height: 'auto',
              mb: 2,
              borderRadius: '4px'
            }}
          />
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Log In
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter your credentials to access the Table Schema Generator
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Log In'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onRegisterClick}
              sx={{ fontWeight: 'medium' }}
            >
              Register here
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Demo credentials:
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" display="block" color="text.secondary">
              Admin: admin@example.com / password
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              User: user@example.com / password
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;