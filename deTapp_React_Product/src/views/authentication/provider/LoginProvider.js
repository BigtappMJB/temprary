import React, { createContext, useState } from "react";
import { decodeData } from "../../utilities/securities/encodeDecode";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isPermissionDetailsCookieName } from "../../utilities/generals";

// Create a new context instance
const LoginContext = createContext();

/**
 * Provider component for managing loading state.
 *
 * @component
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components wrapped by the provider
 * @returns {JSX.Element} Provider component
 */
export const LoginProvider = ({ children }) => {
  const [isLoginStatus, setLoginStatus] = useState(false);
  const [menuList, setMenuList] = useState(() => {
    // Load menuList from localStorage if it exists
    return decodeData(getCookie(isPermissionDetailsCookieName)) ?? [];
  });

  // Function to set loading state to true
  const setLoginStatusFunction = (value) => setLoginStatus(value);



  // Function to set loading state to false
  const setMenuListFunction = (value) => {
    setMenuList(value);
  };


  return (
    <LoginContext.Provider
      value={{
        isLoginStatus,
        menuList,
        setLoginStatusFunction,
        setMenuListFunction,
     
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

/**
 * Custom hook to access loading context values.
 *
 * @returns {Object} Loading context values
 */
export const useLoginProvider = () => React.useContext(LoginContext);
