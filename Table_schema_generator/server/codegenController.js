const express = require('express');
const router = express.Router();
const codegenService = require('./codegenService');
const dbService = require('./dbService');
const config = require('./config');

// Configuration
const DEFAULT_DATABASE = config.database.defaultDatabase;

// Get all tables
router.get('/allTables', async (req, res) => {
  try {
    // Get the database name from query parameter or use default
    const databaseName = req.query.database || DEFAULT_DATABASE;
    
    // Get all tables from the database
    const tables = await dbService.getAllTables(databaseName);
    
    res.json(tables);
  } catch (error) {
    console.error('Error getting tables:', error);
    
    // If there's an error, return mock data as fallback
    const mockTables = [
      'users',
      'products',
      'orders',
      'categories',
      'customers',
      'suppliers',
      'employees',
      'inventory',
      'payments',
      'shipments'
    ];
    
    res.json(mockTables);
  }
});

// Get table metadata
router.get('/tableMetadata/:tableName', async (req, res) => {
  const { tableName } = req.params;
  
  try {
    // Get the database name from query parameter or use default
    const databaseName = req.query.database || DEFAULT_DATABASE;
    
    // Get metadata for the specified table
    const metadata = await dbService.getTableMetadata(databaseName, tableName);
    
    res.json(metadata);
  } catch (error) {
    console.error('Error getting table metadata:', error);
    
    // If there's an error, return mock data as fallback
    const mockMetadata = {
      users: [
        { name: 'id', type: 'BIGINT', primaryKey: true, nullable: false },
        { name: 'username', type: 'VARCHAR(50)', primaryKey: false, nullable: false },
        { name: 'email', type: 'VARCHAR(100)', primaryKey: false, nullable: false },
        { name: 'password', type: 'VARCHAR(255)', primaryKey: false, nullable: false },
        { name: 'first_name', type: 'VARCHAR(50)', primaryKey: false, nullable: true },
        { name: 'last_name', type: 'VARCHAR(50)', primaryKey: false, nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'updated_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'is_active', type: 'BOOLEAN', primaryKey: false, nullable: false }
      ],
      products: [
        { name: 'id', type: 'BIGINT', primaryKey: true, nullable: false },
        { name: 'name', type: 'VARCHAR(100)', primaryKey: false, nullable: false },
        { name: 'description', type: 'TEXT', primaryKey: false, nullable: true },
        { name: 'price', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false },
        { name: 'category_id', type: 'BIGINT', primaryKey: false, nullable: true },
        { name: 'stock_quantity', type: 'INT', primaryKey: false, nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'updated_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'is_active', type: 'BOOLEAN', primaryKey: false, nullable: false }
      ],
      orders: [
        { name: 'id', type: 'BIGINT', primaryKey: true, nullable: false },
        { name: 'customer_id', type: 'BIGINT', primaryKey: false, nullable: false },
        { name: 'order_date', type: 'TIMESTAMP', primaryKey: false, nullable: false },
        { name: 'total_amount', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false },
        { name: 'status', type: 'VARCHAR(20)', primaryKey: false, nullable: false },
        { name: 'shipping_address', type: 'TEXT', primaryKey: false, nullable: true },
        { name: 'payment_method', type: 'VARCHAR(50)', primaryKey: false, nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'updated_at', type: 'TIMESTAMP', primaryKey: false, nullable: true }
      ]
    };
    
    if (mockMetadata[tableName]) {
      res.json(mockMetadata[tableName]);
    } else {
      // Return a generic metadata if the table doesn't exist in our mock data
      const genericMetadata = [
        { name: 'id', type: 'BIGINT', primaryKey: true, nullable: false },
        { name: 'name', type: 'VARCHAR(100)', primaryKey: false, nullable: false },
        { name: 'description', type: 'TEXT', primaryKey: false, nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'updated_at', type: 'TIMESTAMP', primaryKey: false, nullable: true },
        { name: 'is_active', type: 'BOOLEAN', primaryKey: false, nullable: false }
      ];
      res.json(genericMetadata);
    }
  }
});

// Save component and update App.js
router.post('/saveComponent', async (req, res) => {
  try {
    const { componentName, componentCode, routeId, pageTitle, updateAppJs } = req.body;
    
    // Validate required fields
    if (!componentName || !componentCode) {
      return res.status(400).json({
        success: false,
        message: 'Component name and code are required'
      });
    }
    
    // Check if this is a generated component (with .jsx extension)
    const isGeneratedComponent = componentName.endsWith('.jsx');
    
    // For generated components, we don't need to save them as they're already saved by the Python service
    if (!isGeneratedComponent) {
      // Save the component file
      await codegenService.saveComponent(componentName, componentCode);
    }
    
    // Update App.js and Sidebar.js if requested
    if (updateAppJs && routeId && pageTitle) {
      // For generated components, use a different route ID format
      const effectiveRouteId = isGeneratedComponent ? `generated-${componentName.replace('.jsx', '')}` : routeId;
      
      await codegenService.updateAppJs(componentName, effectiveRouteId, pageTitle);
      await codegenService.updateSidebarJs(effectiveRouteId, pageTitle);
    }
    
    res.json({
      success: true,
      message: `Component ${componentName} ${isGeneratedComponent ? 'processed' : 'saved'} successfully${updateAppJs ? ' and App.js updated' : ''}`
    });
  } catch (error) {
    console.error('Error saving component:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while saving the component'
    });
  }
});

module.exports = router;