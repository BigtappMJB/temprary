import { get, post } from "../../utilities/apiservices/apiServices";
import { generateCrudTemplate } from "../templates/crudTemplate";

/**
 * Fetches the list of tables from the API
 * @returns {Promise<Array>} List of tables
 */
export const getTableListDataController = async () => {
  try {
    console.log("Fetching tables from API...");
    const response = await get("dynamic-page/tables", "python");
    console.log("Raw API Response:", response);

    // Check if response has data property
    const data = response?.data || response;
    console.log("Response data:", data);

    if (data && Array.isArray(data)) {
      const formattedTables = data.map((table) => ({
        TABLE_NAME: table.tableName || table.TABLE_NAME || table.name,
      }));
      console.log("Formatted tables:", formattedTables);
      return formattedTables;
    }

    console.warn("Invalid response format from tables API:", response);
    return [];
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};

/**
 * Creates a dynamic page based on the provided data
 * @param {Object} formData - Data for creating the page
 * @returns {Promise<Object>} Response from the API
 */
// export const createReactFormController = async (formData) => {
//   try {
//     if (!formData || typeof formData !== "object") {
//       throw new Error("Invalid form data");
//     }

//     console.log("Creating dynamic page with data:", formData);

//     // Validate tableName
//     if (!formData.tableName || formData.tableName === "") {
//       throw new Error("Table name is required");
//     }

//     // Normalize the route path
//     let routePath = formData.routePath || "";

//     // Ensure route path starts with a slash
//     if (!routePath.startsWith("/")) {
//       routePath = "/" + routePath;
//     }

//     // Remove trailing slash if present
//     if (routePath.endsWith("/") && routePath.length > 1) {
//       routePath = routePath.slice(0, -1);
//     }

//     // Prepare the payload according to the API specification
//     const payload = {
//       tableName: formData.tableName,
//       fields: formData.fields || [],
//       menuName: formData.menuName || "",
//       subMenuName: formData.subMenuName || "",
//       pageName: formData.pageName || "",
//       routePath: routePath,
//       moduleName: formData.moduleName || "",
//       permissionLevels: ["create", "read", "update", "delete"], // Default permission levels
//     };
//     // const payload = {
//     //   className: "com.codegen.model.ihnji",
//     //   fields: [
//     //     { name: "inni", type: "Double", primary: true },
//     //     { name: "knkkin", type: "String", primary: false },
//     //     { name: "knmkn ", type: "String", primary: false },
//     //   ],
//     // };

//     // For debugging - log the exact payload being sent
//     console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

//     // Call the API endpoint and process the response
//     console.log("Calling API endpoint: dynamic-page/create");
//     const response = await post("dynamic-page/create", payload, "python");
//     // const response = await post("/api/generator/generateApp", payload, "java");
//     console.log("API response received:", response);

//     // If the page was created successfully, also generate the React component
//     if (response) {
//       try {
//         console.log("Generating React component for the new page...");

//         // Call the API to generate the React componAPI response receivedent
//         const componentResponse = await post(
//           "gpt/generateReactComponent",
//           {
//             pageName: formData.pageName,
//             tableName: formData.tableName,
//             fields: formData.fields || [],
//             routePath: routePath,
//           },
//           "python"
//         );

//         console.log("React component generation response:", componentResponse);

//         // Add component generation info to the response
//         if (componentResponse && componentResponse.success) {
//           response.componentGenerated = true;
//           if (componentResponse.data && componentResponse.data.generatedFiles) {
//             response.data = response.data || {};
//             response.data.generatedFiles =
//               componentResponse.data.generatedFiles;
//           }
//         }
//       } catch (componentError) {
//         console.error("Error generating React component:", componentError);
//         // Don't fail the whole operation if component generation fails
//         response.componentGenerated = false;
//         response.componentError =
//           componentError.message || "Unknown error generating component";
//       }
//     }

//     if (response && response.success) {
//       return {
//         success: true,
//         message: response.message || "Dynamic page created successfully",
//         data: response.data,
//       };
//     } else {
//       // If we get a response but success is false
//       if (response) {
//         throw response; // Throw the entire response object to preserve error details
//       } else {
//         throw new Error(
//           "Failed to create dynamic page: No response from server"
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error creating dynamic page:", error);
//     throw error;
//   }
// };

export const createReactFormController = async (formData) => {
  try {
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    console.log("Creating dynamic page with data:", formData);

    // Validate tableName
    if (!formData.tableName || formData.tableName === "") {
      throw new Error("Table name is required");
    }

    // Normalize the route path
    let routePath = formData.routePath || "";

    if (!routePath.startsWith("/")) {
      routePath = "/" + routePath;
    }

    if (routePath.endsWith("/") && routePath.length > 1) {
      routePath = routePath.slice(0, -1);
    }

    // Prepare payload for your Java backend API
    const payload = {
      tableName: formData.tableName,
      fields: formData.fields || [],
      menuName: formData.menuName || "",
      subMenuName: formData.subMenuName || "",
      description: formData.description || "",
      pageName: formData.pageName || "",
      routePath: routePath,
      moduleName: formData.moduleName || "",
      masterTable: formData.masterTable || false,
      relationshipType: formData.relationshipType || "one-to-many", // Default to one-to-many
      permissionLevels: ["create", "read", "update", "delete"], // Default permissions
    };

    console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

    // Call your Java backend API only — no React component separate call needed
    const response = await post("/api/generator/generateApp", payload, "java");

    console.log("API response received:", response);

    // Directly return the response from Java backend
    if (response && response.success) {
      return {
        success: true,
        message: response.message || "Dynamic page created successfully",
        data: response.data,
      };
    } else {
      if (response) {
        throw response;
      } else {
        throw new Error(
          "Failed to create dynamic page: No response from server"
        );
      }
    }
  } catch (error) {
    console.error("Error creating dynamic page:", error);
    throw error;
  }
};

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

// const reactGenerationPrompt = (value) => `
// Generate a React component using React Hook Form, Yup validation, and Material UI components for a dynamic form.
// The page name should be set to ${value?.tableName}.

// **Form Details:**
// - Form fields should be dynamically generated based on below details
//   ${formatColumnValue(value.columnsData)}.

// **UI Styling:**
//  - Please follow these Material UI and Emotion styles:

//   \`\`\`javascript
//   import { Box, Button, Paper, styled, Typography } from "@mui/material";

//   // Base styles
//   const Container = styled(Paper)(({ theme }) => ({
//     paddingBottom: theme.spacing(3),
//     marginBottom: theme.spacing(5),
//     borderRadius: theme.spacing(1),
//     boxShadow: theme.shadows[3],
//     [theme.breakpoints.down("sm")]: {
//       padding: theme.spacing(2),
//     },
//   }));

//   const SecondContainer = styled(Paper)(({ theme }) => ({
//     paddingBottom: theme.spacing(3),
//     marginBottom: theme.spacing(5),
//     borderRadius: theme.spacing(1),
//     boxShadow: theme.shadows[3],
//     [theme.breakpoints.down("sm")]: {
//       padding: theme.spacing(2),
//     },
//   }));

//   const Header = styled(Box)(({ theme }) => ({
//     backgroundColor: "#1e88e5",
//     color: "#fff",
//     padding: theme.spacing(2),
//     borderTopLeftRadius: theme.spacing(1),
//     borderTopRightRadius: theme.spacing(1),
//     marginBottom: theme.spacing(2),
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }));

