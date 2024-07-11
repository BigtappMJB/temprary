import {
  addColumnsfromExistingTable,
  deleteColumnsfromExistingTable,
  getTableDefinition,
  getTableList,
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
    console.log({ formData });
    // Prepare the body object with sanitized data
    const body = {
      tableName: "sample_data",
      columns: [
        {
          name: "name",
          dataType: "VARCHAR",
          length: "300",
          nullable: false,
          defaultValue: null,
          primaryKey: false,
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
    console.log({ formData });
    // Prepare the body object with sanitized data
    const body = {
      tableName: "your_table_name",
      columnInfo: {
        name: "your_column_name",
        dataType: "VARCHAR",
        nullable: false,
        length: 255,
        defaultValue: "default_value",
        primaryKey: false,
        createdBy: false,
        createdDate: false,
        updatedBy: false,
        updatedDate: false,
        deletedBy: false,
        deletedDate: false,
        isActive: true,
      },
    };

    // Send the POST request to the cmd API API endpoint
    const response = await post(addColumnsfromExistingTable, body);
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
