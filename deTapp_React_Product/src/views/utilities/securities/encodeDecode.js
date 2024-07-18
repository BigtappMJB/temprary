/**
 * Encodes data to Base64.
 * This function encodes a given string, number, or object to Base64.
 *
 * @param {any} data - The data to encode.
 * @returns {string} The Base64 encoded string.
 */
export const encodeData = (data) => {
  let dataString;

  if (typeof data === 'string' || typeof data === 'number') {
    // Directly convert strings and numbers to strings
    dataString = data.toString();
  } else if (typeof data === 'object') {
    // Convert objects to JSON strings
    dataString = JSON.stringify(data);
  } else {
    throw new Error('Unsupported data type');
  }

  // Convert the string to a Uint8Array using TextEncoder
  const buffer = new TextEncoder().encode(dataString);
  // Convert Uint8Array to binary string
  const binaryString = String.fromCharCode(...new Uint8Array(buffer));
  // Encode binary string to Base64
  return btoa(binaryString);
};

/**
 * Decodes data from Base64.
 * This function decodes a given Base64 string back to its original form.
 *
 * @param {string} encodedData - The Base64 encoded string.
 * @returns {any} The decoded data in its original form.
 */
export const decodeData = (encodedData) => {
  // Decode Base64 string to binary string
  const binaryString = atob(encodedData);
  // Create a Uint8Array from the binary string
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Decode the Uint8Array back to a string using TextDecoder
  const dataString = new TextDecoder().decode(bytes);

  // Try to parse the string back to its original form
  try {
    return JSON.parse(dataString);
  } catch (e) {
    // If parsing fails, return the string or number as is
    if (!isNaN(dataString)) {
      return Number(dataString);
    }
    return dataString;
  }
};

/**
 * Example Usage:
 *
 * import { encodeData, decodeData } from './encodingUtils';
 *
 * const dataString = "Hello, World!";
 * const encodedString = encodeData(dataString);
 * console.log("Encoded String: ", encodedString);
 * const decodedString = decodeData(encodedString);
 * console.log("Decoded String: ", decodedString);
 *
 * const dataNumber = 12345;
 * const encodedNumber = encodeData(dataNumber);
 * console.log("Encoded Number: ", encodedNumber);
 * const decodedNumber = decodeData(encodedNumber);
 * console.log("Decoded Number: ", decodedNumber);
 *
 * const dataObject = { message: "Hello, World!", value: 12345 };
 * const encodedObject = encodeData(dataObject);
 * console.log("Encoded Object: ", encodedObject);
 * const decodedObject = decodeData(encodedObject);
 * console.log("Decoded Object: ", decodedObject);
 *
 * Output:
 * Encoded String:  SGVsbG8sIFdvcmxkIQ==
 * Decoded String:  Hello, World!
 *
 * Encoded Number:  MTIzNDU=
 * Decoded Number:  12345
 *
 * Encoded Object:  eyJtZXNzYWdlIjoiSGVsbG8sIFdvcmxkISIsInZhbHVlIjoxMjM0NX0=
 * Decoded Object:  { message: "Hello, World!", value: 12345 }
 */

/**
 * Security Considerations:
 * - Base64 encoding is not encryption and does not provide confidentiality or integrity protection. It is simply a way to encode binary data as text.
 * - For secure data transmission or storage, use proper encryption algorithms (e.g., AES) and handle keys securely.
 * - Always use HTTPS for transmitting sensitive data to ensure it is encrypted in transit.
 * - Ensure proper input validation and handling to avoid security vulnerabilities like injection attacks.
 */