//   const SubHeader = styled(Box)(({ theme }) => ({
//     color: "#1e88e5",
//     padding: theme.spacing(2),
//     borderTopLeftRadius: theme.spacing(1),
//     borderTopRightRadius: theme.spacing(1),
//     marginBottom: theme.spacing(2),
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }));

//   const FormButton = styled(Button)(({ theme }) => ({
//     [theme.breakpoints.down("sm")]: {
//       width: "100%",
//     },
//   }));
//   \`\`\`

// Component Logic with Axios:

// - The form should:

//   1. Use React Hook Form for form handling.

//   2. Implement Yup validation and display error messages below each field using FormHelperText.

//   3. Dynamically generate form fields based on [object Object] array.

//   4. Include a **Submit** button to log form data and make an API call.

//   5. Include a **Cancel** button to reset the form using 'reset'.

// API Integration:

// - Use Axios to make a POST request with form values as the payload.

// - The API endpoint should be 'https://example.com/api/submit', and the form values should be passed in the request body.

// Grid Layout:

// - The form should have a two-column layout, using Material UI's 'Grid' component.

// - Each form element should occupy one column (sm={6}), and full-width elements should span both columns (xs={12}).

//   - Here’s the basic structure:

//   \`\`\`javascript
//   const ${value?.tableName ? value.tableName : 'TableComponent'} = () => {
//     const { register, handleSubmit, reset, formState: { errors } } = useForm({
//       resolver: yupResolver(validationSchema),
//     });

//     const onSubmit = (data) => console.log(data);

//     return (
//       <>
//         {formAction.display ? (
//           <Container>
//             <Header>
//               <Typography variant="h6">
//                 {value?.tableName ? value.tableName : 'Form'}
//               </Typography>
//             </Header>

