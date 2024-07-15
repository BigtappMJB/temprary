import React, { createContext, useState } from 'react';

// Create a new context instance
const LoadingContext = createContext();

/**
 * Provider component for managing loading state.
 *
 * @component
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components wrapped by the provider
 * @returns {JSX.Element} Provider component
 */
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to set loading state to true
  const startLoading = () => setIsLoading(true);

  // Function to set loading state to false
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Custom hook to access loading context values.
 *
 * @returns {Object} Loading context values
 */
export const useLoading = () => React.useContext(LoadingContext);
