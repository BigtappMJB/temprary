import { handleChatGPTResponse } from "../../../core/openai";
import { get, post } from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

export const getTableListDataController = async () => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));
    // Send the GET request to the projectCreation API endpoint
    const response = await get("AllTables", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getColumnsDetailsController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`columnDetails/${tableName}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const generatePythonAPIController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const body = {
      table: tableName,
      override: 0,
    };
    const response = await post(`generate_blueprint`, body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInputFieldController = async () => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`inputField`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const createReactFormController = async (formData) => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));

    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    const openAIResponse = await handleChatGPTResponse(
      reactGenerationPrompt(formData)
    );
    const jsxCode = openAIResponse;
    downloadUpdatedFile(jsxCode, formData?.tableName);
    debugger;
    // Send the GET request to the projectCreation API endpoint
    // const response = await get("AllTables", "python");
    // Return the response data
    return jsxCode;
  } catch (error) {
    throw error;
  }
};

const reactGenerationPrompt = (
  value
) => `Generate a React component for a dynamic form using React Hook Form, Yup validation, and Material UI components. Use the following input data to create the form fields dynamically and generate the validation schema:

Input Data:
${ JSON.stringify(value)}

**Requirements:**

1. Use React Hook Form for form handling.
2. Use Yup for schema validation.
3. Dynamically generate form fields and validation schema based on the  'columnsData' structure.
4. Use **Material UI** components (such as TextField, Checkbox, Button,Select, etc.) for form inputs and layout.
5. Apply custom styling using **Emotion** (which is compatible with React 18).
6. Ensure the form is fully responsive across all screen sizes, using Material UI's Grid and responsive utilities.
7. Include error messages for validation feedback below each field using Material UI's FormHelperText.
8. For varchar fields:
    - Use 'maxLength' based on the 'CHARACTER_MAXIMUM_LENGTH'.
    - Mark as required if 'IS_NULLABLE' is "NO".
9. For checkbox fields, validate that at least one option is selected.
10. Add Axios for form submission and CRUD operations.
11. Optimize rendering and form submission using 'useMemo' or 'useCallback' to reduce unnecessary re-renders.
12. Include a button to submit the form and log the form data to the console.

**UI Requirements:**

- Ensure the UI is **responsive and compatible with all screen sizes** (mobile, tablet, desktop).
- Use Material UI's **Grid system** for layout and responsive utilities.
- Use **Emotion** for styling and apply a clean, modern look with Material UI themes.
- Ensure the UI follows **best accessibility practices** (e.g., proper label associations and focus management).
- Include consistent padding, margins, and spacing using Material UI's 'Box' or 'Grid' component.
- The UI should be visually appealing and user-friendly.

**Additional Best Practices:**

- Follow the ISO/IEC 25010 standard for software product quality (focus on maintainability, functionality, and reliability).
- Use camel case for variable and function names.
- Keep file names short but meaningful, avoiding special characters and spaces.
- Ensure logical file organization and naming conventions.
- Write clear, readable, and maintainable code with proper indentation and structure.
- Add comments throughout the code to explain the functionality.
- Include error handling (e.g., for form submission or API calls).
- Ensure proper file naming conventions are used (e.g., avoid ambiguous or complex names).
`;

const downloadUpdatedFile = (fileContent, fileName) => {
  // Create a Blob with the updated content
  const blob = new Blob([fileContent], { type: "text/plain" });

  // Create a link element to trigger file download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.txt`; // Set the download file name

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
};