//             <Container component="form" onSubmit={handleSubmit(onSubmit)}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   {/* Dynamically generated form fields */}
//                 </Grid>
//               </Grid>
//             Grid item xs={12} sm={12}>
//           <Box
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             flexWrap="wrap"
//             gap={2} // Adds space between buttons
//           >
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 className="primary"
//               >
//                Add
//               </Button>

//             <Button
//               type="button"
//               variant="contained"
//               color="primary"
//               className="danger"
//               onClick={handleReset}
//             >
//              Cancel
//             </Button>
//           </Box>
//         </Grid>
//             </Container>
//           </Container>
//         ) : null}

//         <SecondContainer>
//           <SubHeader>
//             <Typography variant="h6">
//               <b>${value?.tableName} List</b>
//             </Typography>
//             <FormButton type="button" onClick={addData} variant="contained" color="primary">
//               Add ${value?.tableName}
//             </FormButton>
//           </SubHeader>
//         </SecondContainer>
//       </>
//     );
//   };
//   \`\`\`

//   **Ensure the form**:
//   - Is responsive and accessible.
// - Uses Material UI's dynamic theming.
// - Displays validation messages clearly, with error messages shown below the form fields.
// `;

// const reactGenerationPrompt = (value) =>  `
// Generate a React component using React Hook Form, Yup validation, and Material UI components for a dynamic form.
// The form should follow a two-column grid layout, and an API call should be triggered upon form submission, passing
// the form values as arguments using Axios for HTTP requests. Additionally, retrieve data from the server using Axios
// and store it in useState when the component is mounted.

// Additional API Integration:
// - Retrieve table data using Axios and pass the data into the <DataTable> component.
// - The component should also handle update and delete logic using the provided handler functions.

// Form Details:
// - The page name should be set to ${value?.tableName}.
// - Form fields should be dynamically generated based on the following details:
//   ${formatColumnValue(value.columnsData)}.

// UI Layout Requirements:
// - Use Material UI's Grid component to implement a two-column layout for form elements.
// - Ensure the form is responsive, with a single column layout on smaller screens.

// UI Styling:
// - Please use these Material UI and Emotion styles:

//   \\\`javascript
// import * as Mui from "@mui/material";

//   // Base styles
//   const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
//     paddingBottom: theme.spacing(3),
//     marginBottom: theme.spacing(5),
//     borderRadius: theme.spacing(1),
//     boxShadow: theme.shadows[3],
//     [theme.breakpoints.down("sm")]: {
//       padding: theme.spacing(2),
//     },
//   }));

//   const Header = Mui.styled(Mui.Box)(({ theme }) => ({
//     backgroundColor: "#1e88e5",
//     color: "#fff",
//     padding: theme.spacing(2),
//     borderTopLeftRadius: theme.spacing(1),
//     borderTopRightRadius: theme.spacing(1),
//     marginBottom: theme.spacing(2),
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }));

//   const FormButton = Mui.styled(Mui.Button)(({ theme }) => ({
//     [theme.breakpoints.down("sm")]: {
//       width: "100%",
//     },
//   }));
//   \\\`

// Component Logic with Axios:
// - The form should:
//   1. Use React Hook Form for form handling.
//   2. Implement Yup validation and display error messages below each field using FormHelperText.
//   3. Dynamically generate form fields based on ${value.columnsData} array.
//   4. Include a **Submit** button to log form data and make an API call.
//   5. Include a **Cancel** button to reset the form using \`reset\`.

// - Ensure the code is in **JavaScript only** (no TypeScript).

// API Integration:
// - Use Axios to make a POST request with form values as the payload.
// - The API endpoint should be \`https://example.com/api/submit\`, and the form values should be passed in the request body.

// - Include a function to retrieve table data using Axios and store it in useState.
// - Add an additional API call to retrieve data from the table and display the data using the <DataTable> component.

// Grid Layout:
// - The form should have a two-column layout, using Material UI's \`Grid\` component.
// - Each form element should occupy one column (sm={6}), and full-width elements should span both columns (xs={12}).

// Code Structure with Docstring:

// \\\`javascript
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as Mui from "@mui/material";
// import { useForm } from 'react-hook-form';
// import * as yup from "yup";
// import DataTable from "../user-management/users/components/DataTable";
// import { yupResolver } from '@hookform/resolvers/yup';

// /**
//  * Validation schema using Yup.
//  */
// const validationSchema = yup.object().shape({
//   // Add validation rules based on value.columnsData
// });

