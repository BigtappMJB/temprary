/**
 * 	Date,			Author,		Description
 * 
 * 	2021-25-10,		ISV7915,		LoginController  class 
 * 								Initial version
 *	2021-04-11,		ISV7915,		Optimization changes
 */
package com.cmd.excel.controller;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

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

import com.cmd.constants.CmdConstants;
import com.cmd.domain.request.PasswordRequest;
import com.cmd.domain.request.User;
import com.cmd.domain.response.Response;
import com.cmd.excel.message.ResponseMessage;
import com.cmd.excel.model.Users;
import com.cmd.excel.service.IamLoginService;
import com.cmd.excel.service.LoginService;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class LoginController {
	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	@Autowired
	LoginService loginService;
	
	@Autowired
	IamLoginService iamloginService;

	@Autowired
	UserManagementService userManagementService;
	
	@Autowired
	CmdUtils cmdUtils;
	
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	Response response = new Response();
	String message = "";
	HttpStatus httpStatus = HttpStatus.OK;
	
	Calendar cal = Calendar.getInstance();
	Date today = cal.getTime();
	

	/**
	 * Mapping for dmaapp homepage
	 * 
	 * @return
	 */
	@GetMapping("/home")
	public ResponseEntity<ResponseMessage> gotoHome() {
		this.message = "";
		try {
			message = CmdConstants.MSG_REDIRECT_TO_HOME;

			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_REDIRECT_TO_HOME;
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	/**
	 * For user login
	 * 
	 * @param userId
	 * @param passWord
	 * @return ResponseEntity<UserDetails>
	 */
	@PostMapping("/login")
	public Object authenticateUser(@RequestBody User user) {
		return loginService.loginUser(user);
	}
	
	/**
	 * For user login
	 * 
	 * @param userId
	 * @param passWord
	 * @return ResponseEntity<UserDetails>
	 */
	@PostMapping("/rest/V1/Iam/getToken")
	public Object iamAuthenticateUser(@RequestBody User user) {
		return iamloginService.loginUser(user);
	}

	/**
	 * @param userId
	 * @return ResponseEntity<ResponseMessage>
	 */
	@GetMapping("/logout")
	public ResponseEntity<ResponseMessage> logOutUser(@RequestParam("userName") String userId) {
		boolean isLogOut = false;
		this.message = "";
		try {
			isLogOut = loginService.logOutUser(userId);
			if (isLogOut) {
				message = CmdConstants.MSG_USER_LOGOUT_SUCCESSFULL;
			} else {
				message = CmdConstants.MSG_USER_LOGOUT_ERROR;
			}

			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			return new ResponseEntity<>(new ResponseMessage(message), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @return
	 */
	@GetMapping("/error")
	public ResponseEntity<ResponseMessage> goToError() {
		this.message = "";
		message = CmdConstants.MSG_COMMON_ERROR;

		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
	}

	/**
	 * For chanes password
	 * 
	 * @param token
	 * @param passwordRequest
	 * @return Response
	 */
	@PostMapping("/changePassword")
	public Object changePassword(@RequestHeader("token") String token, @RequestBody PasswordRequest passwordRequest) {
		String errorMessage = "";
		try {
			response = new Response();

			String userName = jwtTokenUtil.getUsernameFromToken(token);
			String oldPassword = cmdUtils.deCrypt(passwordRequest.getOldPassword());
			Users dbUser = loginService.getUserById(userName);
			if (!cmdUtils.deCrypt(dbUser.getPassword()).equals(oldPassword)) {
				message = CmdConstants.INVALID_OLD_PASSWORD;
				errorMessage = CmdConstants.INVALID_OLD_PASSWORD;
				cmdUtils.logInfoErrorMessage(logger, message);
				httpStatus = HttpStatus.NOT_FOUND;
			} else {
				dbUser.setPassword(passwordRequest.getNewPassword());
				dbUser.setPassWordLastUpdatedDate(new Timestamp(today.getTime()).toString());
				userManagementService.saveUser(dbUser);
				message = CmdConstants.PASSWROD_CHANGED_SUCCESSFULLY;
				errorMessage = "";
				cmdUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.OK;
			}
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_CHANGING_PWD;
			cmdUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			errorMessage = e.getLocalizedMessage();
		}
		response.setStatusCode(httpStatus.value());
		response.setMessage(message);
		response.setErrorMessage(errorMessage);
		return ResponseEntity.status(httpStatus).body(response);
	}

}
