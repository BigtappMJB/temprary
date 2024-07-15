/**
 * Regular expression patterns for form validation.
 * Each key represents a form field and its associated regex pattern.
 *
 * @constant {Object} validationRegex
 * @example
 * // Validate a first name
 * const isValidFirstName = validationRegex.firstName.test('John');
 */
export const validationRegex = {
  /**
   * Regex to validate first names (2 to 30 letters).
   */
  firstName: /^[a-zA-Z]{2,30}$/,

  /**
   * Regex to validate last names (1 to 30 letters).
   */
  lastName: /^[a-zA-Z]{1,30}$/,

  /**
   * Regex to validate dates of birth (YYYY-MM-DD).
   */
  dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,

  /**
   * Regex to validate gender (Male, Female, or Other).
   */
  gender: /^(Male|Female|Other)$/,

  /**
   * Regex to validate email addresses.
   */
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  /**
   * Regex to validate phone numbers (3 to 20 digits).
   */
  phoneNumber: /^\d{3,20}$/,

  /**
   * Regex to validate street addresses (at least 3 characters).
   */
  street: /^[a-zA-Z0-9\s,'-]{3,}$/,

  /**
   * Regex to validate city names (2 to 50 letters).
   */
  city: /^[a-zA-Z\s]{2,50}$/,

  /**
   * Regex to validate state names (2 to 50 letters).
   */
  state: /^[a-zA-Z\s]{2,50}$/,

  /**
   * Regex to validate zip codes (5 digits or 5 digits-4 digits).
   */
  zipCode: /^\d{5}(-\d{4})?$/,

  /**
   * Regex to validate country names (2 to 50 letters).
   */
  country: /^[a-zA-Z\s]{2,50}$/,

  /**
   * Regex to validate usernames (3 to 20 characters, letters, numbers, dots, underscores, and hyphens).
   */
  username: /^[a-zA-Z0-9._-]{3,20}$/,

  /**
   * Regex to validate passwords (at least 8 characters, including uppercase, lowercase, number, and special character).
   */
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,

  /**
   * Regex to validate security answers (3 to 50 alphanumeric characters).
   */
  securityAnswer: /^[a-zA-Z0-9\s]{3,50}$/,

  /**
   * Regex to validate languages (2 to 20 letters).
   */
  language: /^[a-zA-Z]{2,20}$/,

  /**
   * Regex to validate profile picture file extensions (jpeg, jpg, gif, png).
   */
  profilePicture: /\.(jpeg|jpg|gif|png)$/,

  /**
   * Regex to validate bios (up to 500 characters).
   */
  bio: /^[\s\S]{0,500}$/,

  /**
   * Regex to validate table names (start with a letter, up to 128 characters, letters, numbers, and underscores).
   */
  tableName: /^[a-zA-Z][a-zA-Z0-9_]{0,127}$/,

  /**
   * Regex to validate column names (start with a letter or underscore, up to 128 characters, letters, numbers, and underscores).
   */
  columnName: /^[a-zA-Z_][a-zA-Z0-9_]{0,127}$/,

  /**
   * Regex to validate a string containing only numbers.
   */
  isNumbers: /[0-9]+$/,

  /**
   * Regex to validate a string containing only alphabets.
   */
  isLetters: /^[a-zA-Z]+[\s\S]+$/,
  /**
   * Regex to validate a string containing only single words.
   */
  isSingleWord: /^[a-zA-Z]+$/,
};

/**
 * Error messages corresponding to each form field.
 * Each key represents a form field and its associated error message.
 *
 * @constant {Object} errorMessages
 * @example
 * // Get error message for invalid first name
 * const firstNameError = errorMessages.firstName;
 */
export const errorMessages = {
  firstName: "First name must be between 2 and 30 letters.",
  lastName: "Last name must be between 2 and 30 letters.",
  dateOfBirth: "Date of birth must be in the format YYYY-MM-DD.",
  gender: "Gender must be Male, Female, or Other.",
  email: "Please enter a valid email address.",
  phoneNumber: "Please enter a valid phone number.",
  street: "Street must be at least 3 characters long.",
  city: "City must be between 2 and 50 letters.",
  state: "State must be between 2 and 50 letters.",
  zipCode: "Zip code must be 5 digits or 5 digits-4 digits.",
  country: "Country must be between 2 and 50 letters.",
  username:
    "Username must be between 3 and 20 characters long and can include letters, numbers, dots, underscores, and hyphens.",
  password:
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  securityAnswer: "Security answer must be between 3 and 50 characters long.",
  language: "Language must be between 2 and 20 letters.",
  profilePicture: "Profile picture must be a .jpeg, .jpg, .gif, or .png file.",
  bio: "Value can be up to 500 characters long.",
  tableName:
    "Table name must start with a letter and can contain letters, numbers, and underscores (max 128 characters) and check spaces.",
  columnName:
    "Column names must start with a letter or underscore, followed by up to 127 letters, digits, or underscores and check spaces.",
  isLetters:
    "Value should contains  only alphabets and should be more than one alphabets.",
  singleWord: "Value only accept alphabets without spaces",
};

/**
 * Validates a form field value against its corresponding regex pattern.
 *
 * @function
 * @param {string} field - The name of the form field to validate.
 * @param {string} value - The value of the form field to validate.
 * @returns {Object} - An object containing the validation result and an error message if invalid.
 * @example
 * // Validate a username
 * const validation = validationFunction('username', 'user_123');
 * console.log(validation); // { valid: true, message: null }
 *
 * // Validate an invalid email
 * const validation = validationFunction('email', 'invalid-email');
 * console.log(validation); // { valid: false, message: 'Please enter a valid email address.' }
 */
export const validationFunction = (field, value) => {
  if (field in validationRegex && !validationRegex[field].test(value)) {
    return { valid: false, message: errorMessages[field] };
  }
  return { valid: true, message: null };
};
