import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../views/utilities/cookieServices/cookieServices';
import { isLoginTokenCookieName } from '../views/utilities/generals';

// Utility function to check if user token is present
const isAuthenticated = () => {
  const userToken = getCookie(isLoginTokenCookieName)
  return !!userToken;
};
console.log(isAuthenticated());
export const ProtectedRoute = ( element ) => {
  return isAuthenticated() ? element : <Navigate to="/auth/login" />;
};

export const LoginProtectedRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : element;
};
