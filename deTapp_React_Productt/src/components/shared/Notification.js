import React from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  '& .MuiAlert-message': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '& .MuiAlert-icon': {
    fontSize: '24px',
  },
}));

const NotificationMessage = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
  },
}));

const Notification = ({ 
  open, 
  message, 
  severity = 'success', 
  duration = 3000,
  onClose 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <StyledAlert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        elevation={6}
      >
        <NotificationMessage>
          {message}
        </NotificationMessage>
      </StyledAlert>
    </Snackbar>
  );
};

export default Notification;
