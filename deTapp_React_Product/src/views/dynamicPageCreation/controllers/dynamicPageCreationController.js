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

    const prompt = reactGenerationPrompt(formData);
    console.log(prompt);

    const openAIResponse = await handleChatGPTResponse(prompt);

    const jsxCode = extractJSXBetweenMarkers(openAIResponse);
    downloadUpdatedFile(openAIResponse, formData?.tableName);
    debugger;
    // Send the GET request to the projectCreation API endpoint
    // const response = await get("AllTables", "python");
    // Return the response data
    return jsxCode;
  } catch (error) {
    throw error;
  }
};

// const reactGenerationPrompt = (
//   value
// ) => `Generate a React component for a dynamic form using React Hook Form, Yup validation, and Material UI components. Use the following input data to create the form fields dynamically and generate the validation schema:

// Page Name :  ${value?.tableName}

// Columns Data:
// ${value?.columnsData}

// **Requirements:**

// 1. Use React Hook Form for form handling.
// 2. Use Yup for schema validation.
// 3. Dynamically generate form fields and validation schema based on the  'columnsData' structure.
// 4. Use **Material UI** components (such as TextField, Checkbox, Button,Select, etc.) for form inputs and layout.
// 5. Apply custom styling using **Emotion** (which is compatible with React 18).
// 6. Ensure the form is fully responsive across all screen sizes, using Material UI's Grid and responsive utilities.
// 7. Include error messages for validation feedback below each field using Material UI's FormHelperText.
// 8. For varchar fields:
//     - Use 'maxLength' based on the 'CHARACTER_MAXIMUM_LENGTH'.
//     - Mark as required if 'IS_NULLABLE' is "NO".
// 9. For checkbox fields, validate that at least one option is selected.
// 10. Add Axios for form submission and CRUD operations.
// 11. Optimize rendering and form submission using 'useMemo' or 'useCallback' to reduce unnecessary re-renders.
// 12. Include a button to submit the form and log the form data to the console.

// **UI Requirements:**

// - Ensure the UI is **responsive and compatible with all screen sizes** (mobile, tablet, desktop).
// - Use Material UI's **Grid system** for layout and responsive utilities.
// - Use **Emotion** for styling and apply a clean, modern look with Material UI themes.
// - Ensure the UI follows **best accessibility practices** (e.g., proper label associations and focus management).
// - Include consistent padding, margins, and spacing using Material UI's 'Box' or 'Grid' component.
// - The UI should be visually appealing and user-friendly.

// **Additional Best Practices:**

// - Follow the ISO/IEC 25010 standard for software product quality (focus on maintainability, functionality, and reliability).
// - Use camel case for variable and function names.
// - Keep file names short but meaningful, avoiding special characters and spaces.
// - Ensure logical file organization and naming conventions.
// - Write clear, readable, and maintainable code with proper indentation and structure.
// - Add comments throughout the code to explain the functionality.
// - Include error handling (e.g., for form submission or API calls).
// - Ensure proper file naming conventions are used (e.g., avoid ambiguous or complex names).

// **Debugging and Issue Resolution:**

// 1. Debug the code **line by line** to identify and fix any issues or bugs.
// 2. If a field is not rendering properly, log the value and inspect it in the developer tools.
// 3. Handle potential errors that could arise during form validation, rendering, and submission (e.g., missing props or API errors).
// 4. Verify the form's responsive behavior by testing across different screen sizes (mobile, tablet, desktop).
// 5. Ensure that validation messages appear appropriately when form fields are invalid.
// 6. Test the form submission thoroughly, handling errors for failed API requests, and retry logic where necessary.
// 7. Make sure all state changes and form updates are logged to the console during debugging to trace behavior accurately.
// 8. Inspect component re-renders to ensure that optimizations (e.g., using 'useMemo' or 'useCallback') are effective.
// 9. If any warnings or errors appear in the browser console (such as prop type warnings or key issues), resolve them.
// 10. Ensure that the code is compliant with accessibility standards and provides feedback to screen readers.

