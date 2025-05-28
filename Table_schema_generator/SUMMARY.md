# Table Schema Generator - Project Summary

## Overview

This project is a React application that allows users to design database tables and generate corresponding Spring Boot code via an API. The application features a user-friendly interface with Material-UI components, a sidebar navigation menu, and real-time JSON preview.

## Key Features

1. **Table Designer Form**
   - Input for table name
   - Dynamic field list with name, type, and primary key options
   - Ability to add/remove fields dynamically

2. **JSON Preview**
   - Real-time preview of the JSON payload
   - Copy to clipboard functionality

3. **API Integration**
   - Submit JSON to backend API endpoint
   - Toggle between development and production environments
   - Display API response

4. **Permanent Sidebar Navigation (Left Side)**
   - Dashboard
   - Table Designer
   - Page Creator
   - History
   - Settings
   - Help
   - Responsive design (converts to top navigation on mobile)

5. **Sample Data**
   - Load sample data with a single click

## Project Structure

```
table-schema-generator/
├── src/
│   ├── components/
│   │   ├── TableSchemaGenerator.js  # Main form component
│   │   └── Sidebar.js               # Navigation sidebar
│   ├── App.js                       # Main application component
│   ├── index.js                     # Entry point
│   ├── index.html                   # HTML template
│   └── styles.css                   # Global styles
├── mock-api.js                      # Mock API server for testing
├── webpack.config.js                # Webpack configuration
├── package.json                     # Project dependencies
└── README.md                        # Project documentation
```

## API Endpoints

- Development: `http://localhost:8080/codegen/tableCreateAPI`
- Production: `/codegen/tableCreateAPI`

## JSON Payload Format

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

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Run both the React app and mock API server:
   ```
   npm run dev
   ```

3. For production build:
   ```
   npm run build
   ```

## Future Enhancements

- Support for foreign key relationships
- Audit columns (created_at, updated_at)
- Table history/list of generated tables
- Export/import table designs
- Visual entity-relationship diagram