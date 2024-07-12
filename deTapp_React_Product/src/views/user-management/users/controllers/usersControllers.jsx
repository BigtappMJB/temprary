import { get, post } from "../../../utilities/apiservices/apiServices";

  
  export const getUserController = async () => {
    try {
      // Prepare the body object with sanitized data
      // Send the GET request to the cmd API API endpoint
      const response = await get("", "python");
      // Return the response data
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const getRolesController = async () => {
    try {
      // Prepare the body object with sanitized data
      // Send the GET request to the cmd API API endpoint
      const response = await get("/master/role", "python");
      // Return the response data
    //   console.log(JSON.parse(response).roles);
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const userCreationController = async (formData) => {
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
      const response = await post("", body, "python");
      // Return the response data
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const userupdateController = async (formData) => {
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
      const response = await post("", body, "python");
      // Return the response data
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const userdeleteController = async (formData) => {
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
      const response = await post("", body, "python");
      // Return the response data
      return response;
    } catch (error) {
      throw error;
    }
  };
  