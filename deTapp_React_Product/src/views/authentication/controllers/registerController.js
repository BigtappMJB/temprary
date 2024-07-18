import { post } from '../../utilities/apiservices/apiServices';

/**
 * Handles the user registration process by sending a POST request
 * to the registration endpoint with the provided form data.
 *
 * @param {Object} formData - The form data containing user information.
 * @param {string} formData.firstname - The user's first name.
 * @param {string} formData.lastname - The user's last name.
 * @param {string} formData.email - The user's email address.
 * @param {string} formData.mobileno - The user's mobile number.
 * @param {string} formData.password - The user's password.
 * @returns {Promise<Object>} The response data from the registration API.
 * @throws {Error} If the registration fails.
 */
export const registerController = async (formData) => {
    try {
        // Data Validation and Sanitization
        if (!formData || typeof formData !== 'object') {
            throw new Error('Invalid form data');
        }

        // Function to remove all spaces from a string
        function removeSpaces(str) {
          return str.replace(/\s+/g, '');
        }

        // Generating a random 4-digit number
        function generateRandom4DigitNumber() {
          return Math.floor(1000 + Math.random() * 9000);
        }

        let random4DigitNumber = generateRandom4DigitNumber();

        // Destructure and sanitize form data
        const { firstname, lastname, email, mobileno } = formData;
        let trimmedVariable = removeSpaces(firstname);
        const sanitizedData = {
            userId: trimmedVariable+'-'+random4DigitNumber,
            firstName: firstname.trim(),
            lastName: lastname.trim(),
            email: email.trim(),
            mobile: mobileno.trim(),
            role: 1 // Hardcode value Role is 1
        };

        // Log the sanitized data (omit password in production)
        console.log('Sanitized Registration Data:', sanitizedData);

        // Send the POST request to the user API endpoint
        const response = await post('/master/user', sanitizedData, 'python');

        // Log the successful response
        console.log('Registration successful:', response);

        // Return the response data
        return response.data;
    } catch (error) {
        // Log the error for debugging
        console.error('Registration error:', error.message);

        // Re-throw the error to be handled by the calling function
        throw new Error(error.message || 'Failed to register. Please try again.');
    }
};
