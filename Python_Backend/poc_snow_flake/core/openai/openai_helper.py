import re


def extract_jsx_between_markers(response):
    # Regular expression to match code blocks enclosed in triple backticks
    code_blocks = []
    regex = re.compile(r'```[\s\S]*?```')
    
    # Iterate through all matches of the regex in the response
    matches = regex.findall(response)
    
    for match in matches:
        # Remove the backticks and language identifier (if any)
        code = re.sub(r'```[\w]*\n?', '', match).rstrip('```')
        # Trim extra spaces/newlines and add the cleaned code into the list
        code_blocks.append(code.strip())
    
    return "\n".join(code_blocks)



def format_column_value(column_data):
    return '\n'.join(
        f"""
     - Field {index + 1}
          - Column Name : {column.get('COLUMN_NAME', {}).get('COLUMN_NAME', 'N/A')}
          - Input Type : {column.get('inputType', {}).get('NAME', 'N/A')}
          - Maximum Length : {column.get('CHARACTER_MAXIMUM_LENGTH', 'N/A')}
          - Default Value : {column.get('COLUMN_DEFAULT', 'N/A')}
          - Required : {'No' if column.get('IS_NULLABLE') == 'NO' else 'Yes'}
          - Options : {', '.join(column.get('optionsList', {}).values()) if column.get('optionsList') else 'N/A'}
        """
        for index, (key, column) in enumerate(column_data.items())
    )



def generate_react_code(value):
    try:
        from core.openai.openi_core import openapi_function
        prompt = react_generation_prompt(value)
        response =  openapi_function(prompt=prompt)
        react_code = extract_jsx_between_markers(response=response)
        return react_code
    except Exception as e:
        raise e



def handle_file_operations(folder_path, file_name, code_content):
    """
    Function to handle file operations: check if path exists, create folder, write to file, and verify success.

    Parameters:
    folder_path (str): The path where the folder should be created.
    file_name (str): The name of the file to create inside the folder.
    code_content (str): The content to write into the file.

    Returns:
    bool: True if the process succeeded, False otherwise.
    """
    try:
        import os
        # 1. Check if folder exists, if not, create it
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"Folder created at: {folder_path}")
        else:
            print(f"Folder already exists at: {folder_path}")

        # 2. Create a file inside the folder and write the code content
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'w') as file:
            file.write(code_content)
            print(f"File created and written at: {file_path}")

        print(os.path.exists(file_path))
        print(os.path.getsize(file_path))
        # 3. Check if the file exists and was written correctly
        if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
            print("File operation succeeded.")
            return True
        else:
            print("File operation failed.")
            return False

    except Exception as e:
        print(f"An error occurred: {e}")
        raise e



