import { encodeData } from "./securities/encodeDecode";
import { validationRegex } from "./Validators";

/**
 * Encoded cookie name for session details
 * @example encodedSessionDetailsCookieName => "encoded_sessionsDetails"
 */
export const encodedSessionDetailsCookieName = encodeData("sessionsDetails");

/**
 * Encoded cookie name for temporary users
 * @example encodedTempUsersCookieName => "encoded_tempUsers"
 */
export const encodedTempUsersCookieName = encodeData("tempUsers");

/**
 * Encoded cookie name for forgot password status
 * @example isForgotPasswordCookieName => "encoded_isForgotPassword"
 */
export const isForgotPasswordCookieName = "isForgotPassword";

/**
 * Encoded cookie name for default password status
 * @example isDefaultPasswordStatusCookieName => "encoded_isDefaultPasswordStatus"
 */
export const isDefaultPasswordStatusCookieName = encodeData(
  "isDefaultPasswordStatus"
);

/**
 * Encoded cookie name for storing permissionDetails
 * @example isPermissionDetailsCookieName => "encoded_isPermissionDetails"
 */
export const isPermissionDetailsCookieName = encodeData("isPermissionDetails");

/**
 * Encoded cookie name for email verification status
 * @example isEmailVerifiedStatusCookieName => "encoded_isEmailVerifiedStatus"
 */
export const isEmailVerifiedStatusCookieName = encodeData(
  "isEmailVerifiedStatus"
);

/**
 * Encoded cookie name for displaying email alert for default Password
 * @example isEmailVerifiedForDefaultPasswordCookieName => "encoded_isEmailVerifiedForDefault"
 */
export const isEmailVerifiedForDefaultPasswordCookieName = encodeData(
  "isEmailVerifiedForDefault"
);

/**
 * Encoded cookie name for displaying email alert for default Password
 * @example isEmailVerifiedForDefaultPasswordCookieName => "encoded_isEmailVerifiedForDefault"
 */
export const isLoginTokenCookieName = encodeData("isLoginTokenCookie");

/**
 * Encoded cookie name for displaying email alert for default Password
 * @example isEmailVerifiedForDefaultPasswordCookieName => "encoded_isEmailVerifiedForDefault"
 */
export const isDefaultPasswordChangedCookieName = encodeData(
  "isDefaultPasswordChanged"
);

/**
 * Encoded cookie name for user ID
 * @example isUserIdCookieName => "encoded_isUserEmail"
 */
export const isUserIdCookieName = encodeData("isUserEmail");

/**
 * Encoded cookie name for for loginStatus
 * @example isLoginSuccess => "encoded_isLoginSuccess"
 */
export const isLoginSuccessCookieName = encodeData("isLoginSuccess");

/**
 * Encoded cookie name for to redirect dashboard
 * @example isLoginSuccess => "encoded_isDashboardRedirect"
 */
export const isDashboardRedirectCookieName = encodeData("isDashboardRedirect");

/**
 * Checks if all values in an array contain at least one number
 * @param {array} arr - The input array
 * @returns {boolean} true if all values contain a number, false otherwise
 * @example allValuesContainNumberInArray(["hello1", "world2", "foo3"]) => true
 * @example allValuesContainNumberInArray(["hello", "world", "foo"]) => false
 */
export const allValuesContainNumberInArray = (arr) => {
  const numberRegex = validationRegex.isNumbers;
  return arr.every((value) => numberRegex.test(value));
};

/**
 * Capitalizes the first word of a sentence
 * @param {string} sentence - The input sentence
 * @returns {string} The sentence with the first word capitalized
 * @throws {TypeError} If the input is not a string
 * @example titleCaseFirstWord("hello world") => "Hello world"
 * @example titleCaseFirstWord("hello") => "Hello"
 */
