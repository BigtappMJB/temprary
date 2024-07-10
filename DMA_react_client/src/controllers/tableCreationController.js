import { createTableAPI } from "../services/apiPath";
import { post } from "../services/apiService";

export const postCMDController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data

    const body = {
      target: formData.target.trim(),
      subTarget: formData.subTarget.trim(),
      sectorClassification: formData.sectorClassification.trim(),
      incorporationCity: formData.incorporationCity.trim(),
    };
    // Send the POST request to the cmd API API endpoint
    const response = await post(createTableAPI, body);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
