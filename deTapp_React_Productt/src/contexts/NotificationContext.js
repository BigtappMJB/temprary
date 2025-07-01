import React, { createContext, useContext } from 'react';
import useNotification from '../hooks/useNotification';
import Notification from '../components/shared/Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notificationUtils = useNotification();
  const { notification, hideNotification } = notificationUtils;

  return (
    <NotificationContext.Provider value={notificationUtils}>
      {children}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