// /**
//  * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
//  * The form layout is styled using Material UI's Grid system with two-column layout for form elements.
//  * Form fields are dynamically generated based on the input data and Yup validation is applied.
//  * On form submission, the form data is sent to an API endpoint using Axios.
//  * Additionally, table data is fetched and passed into the <DataTable> component for display.
//  *
//  * @component
//  * @returns {JSX.Element} The rendered React component.
//  */
// const ${value?.tableName ? value.tableName : 'TableComponent'} = ({ handleUpdateLogic, handleDelete, columns, permissionLevels }) => {
//   // Initialize React Hook Form with Yup resolver
//   const { register, handleSubmit, reset, formState: { errors } } = useForm({
//     mode: "onChange",
//     shouldFocusError: true,
//     reValidateMode: "onChange",
//     resolver: yupResolver(validationSchema),
//   });

//   // Store Table Data in useState
//   const [tableData, setTableData] = useState([]);

//   /**
//    * Fetch and store table data from server using Axios.
//    */
//   const getTableData = async () => {
//     try {
//       const response = await axios.get('https://example.com/api/table');
//       setTableData(response.data);
//     } catch (error) {
//       console.error('Error fetching table data:', error);
//       if (error.response && error.response.status === 404) {
//         setTableData([]);
//       }
//     }
//   };

//   useEffect(() => {
//     getTableData();
//   }, []);

//   /**
//    * Handles form submission, sends form data to the server using Axios.
//    *
//    * @param {Object} formData - The data from the form submission.
//    */
//   const onSubmit = async (formData) => {
//     try {
//       const response = await axios.post('https://example.com/api/submit', formData);
//       console.log('API Response:', response.data);
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//     }
//   };

//   /**
//    * Handles form reset, resetting the form fields.
//    */
//   const onReset = () => {
//     reset();
//   };

//   return (
//     <>
//       {formAction.display ? (
//         <Mui.Paper>
//           <Mui.Box sx={{ backgroundColor: '#1e88e5', color: '#fff', p: 2 }}>
//             <Mui.Typography variant="h6">
//               ${value?.tableName ? value.tableName : 'Form'}
//             </Mui.Typography>
//           </Mui.Box>

//           <Mui.Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
//             <Mui.Grid container spacing={2}>
//               {value.columnsData.map((field, index) => (
//                 <Mui.Grid item xs={12} sm={6} key={index}>
//                   {/* Dynamically render form fields based on column data */}
//                   <Mui.TextField
//                     fullWidth
//                     label={field.label}
//                     {...register(field.name)}
//                     error={!!errors[field.name]}
//                     helperText={errors[field.name]?.message}
//                   />
//                 </Mui.Grid>
//               ))}
//               <Mui.Grid item xs={12}>
//                 <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
//                   <Mui.Button type="submit" variant="contained" color="primary">
//                     Submit
//                   </Mui.Button>
//                   <Mui.Button type="button" variant="contained" color="secondary" onClick={onReset}>
//                     Cancel
//                   </Mui.Button>
//                 </Mui.Box>
//               </Mui.Grid>
//             </Mui.Grid>
//           </Mui.Paper>
//         </Mui.Paper>
//       ) : null}

//             <SecondContainer className="common-table">
//         <SubHeader className="table-header">
//           <Typography variant="h6">
//             <b>${value?.tableName}  List</b>
//           </Typography>
//           <Box display="flex" justifyContent="space-between" flexWrap="wrap">
//             <FormButton
//               type="button"
//               onClick={addUser}
//               variant="contained"
//               color="primary"
//               style={{ marginRight: "10px" }}
//               className='primary'
//               disabled={formAction.action === "add" && formAction.display}
//             >
//               Add ${value?.tableName }
//             </FormButton>
//           </Box>
//         </SubHeader>
//           <DataTable
//             tableData={tableData}
//           />
//       </SecondContainer>
//     </>
//   );
// };

// export default ${value?.tableName ? value.tableName : 'TableComponent'};
// \\\`

// Additional Requirements:
// - Ensure the form is accessible and supports responsive design using Material UI's breakpoints.
// - Validation messages should be clear and displayed under each respective field.
// - Ensure the form adapts to smaller screen sizes, switching to a single-column layout.
// `;

