package com.nbf.project.Service;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import com.nbf.project.Model.ColumnInfo;
import com.nbf.project.Model.TableMetadata;

@Service
public class DatabaseService {

	private static final Logger LOG = LoggerFactory.getLogger(DatabaseService.class);

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
    DataSource dataSource;


	public void createTable(TableMetadata tableMetadata) {
        String tableName = tableMetadata.getTableName();
        if (tableExists(tableName)) {
            String errorMsg = "Table '" + tableName + "' already exists.";
            LOG.error(errorMsg);
            throw new RuntimeException(errorMsg);
        }

        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE ").append(tableName).append(" (");

        List<ColumnInfo> columns = tableMetadata.getColumns();
        for (ColumnInfo column : columns) {
            sql.append(column.getName()).append(" ").append(column.getDataType());
            if (column.getLength() > 0) {
                sql.append("(").append(column.getLength()).append(")");
            }
            if (!column.isNullable()) {
                sql.append(" NOT NULL");
            }
            if (column.getDefaultValue() != null && !column.getDefaultValue().isEmpty()) {
                sql.append(" DEFAULT '").append(column.getDefaultValue()).append("'");
            }
            sql.append(", ");
        }

        // Adding audit columns if specified
        if (tableMetadata.isIncludeAuditColumns()) {
            sql.append("created_by VARCHAR(255), ");
            sql.append("created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ");
            sql.append("updated_by VARCHAR(255), ");
            sql.append("updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ");
            sql.append("deleted_by VARCHAR(255), ");
            sql.append("deleted_date TIMESTAMP, ");
            sql.append("is_active VARCHAR(5) DEFAULT 'Y', ");
        }

        // Primary key constraint
        sql.append("PRIMARY KEY (");
        for (ColumnInfo column : columns) {
            if (column.isPrimaryKey()) {
                sql.append(column.getName()).append(", ");
            }
        }
        sql.delete(sql.length() - 2, sql.length()); // Remove the last comma and space
        sql.append(")");

        sql.append(")");

        LOG.info("Executing SQL query to create table: {}", sql);

        try {
            jdbcTemplate.execute(sql.toString());
            LOG.info("Table '{}' created successfully.", tableName);
        } catch (Exception e) {
            LOG.error("Error creating table '{}': {}", tableName, e.getMessage());
            throw new RuntimeException("Failed to create table.", e);
        }
    }

    private boolean tableExists(String tableName) {
        try {
            DatabaseMetaData metaData = jdbcTemplate.getDataSource().getConnection().getMetaData();
            ResultSet tables = metaData.getTables(null, null, tableName, null);
            return tables.next();
        } catch (Exception e) {
            LOG.error("Error checking if table '{}' exists: {}", tableName, e.getMessage());
            throw new RuntimeException("Failed to check if table exists.", e);
        }
    }

    public void addColumnsToTable(TableMetadata tableMetadata) {
        String tableName = tableMetadata.getTableName();
        if (!tableExists(tableName)) {
            String errorMsg = "Table '" + tableName + "' does not exist.";
            LOG.error(errorMsg);
            throw new RuntimeException(errorMsg);
        }

        StringBuilder sql = new StringBuilder();
        List<ColumnInfo> columns = tableMetadata.getColumns();

        // Determine the last non-audit column (assuming audit columns are always at the end)
        String lastNonAuditColumnName = getLastNonAuditColumnName(tableName);

        // Check for existing columns to avoid duplicates
        for (ColumnInfo column : columns) {
            if (columnExists(tableName, column.getName())) {
                continue; // Skip this iteration if column already exists
            }
            sql.setLength(0); // Clear the StringBuilder for each column
            sql.append("ALTER TABLE ").append(tableName).append(" ADD COLUMN ");
            sql.append(column.getName()).append(" ").append(column.getDataType());
            if (column.getLength() > 0) {
                sql.append("(").append(column.getLength()).append(")");
            }
            if (!column.isNullable()) {
                sql.append(" NOT NULL");
            }
            if (column.getDefaultValue() != null && !column.getDefaultValue().isEmpty()) {
                sql.append(" DEFAULT '").append(column.getDefaultValue()).append("'");
            }
            if (lastNonAuditColumnName != null) {
                sql.append(" AFTER ").append(lastNonAuditColumnName);
            }

            LOG.info("Executing SQL query to add column: {}", sql);
            try {
                jdbcTemplate.execute(sql.toString());
                LOG.info("Column '{}' added successfully to table '{}'.", column.getName(), tableName);
                // Update the reference to the last added column to chain subsequent additions correctly
                lastNonAuditColumnName = column.getName();
            } catch (Exception e) {
                LOG.error("Error adding column '{}' to table '{}': {}", column.getName(), tableName, e.getMessage());
                throw new RuntimeException("Failed to add column to table.", e);
            }
        }
    }

    public String getLastNonAuditColumnName(String tableName) {
        try {
            DatabaseMetaData metaData = jdbcTemplate.getDataSource().getConnection().getMetaData();
            ResultSet resultSet = metaData.getColumns(null, null, tableName, null);
            List<String> columnNames = new ArrayList<>();

            // Collect all column names
            while (resultSet.next()) {
                columnNames.add(resultSet.getString("COLUMN_NAME"));
            }

            // Known audit column names
            List<String> auditColumns = List.of("created_by", "created_date", "updated_by", "updated_date",
                    "deleted_by", "deleted_date", "is_active");

            // Find the last non-audit column by checking from the end of the list backward
            for (int i = columnNames.size() - 1; i >= 0; i--) {
                if (!auditColumns.contains(columnNames.get(i))) {
                    return columnNames.get(i); // Return the last non-audit column name found
                }
            }
            return null; // Return null if only audit columns are found or no columns are found
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error retrieving column information for table '" + tableName + "': " + e.getMessage(), e);
        }
    }

    private boolean columnExists(String tableName, String columnName) {
        try {
            DatabaseMetaData metaData = jdbcTemplate.getDataSource().getConnection().getMetaData();
            ResultSet columns = metaData.getColumns(null, null, tableName, columnName);
            return columns.next();
        } catch (Exception e) {
            LOG.error("Error checking if column '{}' exists in table '{}': {}", columnName, tableName, e.getMessage());
            throw new RuntimeException("Failed to check if column exists.", e);
        }
    }

    // Delete Column

    public void deleteColumn(String tableName, String columnName) throws RuntimeException {
        LOG.debug("Attempting to delete column '{}' from table '{}'.", columnName, tableName);

        if (hasDataInColumn(tableName, columnName)) {
            LOG.error("Cannot delete column '{}' because it contains data.", columnName);
            throw new RuntimeException("Cannot delete column '" + columnName + "' because it contains data.");
        }

        if (!columnExistsDelete(tableName, columnName)) {
            LOG.error("Column '{}' does not exist in the table '{}'.", columnName, tableName);
            throw new RuntimeException("Column '" + columnName + "' does not exist in the table.");
        }

        String sql = "ALTER TABLE " + tableName + " DROP COLUMN " + columnName;
        try {
            jdbcTemplate.execute(sql);
            LOG.info("Column '{}' has been successfully deleted from table '{}'.", columnName, tableName);
        } catch (Exception e) {
            LOG.error("Failed to delete column '{}' from table '{}': {}", columnName, tableName, e.getMessage(), e);
            throw new RuntimeException("Failed to delete column '" + columnName + "': " + e.getMessage(), e);
        }
    }

    private boolean hasDataInColumn(String tableName, String columnName) {
        String checkSql = "SELECT EXISTS (SELECT 1 FROM " + tableName + " WHERE " + columnName
                + " IS NOT NULL LIMIT 1)";
        boolean hasData = Boolean.TRUE.equals(jdbcTemplate.queryForObject(checkSql, Boolean.class));
        LOG.debug("Checking if column '{}' in table '{}' has data: {}", columnName, tableName, hasData);
        return hasData;
    }

    private boolean columnExistsDelete(String tableName, String columnName) {
        try {
            DatabaseMetaData metaData = jdbcTemplate.getDataSource().getConnection().getMetaData();
            ResultSet columns = metaData.getColumns(null, null, tableName, columnName);
            boolean exists = columns.next();
            LOG.debug("Column '{}' exists in table '{}': {}", columnName, tableName, exists);
            return exists;
        } catch (Exception e) {
            LOG.error("Failed to check if column '{}' exists in table '{}': {}", columnName, tableName, e.getMessage(),
                    e);
            throw new RuntimeException("Failed to check if column exists: " + e.getMessage(), e);
        }
    }

    // Update the existing columns
    public void updateColumn(String tableName, ColumnInfo columnInfo) {
        if (!tableExists(tableName)) {
            throw new RuntimeException("Table '" + tableName + "' does not exist.");
        }
        if (!columnExists(tableName, columnInfo.getName())) {
            throw new RuntimeException("Column '" + columnInfo.getName() + "' does not exist in table '" + tableName + "'.");
        }

        StringBuilder sql = new StringBuilder("ALTER TABLE ").append(tableName).append(" MODIFY COLUMN ");
        sql.append(columnInfo.getName()).append(" ").append(columnInfo.getDataType());
        if (columnInfo.getLength() > 0) {
            sql.append("(").append(columnInfo.getLength()).append(")");
        }
        if (!columnInfo.isNullable()) {
            sql.append(" NOT NULL");
        }
        if (columnInfo.getDefaultValue() != null && !columnInfo.getDefaultValue().isEmpty()) {
            sql.append(" DEFAULT '").append(columnInfo.getDefaultValue()).append("'");
        }

        try {
            jdbcTemplate.execute(sql.toString());
            LOG.info("Column '{}' in table '{}' updated successfully.", columnInfo.getName(), tableName);
        } catch (Exception e) {
            LOG.error("Error updating column '{}' in table '{}': {}", columnInfo.getName(), tableName, e.getMessage());
            throw new RuntimeException("Failed to update column: " + e.getMessage(), e);
        }
    }

	
	// Get ALL DataTypes 
	
	public List<String> getAllDataTypes() {
	    List<String> dataTypes = new ArrayList<>();
	    try (Connection conn = jdbcTemplate.getDataSource().getConnection()) {
	        DatabaseMetaData metaData = conn.getMetaData();
	        ResultSet rs = metaData.getTypeInfo();
	        while (rs.next()) {
	            String typeName = rs.getString("TYPE_NAME");
	            dataTypes.add(typeName);
	        }
	    } catch (Exception e) {
	        LOG.error("Error retrieving data types: {}", e.getMessage());
	        throw new RuntimeException("Failed to retrieve data types.", e);
	    }
	    return dataTypes;
	}

	
	

	// In DatabaseService.java

	public List<Map<String, Object>> getData(String tableName, Map<String, Object> conditions) {
		StringBuilder sql = new StringBuilder("SELECT * FROM " + tableName);
		if (conditions != null && !conditions.isEmpty()) {
			sql.append(" WHERE ");
			conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
			sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
		}
		return jdbcTemplate.queryForList(sql.toString());
	}
	
	
	
	
	 /**
     * Retrieves all table names from the specified database.
     * @return List of table names.
     */
    public List<String> getAllTableNames() {
        List<String> tableNames = new ArrayList<>();
        try {
            DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
            String dbName = dataSource.getConnection().getCatalog();
            ResultSet tables = metaData.getTables(dbName, null, "%", new String[]{"TABLE"});
            while (tables.next()) {
                tableNames.add(tables.getString("TABLE_NAME"));
            }
        } catch (Exception e) {
            LOG.error("Error retrieving table names: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve table names.", e);
        }
        return tableNames;
    }
	
	
    
    
    public List<Map<String, Object>> getDataByTable(String tableName, Map<String, Object> conditions) throws Exception {
        StringBuilder sql = new StringBuilder("SELECT * FROM ").append(tableName);

        if (conditions != null && !conditions.isEmpty()) {
            sql.append(" WHERE ");
            conditions.forEach((key, value) -> {
                sql.append(key).append(" = ? AND ");
            });
            sql.delete(sql.length() - 5, sql.length());
        }

        Object[] args = conditions != null ? conditions.values().toArray() : new Object[0];

        return jdbcTemplate.query(sql.toString(), args, new RowMapper<Map<String, Object>>() {
            @Override
            public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
                return extractData(rs);
            }
        });
    }

