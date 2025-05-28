import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Get all smart data items
export const getAllSmartData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/smartdata`);
    return response.data;
  } catch (error) {
    console.error('Error fetching smart data:', error);
    throw error;
  }
};

// Get a single smart data item by ID
export const getSmartDataById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/smartdata/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching smart data with ID ${id}:`, error);
    throw error;
  }
};

// Create a new smart data item
export const createSmartData = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/smartdata`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating smart data:', error);
    throw error;
  }
};

// Update an existing smart data item
export const updateSmartData = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/smartdata/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating smart data with ID ${id}:`, error);
    throw error;
  }
};

// Delete a smart data item
export const deleteSmartData = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/smartdata/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting smart data with ID ${id}:`, error);
    throw error;
  }
};

// Search smart data items
export const searchSmartData = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/smartdata/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching smart data with query "${query}":`, error);
    throw error;
  }
};

export default {
  getAllSmartData,
  getSmartDataById,
  createSmartData,
  updateSmartData,
  deleteSmartData,
  searchSmartData
};