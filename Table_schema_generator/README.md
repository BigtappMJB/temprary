# Table Schema Generator

A React application for designing database tables and generating corresponding Spring Boot code via an API, as well as generating React components for CRUD operations.

## Features

- Design database tables with a user-friendly interface
- Add/remove fields dynamically
- Set field properties (name, type, primary key)
- Preview JSON payload in real-time
- Generate Spring Boot code via API
- Generate React components with CRUD operations
- Automatic App.js and Sidebar.js updates for new components
- Material-UI for a clean, responsive design
- Left sidebar navigation menu
- Environment toggle (Development/Production)
- Sample data loading
- **NEW: Python-based template rendering with Jinja2**
- **NEW: Standardized component templates for consistent UI**
- **NEW: Dynamic page generation based on table metadata**

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Python (v3.6 or later)
- pip (for Python package management)

### Installation

1. Clone the repository
2. Install all dependencies (Node.js and Python) with a single command:

```bash
npm run setup
```

This will:
- Install all Node.js dependencies
- Install required Python packages
- Create necessary directories

3. Make sure Python 3.6+ is installed on your system.

4. Start the application:

**Option 1: Using the batch file (Windows)**
```
start_app.bat
```

**Option 2: Using npm (if execution policy allows)**
```bash
npm start
```

Both options will start the React application and the Python service.

For development with the mock API, use:

```bash
npm run dev
```

**Note for Windows users with execution policy restrictions:**
If you encounter PowerShell execution policy errors, use the provided batch files:
- `start_app.bat` - Starts both the React app and Python service
- `start_python_service.bat` - Starts only the Python service
- `install_python_deps.bat` - Installs Python dependencies

This will start:
- The React development server
- The Node.js backend server
- The Python template rendering service

6. Open your browser and navigate to `http://localhost:8080`

### Manual Start (Alternative)

If you prefer to start services individually:

1. Start the Python service:

**Windows (using batch file):**
```
start_python_service.bat
```

**Other platforms (or if execution policy allows):**
```bash
npm run python-service
```

2. In a new terminal, start the React development server:

```bash
npm run start-react
```

3. If you need the mock API server:

```bash
npm run mock-api
```

## Usage

### Table Designer
1. Enter a table name
2. Add fields with their properties:
   - Field name
   - Field type (select from common SQL types)
   - Primary key (checkbox)
3. Preview the JSON payload that will be sent to the backend
4. Click "Generate Table & API" to send the request to the backend
5. View the API response

### Page Creator
1. Select a table from the dropdown menu
2. Customize the component options:
   - Pagination
   - Sorting
   - Filtering
   - Search
   - Refresh
   - CRUD Operations
3. Configure the fields you want to include
4. Click "Generate Component" to preview the generated code
5. Click "Save Component" to:
   - Generate the component using the Python Jinja2 template renderer
   - Save the component file to the src/components/generated/ directory
   - Update App.js to import the component and add a route
   - Update Sidebar.js to add a menu item for the component
6. Access your new component through the sidebar menu

### Python Template Rendering
The application now uses Python with Jinja2 for template rendering:

1. Table metadata is sent to the Python service
2. The Python service renders the Jinja2 template with the metadata
3. The rendered component is saved to the src/components/generated/ directory
4. The component is dynamically imported in App.js using React.lazy and Suspense

## Backend API

The application expects a backend API endpoint at `http://localhost:8080/codegen/tableCreateAPI` (development) or `/codegen/tableCreateAPI` (production) that accepts a POST request with the following JSON structure:

```json
{
  "tableName": "example_table",
  "fields": [
    {
      "name": "id",
      "type": "BIGINT",
      "primaryKey": true
    },
    {
      "name": "name",
      "type": "VARCHAR(100)",
      "primaryKey": false
    }
  ]
}
```

## Backend API Endpoints

### Table Designer API
The application expects a backend API endpoint at `http://localhost:8080/codegen/tableCreateAPI` (development) or `/codegen/tableCreateAPI` (production) that accepts a POST request with the table schema.

### Page Creator API
The application uses the following API endpoints:

- `GET /codegen/allTables` - Get a list of all available tables
- `GET /codegen/tableMetadata/:tableName` - Get metadata for a specific table
- `POST /codegen/saveComponent` - Save a generated component and update App.js and Sidebar.js

### Python Template Service API
The Python service exposes the following endpoint:

- `POST http://localhost:5000/generate` - Generate a React component from a Jinja2 template
  - Request body:
    ```json
    {
      "tableName": "example_table",
      "componentName": "ExampleTable",
      "pageTitle": "Example Management",
      "selectedFields": [...],
      "componentOptions": {...}
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Component ExampleTable generated successfully",
      "filePath": "path/to/component",
      "componentCode": "// Generated component code..."
    }
    ```

## Future Enhancements

- Support for foreign key relationships
- Audit columns (created_at, updated_at)
- Table history/list of generated tables
- Export/import table designs
- Visual entity-relationship diagram
- Component preview before saving
- Additional templates for different component types
- Role-based access control in generated components
- Template customization through the UI
- Support for more complex relationships in generated components
- Drag-and-drop field reordering
- Live preview of generated components

## Testing the Python Service

To verify that the Python template rendering service is working correctly:

1. Start the Python service:

**Windows (using batch file):**
```
start_python_service.bat
```

**Other platforms (or if execution policy allows):**
```bash
npm run python-service
```

2. In a new terminal, run the test script:

**Windows (using batch file):**
```
test_python_service.bat
```

**Other platforms (or if execution policy allows):**
```bash
npm run test-python
```

This will generate a sample component and verify that the service is working correctly.

## Troubleshooting

If you encounter issues with the Python service:

1. Make sure Python is installed and in your PATH
2. Try installing the dependencies manually:

```bash
cd server/python_service
pip install -r requirements.txt
```

3. Check the console for error messages
4. Verify the Python service is running by visiting http://localhost:5000 in your browser
5. If port 5000 is already in use, modify the port in `server/python_service/app.py`

## License

This project is licensed under the ISC License.