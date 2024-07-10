/**
 * Object containing regular expressions for validating various form fields.
 *
 * @type {Object}
 */
export const validationRegex = {
  /**
   * First name: Only letters, length between 2 and 30
   */
  firstName: /^[a-zA-Z]{2,30}$/,
  /**
   * Last name: Only letters, length between 2 and 30
   */
  lastName: /^[a-zA-Z]{2,30}$/,
  /**
   * Date of birth: Date format YYYY-MM-DD
   */
  dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
  /**
   * Gender: Accepts "Male", "Female", or "Other"
   */
  gender: /^(Male|Female|Other)$/,
  /**
   * Email: Email format
   */
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  /**
   * Phone number: Minimum 3 digits, maximum 20 digits
   */
  phoneNumber: /^\d{3,20}$/,
  /**
   * Street: Letters, numbers, spaces, commas, hyphens, minimum length 3
   */
  street: /^[a-zA-Z0-9\s,'-]{3,}$/,
  /**
   * City: Letters and spaces, length between 2 and 50
   */
  city: /^[a-zA-Z\s]{2,50}$/,
  /**
   * State: Letters and spaces, length between 2 and 50
   */
  state: /^[a-zA-Z\s]{2,50}$/,
  /**
   * Zip code: 5 digits or 5 digits-4 digits
   */
  zipCode: /^\d{5}(-\d{4})?$/,
  /**
   * Country: Letters and spaces, length between 2 and 50
   */
  country: /^[a-zA-Z\s]{2,50}$/,
  /**
   * Username: Letters, numbers, dots, underscores, hyphens, length between 3 and 20
   */
  username: /^[a-zA-Z0-9._-]{3,20}$/,
  /**
   * Password: Minimum 8 characters, at least one upper and lower case letter and one number
   */
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  /**
   * Security answer: Letters, numbers, spaces, length between 3 and 50
   */
  securityAnswer: /^[a-zA-Z0-9\s]{3,50}$/,
  /**
   * Language: Only letters, length between 2 and 20
   */
  language: /^[a-zA-Z]{2,20}$/,
  /**
   * Profile picture: File extensions for images
   */
  profilePicture: /\.(jpeg|jpg|gif|png)$/,
  /**
   * Bio: Any character, maximum length 500
   */
  bio: /^.{0,500}$/,

  /**
   * Must start with a letter (uppercase or lowercase).
Can include letters, digits, and underscores.
Often there's a length restriction (e.g., between 1 and 128 characters).
   */
  tableName: /^[a-zA-Z][a-zA-Z0-9_]{0,127}$/,
  columnName: /^[a-zA-Z_][a-zA-Z0-9_]{0,127}$/,
};

/**
 * Object containing error messages for each form field.
 *
 * @type {Object}
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
  bio: "Bio can be up to 500 characters long.",
  tableName:
    "Table name must start with a letter and can contain letters, numbers, and underscores (max 128 characters) and check spaces.",
  columnName:
    "Column names must start with a letter or underscore, followed by up to 127 letters, digits, or underscores and check spaces. ",
};

/**
 * Validates a form field value against a regular expression.
 *
 * @param {string} field - The name of the form field to validate.
 *@param {string} value - The value of the form field to validate.
 * @returns {Object} - An object with a `valid` property indicating whether the validation passed, and a `message` property containing an error message if the validation failed.
 *
 * @example
 * const result = validationFunction('email', 'example@example.com');
 * console.log(result.valid); // true
 * console.log(result.message); // null
 *
 * const result = validationFunction('email', 'invalid email');
 * console.log(result.valid); // false
 * console.log(result.message); // "Please enter a valid email address."
 */
export const validationFunction = (field, value) => {
  if (field in validationRegex && !validationRegex[field].test(value)) {
    return { valid: false, message: errorMessages[field] };
  }
  return { valid: true, message: null };
};
