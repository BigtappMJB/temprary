import moment from "moment";
import {
  get,
  post,
  remove,
  put,
} from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import {
  isUserIdCookieName,
} from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

export const getProjectRoleControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("master/AllProjectRoles", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProjectPhaseControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("master/AllProjectPhases", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getActivityCodecontroller = async (phaseId, roleId) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(
      `master/AllActivityCodes?phaseId=${phaseId}&projectRoleId=${roleId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getActivityCodeController = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("master/AllActivityCode", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the list of cmds from the API.
 *
 * @async
 * @function getCMDController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getCMDController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getProjectEstimationControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("master/getAllProjectEst", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClientControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("cmd/Allcmd", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
   * Creates a new cmd with the given form data.
   *
   * @async
   * @function cmdCreationController
   * @param {Object} formData - The form data for the new cmd.
   * @param {string} formData.firstName - The first name.
   * @param {string} formData.lastName - The last name.
   * @param {string} formData.email - The email address.
   * @param {string} formData.mobileNo - The mobile number.
   * @param {Object|string} formData.role - The role object or role ID.
   * @returns {Promise<Object>} - The response data from the API.
   * @throws {Error} - If the form data is invalid or the API request fails.
   * @example
   * const formData = {
  
   *   firstName: "John",
   *   lastName: "Doe",
   *   email: "john.doe@example.com",
   *   mobileNo: "1234567890",
   *   role: { ID: "admin", NAME: "Admin" }
   * };
   * cmdCreationController(formData)
   *   .then(response => console.log(response))
   *   .catch(error => console.error(error));
   */

export const projectEstimateCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // console.log({formData});

    const email = decodeData(getCookie(isUserIdCookieName));

    // Prepare the body object with sanitized data
    const body = {
      projectNameCode: formData?.projectName.PROJECT_NAME_CODE,
      projectPhaseCode: formData?.phase.id,
      projectRoleId: formData?.role.id,
      ActivityCode: formData?.activityCode.activityName,
      startDate: moment(formData.startDate).format("YYYY-MM-DD"),
      endDate: moment(formData.endDate).format("YYYY-MM-DD"),
      noOfHours: Number(formData.hoursPerDay),
      totalHours: Number(formData?.totalHours),
      noOfWorkingDays: Number(formData?.workingDays),
      createdBy: email,
      isActive: 1,
    };
    // Send the POST request to the cmd API endpoint
    const response = await post("master/CreateProjectEst", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing cmd with the given form data.
 *
 * @async
 * @function cmdupdateController
 * @param {Object} formData - The form data for updating the cmd.
 * @param {string} formData.cmdId - The cmd ID.
 * @param {string} formData.ID - The primary key for cmd ID.*
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   cmdId: "123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   mobileNo: "1234567890",
 *   role: { ID: "admin", NAME: "Admin" }
 * };
 * cmdupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */

export const projectEstimateUpdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // const email = decodeData(getCookie(isUserIdCookieName));

    // Prepare the body object with sanitized data
    const body = {
      projectNameCode: formData?.projectName.PROJECT_NAME_CODE,
      projectPhaseCode: formData?.phase.id,
      projectRoleId: formData?.role.id,
      ActivityCode: formData?.activityCode.activityName,
      startDate: moment(formData.startDate).format("YYYY-MM-DD"),
      endDate: moment(formData.endDate).format("YYYY-MM-DD"),
      noOfHours: Number(formData.hoursPerDay),
      totalHours: Number(formData?.totalHours),
      noOfWorkingDays: Number(formData?.workingDays),

      // created_by: email,
      // is_active: true,
    };
    // Send the POST request to the cmd API endpoint
    const response = await put(
      `master/getAllProjectEst?id=${formData?.ID}`,
      body,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a cmd with the given ID.
 *
 * @async
 * @function cmddeleteController
 * @param {number} cmdId - The ID of the cmd to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the cmd ID is invalid or the API request fails.
 * @example
 * cmddeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectEstimateDeletionController = async (cmdId) => {
  try {
    // Data Validation and Sanitization
    if (typeof cmdId !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the cmd API endpoint
    const response = await remove(
      `master/DeleteProjectEstById?id=${cmdId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
