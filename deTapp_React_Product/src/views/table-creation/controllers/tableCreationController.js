import {
  createTableAPI,
  getDataTypes,
} from "../../utilities/apiservices/apiPath";
import { get, post } from "../../utilities/apiservices/apiServices";

export const tableCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    console.log({ formData });

    // Prepare the body object with sanitized data
    const body = {
      tableMetadata: {
        tableName: formData.tableName,
        columns: formData.columnsData.map((column) => ({
          name: column.columnName,
          dataType: column.dataType,
          length: column.length,
          nullable: column.isMandatory,
          defaultValue: column.defaultValue,
          primaryKey: column.isPrimary,
        })),
        includeAuditColumns: true,
      },
    };
    // Send the POST request to the cmd API API endpoint
    const response = await post(createTableAPI, body, "springboot");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDataTypesController = async () => {
  try {
    // Prepare the body object with sanitized data
    // Send the GET request to the cmd API API endpoint
    const response = await get(getDataTypes, "springboot");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
