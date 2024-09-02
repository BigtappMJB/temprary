package com.example.auto.repositories;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.auto.config.dataSourceConfig;
@Repository
public class RoleRepository {

	private Connection conn;
    private PreparedStatement stmt;
    static dataSourceConfig connector = new dataSourceConfig();
    
    public RoleRepository() {
    	 
    }

   

    public int createRole(String name, String description) throws SQLException {
    	Connection conn = connector.getSnowflakeConnection();
        int roleId = -1;
        try {
            stmt = conn.prepareStatement("INSERT INTO NBF_CIA.PUBLIC.ROLES (NAME, DESCRIPTION) VALUES (?, ?)");
            stmt.setString(1, name);
            stmt.setString(2, description);
            stmt.executeUpdate();
            conn.commit();

            stmt = conn.prepareStatement("SELECT MAX(ID) FROM NBF_CIA.PUBLIC.ROLES");
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                roleId = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roleId;
    }

    public List<Map<String, Object>> getRoles() throws SQLException {
    	Connection conn = connector.getSnowflakeConnection();
        List<Map<String, Object>> roles = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT ID, NAME, DESCRIPTION FROM NBF_CIA.PUBLIC.ROLES");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> role = new HashMap<>();
                role.put("id", rs.getInt("ID"));
                role.put("name", rs.getString("NAME"));
                role.put("description", rs.getString("DESCRIPTION"));
                roles.add(role);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
    }

    public Map<String, Object> getRole(int roleId) throws SQLException {
        Map<String, Object> role = null;
        Connection conn = connector.getSnowflakeConnection();
        try {
            stmt = conn.prepareStatement("SELECT ID, NAME, DESCRIPTION FROM NBF_CIA.PUBLIC.ROLES WHERE ID = ?");
            stmt.setInt(1, roleId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                role = new HashMap<>();
                role.put("id", rs.getInt("ID"));
                role.put("name", rs.getString("NAME"));
                role.put("description", rs.getString("DESCRIPTION"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return role;
    }

    public int updateRole(int roleId, String name, String description) throws SQLException {
        int rowCount = -1;
        Connection conn = connector.getSnowflakeConnection();
        try {
            stmt = conn.prepareStatement("UPDATE NBF_CIA.PUBLIC.ROLES SET NAME = ?, DESCRIPTION = ? WHERE ID = ?");
            stmt.setString(1, name);
            stmt.setString(2, description);
            stmt.setInt(3, roleId);
            rowCount = stmt.executeUpdate();
            conn.commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rowCount;
    }

    public Map<String, Object> deleteRole(int roleId) throws SQLException {
    	Connection conn = connector.getSnowflakeConnection();
        Map<String, Object> result = new HashMap<>();
        try {
            stmt = conn.prepareStatement("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.USERS WHERE ROLE_ID = ?");
            stmt.setInt(1, roleId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int userCount = rs.getInt(1);
                System.out.println("User count for role_id " + roleId + ": " + userCount);  // Debug log
                if (userCount > 0) {
                    System.out.println("Role is assigned to users and cannot be deleted");  // Debug log
                    result.put("error", "Role is assigned to users and cannot be deleted");
                    return result;
                }
            }

            stmt = conn.prepareStatement("SELECT COUNT(*) FROM NBF_CIA.PUBLIC.ROLE_PERMISSION WHERE ROLE_ID = ?");
            stmt.setInt(1, roleId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                int rolePermissionCount = rs.getInt(1);
                System.out.println("Role permission count for role_id " + roleId + ": " + rolePermissionCount);  // Debug log
                if (rolePermissionCount > 0) {
                    System.out.println("Role is used in role permissions and cannot be deleted");  // Debug log
                    result.put("error", "Role is used in role permissions and cannot be deleted");
                    return result;
                }
            }

            stmt = conn.prepareStatement("DELETE FROM NBF_CIA.PUBLIC.ROLES WHERE ID = ?");
            stmt.setInt(1, roleId);
            stmt.executeUpdate();
            conn.commit();
            System.out.println("Role " + roleId + " deleted successfully");  // Debug log
            result.put("message", "Role deleted successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            result.put("error", e.getMessage());
        }
        return result;
    }

    public List<Map<String, Object>> getAllPermissions() throws SQLException {
    	Connection conn = connector.getSnowflakeConnection();
        List<Map<String, Object>> permissions = new ArrayList<>();
        try {
            stmt = conn.prepareStatement("SELECT ID, LEVEL FROM NBF_CIA.PUBLIC.PERMISSION_LEVEL");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> permission = new HashMap<>();
                permission.put("id", rs.getInt("ID"));
                permission.put("level", rs.getString("LEVEL"));
                permissions.add(permission);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return permissions;
    }
}
