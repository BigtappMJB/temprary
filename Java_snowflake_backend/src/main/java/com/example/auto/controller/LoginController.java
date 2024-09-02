package com.example.auto.controller;

import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.auto.repositories.RegisterRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;


@CrossOrigin("*")
@RestController
@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class LoginController {

	private static final Logger log = LoggerFactory.getLogger(LoginController.class);

	@Autowired
    private RegisterRepository registerRepository;
	
	@PostMapping("/login")
	 public ResponseEntity<?> login(@RequestBody Map<String, String> data) throws SQLException, JsonMappingException, JsonProcessingException {
     String email = data.get("email");
	     String password = data.get("password");

	     log.info("Login attempt for email: " + email);

	     // Fetch user data from the database
	     Map<String, Object> user = registerRepository.getUserByEmail(email);
	     if (user == null) {
	         log.error("User not found for email: " + email);
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found. Please check your email and try again."));
	     }

	     // Decrypt and validate the password
	     
	     System.out.println(password);
	     // if (!passwordEncoder.matches(password, user.getPassword())) {
	     //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid password"));
	     // }

	     // Strip leading/trailing whitespace from passwords
	     String providedPassword = password.strip();
	     String storedPassword = ((String) user.get("password")).strip();

	     log.info("Provided password (stripped): '" + providedPassword + "'");
	     log.info("Stored password (stripped): '" + storedPassword + "'");

	     // Validate the password
	     if (!storedPassword.equals(providedPassword)) {
	         log.error("Incorrect password for email: " + email);
	         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "The password you entered is incorrect. Please check your password and try again."));
	     }

	     log.info("Password validated for email: " + email);

	     // Update the last login datetime
	     registerRepository.updateLastLogin(email);

	     // Check permissions based on email
	        List<Map<String, Object>> permissions = registerRepository.getPermissionsByEmail(email);
	     log.info("Permissions for email " + email + ": " + permissions);

	     return ResponseEntity.ok().body(Map.of(
	         "message", "Login successful",
	         "permissions", permissions,
	         "is_default_password_changed", user.get("is_default_password_changed"),
	         "is_verified", user.get("is_verified"),
	         "last_login_datetime", user.get("last_login_datetime")
	     ));
	}
	 @PostMapping("/logout")
	 public ResponseEntity<Map<String, String>> logout() {
	     return ResponseEntity.ok().body(Collections.singletonMap("message", "Logout successful"));
	 }
		
		  @PostMapping("/enrollPassword") public ResponseEntity<String>
		  enrollPassword(@RequestBody String data_j, @RequestParam int id) throws SQLException { 
			  return
		  (ResponseEntity<String>) registerRepository.updatePassword(data_j, id); }
		

}
