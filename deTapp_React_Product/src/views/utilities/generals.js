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
export const isLoginTokenCookieName = encodeData(
  "isLoginTokenCookie"
);

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
export const getSubmenuDetails = (menuList, identifier, type = "path") => {
  for (const menu of menuList) {
    for (const submenu of menu.submenus) {
      if (
        (type === "path" && submenu.submenu_path === identifier) ||
        (type === "name" && submenu.submenu_name === identifier)
      ) {
        return submenu;
      }
    }
  }
  return null;
};