export const titleCaseFirstWord = (sentence) => {
  // Check if the input is a string
  if (typeof sentence !== "string") {
    throw new TypeError("Input must be a string");
  }
  const words = sentence.trim().split(" ");

  if (words.length > 0 && words[0].length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(" ");
};

export const ScrollToTopButton = () =>
  window.scrollTo({
    top: 0,
    behavior: "smooth", // for smooth scrolling
  });

export const getCurrentPathName = () => {
  const hash = window.location.hash;
  return hash ? hash.substring(1) : "/";
};
/**
 * Gets submenu details from the menu list based on the provided identifier.
 * 
 * @param {Array} menuList - The list of menus to search through
 * @param {string} identifier - The identifier to match against (path or name)
 * @param {string} type - The type of identifier ('path' or 'name')
 * @returns {Object|null} - The matching submenu object or null if not found
 */
export const getSubmenuDetails = (menuList, identifier, type = "path") => {
  try {
    // Safety check for menuList
    if (!menuList || !Array.isArray(menuList) || menuList.length === 0) {
      console.warn("getSubmenuDetails: Invalid or empty menuList");
      return null;
    }

    // Search through menus and submenus
    for (const menu of menuList) {
      // Safety check for submenus
      if (!menu.submenus || !Array.isArray(menu.submenus)) {
        console.warn(`getSubmenuDetails: Invalid submenus in menu: ${menu.menu_name || 'unknown'}`);
        continue;
      }

      for (const submenu of menu.submenus) {
        if (
          (type === "path" && submenu.submenu_path === identifier) ||
          (type === "name" && submenu.submenu_name === identifier)
        ) {
          return submenu;
        }
      }
    }
    
    // If we get here, no matching submenu was found
    console.warn(`getSubmenuDetails: No submenu found with ${type} = ${identifier}`);
    return null;
  } catch (error) {
    console.error("Error in getSubmenuDetails:", error);
    return null;
  }
};

/**
 * Formats the given date into a string suitable for use as a filename.
 *
 * The format used is `YYYY-MM-DDTHH-mm-ss.sssZ`, where colons (:) and dots (.)
 * are replaced with dashes (-) to ensure the filename is valid across various
 * file systems.
 *
 * @param {Date} date - The date object to be formatted.
 * @returns {string} - The formatted date string suitable for use as a filename.
 *
 * @example
 * const now = new Date();
 * const filename = timeStampFileName(now);
 * console.log(filename); // Example output: 2024-07-31T10-11-12-345Z
 */
export const timeStampFileName = (date) =>
  date.toISOString().replace(/[:.]/g, "-");
/**
 * Generates a CSV file from the provided API data and downloads it with a timestamped filename.
 *
 * @param {Array<Object>} apiData - Array of objects representing the API data.
 * @param {string} baseFilename - Base name for the downloaded CSV file, without extension.
 * @param {Array<Object>} [columnOrder] - Optional array specifying the order and names of columns in the CSV file.
 *                                    Each object in the array should have keys `key` and `name`.
 *
 * @example
 * const apiData = [
 *   { id: 1, name: "John Doe", age: 30, description: 'He said, "Hello!"' },
 *   { id: 2, name: "Jane Smith", age: 25, description: 'She replied, "Hi!"' }
 * ];
 * const baseFilename = 'data';
 * const columnOrder = [
 *   { key: 'id', name: 'ID' },
 *   { key: 'name', name: 'Full Name' },
 *   { key: 'age', name: 'Age' }
 * ];
 * generateCSV(apiData, baseFilename, columnOrder);
 */
export const generateCSV = (apiData, baseFilename, columnOrder = null) => {
  // Check if apiData is an array and has at least one item
  if (!Array.isArray(apiData) || apiData.length === 0) {
    console.error("Invalid API data. It should be a non-empty array.");
    return;
  }
  // Function to escape values properly
  const escapeValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }
    // Convert value to string and escape quotes
    let stringValue = value.toString();
    // Escape double quotes by doubling them
    stringValue = stringValue.replace(/"/g, '""');
    // Wrap the value in double quotes
    return `"${stringValue}"`;
  };

  // Determine the columns to use
  let keys;
  let columnNames;
  if (columnOrder && columnOrder.length > 0) {
    keys = columnOrder.map((col) => col);
    columnNames = columnOrder.map((col) => col);

    // Check if all columnOrder keys are present in the data
    const missingKeys = keys.filter(
      (key) => !Object.keys(apiData[0]).includes(key)
    );
    if (missingKeys.length > 0) {
      console.warn(
        "Some columns in columnOrder do not exist in the data:",
        missingKeys
      );

      // Fallback to original order if keys are missing
      keys = Object.keys(apiData[0]);
      columnNames = keys;
    }
  } else {
    keys = Object.keys(apiData[0]);
    columnNames = keys;
  }

  // Create CSV content
  let csvContent = `${columnNames.join(",")}\n`;

  apiData.forEach((row) => {
    const values = keys.map((key) => escapeValue(row[key]));
    csvContent += `${values.join(",")}\n`;
  });

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv" });

  // Create a link element to download the CSV file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${baseFilename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



/**
 * Converts an absolute file path to a relative path suitable for dynamic imports
 * @param {string} absolutePath - The absolute path to convert
 * @returns {string} - The relative path
 */
export const convertToRelativePath = (absolutePath) => {
  if (!absolutePath) return '';
  
  // Handle different path formats
  let relativePath = absolutePath;
  
  // Replace backslashes with forward slashes for consistency
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Extract the path after 'generatedPages'
  if (relativePath.includes('generatedPages')) {
    relativePath = relativePath.replace(/^.*generatedPages\//, '/');
  } 
  // Extract the path after 'views'
  else if (relativePath.includes('views')) {
    relativePath = relativePath.replace(/^.*views\//, '/');
  }
  
  // Remove file extension if present
  relativePath = relativePath.replace(/\.(jsx?|tsx?)$/, '');
  
  // Ensure the path starts with a slash
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  console.log(`Converted path: ${absolutePath} -> ${relativePath}`);
  return relativePath;
};