const reactGenerationPrompt = (value) => `
Generate a React component using React Hook Form, Yup validation, and Material UI components for a dynamic form. 
The form should follow a two-column grid layout, and an API call should be triggered upon form submission, passing 
the form values as arguments using Axios for HTTP requests. Additionally, retrieve data from the server using Axios 
and store it in useState when the component is mounted.

Additional API Integration:
- Retrieve table data using Axios and pass the data into the <DataTable> component.
- The component should also handle update and delete logic using the provided handler functions.

Form Details:
- The page name should be set to ${value?.pageDetails?.pageName}.
- Form fields should be dynamically generated based on the following details:
  ${formatColumnValue(value.columnsData)}.

UI Layout Requirements:
- Use Material UI's Grid component to implement a two-column layout for form elements.
- Ensure the form is responsive, with a single column layout on smaller screens.

UI Styling:
- Please use these Material UI and Emotion styles:

  \\\`javascript
import DataTable from "../user-management/users/components/DataTable";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Mui from "@mui/material";

  // Base styles
  const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));

  const Header = Mui.styled(Mui.Box)(({ theme }) => ({
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

  const FormButton = Mui.styled(Mui.Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  }));
  \\\`

Component Logic with Axios:
- The form should:
  1. Use React Hook Form for form handling.
  2. Implement Yup validation and display error messages below each field using FormHelperText.
  3. Dynamically generate form fields based on ${
    value.columnsData
  } array, ensuring proper names and validation.
  4. Include a **Submit** button to log form data and make an API call.
  5. Include a **Cancel** button to reset the form using \`reset\`.

- Ensure the code is in **JavaScript only** (no TypeScript).

API Integration:
- Use Axios to make a POST request with form values as the payload.
- The API endpoint should be \`https://example.com/api/submit\`, and the form values should be passed in the request body.

- Include a function to retrieve table data using Axios and store it in useState. 
- Add an additional API call to retrieve data from the table and display the data using the <DataTable> component.

Grid Layout:
- The form should have a two-column layout, using Material UI's \`Grid\` component.
- Each form element should occupy one column (sm={6}), and full-width elements should span both columns (xs={12}).

Code Structure with Docstring:

\\\`javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from "yup";

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({
  // Add validation rules dynamically from value.columnsData
});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with two-column layout for form elements.
 * Form fields are dynamically generated based on the input data and Yup validation is applied.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @returns {JSX.Element} The rendered React component.
 */
const ${
  value?.pageDetails?.pageName ? value?.pageDetails?.pageName : "TableComponent"
} = ({ handleUpdateLogic, handleDelete, columns, permissionLevels }) => {
  // Initialize React Hook Form with Yup resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: "onChange",
    shouldFocusError: true, 
    reValidateMode: "onChange", 
    resolver: yupResolver(validationSchema),
  });

  // Store Table Data in useState
  const [tableData, setTableData] = useState([]);

  /**
   * Fetch and store table data from server using Axios.
   */
  const getTableData = async () => {
    try {
      const response = await axios.get('https://example.com/api/table');
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]); // Set empty data if an error occurs
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  /**
   * Handles form submission, sends form data to the server using Axios.
   *
   * @param {Object} formData - The data from the form submission.
   */
  const onSubmit = async (formData) => {
    try {
      const response = await axios.post('https://example.com/api/submit', formData);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  /**
   * Handles form reset, resetting the form fields.
   */
  const onReset = () => {
    reset();
  };

  return (
    <>
      {formAction.display ? (
        <Container>
          <Header sx={{ backgroundColor: '#1e88e5', color: '#fff', p: 2 }}>
            <Mui.Typography variant="h6">
              ${
                value?.pageDetails?.pageName
                  ? value?.pageDetails?.pageName
                  : "Form"
              }
            </Mui.Typography>
          </Header>

          <Mui.Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, mb: 5 }}>
            <Mui.Grid container spacing={2}>
              {value.columnsData.map((field, index) => (
                <Mui.Grid item xs={12} sm={6} key={index}>
                  <Mui.TextField
                    fullWidth
                    label={field.label}
                    {...register(field.name, { required: field.required || false })}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message || ''}
                  />
                </Mui.Grid>
              ))}
              <Mui.Grid item xs={12}>
                <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
                  <Mui.Button type="submit" variant="contained" color="primary">
                    Submit
                  </Mui.Button>
                  <Mui.Button type="button" variant="contained" color="secondary" onClick={onReset}>
                    Cancel
                  </Mui.Button>
                </Mui.Box>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Box>
        </Container>
      ) : null}

      {/* This part is placed outside the first Paper element */}
      <SecondContainer className="common-table">
        <SubHeader className="table-header">
          <Mui.Typography variant="h6">
            <b>${value?.pageDetails?.pageName} List</b>
          </Mui.Typography>
          <Mui.Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={null}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              className='primary'
            >
              Add ${value?.pageDetails?.pageName}
            </FormButton>
          </Mui.Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
          columns={columns}
          permissionLevels={permissionLevels}
        />
      </SecondContainer>
    </>
  );
};

export default ${
  value?.pageDetails?.pageName ? value?.pageDetails?.pageName : "TableComponent"
};
`;
