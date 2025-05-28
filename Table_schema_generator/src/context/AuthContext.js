import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) {
      return false;
    }
    return currentUser.roles.includes(role);
  };

  // Mock login function - in a real app, this would call an API
  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login
        if (email === 'admin@example.com' && password === 'password') {
          const user = {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            roles: ['admin', 'user']
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else if (email === 'user@example.com' && password === 'password') {
          const user = {
            id: '2',
            email: 'user@example.com',
            name: 'Regular User',
            roles: ['user']
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  // Mock register function
  const register = async (name, email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful registration
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          roles: ['user']
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...currentUser, ...userData };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 1000);
    });
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;