import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
    duration: 3000,
  });

  const showNotification = useCallback(({
    message,
    severity = 'success',
    duration = 3000,
  }) => {
    setNotification({
      open: true,
      message,
      severity,
      duration,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const notifySuccess = useCallback((message) => {
    showNotification({ message, severity: 'success' });
  }, [showNotification]);

  const notifyError = useCallback((message) => {
    showNotification({ message, severity: 'error', duration: 4000 });
  }, [showNotification]);

  const notifyInfo = useCallback((message) => {
    showNotification({ message, severity: 'info' });
  }, [showNotification]);

  const notifyWarning = useCallback((message) => {
    showNotification({ message, severity: 'warning', duration: 4000 });
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};

export default useNotification;
