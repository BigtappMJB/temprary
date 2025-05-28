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
  Avatar,
  Grid,
  Chip
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { currentUser, updateProfile, hasRole } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await updateProfile({ name, email });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">You need to be logged in to view this page.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 800,
          mx: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            mb: 4
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: { xs: 2, sm: 0 },
              mr: { sm: 3 }
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
              User Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account information
            </Typography>
            <Box sx={{ mt: 1 }}>
              {currentUser.roles && currentUser.roles.map((role) => (
                <Chip
                  key={role}
                  label={role.charAt(0).toUpperCase() + role.slice(1)}
                  color={role === 'admin' ? 'primary' : 'default'}
                  size="small"
                  sx={{ mr: 1, mt: 1 }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="userId"
                label="User ID"
                value={currentUser.id || ''}
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 1, py: 1.2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {hasRole('admin') && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Admin Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                As an administrator, you have access to additional system settings and user management features.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
              >
                Manage Users
              </Button>
              <Button
                variant="outlined"
                color="primary"
              >
                System Settings
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;