// Ensure the component is fully debugged and working as expected before finalizing the solution.
// `;

const formatColumnValue = (columnData) =>
  Object.entries(columnData)
    .map(([key, column], index) => {
      return `
     - Field ${index + 1}
          - Column Name : ${column?.COLUMN_NAME.COLUMN_NAME}
          - Input Type : ${column?.inputType?.NAME ?? "N/A"}
          - Maximum Length : ${column?.CHARACTER_MAXIMUM_LENGTH ?? "N/A"}
          - Default Value : ${column?.COLUMN_DEFAULT ?? "N/A"}
          - Required : ${column?.IS_NULLABLE === "NO" ? "No" : "Yes"}
          - Options : ${
            column?.optionsList
              ? Object.values(column?.optionsList).join(", ")
              : "N/A"
          }
    `;
    })
    .join("\n");

const reactGenerationPrompt = (value) => `
Generate a React component using React Hook Form, Yup validation, and Material UI components for a dynamic form.
The page name should be set to ${value?.tableName}.

**Form Details:**
- Form fields should be dynamically generated based on below details
  ${formatColumnValue(value.columnsData)}.

**UI Styling:**
 - Please follow these Material UI and Emotion styles:

  \`\`\`javascript
  import { Box, Button, Paper, styled, Typography } from "@mui/material";

  // Base styles
  const Container = styled(Paper)(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));

  const SecondContainer = styled(Paper)(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));

  const Header = styled(Box)(({ theme }) => ({
    backgroundColor: "#1e88e5",
    color: "#fff",
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const SubHeader = styled(Box)(({ theme }) => ({
    color: "#1e88e5",
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const FormButton = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  }));
  \`\`\`

**Component:**
  - ${value?.tableName} should:
  - Use React Hook Form for form handling.
  - Validate with Yup, and display error messages below each field using FormHelperText.

  - The form should dynamically generate fields and support these functionalities:
    1. A **Submit** button that logs form data.
    2. A **Cancel** button to reset the form using \`reset\`.

  - Ensure the code is in **JavaScript only** (no TypeScript).
  - Here’s the basic structure:

  \`\`\`javascript
  const \${value?.tableName ? value.tableName : 'TableComponent'} = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => console.log(data);

    return (
      <>
        {formAction.display ? (
          <Container>
            <Header>
              <Typography variant="h6">
                {value?.tableName ? value.tableName : 'Form'}
              </Typography>
            </Header>

            <Container component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {/* Dynamically generated form fields */}
                </Grid>
              </Grid>
            Grid item xs={12} sm={12}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            gap={2} // Adds space between buttons
          >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="primary"
              >
               Add
              </Button>

            <Button
              type="button"
              variant="contained"
              color="primary"
              className="danger"
              onClick={handleReset}
            >
             Cancel
            </Button>
          </Box>
        </Grid>
            </Container>
          </Container>
        ) : null}

        <SecondContainer>
          <SubHeader>
            <Typography variant="h6">
              <b>${value?.tableName} List</b>
            </Typography>
            <FormButton type="button" onClick={addData} variant="contained" color="primary">
              Add ${value?.tableName}
            </FormButton>
          </SubHeader>
        </SecondContainer>
      </>
    );
  };
  \`\`\`

  **Ensure the form**:
  - Is responsive and accessible.
- Uses Material UI's dynamic theming.
- Displays validation messages clearly, with error messages shown below the form fields.
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

function extractJSXBetweenMarkers(inputString) {
  // Use a regular expression to find the JSX code between ```jsx markers
  const regex = /```jsx([\s\S]*?)```/g;
  const matches = inputString.match(regex);

  // If a match is found, clean up the markers and return the JSX content
  if (matches) {
    matches.map((match) => match.replace(/```jsx|```/g, "").trim());
    return matches.join("\r\n");
  }

  // If no matches are found, return an empty array or null
  return null;
}
