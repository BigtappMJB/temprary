import { get, post } from "../../utilities/apiservices/apiServices";

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
        // length: column?.length,
        nullable: column.isMandatory,
        default: column.defaultValue,
        primary_key: column.isPrimary,
        auto_increment: column.isPrimary 
      })),
      // includeAuditColumns: true,
    };

    // Send the POST request to the cmd API API endpoint
    const response = await post("master/tableConfigurator", body, "python");
    // Return the response data
    return response[0];
  } catch (error) {
    throw error;
  }
};

export const getDataTypesController = async () => {
  try {
    // Prepare the body object with sanitized data
    // Send the GET request to the cmd API API endpoint
    const response = await get(
      "master/tableConfigurator?type=dataType",
      "python"
    );
    // Return the response data
    return Object.values(response);
  } catch (error) {
    throw error;
  }
};