def react_generation_prompt(value):
    return f'''
Generate a React component using React Hook Form, Yup validation, and Material UI components for a dynamic form. 
The form should follow a two-column grid layout, and an API call should be triggered upon form submission, passing 
the form values as arguments using Axios for HTTP requests. Additionally, retrieve data from the server using Axios 
and store it in useState when the component is mounted.

Additional API Integration:
- Retrieve table data using Axios and pass the data into the <DataTable> component.
- The component should also handle update and delete logic using the provided handler functions.

Form Details:
- The page name should be set to {value.get("pageDetails", {}).get("pageName", '')}.
- Form fields should be dynamically generated based on the following details:
  {format_column_value(value.get("columnsData", []))}.

UI Layout Requirements:
- Use Material UI's Grid component to implement a two-column layout for form elements.
- Ensure the form is responsive, with a single column layout on smaller screens.

UI Styling:
- Please use these Material UI and Emotion styles:

  \'''
import DataTable from "../user-management/users/components/DataTable";
import {{ yupResolver }} from '@hookform/resolvers/yup';
import * as Mui from "@mui/material";

  // Base styles
  const Container = Mui.styled(Mui.Paper)(({{ theme }}) => ({{
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {{
      padding: theme.spacing(2),
    }},
  }}));

  const Header = Mui.styled(Mui.Box)(({{ theme }}) => ({{
    backgroundColor: "#1e88e5",
    color: "#fff",
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}));

  const FormButton = Mui.styled(Mui.Button)(({{ theme }}) => ({{
    [theme.breakpoints.down("sm")]: {{
      width: "100%",
    }},
  }}));
  \'''

Component Logic with Axios:
- The form should:
  1. Use React Hook Form for form handling.
  2. Implement Yup validation and display error messages below each field using FormHelperText.
  3. Dynamically generate form fields based on {value.get("columnsData", [])} array, ensuring proper names and validation.
  4. Include a **Submit** button to log form data and make an API call.
  5. Include a **Cancel** button to reset the form using reset.

- Ensure the code is in **JavaScript only** (no TypeScript).

API Integration:
- Use Axios to make a POST request with form values as the payload.
- The API endpoint should be https://example.com/api/submit, and the form values should be passed in the request body.

- Include a function to retrieve table data using Axios and store it in useState. 
- Add an additional API call to retrieve data from the table and display the data using the <DataTable> component.

Grid Layout:
- The form should have a two-column layout, using Material UI's Grid component.
- Each form element should occupy one column (sm={{6}}), and full-width elements should span both columns (xs={{12}}).

Code Structure with Docstring:

\'''
import React, {{ useEffect, useState }} from 'react';
import axios from 'axios';
import {{ useForm }} from 'react-hook-form';
import * as yup from "yup";
import {{ yupResolver }} from '@hookform/resolvers/yup';
import DataTable from "../user-management/users/components/DataTable";

/**
 * Validation schema using Yup.
 */
const validationSchema = yup.object().shape({{
  // Add validation rules dynamically from value.columnsData
}});

/**
 * A dynamic form component generated using React Hook Form, Material UI, and Axios for HTTP requests.
 * The form layout is styled using Material UI's Grid system with two-column layout for form elements.
 * Form fields are dynamically generated based on the input data and Yup validation is applied.
 * On form submission, the form data is sent to an API endpoint using Axios.
 * Additionally, table data is fetched and passed into the <DataTable> component for display.
 *
 * @component
 * @returns {{JSX.Element}} The rendered React component.
 */
const TableComponent = ({{ handleUpdateLogic, handleDelete, columns, permissionLevels }}) => {{
  // Initialize React Hook Form with Yup resolver
  const {{ register, handleSubmit, reset, formState: {{ errors }} }} = useForm({{
    mode: "onChange",
    shouldFocusError: true, 
    reValidateMode: "onChange", 
    resolver: yupResolver(validationSchema),
  }});

  // Store Table Data in useState
  const [tableData, setTableData] = useState([]);

  /**
   * Fetch and store table data from server using Axios.
   */
  const getTableData = async () => {{
    try {{
      const response = await axios.get('https://example.com/api/table');
      setTableData(response.data);
    }} catch (error) {{
      console.error('Error fetching table data:', error);
      setTableData([]); // Set empty data if an error occurs
    }}
  }};

  useEffect(() => {{
    getTableData();
  }}, []);

  /**
   * Handles form submission, sends form data to the server using Axios.
   *
   * @param {{Object}} formData - The data from the form submission.
   */
  const onSubmit = async (formData) => {{
    try {{
      const response = await axios.post('https://example.com/api/submit', formData);
      console.log('API Response:', response.data);
    }} catch (error) {{
      console.error('Error submitting the form:', error);
    }}
  }};

  /**
   * Handles form reset, resetting the form fields.
   */
  const onReset = () => {{
    reset();
  }};

  return (
    <>
      <Container>
        <Header>
          <Mui.Typography variant="h6">
            {value.get("pageDetails", {}).get("pageName", 'Form')}
          </Mui.Typography>
        </Header>

        <Mui.Box component="form" onSubmit={{handleSubmit(onSubmit)}} sx={{{{ p: 3, mb: 5 }}}}>
          <Mui.Grid container spacing={2}>
            {{value.get("columnsData", []).map((field, index) => (
              <Mui.Grid item xs={12} sm={6} key={{index}}>
                <Mui.TextField
                  fullWidth
                  label={{field.get("label")}}
                  {{...register(field.get("name"), {{ required: field.get("required", False) }})}}
                  error={{!!errors[field.get("name")]}}
                  helperText={{errors[field.get("name")]?.message || ''}}
                />
              </Mui.Grid>
            ))}}
            <Mui.Grid item xs={12}>
              <Mui.Box display="flex" justifyContent="flex-end" gap={2}>
                <Mui.Button type="submit" variant="contained" color="primary">
                  Submit
                </Mui.Button>
                <Mui.Button type="button" variant="contained" color="secondary" onClick={{onReset}}>
                  Cancel
                </Mui.Button>
              </Mui.Box>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Box>
      </Container>

      <Mui.Box className="common-table">
        <Mui.Typography variant="h6">
          <b>{value.get("pageDetails", {}).get("pageName", '')} List</b>
        </Mui.Typography>
        <DataTable
          tableData={{tableData}}
          handleUpdateLogic={{handleUpdateLogic}}
          handleDelete={{handleDelete}}
          columns={{columns}}
          permissionLevels={{permissionLevels}}
        />
      </Mui.Box>
    </>
  );
}};

export default {value.get("pageDetails", {}).get("pageName", '')};
\'''
'''


