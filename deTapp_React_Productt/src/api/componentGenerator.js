import axios from 'axios';
import { getBaseUrl } from '../views/utilities/apiservices/apiServices';

/**
 * Generates a React component file for a dynamic page
 * 
 * @param {Object} config - Configuration for the component
 * @param {string} config.pageName - The name of the page
 * @param {string} config.tableName - The name of the database table
 * @returns {Promise} - Promise that resolves when the component is created
 */
export const generateReactComponent = async (config) => {
  try {
    const { pageName, tableName } = config;
    
    // Normalize names
    const normalizedPageName = pageName.toLowerCase();
    const normalizedTableName = tableName || normalizedPageName;
    
    console.log(`Requesting backend to generate React component for ${normalizedPageName}`);
    
    // Call the backend API to generate the component
    const response = await axios.post(
      `${getBaseUrl('python')}/gpt/generateReactComponent`,
      {
        pageName: normalizedPageName,
        tableName: normalizedTableName
      }
    );
    
    console.log('Component generation response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error generating React component:', error);
    throw error;
  }
};