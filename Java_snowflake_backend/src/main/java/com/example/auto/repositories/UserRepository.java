package com.example.auto.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.auto.config.dataSourceConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;



@Repository
public class UserRepository {
	private static final Logger LOG = LoggerFactory.getLogger(UserRepository.class);
	static dataSourceConfig connector = new dataSourceConfig();
	@Autowired
    private RegisterRepository registerRepository;
	@Autowired
    private JdbcTemplate jdbcTemplate;
    private PreparedStatement stmt;

	// Method to fetch all users with their roles
    public List<Map<String, Object>> fetchAllUsers() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Map<String, Object>> data = new ArrayList<>();

        try {
            conn = connector.getDBConnection();
            String sql = "SELECT u.*, r.name as role_name " +
                         "FROM USERS u " +
                         "LEFT JOIN ROLES r ON r.ID = u.ROLE_ID " +
                         "ORDER BY u.ID DESC";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            // Get column names from ResultSet metadata
            int columnCount = rs.getMetaData().getColumnCount();
            List<String> columnNames = new ArrayList<>();
            for (int i = 1; i <= columnCount; i++) {
                columnNames.add(rs.getMetaData().getColumnName(i));
            }

            // Iterate through the ResultSet and populate data list
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (String columnName : columnNames) {
                    row.put(columnName, rs.getObject(columnName));
                }
                data.add(row);
            }
        } catch (SQLException e) {
            throw e;
        } finally {
            // Close resources
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }

        return data;
    }
 // Method to get a menu by its ID
    public Map<String, Object> getMenu(String id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int ids =Integer.parseInt(id);
        try {
            conn = connector.getDBConnection();
            String sql = "SELECT * FROM MENUS WHERE ID = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, ids);
            rs = stmt.executeQuery();

            if (rs.next()) {
                // Get column names and values
                int columnCount = rs.getMetaData().getColumnCount();
                Map<String, Object> menuDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    menuDict.put(columnName, columnValue);
                }
                return Map.of("menu", menuDict, "status", 200);
            } else {
                return Map.of("message", "Menu not found", "status", 404);
            }
        } catch (SQLException e) {
            return Map.of("error", e.getMessage(), "status", 500);
        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log the exception
            }
        }
    }
 // Method to get all menus
    public List<Map<String, Object>> getAllMenus() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Map<String, Object>> menusList = new ArrayList<>();
        try {
            conn = connector.getDBConnection();
            String sql = "SELECT * FROM MENUS";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            // Get column names from ResultSet metadata
            int columnCount = rs.getMetaData().getColumnCount();
           

            while (rs.next()) {
                Map<String, Object> menuDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    menuDict.put(columnName, columnValue);
                }
                menusList.add(menuDict);
            }

            if (!menusList.isEmpty()) {
               // return Map.of("data", menusList, "status", 200);
            } else {
              //  return Map.of("message", "No menus found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
          //  return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
		return menusList;
    }
 // Method to update a menu by ID
    public Map<String, Object> updateMenu(String menuId, Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int menuIds= Integer.parseInt(menuId);

        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "UPDATE MENUS SET NAME = ?, DESCRIPTION = ? WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, (String) data.get("name"));
            stmt.setString(2, (String) data.get("description"));
            stmt.setInt(3, menuIds);

            // Execute the update operation
            int rowsUpdated = stmt.executeUpdate();

            // Check if the update was successful
            if (rowsUpdated > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "Menu updated successfully", "status", 200);
            } else {
                return Map.of("message", "Menu not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to delete a menu by ID
    public Map<String, Object> deleteMenu(String menuId) {
        Connection conn = null;
        PreparedStatement checkStmt = null;
        PreparedStatement deleteStmt = null;
        ResultSet rs = null;
        int menuIds= Integer.parseInt(menuId);
        try {
            conn = connector.getDBConnection();

            // Check if there are any submenus associated with this menu
            String checkSql = "SELECT COUNT(*) FROM SUB_MENUS WHERE MENU_ID = ?";
            checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, menuIds);
            rs = checkStmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                return Map.of("error", "Cannot delete menu with associated submenus", "status", 400);
            }

            // If no submenus are associated, proceed to delete the menu
            String deleteSql = "DELETE FROM MENUS WHERE ID = ?";
            deleteStmt = conn.prepareStatement(deleteSql);
            deleteStmt.setInt(1, menuIds);
            int rowsDeleted = deleteStmt.executeUpdate();

            if (rowsDeleted > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "Menu deleted successfully", "status", 200);
            } else {
                return Map.of("message", "Menu not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (checkStmt != null) checkStmt.close();
                if (deleteStmt != null) deleteStmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }

    public Object createUser(Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();

            // Generate default password
           
            String default_password = registerRepository.generateDefaultPassword(8);

            // Send default password to user's email
            registerRepository.sendDefaultPassword(data.get("email").toString(), default_password);

            // Prepare SQL statement
            String sql = "INSERT INTO USERS " +
                         "(FIRST_NAME, MIDDLE_NAME, LAST_NAME, EMAIL, MOBILE, ROLE_ID, PASSWORD, IS_VERIFIED, IS_DEFAULT_PASSWORD_CHANGED, CREATED_DATE) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, data.get("first_name").toString());
            stmt.setString(2, data.get("middle_name").toString());
            stmt.setString(3, data.get("last_name").toString());
            stmt.setString(4, data.get("email").toString());
            stmt.setString(5, data.get("mobile").toString());
            stmt.setInt(6, Integer.parseInt(data.get("role_id").toString()));
            stmt.setString(7, default_password);
            stmt.setBoolean(8, true); // IS_VERIFIED
            stmt.setBoolean(9, false); // IS_DEFAULT_PASSWORD_CHANGED

            // Execute the insert operation
            stmt.executeUpdate();

            // Commit the transaction
            conn.commit();

            // Return success message
            return Map.of("message", "User created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace();
            // Log the error
            System.err.println("Error occurred while creating user: " + e.getMessage());
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    // Method to get user by user ID
    public Map<String, Object> getUser(String userId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int userIds =Integer.parseInt(userId);
        try {
            conn = connector.getDBConnection();
            String sql = "SELECT u.*, r.name as role_name " +
                         "FROM USERS u " +
                         "LEFT JOIN ROLES r ON r.ID = u.ROLE_ID " +
                         "WHERE u.ID = ? ORDER BY u.ID DESC";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userIds);
            rs = stmt.executeQuery();

            if (rs.next()) {
                // Get column names and values
                int columnCount = rs.getMetaData().getColumnCount();
                Map<String, Object> userDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnName(i);
                    Object columnValue = rs.getObject(i);

                    // Convert Timestamp to ISO 8601 string format
                    if (columnValue instanceof Timestamp) {
                        columnValue = ((Timestamp) columnValue).toInstant().toString();
                    }

                    userDict.put(columnName, columnValue);
                }
                return Map.of("user", userDict, "status", 200);
            } else {
                return Map.of("message", "User not found", "status", 404);
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);
        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
 // Method to fetch all users with their roles
    public Map<String, Object> getAllUsers() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = connector.getDBConnection();
            String sql = "SELECT u.*, r.name as role_name " +
                         "FROM USERS u " +
                         "LEFT JOIN ROLES r ON r.ID = u.ROLE_ID " +
                         "ORDER BY u.ID DESC";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            // Get column names from ResultSet metadata
            int columnCount = rs.getMetaData().getColumnCount();
            List<String> columnNames = new ArrayList<>();
            for (int i = 1; i <= columnCount; i++) {
                columnNames.add(rs.getMetaData().getColumnName(i));
            }

            // Iterate through the ResultSet and populate the data list
            List<Map<String, Object>> data = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (String columnName : columnNames) {
                    Object columnValue = rs.getObject(columnName);

                    // Convert Timestamp to ISO 8601 string format
                    if (columnValue instanceof Timestamp) {
                        columnValue = ((Timestamp) columnValue).toInstant().toString();
                    }

                    row.put(columnName, columnValue);
                }
                data.add(row);
            }

            // Convert the list of users to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
            return Map.of("data", jsonData, "status", 200);

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // Log JSON processing exceptions
            return Map.of("error", "Error processing JSON data", "status", 500);
        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to update user by user ID
    public Map<String, Object> updateUser(String userId, Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int userIds =Integer.parseInt(userId);
        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "UPDATE USERS " +
                         "SET FIRST_NAME = ?, MIDDLE_NAME = ?, LAST_NAME = ?, MOBILE = ?, EMAIL = ?, ROLE_ID = ? " +
                         "WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, (String) data.get("first_name"));
            stmt.setString(2, (String) data.get("middle_name"));
            stmt.setString(3, (String) data.get("last_name"));
            stmt.setString(4, (String) data.get("mobile"));
            stmt.setString(5, (String) data.get("email"));
            stmt.setInt(6, (int) data.get("role_id"));
            stmt.setInt(7, userIds);

            // Execute the update operation
            int rowsUpdated = stmt.executeUpdate();

            // Check if the update was successful
            if (rowsUpdated > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "User updated successfully", "status", 200);
            } else {
                return Map.of("message", "User not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
 // Method to delete a user by user ID
    public Map<String, Object> deleteUser(String userId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int userIds =Integer.parseInt(userId);
        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "DELETE FROM USERS WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set the user ID parameter
            stmt.setInt(1, userIds);

            // Execute the delete operation
            int rowsDeleted = stmt.executeUpdate();

            // Check if the delete was successful
            if (rowsDeleted > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "User deleted successfully", "status", 200);
            } else {
                return Map.of("message", "User not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to create a new menu
    public Map<String, Object> createMenu(Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "INSERT INTO MENUS (NAME, DESCRIPTION) VALUES (?, ?)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, (String) data.get("name"));
            stmt.setString(2, (String) data.get("description"));

            // Execute the insert operation
            stmt.executeUpdate();
            conn.commit();

            // Return success message
            return Map.of("message", "Menu created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to create a new submenu
    public Map<String, Object> createSubMenu(Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "INSERT INTO SUB_MENUS (MENU_ID, NAME, DESCRIPTION, ROUTE) VALUES (?, ?, ?, ?)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setInt(1, (int) data.get("menu_id"));
            stmt.setString(2, (String) data.get("name"));
            stmt.setString(3, (String) data.get("description"));
            stmt.setString(4, (String) data.get("route"));

            // Execute the insert operation
            stmt.executeUpdate();
            conn.commit();

            // Return success message
            return Map.of("message", "SubMenu created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to get a submenu by ID
    public Map<String, Object> getSubMenu(String subMenuId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int subMenuIds =Integer.parseInt(subMenuId);
        try {
            conn = connector.getDBConnection();
            String sql = "SELECT sm.*, m.NAME as menu_name FROM SUB_MENUS sm " +
                         "LEFT JOIN MENUS m ON m.ID = sm.MENU_ID WHERE sm.ID = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, subMenuIds);
            rs = stmt.executeQuery();

            if (rs.next()) {
                // Get column names and values
                int columnCount = rs.getMetaData().getColumnCount();
                Map<String, Object> subMenuDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    subMenuDict.put(columnName, columnValue);
                }
                return Map.of("data", subMenuDict, "status", 200);
            } else {
                return Map.of("message", "SubMenu not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to get all submenus
    public List<Map<String, Object>> getAllSubMenus() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Map<String, Object>> subMenusList = new ArrayList<>();
        try {
            conn = connector.getDBConnection();
            String sql = "SELECT sm.*, m.NAME as menu_name FROM SUB_MENUS sm " +
                         "LEFT JOIN MENUS m ON m.ID = sm.MENU_ID";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            // Get column names from ResultSet metadata
            int columnCount = rs.getMetaData().getColumnCount();
           
         
            while (rs.next()) {
            	 Map<String, Object> subMenuDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnLabel(i);
                    Object columnValue = rs.getObject(i);
                    subMenuDict.put(columnName, columnValue);
                }
                subMenusList.add(subMenuDict);
            }

            

        } catch (SQLException e) {
            e.printStackTrace(); 

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
		return subMenusList;
    }
    
 // Method to update a submenu by ID
    public Map<String, Object> updateSubMenu(String subMenuId, Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int subMenuIds =Integer.parseInt(subMenuId);
        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "UPDATE SUB_MENUS SET MENU_ID = ?, NAME = ?, DESCRIPTION = ?, ROUTE = ? WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setInt(1, (int) data.get("menu_id"));
            stmt.setString(2, (String) data.get("name"));
            stmt.setString(3, (String) data.get("description"));
            stmt.setString(4, (String) data.get("route"));
            stmt.setInt(5, subMenuIds);

            // Execute the update operation
            int rowsUpdated = stmt.executeUpdate();

            // Check if the update was successful
            if (rowsUpdated > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "SubMenu updated successfully", "status", 200);
            } else {
                return Map.of("message", "SubMenu not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to delete a submenu by ID
    public Map<String, Object> deleteSubMenu(String subMenuId) {
        Connection conn = null;
        PreparedStatement checkStmt = null;
        PreparedStatement deleteStmt = null;
        ResultSet rs = null;
        int subMenuIds =Integer.parseInt(subMenuId);
        try {
            conn = connector.getDBConnection();

            // Check if the submenu is mapped to any role permission
            String checkSql = "SELECT COUNT(*) FROM ROLE_PERMISSION WHERE SUB_MENU_ID = ?";
            checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, subMenuIds);
            rs = checkStmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                return Map.of("message", "SubMenu is mapped to role permission and cannot be deleted", "status", 400);
            }

            // Delete the submenu based on the given ID
            String deleteSql = "DELETE FROM SUB_MENUS WHERE ID = ?";
            deleteStmt = conn.prepareStatement(deleteSql);
            deleteStmt.setInt(1, subMenuIds);
            int rowsDeleted = deleteStmt.executeUpdate();

            if (rowsDeleted > 0) {
                conn.commit(); // Commit the transaction
                return Map.of("message", "SubMenu deleted successfully", "status", 200);
            } else {
                return Map.of("message", "SubMenu not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (checkStmt != null) checkStmt.close();
                if (deleteStmt != null) deleteStmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
	// Method to create a new permission
    public static Map<String, Object> createPermission(Map<String, Object> data) throws SQLException {
        String sql = "INSERT INTO permission_level (level) VALUES (?)";
        try (Connection conn = connector.getDBConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, (String) data.get("level"));
            stmt.executeUpdate();
            conn.commit();
            return Map.of("message", "Permission created successfully", "status", 201);
        } catch (SQLException e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage(), "status", 500);
        }
    }
    public static Map<String, Object> getPermission(String id) throws SQLException {
        String sql = "SELECT * FROM permission_level WHERE id = ?";
        try (Connection conn = connector.getDBConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                // Assuming your table has columns 'id' and 'level'
                return Map.of(
                        "id", rs.getString("id"),
                        "level", rs.getString("level"),
                        "status", 200
                );
            } else {
                return Map.of("error", "Permission not found", "status", 404);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage(), "status", 500);
        }
    }
 // Method to get all permissions
    public static  List<Map<String, Object>> getAllPermissions() throws SQLException {
    	 List<Map<String, Object>> permissions = new ArrayList<>();
        String sql = "SELECT * FROM permission_level";
        try (Connection conn = connector.getDBConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
        	
        	
			/*
			 * while (rs.next()) { Map<String, Object> permission = new HashMap<>(); // [ID,
			 * LEVEL, CREATED_BY, CREATED_DATE, UPDATED_BY, UPDATED_DATE, IS_ACTIVE,
			 * DELETED_BY, DELETED_DATE] permission.put("id", rs.getInt("ID"));
			 * permission.put("level", rs.getString("LEVEL")); permissions.add(permission);
			 * }
			 */
            int columnCount = rs.getMetaData().getColumnCount();
            while (rs.next()) {
            	 Map<String, Object> permission = new HashMap<>();
               for (int i = 1; i <= columnCount; i++) {
                   String columnName = rs.getMetaData().getColumnName(i);
                   Object columnValue = rs.getObject(i);
                   permission.put(columnName, columnValue);
                   permission.put("id", rs.getInt("ID"));
                   permission.put("level", rs.getString("LEVEL"));
               }
               permissions.add(permission);
           }
        } catch (SQLException e) {
            e.printStackTrace();
           
        }
		return permissions;
    }

    // Method to update a permission
    public static Map<String, Object> updatePermission(String id, Map<String, Object> data) throws SQLException {
        String sql = "UPDATE permission_level SET level = ? WHERE id = ?";
        try (Connection conn = connector.getDBConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, (String) data.get("level"));
            stmt.setString(2, id);
            int rowsUpdated = stmt.executeUpdate();

            if (rowsUpdated > 0) {
                conn.commit();
                return Map.of("message", "Permission updated successfully", "status", 200);
            } else {
                return Map.of("error", "Permission not found", "status", 404);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage(), "status", 500);
        }
    }

    // Method to delete a permission
    public static Map<String, Object> deletePermission(String id) throws SQLException {
        String sql = "DELETE FROM permission_level WHERE id = ?";
        try (Connection conn = connector.getDBConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            int rowsDeleted = stmt.executeUpdate();

            if (rowsDeleted > 0) {
                conn.commit();
                return Map.of("message", "Permission deleted successfully", "status", 200);
            } else {
                return Map.of("error", "Permission not found", "status", 404);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage(), "status", 500);
        }
    }

 // Method to create a new role permission
    public Map<String, Object> createRolePermission(Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "INSERT INTO ROLE_PERMISSION (ROLE_ID, MENU_ID, SUB_MENU_ID, PERMISSION_LEVEL) VALUES (?, ?, ?, ?)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setInt(1, (int) data.get("role_id"));
            stmt.setInt(2, (int) data.get("menu_id"));
            stmt.setInt(3, (int) data.get("submenu_id"));
            stmt.setInt(4, (int) data.get("permission_level"));

            // Execute the insert operation
            stmt.executeUpdate();
//            conn.commit();

            // Return success message
            return Map.of("message", "Role permission created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
 // Method to get a role permission by ID
    public Map<String, Object> getRolePermission(String rolePermissionId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int rolePermissionIds =Integer.parseInt(rolePermissionId);
        try {
            conn = connector.getDBConnection();
            String sql = """
                SELECT rp.*, r.name as role_name, m.name as menu_name, sm.name AS sub_menu_name, p.level AS permission 
                FROM ROLE_PERMISSION rp 
                LEFT JOIN ROLES r ON r.id = rp.role_id
                LEFT JOIN MENUS m ON m.id = rp.menu_id 
                LEFT JOIN SUB_MENUS sm ON sm.id = rp.sub_menu_id 
                LEFT JOIN PERMISSION_LEVEL p ON p.id = rp.permission_level
                WHERE rp.id = ?""";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, rolePermissionIds);
            rs = stmt.executeQuery();

            if (rs.next()) {
                // Get column names and values
                int columnCount = rs.getMetaData().getColumnCount();
                Map<String, Object> rolePermissionDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    rolePermissionDict.put(columnName, columnValue);
                }
                return Map.of("data", rolePermissionDict, "status", 200);
            } else {
                return Map.of("message", "Role permission not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
    
    // Method to get all role permissions
    public  List<Map<String, Object>> getAllRolePermissions() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Map<String, Object>> rolePermissionsList = new ArrayList<>();
        try {
            conn = connector.getDBConnection();
            String sql = """
                SELECT rp.*, r.name as role_name, m.name as menu_name, sm.name AS sub_menu_name, p.level AS permission 
                FROM ROLE_PERMISSION rp 
                LEFT JOIN ROLES r ON r.id = rp.role_id
                LEFT JOIN MENUS m ON m.id = rp.menu_id 
                LEFT JOIN SUB_MENUS sm ON sm.id = rp.sub_menu_id 
                LEFT JOIN PERMISSION_LEVEL p ON p.id = rp.permission_level
                ORDER BY rp.id DESC""";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            // Get column names from ResultSet metadata
            int columnCount = rs.getMetaData().getColumnCount();
           

            while (rs.next()) {
                Map<String, Object> rolePermissionDict = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = rs.getMetaData().getColumnLabel(i);
                    Object columnValue = rs.getObject(i);
                    rolePermissionDict.put(columnName, columnValue);
                }
                rolePermissionsList.add(rolePermissionDict);
            }


        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
           // return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
		return rolePermissionsList;
    }
    
 // Method to update a role permission by ID
    public Map<String, Object> updateRolePermission(String rolePermissionId, Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int rolePermissionIds =Integer.parseInt(rolePermissionId);
        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "UPDATE ROLE_PERMISSION SET ROLE_ID = ?, MENU_ID = ?, SUB_MENU_ID = ?, PERMISSION_LEVEL = ? WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setInt(1, (int) data.get("role_id"));
            stmt.setInt(2, (int) data.get("menu_id"));
            stmt.setInt(3, (int) data.get("submenu_id"));
            stmt.setInt(4, (int) data.get("permission_level"));
            stmt.setInt(5, rolePermissionIds);

            // Execute the update operation
            int rowsUpdated = stmt.executeUpdate();

            // Check if the update was successful
            if (rowsUpdated > 0) {
//                conn.commit(); // Commit the transaction
                return Map.of("message", "Role permission updated successfully", "status", 200);
            } else {
                return Map.of("message", "Role permission not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
    
    
 // Method to delete a role permission by ID
    public Map<String, Object> deleteRolePermission(String rolePermissionId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int rolePermissionIds =Integer.parseInt(rolePermissionId);
        try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "DELETE FROM ROLE_PERMISSION WHERE ID = ?";
            stmt = conn.prepareStatement(sql);

            // Set the role permission ID parameter
            stmt.setInt(1, rolePermissionIds);

            // Execute the delete operation
            int rowsDeleted = stmt.executeUpdate();

            // Check if the delete was successful
            if (rowsDeleted > 0) {
//                conn.commit(); // Commit the transaction
                return Map.of("message", "Role permission deleted successfully", "status", 200);
            } else {
                return Map.of("message", "Role permission not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
    }
	/*
	 * public String createTables(Map<String, Object> params) { StringBuilder
	 * queryPart = new StringBuilder();
	 * queryPart.append("CREATE TABLE IF NOT EXISTS ").append(params.get(
	 * "table_name")).append(" (");
	 * 
	 * try { // Retrieve columns from params List<Map<String, Object>> columns =
	 * (List<Map<String, Object>>) params.get("columns");
	 * 
	 * // Iterate over each column for (Map<String, Object> column : columns) { //
	 * Add column name if (column.get("column_name") != null) {
	 * queryPart.append(column.get("column_name")).append(" "); }
	 * 
	 * // Add data type and length if (column.get("data_type") != null) { String
	 * dataType = (String) column.get("data_type"); Integer length = (Integer)
	 * column.get("length");
	 * 
	 * if (length != null) {
	 * queryPart.append(dataType).append("(").append(length).append(") "); } else {
	 * queryPart.append(dataType).append(" "); } }
	 * 
	 * // Check for auto-increment if
	 * (Boolean.TRUE.equals(column.get("auto_increment"))) {
	 * queryPart.append("AUTOINCREMENT "); }
	 * 
	 * // Check for primary key if (Boolean.TRUE.equals(column.get("primary_key")))
	 * { queryPart.append("PRIMARY KEY "); }
	 * 
	 * // Add default value if (column.get("default") != null) {
	 * queryPart.append("DEFAULT '").append(column.get("default")).append("' "); }
	 * 
	 * // Handle nullability if (Boolean.FALSE.equals(column.get("nullable"))) { //
	 * Assuming false means NOT NULL queryPart.append("NOT NULL "); }
	 * 
	 * queryPart.append(", "); }
	 * 
	 * // Handle foreign keys for (Map<String, Object> reCheck : columns) {
	 * Map<String, Object> foreignKey = (Map<String, Object>)
	 * reCheck.get("foreign_keys"); if (foreignKey != null) {
	 * queryPart.append("FOREIGN KEY (").append(reCheck.get("column_name")).
	 * append(") REFERENCES ")
	 * .append(foreignKey.get("table")).append("(").append(foreignKey.get(
	 * "ref_column")).append("), "); } }
	 * 
	 * // Remove the last comma and space if (queryPart.length() > 0) {
	 * queryPart.setLength(queryPart.length() - 2); }
	 * 
	 * queryPart.append(");");
	 * 
	 * // Convert StringBuilder to String String createTableQuery =
	 * queryPart.toString(); System.out.println(createTableQuery);
	 * 
	 * // Execute the SQL query return setConnectionsPost(createTableQuery); } catch
	 * (Exception e) { e.printStackTrace(); return "{\"error\": \"" + e.getMessage()
	 * + "\"}"; } } private String setConnectionsPost(String query) { try
	 * (Connection conn = connector.getDBConnection(); PreparedStatement stmt
	 * = conn.prepareStatement(query)) { stmt.executeUpdate(); return
	 * "{\"message\": \"Table created successfully\"}"; } catch (SQLException e) {
	 * e.printStackTrace(); return "{\"error\": \"" + e.getMessage() +
	 * "\", \"status\": 501}"; } }
	 */
    public String createTable(Map<String, Object> params) {
        StringBuilder queryBuilder = new StringBuilder();

        try {
            queryBuilder.append("CREATE TABLE IF NOT EXISTS ")
                    .append(params.get("table_name"))
                    .append(" (");

            List<Map<String, Object>> columns = (List<Map<String, Object>>) params.get("columns");

            for (Map<String, Object> column : columns) {
                String columnName = (String) column.get("column_name");
                String dataType = (String) column.get("data_type");
                Boolean autoIncrement = (Boolean) column.get("auto_increment");
                Boolean primaryKey = (Boolean) column.get("primary_key");
                String defaultValue = (String) column.get("default");
                Boolean nullable = (Boolean) column.get("nullable");

                if (columnName != null && !columnName.isEmpty()) {
                    queryBuilder.append(columnName).append(" ");
                }

                if (dataType != null && !dataType.isEmpty()) {
                    queryBuilder.append(dataType).append(" ");
                }

                if (Boolean.TRUE.equals(autoIncrement)) {
                    queryBuilder.append("AUTOINCREMENT ");
                }

                if (Boolean.TRUE.equals(primaryKey)) {
                    queryBuilder.append("PRIMARY KEY ");
                }

                if (defaultValue != null && !defaultValue.isEmpty()) {
                    queryBuilder.append("DEFAULT '").append(defaultValue).append("' ");
                }

                if (Boolean.TRUE.equals(nullable)) {
                    queryBuilder.append("NOT NULL ");
                }

                queryBuilder.append(", ");
            }

            // Handle foreign keys
            for (Map<String, Object> column : columns) {
                Map<String, Object> foreignKeys = (Map<String, Object>) column.get("foreign_keys");
                if (foreignKeys != null) {
                    String columnName = (String) column.get("column_name");
                    String foreignTable = (String) foreignKeys.get("table");
                    String foreignRefColumn = (String) foreignKeys.get("ref_column");

                    queryBuilder.append("FOREIGN KEY (")
                            .append(columnName)
                            .append(") REFERENCES ")
                            .append(foreignTable)
                            .append("(")
                            .append(foreignRefColumn)
                            .append("), ");
                }
            }

            // Remove the last comma and space
            queryBuilder.setLength(queryBuilder.length() - 2);

            queryBuilder.append(");");

            String createTableQuery = queryBuilder.toString();
            System.out.println(createTableQuery);

            // Execute the query using Snowflake JDBC
            return executeCreateTableQuery(createTableQuery);

        } catch (Exception error) {
            System.err.println("An error occurred while creating the table: " + error.getMessage());
            return "{\"error\": \"" + error.getMessage() + "\"}";
        }
    }

    private String executeCreateTableQuery(String createTableQuery) {
        try {
            jdbcTemplate.execute(createTableQuery);
            System.out.println("Table created successfully.");
            return "{\"message\": \"Table created successfully\"}";

        } catch (Exception error) {
            System.err.println("An error occurred while executing the create table query: " + error.getMessage());
            return "{\"error\": \"" + error.getMessage() + "\"}";
        }
    }

    public String getDataType() {
        try {
            // Mock data types for demonstration
            String[] dataTypes = {"INT", "VARCHAR(255)", "TIMESTAMP", "BOOLEAN"};
            StringBuilder dataTypeResponse = new StringBuilder();
            dataTypeResponse.append("{\"dataTypes\": [");

            for (String dataType : dataTypes) {
                dataTypeResponse.append("\"").append(dataType).append("\", ");
            }

            dataTypeResponse.setLength(dataTypeResponse.length() - 2); // Remove last comma and space
            dataTypeResponse.append("]}");

            return dataTypeResponse.toString();

        } catch (Exception error) {
            System.err.println("An error occurred while fetching data types: " + error.getMessage());
            return "{\"error\": \"" + error.getMessage() + "\"}";
        }
    }
	public List<Map<String, Object>> getClients() throws SQLException {
		Connection conn = connector.getDBConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT CLIENT_CODE_ID,CLIENT_NAME FROM client_info");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("id", rs.getInt("CLIENT_CODE_ID"));
                role.put("name", rs.getString("CLIENT_NAME"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
	}
	public List<Map<String, Object>> getProjectTypes() throws SQLException {
		Connection conn = connector.getDBConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT PROJECT_TYPE_CODE,PROJECT_TYPE_NAME FROM project_type");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("id", rs.getString("PROJECT_TYPE_CODE"));
                role.put("name", rs.getString("PROJECT_TYPE_NAME"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
	}
	public List<Map<String, Object>> getAllProjectRoles() throws SQLException {
		Connection conn = connector.getDBConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT PROJECT_ROLE_ID,PROJECT_ROLE_NAME FROM project_role");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("id", rs.getInt("PROJECT_ROLE_ID"));
                role.put("name", rs.getString("PROJECT_ROLE_NAME"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
	}
	public List<Map<String, Object>> getAllProjectPhases() throws SQLException {
		Connection conn = connector.getDBConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT PHASE_CODE,PHASE_NAME FROM project_phases");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("id", rs.getString("PHASE_CODE"));
                role.put("name", rs.getString("PHASE_NAME"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
	}
	public List<Map<String, Object>> getAllProjectCreation() throws SQLException {
		 Connection conn = connector.getDBConnection();
         List<Map<String, Object>> detailList = new ArrayList<>();
	        try {
	            stmt = conn.prepareStatement("SELECT * FROM PROJECT_DETAILS pd JOIN CLIENT_INFO ci ON pd.client_id = ci.client_code_id JOIN PROJECT_TYPE pt ON pd.PROJECT_TYPE_CODE = pt.PROJECT_TYPE_CODE  ORDER BY pd.created_date DESC;");
	            ResultSet rs = stmt.executeQuery();

	            while (rs.next()) {
	                Map<String, Object> rowMap = new HashMap<>();
	                // Get column names and values for each row
	                int columnCount = rs.getMetaData().getColumnCount();
	                for (int i = 1; i <= columnCount; i++) {
	                    String columnName = rs.getMetaData().getColumnLabel(i);
	                    Object columnValue = rs.getObject(i);
	                    rowMap.put(columnName, columnValue);
	                }
	                detailList.add(rowMap);
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return detailList;
	}
	
	public Map<String, Object> updateAllProjectCreation(String id, Map<String, Object> data) {
        Connection conn = null;
        PreparedStatement stmt = null;
        int projectId=Integer.parseInt(id);
		try {
            conn = connector.getDBConnection();

            // Prepare SQL statement
            String sql = "UPDATE PROJECT_DETAILS SET project_name = ?, client_id = ?, project_type_id = ? " +
                    "WHERE PROJECT_ID =?";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, (String)data.get("projectName"));
            stmt.setInt(2, (int) data.get("clientId"));
            stmt.setInt(3, (int) data.get("projectTypeid"));
            stmt.setInt(4, projectId);

            // Execute the update operation
            int rowsUpdated = stmt.executeUpdate();

            // Check if the update was successful
            if (rowsUpdated > 0) {
//                conn.commit(); // Commit the transaction
                return Map.of("message", "project creation updated successfully", "status", 200);
            } else {
                return Map.of("message", "Project creation not found", "status", 404);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }
      
	}
	
	 public  Map<String, Object>  deleteProjectDetails(String projectId) {
		 
		  Connection conn = null;
	        PreparedStatement stmt = null;
	        int rolePermissionIds =Integer.parseInt(projectId);
	        try {
	            conn = connector.getDBConnection();

	            // Prepare SQL statement
	            String sql = "DELETE FROM PROJECT_DETAILS WHERE project_id = ?";
	            stmt = conn.prepareStatement(sql);

	            // Set the role permission ID parameter
	            stmt.setInt(1, rolePermissionIds);

	            // Execute the delete operation
	            int rowsDeleted = stmt.executeUpdate();

	            // Check if the delete was successful

	            if (rowsDeleted > 0) {
//	                conn.commit(); // Commit the transaction
	                return Map.of("message", "Project details deleted successfully", "status", 200);
	            } else {
	                return Map.of("message", "Project details permission not found", "status", 404);
	            }

	        } catch (SQLException e) {
	            e.printStackTrace(); // Log the exception
	            return Map.of("error", e.getMessage(), "status", 500);

	        } finally {
	            // Close resources
	            try {
	                if (stmt != null) stmt.close();
	                if (conn != null) conn.close();
	            } catch (SQLException e) {
	                e.printStackTrace(); // Log exception if closing fails
	            }
	        }
	        
	    }
	public Map<String, Object> createAllProjectCreation(Map<String, Object> data) {
		Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();


            // Prepare SQL statement
            String sql = "\r\n"
            		+ "\r\n"
            		+ "insert into project_details(project_name_code,PROJECT_NAME, CLIENT_ID,PROJECT_TYPE_CODE,"
            		+ "CREATED_BY,CREATED_DATE,IS_ACTIVE) "
            		+ " " +
                         "VALUES (?,?, ?, ?,?, CURRENT_TIMESTAMP,?)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, data.get("projectCode").toString());
            stmt.setString(2, data.get("projectName").toString());
            stmt.setInt(3,(int) data.get("clientId"));
            stmt.setString(4, data.get("projectTypeCode").toString());
            stmt.setString(5, data.get("createdby").toString());
            stmt.setInt(6,(int) data.get("isActive"));

            // Execute the insert operation
            stmt.executeUpdate();

            // Commit the transaction
//            conn.commit();

            // Return success message
            return Map.of("message", "Project details created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace();
            // Log the error
            System.err.println("Error occurred while creating user: " + e.getMessage());
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }

	}
	public List<Map<String, Object>> getAllActivityCodes(String phaseId, int projectRoleId)  throws SQLException {
		Connection conn = connector.getDBConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT ACTIVITY_CODE FROM project_activity where project_phase_id=? AND PROJECT_ROLE_ID = ?");

            stmt.setString(1, (phaseId).toString());
            stmt.setInt(2, projectRoleId);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("activityName", rs.getString("ACTIVITY_CODE"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
	}
	
	public Map<String, Object> createProjectEst(Map<String, Object> data) {
		Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = connector.getDBConnection();


            // Prepare SQL statement
            String sql = "INSERT INTO project_estimate( PROJECT_PHASE_CODE, PROJECT_ROLE_ID, ACTIVITY_CODE,"
            		+ " START_DATE, END_DATE, NO_OF_HOURS_PER_DAY, TOTAL_HOURS,"
            		+ " CREATED_BY, CREATED_DATE, UPDATED_BY, UPDATED_DATE, IS_ACTIVE,"
            		+ "PROJECT_NAME_CODE) "
            		+ " " +
                         "VALUES (?,?, ?, ?,?,?,?,?, CURRENT_TIMESTAMP,null, null,?, ?)";
            stmt = conn.prepareStatement(sql);

            // Set parameters
            stmt.setString(1, data.get("projectPhaseCode").toString());
            stmt.setInt(2, (int)data.get("projectRoleId"));
            stmt.setString(3, data.get("ActivityCode").toString());
            stmt.setString(4, data.get("startDate").toString());
            stmt.setString(5, data.get("endDate").toString());
            stmt.setInt(6, (int)data.get("noOfHours"));
            stmt.setInt(7, (int)data.get("totalHours"));
            stmt.setString(8, data.get("createdBy").toString());
            stmt.setInt(9,(int) data.get("isActive"));
            stmt.setString(10, data.get("projectNameCode").toString());
            // Execute the insert operation
            stmt.executeUpdate();

            // Commit the transaction
//            conn.commit();

            // Return success message
            return Map.of("message", "Project Estimation created successfully", "status", 201);

        } catch (SQLException e) {
            e.printStackTrace();
            // Log the error
            System.err.println("Error occurred while creating user: " + e.getMessage());
            return Map.of("error", e.getMessage(), "status", 500);

        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace(); // Log exception if closing fails
            }
        }

	}
}
