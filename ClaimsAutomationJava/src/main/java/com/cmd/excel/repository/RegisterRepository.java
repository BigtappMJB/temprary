package com.cmd.excel.repository;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Repository;

import com.cmd.excel.helper.DmaEmailHelper;
import com.cmd.excel.utils.Constants;
import com.cmd.excel.utils.DataSourceConfig;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;



@Repository
public class RegisterRepository {
	
	private static final Logger LOG = LoggerFactory.getLogger(RegisterRepository.class);


	static DataSourceConfig connector = new DataSourceConfig(); // Use dependency injection for DataSourceConfig

	@Value("${email.username}")
	private static String emailUsername;

	@Value("${email.password}")
	private static String emailPassword;

    @Autowired
    DmaEmailHelper emailHelper;
    
	public Map<String, Object> getUserByEmail(String email) throws SQLException  {
	    Connection conn = connector.getDBConnection();
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    Map<String, Object> userMap = new HashMap<>();

	    try {
	        String query = "SELECT first_name, user_name, last_name, email, mobile_number, role_id, password, is_default_password_changed, is_verified, last_logged_in_date, otp " +
	                       "FROM USERS " +
	                       "WHERE email = ?";
	        stmt = conn.prepareStatement(query);
	        stmt.setString(1, email);
	        rs = stmt.executeQuery();
	       // [FIRST_NAME, MIDDLE_NAME, LAST_NAME, EMAIL, MOBILE, ROLE_ID, PASSWORD, IS_DEFAULT_PASSWORD_CHANGED, IS_VERIFIED, LAST_LOGIN_DATETIME, OTP]
	        if (rs.next()) {
	            userMap.put("first_name", rs.getString(1));
	            userMap.put("middle_name", rs.getString(2));
	            userMap.put("last_name", rs.getString(3));
	            userMap.put("email", rs.getString(4));
	            userMap.put("mobile", rs.getString(5));
	            userMap.put("role", rs.getInt(6));
	            userMap.put("password", rs.getString(7));
	            userMap.put("is_default_password_changed", rs.getBoolean(8));
	            userMap.put("is_verified", rs.getBoolean(9));
	            userMap.put("last_login_datetime", rs.getTimestamp(10) != null ? rs.getTimestamp(10).toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
	            userMap.put("otp", rs.getString(11));
	            userMap.put("authorities", "ROLE_USER");
	            
	        } else {
	            return null;
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	        // Log the error
	        System.out.println("Error fetching user: " + e.getMessage());
	        return null;
	    } finally {
	        try {
	            if (rs != null) rs.close();
	            if (stmt != null) stmt.close();
	            if (conn != null) conn.close();
	        } catch (SQLException ex) {
	            ex.printStackTrace();
	        }
	    }

	    return userMap;
	}
	
	public static String generateOTP() {
		LOG.info("Generating OTP");
		try {
			Random rand = SecureRandom.getInstanceStrong();
			StringBuilder sb = new StringBuilder(Constants.OTP_LENGTH);
			for (int i = 0; i < Constants.OTP_LENGTH; i++) {
				sb.append(rand.nextInt(10));
			}
			LOG.info("Generation of OTP is successfull");
			return sb.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
	}
	// Convert Python code to Java

	// Method to send OTP email
	public boolean sendOtpEmail(String user_email, String otp) {
        // Set email properties
		//Properties prop = emailHelper.getEmailProperties();
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true"); // Enable authentication
        properties.put("mail.smtp.starttls.enable", "true"); // Enable TLS
        properties.put("mail.smtp.host", Constants.SMTP_HOST); // Set SMTP server host
        properties.put("mail.smtp.port", Constants.SMTP_PORT); // Set SMTP server port

        // Create a session with authentication
        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
			
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(Constants.SMTP_USER, Constants.SMTP_PASSWORD);
			}
        });

        try {
            // Create a message object
        	Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(Constants.SMTP_USER)); // Set sender email address
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user_email)); // Set recipient
            message.setSubject("Your OTP Code "); // Set email subject
            message.setText("Your OTP Code is: " + otp); // Set email body with the default password

            // Enable debug output to see the connection and communication details
            session.setDebug(true);

            // Send the email
            Transport.send(message);
            System.out.println("Forgot password email sent successfully to " + user_email);
            return true; // Return true if email sent successfully
        } catch (MessagingException e) {
        	LOG.info("An error occurred while sending forward password email:"+ e.getMessage(), e);
        	  return false; // Return false if email sending failed
        }
      
    }
	public void  updateUserOtp(String email, String otp) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            // Establish a connection
            conn = connector.getDBConnection();

            // Prepare SQL query
            String sql = "UPDATE USERS SET OTP = ?, UPDATED_DATE = ?, UPDATED_BY = ? WHERE EMAIL = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, otp);
            stmt.setString(2, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            stmt.setString(3, "system");
            stmt.setString(4, email);

            // Execute update
            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected > 0) {
                LOG.info("OTP for user {} updated in database.", email);
                
            } else {
            	LOG.warn("No user found with email: {}", email);
               
            }
        } catch (SQLException e) {
        	LOG.error("Error updating OTP for user {}: {}", email, e.getMessage(), e);
           
        } finally {
            // Clean up
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
            	LOG.error("Error closing database resources: {}", e.getMessage(), e);
            }
        }
    }
	// Method to insert a user into the database
    public static void insertUser(String email, String firstName, String middleName, String lastName, String mobile, int roleId, String otp, LocalDateTime created_date) {
    	Connection conn = null;
        PreparedStatement pstmt = null;
       
        try {
            // Get a connection
        	 conn = connector.getDBConnection();

        	  // SQL query with placeholders
              String query = "INSERT INTO USERS (EMAIL, FIRST_NAME, user_name, LAST_NAME, mobile_number, ROLE_ID, password, created_date) \r\n"
              		+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?);\r\n"
              		+ " ";

            // Prepare the statement
            pstmt = conn.prepareStatement(query);

            // Set the parameters
            pstmt.setString(1, email);
            pstmt.setString(2, firstName);
            pstmt.setString(3, firstName);
            pstmt.setString(4, lastName);
            pstmt.setString(5, mobile);
            pstmt.setInt(6, roleId);
            pstmt.setString(7, otp);
            Timestamp timestamp = Timestamp.valueOf(created_date);
            pstmt.setTimestamp(8, timestamp);
            //pstmt.setLong(8, created_date);

            // Execute the insert
            pstmt.executeUpdate();

            System.out.println("User inserted successfully!");
        } catch (SQLException e) {
            // Log the error
        	LOG.info("Error inserting user:"+ e.getMessage(), e);
           
        } finally {
            try {
                // Close the prepared statement
                if (pstmt != null) {
                    pstmt.close();
                }
                // Close the connection
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
            	LOG.info("Error closing resources:"+ e.getMessage(), e);
               
            }
        }
    }
    public static String generateDefaultPassword(int length) {
        if (length < 8) {  // Ensure length is at least 8 characters
            throw new IllegalArgumentException("Password length must be at least 8 characters");
        }

        String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`";
        SecureRandom random = new SecureRandom();
        List<Character> password = new ArrayList<>();

        password.add(characters.charAt(random.nextInt(26)));  // Ensure at least one lowercase letter
        password.add(characters.charAt(random.nextInt(26) + 26));  // Ensure at least one uppercase letter
        password.add(characters.charAt(random.nextInt(10) + 52));  // Ensure at least one digit
        password.add(characters.charAt(random.nextInt(15) + 62));  // Ensure at least one symbol

        // Add remaining characters to meet the required length
        for (int i = 4; i < length; i++) {
            password.add(characters.charAt(random.nextInt(characters.length())));
        }

        Collections.shuffle(password);

        StringBuilder sb = new StringBuilder();
        for (Character c : password) {
            sb.append(c);
        }

        String generatedPassword = sb.toString();

        if (generatedPassword.matches(".*[a-z].*")
                && generatedPassword.matches(".*[A-Z].*")
                && generatedPassword.matches(".*\\d.*")
                && generatedPassword.matches(".*[!@#$%^&*()-_=+\\[\\]{}|;:,.<>?/~`].*")) {
            return generatedPassword;
        }

        return generateDefaultPassword(length);  // Recursively call the method until a valid password is generated
    }
 // Update user password and verify
    public void updateUserPasswordAndVerify(String email, String password) throws SQLException {
    	Connection conn = null;
    	 Statement stmt = null;
        try {
        	 conn = connector.getDBConnection();
             stmt = conn.createStatement();
            stmt.executeUpdate(String.format(
                "UPDATE USERS " +
                "SET PASSWORD = '%s', IS_VERIFIED = TRUE, UPDATED_DATE = '%s', UPDATED_BY = 'system' " +
                "WHERE EMAIL = '%s'",
                password, LocalDateTime.now(), email));
          
        	LOG.info("AppName:", "Password and verification status for user %s updated in database");
            
        } catch (Exception e) {
        	LOG.info("AppName:", "Error updating password and verification status for user %s: %s\", email");
        	
        } finally {
            stmt.close();
            conn.close();
        }
    }

    public static boolean sendDefaultPassword(String recipientEmail, String password) {
        // Set email properties
    	
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true"); // Enable authentication
        properties.put("mail.smtp.starttls.enable", "true"); // Enable TLS
        properties.put("mail.smtp.host", Constants.SMTP_HOST); // Set SMTP server host
        properties.put("mail.smtp.port", Constants.SMTP_PORT); // Set SMTP server port

        // Create a session with authentication
        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
			
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(Constants.SMTP_USER, Constants.SMTP_PASSWORD);
			}
        });

        try {
            // Create a message object
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(Constants.SMTP_USER)); // Set sender email address
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail)); // Set recipient
            message.setSubject("Your Default Password"); // Set email subject
            message.setText("Your default password is: " + password); // Set email body with the default password

            // Enable debug output to see the connection and communication details
            session.setDebug(true);

            // Send the email
            Transport.send(message);
            System.out.println("Default password email sent successfully to " + recipientEmail);
            return true; // Return true if email sent successfully
        } catch (MessagingException e) {
        	LOG.info("An error occurred while sending default password email:"+ e.getMessage(), e);
        	   
        }
        return false; // Return false if email sending failed
    }
 // Convert the Python code to Java
    public void updateLastLogin(String email) throws SQLException {
        Connection conn = connector.getDBConnection();
        Statement stmt = conn.createStatement();
        try {
            // Ensure the datetime format is correct
            String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"));
            LOG.info("Updating last login datetime for email:"+ email + " to " + currentTime, currentTime);
           

            stmt.executeUpdate("UPDATE USERS " +
                    "SET LAST_LOGIN_DATETIME = '" + currentTime + "' " +
                    "WHERE EMAIL = '" + email + "'");
            
            LOG.info("Last login datetime updated for email: " + email, email);
           
        } catch (Exception e) {
        	 LOG.info("Error updating last login datetime for email: " + email, email);
                                                                 
        } finally {
            stmt.close();
            conn.close();
        }
    }
    public List<Map<String, Object>> getPermissionsByEmail(String email) throws JsonMappingException, JsonProcessingException {
    	Connection conn = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;
    List<Map<String, Object>> permissions = new ArrayList<>();
    ObjectMapper objectMapper = new ObjectMapper();
    try {
        conn = connector.getDBConnection();
//        String selectQuery = "WITH MenuData AS (\n" +
//                "    SELECT\n" +
//                "        r.NAME AS role_name,\n" +
//                "        pl.LEVEL AS permission_level,\n" +
//                "        m.NAME AS menu_name,\n" +
//                "        m.ID AS menu_id,\n" +
//                "        sm.ID AS submenu_Id,\n" +
//                "        sm.NAME AS submenu_name,\n" +
//                "        sm.ROUTE AS submenu_path\n" +
//                "    FROM\n" +
//                "        USERS u\n" +
//                "    JOIN\n" +
//                "        ROLES r ON u.ROLE_ID = r.ID\n" +
//                "    JOIN\n" +
//                "        ROLE_PERMISSION rp ON rp.ROLE_ID = r.ID\n" +
//                "    JOIN\n" +
//                "        PERMISSION_LEVEL pl ON rp.PERMISSION_LEVEL = pl.ID\n" +
//                "    JOIN\n" +
//                "        MENUS m ON rp.MENU_ID = m.ID\n" +
//                "    LEFT JOIN\n" +
//                "        SUB_MENUS sm ON rp.SUB_MENU_ID = sm.ID\n" +
//                "    WHERE\n" +
//                "        u.EMAIL = ? AND pl.ID != 301\n" +
//                "    ORDER BY\n" +
//                "        m.ID  ASC\n" +
//                "),\n" +
//                "AggregatedData AS (\n" +
//                "    SELECT\n" +
//                "        role_name,\n" +
//                "        menu_name,\n" +
//                "        menu_id,\n" +
//                "        ARRAY_AGG(OBJECT_CONSTRUCT('submenu_Id',submenu_Id,'submenu_name', submenu_name, 'submenu_path', submenu_path, 'permission_level', permission_level)\n" +
//                "        ) AS submenus\n" +
//                "    FROM\n" +
//                "       (\n" +
//                "        SELECT *\n" +
//                "        FROM MenuData\n" +
//                "        ORDER BY menu_id ASC, submenu_id ASC\n" +
//                "    ) AS ordered_data\n" +
//                "    GROUP BY\n" +
//                "        role_name, menu_name,menu_id\n" +
//                ")\n" +
//                "SELECT\n" +
//                "    OBJECT_CONSTRUCT(\n" +
//                "        'menu_id', menu_id,\n" +
//                "        'menu_name', menu_name,\n" +
//                "        'role_name', role_name,\n" +
//                "        'submenus', submenus\n" +
//                "    ) AS menu_data\n" +
//                "FROM\n" +
//                "    AggregatedData ORDER BY menu_id ASC";
        String selectQuery = "SELECT\r\n"
        		+ "    CONCAT(\r\n"
        		+ "        '{\"menu_id\":', menu_id,\r\n"
        		+ "        ',\"menu_name\":\"', menu_name,\r\n"
        		+ "        '\",\"role_name\":\"', role_name,\r\n"
        		+ "        '\",\"submenus\":[', \r\n"
        		+ "        GROUP_CONCAT(\r\n"
        		+ "            CONCAT(\r\n"
        		+ "                '{\"submenu_Id\":', submenu_Id,\r\n"
        		+ "                ',\"submenu_name\":\"', submenu_name,\r\n"
        		+ "                '\",\"submenu_path\":\"', submenu_path,\r\n"
        		+ "                '\",\"permission_level\":\"', permission_level, '\"}'\r\n"
        		+ "            ) SEPARATOR ','\r\n"
        		+ "        ), \r\n"
        		+ "        ']}'\r\n"
        		+ "    ) AS menu_data\r\n"
        		+ "FROM\r\n"
        		+ "    (\r\n"
        		+ "        SELECT\r\n"
        		+ "            r.NAME AS role_name,\r\n"
        		+ "            pl.LEVEL AS permission_level,\r\n"
        		+ "            m.NAME AS menu_name,\r\n"
        		+ "            m.ID AS menu_id,\r\n"
        		+ "            sm.ID AS submenu_Id,\r\n"
        		+ "            sm.NAME AS submenu_name,\r\n"
        		+ "            sm.ROUTE AS submenu_path\r\n"
        		+ "        FROM\r\n"
        		+ "            automationutil.USERS u\r\n"
        		+ "        JOIN\r\n"
        		+ "            automationutil.ROLES r ON u.ROLE_ID = r.ID\r\n"
        		+ "        JOIN\r\n"
        		+ "            automationutil.ROLE_PERMISSION rp ON rp.ROLE_ID = r.ID\r\n"
        		+ "        JOIN\r\n"
        		+ "            automationutil.PERMISSION_LEVEL pl ON rp.PERMISSION_LEVEL = pl.ID\r\n"
        		+ "        JOIN\r\n"
        		+ "            automationutil.MENUS m ON rp.MENU_ID = m.ID\r\n"
        		+ "        LEFT JOIN\r\n"
        		+ "            automationutil.SUB_MENUS sm ON rp.SUB_MENU_ID = sm.ID\r\n"
        		+ "        WHERE\r\n"
        		+ "            u.EMAIL = ? \r\n"
        		+ "    ) AS MenuData\r\n"
        		+ "GROUP BY\r\n"
        		+ "    role_name, menu_name, menu_id\r\n"
        		+ "ORDER BY\r\n"
        		+ "    menu_id ASC;\r\n";
        stmt = conn.prepareStatement(selectQuery);
        stmt.setString(1, email);
        rs = stmt.executeQuery();

        while (rs.next()) {
			/*
			 * String menuDataJson = rs.getString("MENU_DATA"); // Get the JSON string
			 * JsonNode menuDataNode = objectMapper.readTree(menuDataJson); // Parse JSON
			 * 
			 * Map<String, Object> permission = new HashMap<>(); permission.put("menu_id",
			 * menuDataNode.get("menu_id").asInt()); permission.put("menu_name",
			 * menuDataNode.get("menu_name").asText()); permission.put("role_name",
			 * menuDataNode.get("role_name").asText()); permission.put("submenus",
			 * menuDataNode.get("submenus").toString()); // Keep submenus as JSON string
			 * 
			 * permissions.add(permission);
			 */
        	String menuDataJson = rs.getString("MENU_DATA"); // Get the JSON string
            JsonNode menuDataNode = objectMapper.readTree(menuDataJson); // Parse JSON

            Map<String, Object> permission = new HashMap<>();
            permission.put("menu_id", menuDataNode.get("menu_id").asInt());
            permission.put("menu_name", menuDataNode.get("menu_name").asText());
            permission.put("role_name", menuDataNode.get("role_name").asText());

            // Parse the submenus JSON array
            JsonNode submenusNode = menuDataNode.get("submenus");
            List<Map<String, Object>> submenus = objectMapper.convertValue(
                    submenusNode,
                    new TypeReference<List<Map<String, Object>>>() {}
            );
            permission.put("submenus", submenus); // Store as a list of maps

            permissions.add(permission);
        }
    } catch (SQLException e) {
    	LOG.error("Error fetching permissions for email: {}", email, e);  // Use error level for exceptions
    } finally {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
            	 LOG.error("Error closing ResultSet: ", e.getMessage());
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
            	 LOG.error("Error closing PreparedStatement: ", e.getMessage());
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
            	 LOG.error("Error closing Connection: ", e.getMessage());
            }
        }
    }

    return permissions;
}
 // Update Password Method in Java
	
    public Map<String, Object> updatePassword(String data_j, int id) throws SQLException {
        Connection conn = connector.getDBConnection();
        PreparedStatement stmt = null;
        try {
            // Parse the JSON string using Jackson
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(data_j);
            String password = jsonNode.get("password").asText(); // Extract the password field

            // Prepare SQL statement
            stmt = conn.prepareStatement("UPDATE users SET password = ? WHERE id = ?");
            stmt.setString(1, password);
            stmt.setInt(2, id);
            stmt.executeUpdate();

            
            return Map.of("message", "User Password updated successfully", "status", 200);
        } catch (SQLException e) {
            conn.rollback(); // Rollback changes on error
            return Map.of("error", e.getMessage(), "status", 500);
        } catch (Exception e) {
            return Map.of("error", e.getMessage(), "status", 400); // Handle parsing exceptions
        } finally {
            if (stmt != null) {
                stmt.close();
            }
            conn.close();
        }
    
}

    
 // Converted Python code to Java
    public void updateUserPassword(String email, String password) throws SQLException {
        Connection conn = connector.getDBConnection();
        Statement stmt = conn.createStatement();
        try {
            stmt.executeUpdate(String.format(
                "UPDATE USERS " +
                "SET PASSWORD = '%s', IS_DEFAULT_PASSWORD_CHANGED = TRUE, UPDATED_DATE = '%s', UPDATED_BY = 'system' " +
                "WHERE EMAIL = '%s'",
                password, LocalDateTime.now(), email));
            
            LOG.info("Password for user %s updated in database.: ", email);
          
        } catch (Exception e) {
        	 LOG.error("Error updating password for user %s: %s: ", email);
           
        } finally {
            stmt.close();
            conn.close();
        }
    }

	/*
	 * public void sendPasswordUpdateEmail(String user_email) { Message msg = new
	 * Message("Password Update Notification", sender_mail_config.get("username"),
	 * Arrays.asList(user_email));
	 * msg.setBody("Your password has been successfully updated.");
	 * 
	 * try { Transport transport = mail.getSession().getTransport();
	 * transport.connect(); transport.sendMessage(msg, msg.getAllRecipients());
	 * transport.close();
	 * current_app.getLogger().info("Password update notification email sent to " +
	 * user_email); } catch (MessagingException e) { current_app.getLogger().
	 * error("An error occurred while sending password update email: " +
	 * e.getMessage()); } catch (Exception e) {
	 * current_app.getLogger().error("An unexpected error occurred: " +
	 * e.getMessage()); } }
	 */

}
