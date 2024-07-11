import {
  addColumnsfromExistingTable,
  deleteColumnsfromExistingTable,
  getTableDefinition,
  getTableList,
  updateColumnsfromExistingTable,
} from "../services/apiPath";
import { get, post } from "../services/apiServices";

export const getTableListController = async () => {
  try {
    // Prepare the body object with sanitized data
    // Send the GET request to the cmd API API endpoint
    const response = await get(getTableList);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTableDefinitionController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "string") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      tableName: formData,
    };
    // Send the POST request to the cmd API API endpoint
    const response = await post(getTableDefinition, body);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const addColumnsController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      tableName: formData.tableName,
      columns: [
        {
          name: formData?.formData.columnName,
          dataType: formData?.formData.dataType,
          length: formData?.formData.length,
          nullable: formData?.formData.isMandatory,
          defaultValue: formData?.formData.defaultValue,
          primaryKey: formData?.formData.isPrimary,
        },
      ],
      includeAuditColumns: false,
    };
    // Send the POST request to the cmd API API endpoint
    const response = await post(addColumnsfromExistingTable, body);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateColumnsController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      tableName: formData.tableName,
      columnInfo: {
        name: formData?.formData.columnName,
        dataType: formData?.formData.dataType,
        nullable: formData?.formData.isMandatory,
        length: formData?.formData.length,
        defaultValue: formData?.formData.defaultValue,
        primaryKey: formData?.formData.isPrimary,
        createdBy: false,
        createdDate: false,
        updatedBy: new Date(),
        updatedDate: false,
        deletedBy: false,
        deletedDate: false,
        isActive: true,
      },
    };

    // Send the POST request to the cmd API API endpoint
    const response = await post(updateColumnsfromExistingTable, body);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteColumnsController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Send the POST request to the cmd API API endpoint
    const response = await post(
      deleteColumnsfromExistingTable +
        "/" +
        formData.tableName +
        "/" +
        formData.columnName
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