    private Map<String, Object> extractData(ResultSet rs) throws SQLException {
        Map<String, Object> row = new LinkedHashMap<>();
        ResultSetMetaData metaData = rs.getMetaData();
        int columns = metaData.getColumnCount();
        for (int i = 1; i <= columns; i++) {
            row.put(metaData.getColumnName(i), rs.getObject(i));
        }
        return row;
    }

    
    
    
    
    
    
    /////////////////////////ADD Data for the  tables Methodss ////////////////////

	public void addData(String tableName, Map<String, Object> data) {
		StringBuilder columns = new StringBuilder();
		StringBuilder values = new StringBuilder();
		data.forEach((key, value) -> {
			columns.append(key).append(", ");
			values.append("'").append(value).append("', ");
		});
		columns.setLength(columns.length() - 2); // Remove the trailing comma and space
		values.setLength(values.length() - 2); // Remove the trailing comma and space
		String sql = "INSERT INTO " + tableName + " (" + columns.toString() + ") VALUES (" + values.toString() + ")";
		jdbcTemplate.execute(sql);
	}

	public void updateData(String tableName, Map<String, Object> data, Map<String, Object> conditions) {
		StringBuilder sql = new StringBuilder("UPDATE " + tableName + " SET ");
		data.forEach((key, value) -> sql.append(key + " = '" + value + "', "));
		sql.delete(sql.length() - 2, sql.length()); // Remove the last comma and space
		sql.append(" WHERE ");
		conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
		sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
		jdbcTemplate.execute(sql.toString());
	}

	public void deleteData(String tableName, Map<String, Object> conditions) {
		StringBuilder sql = new StringBuilder("DELETE FROM " + tableName + " WHERE ");
		conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
		sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
		jdbcTemplate.execute(sql.toString());
	}

}
