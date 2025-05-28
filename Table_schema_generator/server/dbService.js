const mysql = require('mysql2/promise');
const config = require('./config');

// Database configuration
const dbConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: 'information_schema' // We'll use information_schema to get metadata
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to get all tables from a specific database
const getAllTables = async (databaseName) => {
  try {
    const connection = await pool.getConnection();
    
    // Query to get all tables from the specified database
    const [rows] = await connection.query(
      'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?',
      [databaseName]
    );
    
    connection.release();
    
    // Extract table names from the result
    return rows.map(row => row.TABLE_NAME);
  } catch (error) {
    console.error('Error getting tables:', error);
    throw error;
  }
};

// Function to get metadata for a specific table
const getTableMetadata = async (databaseName, tableName) => {
  try {
    const connection = await pool.getConnection();
    
    // Query to get column information for the specified table
    const [columns] = await connection.query(
      `SELECT 
        COLUMN_NAME as name, 
        DATA_TYPE as dataType,
        COLUMN_TYPE as columnType,
        IS_NULLABLE as isNullable,
        COLUMN_KEY as columnKey,
        EXTRA as extra
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION`,
      [databaseName, tableName]
    );
    
    connection.release();
    
    // Transform the column data into the format expected by the frontend
    const metadata = columns.map(column => {
      // Determine the SQL type (including size/precision if applicable)
      let type = column.dataType.toUpperCase();
      if (column.columnType.includes('(')) {
        type = column.columnType.toUpperCase();
      }
      
      return {
        name: column.name,
        type: type,
        primaryKey: column.columnKey === 'PRI',
        nullable: column.isNullable === 'YES',
        autoIncrement: column.extra.includes('auto_increment')
      };
    });
    
    return metadata;
  } catch (error) {
    console.error('Error getting table metadata:', error);
    throw error;
  }
};

// Function to execute a query against a specific database
const executeQuery = async (databaseName, query, params = []) => {
  try {
    // Create a connection with the specified database
    const connection = await mysql.createConnection({
      ...dbConfig,
      database: databaseName
    });
    
    // Execute the query
    const [results] = await connection.execute(query, params);
    
    // Close the connection
    await connection.end();
    
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

module.exports = {
  getAllTables,
  getTableMetadata,
  executeQuery
};