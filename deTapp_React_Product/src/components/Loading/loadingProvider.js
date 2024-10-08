import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

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

  const contextValue = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access loading context values.
 *
 * @returns {Object} Loading context values
 */
export const useLoading = () => React.useContext(LoadingContext);
