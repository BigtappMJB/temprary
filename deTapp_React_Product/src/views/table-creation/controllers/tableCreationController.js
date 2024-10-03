import { get, post } from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

export const tableCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      table_name: formData.tableName,
      columns: formData.columnsData.map((column) => ({
        column_name: column.columnName,
        data_type: column.dataType,
        length: Number(column?.length),
        isMandatory: column.isMandatory,
        default: column.defaultValue === "" ? null : column.defaultValue,
        primary_key: column.isPrimary,
        auto_increment: column.isPrimary,
        foreign_key: column?.isForeign,
        fk_table_name: column?.fkTableName?.TABLE_NAME,
        fk_column_name: column?.fkTableFieldName?.COLUMN_NAME,
      })),
      includeAuditColumns: true,
      created_by: decodeData(getCookie(isUserIdCookieName)),
    };

    

    // Send the POST request to the cmd API API endpoint
    const response = await post("/generate-create-query", body, "python");
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
    const response = await get("/mysqlDataTypes", "python");
    // Return the response data
    return Object.values(response);
  } catch (error) {
    throw error;
  }
};
