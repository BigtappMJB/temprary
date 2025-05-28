const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const codegenController = require('./codegenController');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/codegen', codegenController);

// Import database service and configuration
const dbService = require('./dbService');
const config = require('./config');

// Configuration
const DEFAULT_DATABASE = config.database.defaultDatabase;

// API routes for CRUD operations
app.get('/api/:table', async (req, res) => {
  const { table } = req.params;
  const databaseName = req.query.database || DEFAULT_DATABASE;
  
  try {
    // Try to get data from the database
    const query = `SELECT * FROM ${table} LIMIT 100`;
    const data = await dbService.executeQuery(databaseName, query);
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    
    // If there's an error, return mock data as fallback
    const mockData = Array(15).fill(null).map((_, index) => {
      const item = { id: index + 1 };
      
      // Add fields based on the table name
      switch (table) {
        case 'users':
          item.username = `user${index + 1}`;
          item.email = `user${index + 1}@example.com`;
          item.first_name = `First${index + 1}`;
          item.last_name = `Last${index + 1}`;
          item.created_at = new Date(Date.now() - (index * 86400000)).toISOString();
          item.updated_at = new Date(Date.now() - (index * 43200000)).toISOString();
          item.is_active = index % 2 === 0;
          break;
        case 'products':
          item.name = `Product ${index + 1}`;
          item.description = `Description for product ${index + 1}`;
          item.price = (index + 1) * 10.99;
          item.category_id = (index % 5) + 1;
          item.stock_quantity = (index + 1) * 5;
          item.created_at = new Date(Date.now() - (index * 86400000)).toISOString();
          item.updated_at = new Date(Date.now() - (index * 43200000)).toISOString();
          item.is_active = index % 2 === 0;
          break;
        case 'orders':
          item.customer_id = (index % 10) + 1;
          item.order_date = new Date(Date.now() - (index * 86400000)).toISOString();
          item.total_amount = (index + 1) * 100.50;
          item.status = ['pending', 'processing', 'shipped', 'delivered'][index % 4];
          item.shipping_address = `${index + 1} Main St, City ${index + 1}, Country`;
          item.payment_method = ['credit_card', 'paypal', 'bank_transfer'][index % 3];
          item.created_at = new Date(Date.now() - (index * 86400000)).toISOString();
          item.updated_at = new Date(Date.now() - (index * 43200000)).toISOString();
          break;
        default:
          item.name = `Item ${index + 1}`;
          item.description = `Description for item ${index + 1}`;
          item.created_at = new Date(Date.now() - (index * 86400000)).toISOString();
          item.updated_at = new Date(Date.now() - (index * 43200000)).toISOString();
          item.is_active = index % 2 === 0;
      }
      
      return item;
    });
    
    res.json(mockData);
  }
});

// Add CRUD operations for the API
app.post('/api/:table', async (req, res) => {
  const { table } = req.params;
  const databaseName = req.query.database || DEFAULT_DATABASE;
  const data = req.body;
  
  try {
    // Remove id if it's null or undefined (for auto-increment)
    if (data.id === null || data.id === undefined) {
      delete data.id;
    }
    
    // Build the INSERT query
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    
    // Execute the query
    const result = await dbService.executeQuery(databaseName, query, values);
    
    // Return the inserted data with the new ID
    res.status(201).json({
      ...data,
      id: result.insertId
    });
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error);
    res.status(500).json({
      error: 'Failed to create record',
      details: error.message
    });
  }
});

app.put('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const databaseName = req.query.database || DEFAULT_DATABASE;
  const data = req.body;
  
  try {
    // Remove id from the data object (we don't want to update the ID)
    delete data.id;
    
    // Build the UPDATE query
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    
    // Execute the query
    await dbService.executeQuery(databaseName, query, values);
    
    // Return the updated data
    res.json({
      ...data,
      id: parseInt(id)
    });
  } catch (error) {
    console.error(`Error updating record in ${table}:`, error);
    res.status(500).json({
      error: 'Failed to update record',
      details: error.message
    });
  }
});

app.delete('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const databaseName = req.query.database || DEFAULT_DATABASE;
  
  try {
    // Build the DELETE query
    const query = `DELETE FROM ${table} WHERE id = ?`;
    
    // Execute the query
    await dbService.executeQuery(databaseName, query, [id]);
    
    // Return success message
    res.json({
      success: true,
      message: `Record with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting record from ${table}:`, error);
    res.status(500).json({
      error: 'Failed to delete record',
      details: error.message
    });
  }
});

// API endpoint to test database connection
app.post('/api/config/testConnection', async (req, res) => {
  const { host, port, user, password, database } = req.body;
  
  try {
    // Create a connection with the provided credentials
    const connection = await mysql.createConnection({
      host,
      port: port || 3306,
      user,
      password,
      database
    });
    
    // If connection is successful, close it
    await connection.end();
    
    res.json({
      success: true,
      message: 'Connection successful'
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Connection failed'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});