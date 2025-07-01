// encryptionUtils.js

/**
 * Checks if the Web Crypto API is supported by the browser.
 *
 * @returns {boolean} True if Web Crypto API is supported, false otherwise.
 */
const isWebCryptoSupported = () => {
    return window.crypto && window.crypto.subtle;
  };
  
  /**
   * Encrypts data using the Web Crypto API.
   *
   * @param {CryptoKey} key - The encryption key.
   * @param {string} data - The data to be encrypted.
   *
   * @returns {Promise<{ encryptedData: Uint8Array, iv: Uint8Array }>} An object containing the encrypted data and initialization vector.
   */
  const webCryptoEncrypt = async (key, data) => {
    const encodedData = new TextEncoder().encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );
    return { encryptedData, iv };
  };
  
  /**
   * Decrypts data using the Web Crypto API.
   *
   * @param {CryptoKey} key - The decryption key.
   * @param {Uint8Array} encryptedData - The encrypted data.
   * @param {Uint8Array} iv - The initialization vector.
   *
   * @returns {Promise<string>} The decrypted data.
   */
  const webCryptoDecrypt = async (key, encryptedData, iv) => {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );
    return new TextDecoder().decode(decryptedData);
  };
  
  /**
   * Generates a key for the Web Crypto API.
   *
   * @returns {Promise<CryptoKey>} A generated key.
   */
  const generateWebCryptoKey = async () => {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  };
  
  /**
   * Unified encryption function.
   *
   * @param {string} data - The data to be encrypted.
   * @param {string} secretKey - The secret key (not used in this implementation).
   *
   * @returns {Promise<{ encryptedData: Uint8Array, iv: Uint8Array, key: JsonWebKey }>} An object containing the encrypted data, initialization vector, and exported key.
   *
   * @example
   * const data = "Hello, World!";
   * const secretKey = "my_secret_key";
   * const { encryptedData, iv, key } = await encryptData(data, secretKey);
   * console.log(encryptedData, iv, key);
   */
  const encryptData = async (data, secretKey) => {
    if (isWebCryptoSupported()) {
      const key = await generateWebCryptoKey();
      const { encryptedData, iv } = await webCryptoEncrypt(key, data);
      return {
        encryptedData,
        iv,
        key: await window.crypto.subtle.exportKey("jwk", key),
      };
    } else {
      return { data, iv: null, key: null };
    }
  };
  
  /**
   * Unified decryption function.
   *
   * @param {Uint8Array} encryptedData - The encrypted data.
   * @param {Uint8Array} iv - The initialization vector.
   * @param {JsonWebKey} key - The exported key.
   * @param {string} secretKey - The secret key (not used in this implementation).
   *
   * @returns {Promise<string>} The decrypted data.
   *
   * @example
   * const encryptedData = new Uint8Array([...]);
   * const iv = new Uint8Array([...]);
   * const key = {... };
   * const secretKey = "my_secret_key";
   * const decryptedData = await decryptData(encryptedData, iv, key, secretKey);
   * console.log(decryptedData);
   */
  const decryptData = async (encryptedData, iv, key, secretKey) => {
    if (isWebCryptoSupported() && key && iv) {
      const importedKey = await window.crypto.subtle.importKey(
        "jwk",
        key,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
      );
      const decryptedData = await webCryptoDecrypt(importedKey, encryptedData, iv);
      return decryptedData;

    } else {
      return encryptData;
    }
  };
  
  export { encryptData, decryptData };