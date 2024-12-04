package com.cmd.excel.controller;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.excel.repository.RegisterRepository;
import java.util.Base64;



@CrossOrigin("*")
@RestController
@RequestMapping("/register")
public class RegisterController {
	private static final Logger LOG = LoggerFactory.getLogger(RegisterController.class);

	@Autowired
	private RegisterRepository registerRepository;

	@GetMapping("/userhello")
	public String sayHello() {
		return "Hello, World!";
	}

	// Route for Registration
	@PostMapping("/registration")
	public ResponseEntity<Object> register(@RequestBody Map<String, Object> data) throws SQLException {
		String email = (String) data.get("email");
		String first_name = (String) data.get("first_name");
		String middle_name = (String) data.get("middle_name");
		String last_name = (String) data.get("last_name");
		String mobile = (String) data.get("mobile");
		int role_id = 0; // Default role from the roles table
		LocalDateTime created_date = LocalDateTime.now();

		if (registerRepository.getUserByEmail(email) != null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User already exists"));
		}

		String otp = registerRepository.generateOTP();
		if (registerRepository.sendOtpEmail(email, otp)) {
			registerRepository.insertUser(email, first_name, middle_name, last_name, mobile, role_id, otp,
					created_date); // Save OTP in password field
			return ResponseEntity.ok(Map.of("message", "OTP sent to email successfully"));
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to send OTP"));
		}
	}

	// Route for Verifying OTP
	@PostMapping("/verify_otp")
	public ResponseEntity<Object> verifyOtp(@RequestBody Map<String, Object> data) throws SQLException {
		String email = (String) data.get("email");
		String otp = (String) data.get("otp");
		Map<String, Object> user = registerRepository.getUserByEmail(email);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
		}

		if (!user.get("password").equals(otp)) { // Assuming the password field is used to store the OTP temporarily
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",
					"The OTP you have entered is incorrect. Please check the OTP email for the valid code."));
		}

		// Update IS_VERIFIED to true and set a default password
		String default_password = registerRepository.generateDefaultPassword(8);
		String encodedPassword = Base64.getEncoder().encodeToString(default_password.getBytes());
		registerRepository.updateUserPasswordAndVerify(email, encodedPassword);
		registerRepository.sendDefaultPassword(email, default_password);
		return ResponseEntity.ok(Map.of("message", "OTP verified, default password sent to mail"));
	}

	// Route for Changing Password
	@PostMapping("/change_password")
	public ResponseEntity<Object> changePassword(@RequestBody Map<String, String> data) throws SQLException {
		String email = data.get("email");
		String oldPassword = data.get("old_password");
		String newPassword = data.get("new_password");

		Objects.requireNonNull(email, "Email must not be null");
		Objects.requireNonNull(oldPassword, "Old password must not be null");
		Objects.requireNonNull(newPassword, "New password must not be null");
		LOG.info("Request received to change password for email: " + email);

		Map<String, Object> user = registerRepository.getUserByEmail(email);
		if (user == null) {
			LOG.info("\"User not found for email: " + email);

			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("error", "User not found"));
		}
		LOG.info("\"User Found: " + email);

		// Strip leading/trailing whitespace from passwords
		String providedOldPassword = oldPassword.strip();
		String storedPassword = ((String) user.get("password")).strip();
		LOG.info("\"Provided old password (stripped): : " + providedOldPassword);
		LOG.info("\"Stored password (stripped):" + storedPassword);

		if (!providedOldPassword.equals(storedPassword)) { // Direct comparison after stripping whitespace
			LOG.info("\"Invalid email or password for email:" + email);

			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Collections.singletonMap("error", "Invalid default/Current password"));
		}
		LOG.info("\"Old password verified for email:" + email);

		registerRepository.updateUserPassword(email, newPassword);
		LOG.info("\"Password updated successfully for email" + email);

		// Send password update notification email
		 sendPasswordUpdateEmail(email);

		return ResponseEntity.ok(Collections.singletonMap("message", "Password updated successfully"));
	}

	// Route for Changing Password
		@PostMapping("/reset_password")
		public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> data) throws SQLException {
			String email = data.get("email");
			String otp = data.get("otp");
			String newPassword = data.get("new_password");

			Objects.requireNonNull(email, "Email must not be null");
			Objects.requireNonNull(otp, "otp must not be null");
			Objects.requireNonNull(newPassword, "New password must not be null");
			LOG.info("Request received to change password for email: " + email);

			Map<String, Object> user = registerRepository.getUserByEmail(email);
			if (user == null) {
				LOG.info("\"User not found for email: " + email);

				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Collections.singletonMap("error", "User not found"));
			}
			LOG.info("\"User Found: " + email);

			
			LOG.info("\"Old password verified for email:" + email);

			registerRepository.updateUserPassword(email, newPassword);
			LOG.info("\"Password updated successfully for email" + email);

			// Send password update notification email
			 sendPasswordUpdateEmail(email);

			return ResponseEntity.ok(Collections.singletonMap("message", "Password updated successfully"));
		}
	 public void sendPasswordUpdateEmail(String userEmail) { // Create a
	  SimpleMailMessage message = new SimpleMailMessage();
	  
	  // Set the email details message.setFrom(Constants.USER_EMAIL);
	  message.setTo(userEmail); message.setSubject("Password Update Notification");
	  message.setText("Your password has been successfully updated.");
	 
	 try { // Send the email mailSender.send(message);
	  LOG.info("Password update notification email sent to {}", userEmail); } catch
	  (org.springframework.mail.MailSendException e) {
	 LOG.error("SMTP AUTH extension not supported by server: {}", e.getMessage());
	 } catch (Exception e) {
	 LOG.error("An error occurred while sending password update email: {}",
	  e.getMessage()); } }
	
	@PostMapping("/generate_otp")
	public ResponseEntity<String> generateOtp(@RequestBody Map<String, String> data) {
		String email = data.get("email");
		LOG.info("OTP generation requested for email: {}", email);

		try {
			if (registerRepository.getUserByEmail(email) == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"User not found\"}");
			}
			String otp = registerRepository.generateOTP();

			if (otp != null) {
				if (registerRepository.sendOtpEmail(email, otp)) {
					registerRepository.updateUserOtp(email, otp); // Save the OTP in the database
					LOG.info("OTP sent and saved for email: {}", email);
					LOG.info("OTP sent and saved for email: {}", email);
					return ResponseEntity.status(200)
							.body("{\"message\": \"OTP generated and sent to email successfully\"}");
				} else {
					return ResponseEntity.status(500).body("{\"error\": \"Failed to send OTP\"}");
				}
			} else {
				return ResponseEntity.status(500).body("{\"error\": \"Failed to send mail\"}");
			}
		} catch (Exception e) {
			LOG.error("User not found or error occurred for email: {}", email, e);
			return ResponseEntity.status(404).body("{\"error\": \"User not found or an error occurred\"}");
		}
	}
}

